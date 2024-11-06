import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Category, CategoryDocument } from 'src/models/category.schema'

import { CreateCategoryDTO } from './dto/create-category.dto'
import { UpdateCategoryDTO } from './dto/update-category.dto'

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async getAll() {
    return this.categoryModel.find()
  }

  async get(id: string) {
    return this.categoryModel.findById(id)
  }

  async create(data: CreateCategoryDTO) {
    return this.categoryModel.create(data)
  }

  async update(data: UpdateCategoryDTO, id: string) {
    return this.categoryModel.findByIdAndUpdate(id, data)
  }

  async delete(id: string) {
    return this.categoryModel.findByIdAndDelete(id)
  }
}
