import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { User, UserDocument } from 'src/models/user.schema'

import { UpdateProfileDTO } from './dto/update-profile.dto'

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getMe(user: UserDocument) {
    const profile = await this.userModel.findById(user._id)

    return profile
  }

  async update(user: UserDocument, data: UpdateProfileDTO) {
    const update_profile = await this.userModel.findByIdAndUpdate(
      user._id,
      data,
      {
        new: true,
      },
    )

    return update_profile
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
