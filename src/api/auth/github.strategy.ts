import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-github2'

import { AuthService } from './auth.service'

export interface GitHubProfile {
  id: number
  username: string
  displayName: string
  photos: { value: string }[]
  emails: { value: string }[]
}

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/github/redirect`,
      scope: ['user:email'],
    })
  }

  async validate(access_token: string, profile: GitHubProfile) {
    const { id, username, displayName, photos, emails } = profile
    const user = await this.authService.validateUser({
      id,
      username,
      displayName,
      photos,
      emails,
    })

    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
