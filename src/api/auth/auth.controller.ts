import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags } from '@nestjs/swagger'
import axios from 'axios'

import { Public } from 'src/common/decarators/public.decarator'
import { ResponseDTO } from 'src/common/decarators/response.decarator'

import { AuthService } from './auth.service'
import { SignInDTO, SignInResponseDTO, SignUpDTO } from './dto/singin.dto'

@ApiTags('Auth')
@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('/signup')
  @ResponseDTO(SignInResponseDTO)
  async signup(@Body() { name, password, email, username }: SignUpDTO) {
    const existing_user = await this.authService.getUserByEmail(email)

    if (existing_user) {
      throw new BadRequestException('Already registered')
    }

    const access_token = await this.authService.signup({
      name,
      email,
      password,
      username,
    })

    return { data: { access_token } }
  }

  @Public()
  @Post('/signin')
  @ResponseDTO(SignInResponseDTO)
  async signin(@Body() { password, email }: SignInDTO) {
    const existing_user = await this.authService.getUserByEmail(email)

    if (!existing_user) {
      throw new NotFoundException('Email or password incorrect')
    }

    const correct_password = await this.authService.comparePassword(
      password,
      existing_user.password,
    )

    if (!correct_password) {
      throw new NotFoundException('Email or password incorrect')
    }

    const access_token = await this.jwtService.signAsync({
      user: existing_user._id,
    })

    return { data: { access_token } }
  }

  @Public()
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {}

  @Public()
  @Get('github/redirect')
  @UseGuards(AuthGuard('github'))
  async githubRedirect(@Req() req) {
    const code = req.query.code

    // Access token olish
    const access_token_response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      },
    )

    const access_token = access_token_response.data.access_token

    const profile_response = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${access_token}`,
      },
    })

    const profile = profile_response.data

    const user = await this.authService.validateUser(profile)
    return { message: 'GitHub login successful', user }
  }
}
