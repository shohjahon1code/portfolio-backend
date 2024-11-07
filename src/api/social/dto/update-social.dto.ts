import { IsOptional, IsString } from 'class-validator'

export class UpdateSocialDTO {
  @IsString()
  name: string

  @IsString()
  @IsOptional()
  label: string

  @IsString()
  placeholder: string

  @IsString()
  icon: string
}
