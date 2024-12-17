import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcryptjs'
import { Model, Types } from 'mongoose'

import { User } from 'src/models/user.schema'

import { SignUpDTO } from './dto/singin.dto'
import { GitHubProfileData } from './github.strategy'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup({ name, password, email, username }: SignUpDTO) {
    const hash_password = await this.hashPassword(password)

    if (username) {
      const existing_user = await this.userModel.findOne({
        username: username,
      })

      if (existing_user) {
        throw new BadRequestException('Username is already taken')
      }
    }

    const user = await this.userModel.create({
      password: hash_password,
      email,
      name,
      username,
    })

    return this.jwtService.signAsync({ user: user._id })
  }

  async validateUser(profile: GitHubProfileData) {
    const { id, username, display_name, emails, photos } = profile
    const email = emails?.[0]?.value
    const avatar = photos?.[0]?.value

    if (!email) {
      throw new BadRequestException('Email is required')
    }

    let user = await this.getUserByEmail(email)

    if (!user) {
      user = await this.userModel.create({
        github: id,
        username,
        name: display_name || username,
        email,
        avatar,
      })
    }

    return user
  }

  async getUser(id: Types.ObjectId) {
    const user = await this.userModel.findOne({
      _id: id,
      is_deleted: false,
    })

    return user
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel
      .findOne({
        email,
        is_deleted: false,
      })
      .select('+password')

    return user
  }

  async signUpGoogle({
    fio,
    email,
    picture,
  }: {
    fio: string
    email: string
    picture: string
  }) {
    let user = await this.getUserByEmail(email)

    if (!user) {
      user = await this.userModel.create({
        name: fio,
        email,
        avatar: picture,
      })
    }

    const token = await this.jwtService.signAsync({ user: user._id })

    return {
      access_token: token,
    }
  }

  async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 12)

    return hash
  }

  async comparePassword(password: string, hash_password: string) {
    const is_true = await bcrypt.compare(password, hash_password)

    return is_true
  }
}
