import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { Types } from 'mongoose'
import { IsObjectId } from 'nestjs-object-id'

import { PortfolioType } from 'src/models/portfolio.schema'

export class UpdatePortfolioDTO {
  @IsString()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  description: string

  @IsObjectId()
  @IsOptional()
  @Transform(({ obj }) => new Types.ObjectId(obj.category))
  @ApiProperty({ example: '672f0fd67303b18cfb20e53c' })
  category: string

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images: string[]

  @IsNumber()
  @IsOptional()
  page: number

  @IsString()
  @IsOptional()
  github_link: string

  @IsString()
  @IsOptional()
  live_demo: string

  @IsEnum(PortfolioType)
  @IsOptional()
  type: PortfolioType
}
