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

  async getUserPortfolios(user: Types.ObjectId) {
    return this.portfolioModel
      .find({ user: user._id })
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

  async getUserFavorites(user: Types.ObjectId) {
    return this.portfolioModel
      .find({ favoritedBy: user })
      .populate('user')
      .populate('category')
      .populate('skills')
      .exec()
  }

  async toggleFavorite(portfolioId: string, user: Types.ObjectId) {
    const portfolio = await this.portfolioModel.findById(portfolioId)

    if (!portfolio) {
      throw new Error('Portfolio not found')
    }

    const is_favorited = portfolio.favoritedBy?.includes(user._id)

    if (is_favorited) {
      portfolio.favoritedBy = portfolio.favoritedBy.filter(
        (id) => !id.equals(user._id),
      )
    } else {
      portfolio.favoritedBy.push(user._id)
    }

    await portfolio.save()

    return portfolio
  }

  async getUserLikes(user: Types.ObjectId) {
    return this.portfolioModel
      .find({ likedBy: user._id })
      .populate('user')
      .populate('category')
      .populate('skills')
      .exec()
  }

  async toggleLike(portfolioId: string, user: Types.ObjectId) {
    const portfolio = await this.portfolioModel.findById(portfolioId)

    if (!portfolio) {
      throw new Error('Portfolio not found')
    }

    const is_liked = portfolio.likedBy?.includes(user._id)

    if (is_liked) {
      portfolio.likedBy = portfolio.likedBy.filter((id) => !id.equals(user._id))
      portfolio.likesCount = (portfolio.likesCount || 1) - 1
    } else {
      portfolio.likedBy.push(user._id)
      portfolio.likesCount = (portfolio.likesCount || 0) + 1
    }

    await portfolio.save()

    return portfolio
  }

  async incrementLikes(portfolioId: string) {
    const portfolio = await this.portfolioModel.findByIdAndUpdate(
      portfolioId,
      { $inc: { likesCount: 1 } },
      { new: true },
    )
    if (!portfolio) {
      throw new Error('Portfolio not found')
    }

    return portfolio
  }

  async decrementLikes(portfolioId: string) {
    const portfolio = await this.portfolioModel.findByIdAndUpdate(
      portfolioId,
      { $inc: { likesCount: -1 } },
      { new: true },
    )
    if (!portfolio) {
      throw new Error('Portfolio not found')
    }

    return portfolio
  }
}
