import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcryptjs'
import { Model } from 'mongoose'

import { User, UserDocument } from 'src/models/user.schema'

import { UpdateProfileDTO } from './dto/update-profile.dto'

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getAllUsers() {
    const users = await this.userModel.find().exec()
    return users
  }

  async getMe(user: UserDocument) {
    const profile = await this.userModel.findById(user._id)

    return profile
  }

  async update(user: UserDocument, data: UpdateProfileDTO) {
    if (data.username) {
      const existing_user = await this.userModel.findOne({
        username: data.username,
        _id: { $ne: user._id },
      })

      if (existing_user) {
        throw new BadRequestException('Username is already taken')
      }
    }
    const update_profile = await this.userModel.findByIdAndUpdate(
      user._id,
      data,
      {
        new: true,
      },
    )

    return update_profile
  }

  async changePassword(
    user: UserDocument,
    old_password: string,
    new_password: string,
  ) {
    const is_password_correct = await bcrypt.compare(
      old_password,
      user.password,
    )
    if (!is_password_correct) {
      throw new BadRequestException('Incorrect old password')
    }

    const salt_rounds = 12
    const hashed_password = await bcrypt.hash(new_password, salt_rounds)

    const updated_user = await this.userModel.findByIdAndUpdate(
      user._id,
      { password: hashed_password },
      { new: true },
    )

    if (!updated_user) {
      throw new BadRequestException('Failed to update the password')
    }

    return updated_user
  }

  async deleteProfile(user_id: string) {
    const deleted_profile = await this.userModel.findByIdAndUpdate(
      user_id,
      { is_deleted: true },
      { new: true },
    )

    return deleted_profile
  }
}
