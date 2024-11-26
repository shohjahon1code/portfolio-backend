import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { Portfolio, PortfolioDocument } from 'src/models/portfolio.schema'

import { CreatePortfolioDTO } from './dto/create-portfolio.dto'
import { UpdatePortfolioDTO } from './dto/update-portfolio.dto'

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(Portfolio.name)
    private readonly portfolioModel: Model<PortfolioDocument>,
  ) {}

  async getAll() {
    return this.portfolioModel
      .find()
      .populate('user')
      .populate('category')
      .populate('skills')
      .exec()
  }

  async getAllPortfolios() {
    return this.portfolioModel
      .find()
      .populate('user')
      .populate('category')
      .populate('skills')
      .exec()
  }

  async get(id: string) {
    return this.portfolioModel
      .findById(id)
      .populate('user')
      .populate('category')
      .populate('skills')
      .exec()
  }

  async create(user: Types.ObjectId, data: CreatePortfolioDTO) {
    const new_portfolio = await this.portfolioModel.create({
      user: user,
      ...data,
    })

    return new_portfolio
  }

  async update(id: string, data: UpdatePortfolioDTO) {
    const update_portfolio = await this.portfolioModel.findByIdAndUpdate(
      id,
      data,
      { new: true },
    )

    return update_portfolio
  }

  async delete(id: string) {
    const portfolio = await this.portfolioModel.findByIdAndDelete(id)

    return portfolio
  }
}
