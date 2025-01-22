import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Types } from 'mongoose'
import { IsObjectId } from 'nestjs-object-id'

import { PortfolioType } from 'src/models/portfolio.schema'

export class Skill {
  @IsString()
  @ApiProperty({ example: 'React' })
  name: string

  @IsString()
  @ApiProperty({
    example:
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  })
  logo: string

  @IsString()
  @ApiProperty({ example: 'Frontend' })
  category: string

  @IsString()
  @ApiProperty({ example: 'Expert' })
  level: string

  @IsString()
  @ApiProperty({
    example: 'JavaScript library for building user interfaces',
  })
  description: string
}

export class CreatePortfolioDTO {
  @IsString()
  name: string

  @IsString()
  description: string

  @IsObjectId()
  @Transform(({ obj }) => new Types.ObjectId(obj.category))
  @ApiProperty({ example: '672f0fd67303b18cfb20e53c' })
  category: string

  @IsArray()
  @IsString({ each: true })
  images: string[]

  @IsNumber()
  page: number

  @IsString()
  github_link: string

  @IsString()
  live_demo: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Skill)
  skills: Skill[]

  @IsEnum(PortfolioType)
  @IsOptional()
  type: PortfolioType

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://example.com/video.mp4' })
  video_url: string

  @IsOptional()
  @ApiProperty({ example: true })
  isPublic: boolean
}
