import { IsOptional, IsString } from 'class-validator'

export class UpdateCategoryDTO {
  @IsString()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  description: string

  @IsString()
  @IsOptional()
  image: string
}
