import { Type } from 'class-transformer'
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator'

class WorkHistory {
  @IsString()
  @IsOptional()
  company_name: string

  @IsString()
  @IsOptional()
  company_url: string

  @IsString()
  @IsOptional()
  role: string

  @IsString()
  @IsOptional()
  start_date: string

  @IsString()
  @IsOptional()
  end_date: Date
}

class Social {
  @IsString()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  link: string
}

export class UpdateProfileDTO {
  @IsString()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  email: string

  @IsString()
  @IsOptional()
  username: string

  @IsString()
  @IsOptional()
  password: string

  @IsString()
  @IsOptional()
  avatar: string

  @IsString()
  @IsOptional()
  banner: string

  @IsString()
  @IsOptional()
  location: string

  @IsString()
  @IsOptional()
  bio: string

  @IsString()
  @IsOptional()
  role: string

  @IsString()
  @IsOptional()
  website_url: string

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => WorkHistory)
  work_history: WorkHistory[]

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => Social)
  social_url: Social[]
}

export class ChangePasswordDTO {
  @IsString()
  old_password: string

  @IsString()
  new_password: string
}
