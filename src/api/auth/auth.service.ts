import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcryptjs'
import { Model, Types } from 'mongoose'

import { User } from 'src/models/user.schema'

import { SignUpDTO } from './dto/singin.dto'
import { GitHubProfile } from './github.strategy'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup({ name, password, email, username }: SignUpDTO) {
    const hash_password = await this.hashPassword(password)

    const user = await this.userModel.create({
      password: hash_password,
      email,
      name,
      username,
    })

    return this.jwtService.signAsync({ user: user._id })
  }

  async validateUser(profile: GitHubProfile) {
    const { id, username, display_name, emails } = profile

    const email = emails[0]?.value
    let user = await this.getUserByEmail(email)

    if (!user) {
      user = await this.userModel.create({
        github: id,
        username,
        display_name,
        email,
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

  async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 12)

    return hash
  }

  async comparePassword(password: string, hash_password: string) {
    const is_true = await bcrypt.compare(password, hash_password)

    return is_true
  }
}
