import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Social, SocialDocument } from 'src/models/social.schema'

import { CreateSocialDTO } from './dto/create-social.dto'
import { UpdateSocialDTO } from './dto/update-social.dto'

@Injectable()
export class SocialService {
  constructor(
    @InjectModel(Social.name)
    private readonly socialModel: Model<SocialDocument>,
  ) {}

  async getAll() {
    return this.socialModel.find()
  }

  async get(id: string) {
    return this.socialModel.findById(id)
  }

  async create(data: CreateSocialDTO) {
    return this.socialModel.create(data)
  }

  async update(data: UpdateSocialDTO, id: string) {
    return this.socialModel.findByIdAndUpdate(id, data)
  }

  async delete(id: string) {
    return this.socialModel.findByIdAndDelete(id)
  }
}
