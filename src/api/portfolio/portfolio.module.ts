import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Portfolio, PortfolioSchema } from 'src/models/portfolio.schema'

import { PortfolioController } from './portfolio.controller'
import { PortfolioService } from './portfolio.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Portfolio.name, schema: PortfolioSchema },
    ]),
  ],
  providers: [PortfolioService],
  controllers: [PortfolioController],
})
export class PortfolioModule {}
