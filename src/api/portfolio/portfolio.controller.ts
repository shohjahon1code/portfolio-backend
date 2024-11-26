import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ParseObjectIdPipe } from 'nestjs-object-id'

import { UserDocument } from 'src/models/user.schema'

import { ResponseDTO } from 'src/common/decarators/response.decarator'
import { User } from 'src/common/decarators/user.decarator'

import { Public } from '../../common/decarators/public.decarator'
import { CreatePortfolioDTO } from './dto/create-portfolio.dto'
import { PortfolioResponseDTO } from './dto/response-portfolio.dto'
import { UpdatePortfolioDTO } from './dto/update-portfolio.dto'
import { PortfolioService } from './portfolio.service'

@ApiBearerAuth()
@ApiTags('Portfolio')
@Controller('api/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('/')
  @ResponseDTO(PortfolioResponseDTO, { isArray: true })
  async getAll() {
    const portfolio = await this.portfolioService.getAll()

    return { data: portfolio }
  }

  @Public()
  @Get('/all-portfolios')
  @ResponseDTO(PortfolioResponseDTO, { isArray: true })
  async getAllPortfolio() {
    const portfolio = await this.portfolioService.getAllPortfolios()

    return { data: portfolio }
  }

  @Get('/:id')
  @ResponseDTO(PortfolioResponseDTO)
  async get(@Param('id', ParseObjectIdPipe) id: string) {
    const portfolio = await this.portfolioService.get(id)

    return { data: portfolio }
  }

  @Get('/user/me')
  @ResponseDTO(PortfolioResponseDTO, { isArray: true })
  async getUserPortfolios(@User() user: UserDocument) {
    const user_portfolios = await this.portfolioService.getUserPortfolios(
      user._id,
    )

    if (!user_portfolios || user_portfolios.length === 0) {
      throw new NotFoundException('No portfolios found for this user')
    }

    return { data: user_portfolios }
  }

  @Post('/')
  async create(@Body() body: CreatePortfolioDTO, @User() user: UserDocument) {
    const new_category = await this.portfolioService.create(user._id, body)

    return { data: new_category }
  }

  @Put('/:id')
  async update(
    @Body() body: UpdatePortfolioDTO,
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    const updated_portfolio = await this.portfolioService.update(id, body)

    if (!updated_portfolio) {
      throw new NotFoundException('Category not found')
    }

    return { data: updated_portfolio }
  }

  @Delete('/:id')
  async delete(@Param('id', ParseObjectIdPipe) id: string) {
    await this.portfolioService.delete(id)

    return { data: null }
  }
}
