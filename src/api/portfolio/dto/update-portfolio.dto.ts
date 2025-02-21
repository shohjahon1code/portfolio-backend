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

class SkillDTO {
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

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SkillDTO)
  skills: SkillDTO[]

  @IsEnum(PortfolioType)
  @IsOptional()
  type: PortfolioType

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://example.com/videos.mp4' })
  video_url: string

  @IsOptional()
  @ApiProperty({ example: true })
  isPublic: boolean
}
