import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'

import { UserDocument } from 'src/models/user.schema'

import { Public } from 'src/common/decarators/public.decarator'
import { ResponseDTO } from 'src/common/decarators/response.decarator'

import { AuthService } from './auth.service'
import { SignInDTO, SignInResponseDTO, SignUpDTO } from './dto/singin.dto'

interface ForGoogleRequest extends Request {
  user?: {
    firstName: string
    lastName: string
    email: string
    picture: string
  }
}

@ApiTags('Auth')
@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: ForGoogleRequest, @Res() res: Response) {
    try {
      const front_url = this.configService.get<string>('FRONT_URL')

      const token = await this.authService.signUpGoogle({
        fio: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
        picture: req.user.picture,
      })

      res.redirect(`${front_url}?access_token=${token.access_token}`)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Public()
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // Guard redirects to GitHub
  }

  @Public()
  @Get('github/redirect')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      const front_url = this.configService.get<string>('FRONT_URL')
      const user = req.user as UserDocument

      const token = await this.jwtService.signAsync({ user: user._id })

      res.redirect(`${front_url}?access_token=${token}`)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

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
}
