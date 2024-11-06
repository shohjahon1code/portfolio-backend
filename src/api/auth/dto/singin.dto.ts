import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'

export class SignUpDTO {
  @IsString()
  name: string

  @IsString()
  email?: string

  @IsString()
  password: string
}

export class SignInDTO {
  @IsString()
  email?: string

  @IsString()
  password: string
}

export class SignInResponseDTO {
  @Expose()
  access_token: string
}
