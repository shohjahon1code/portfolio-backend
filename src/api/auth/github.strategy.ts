import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-github2'

import { AuthService } from './auth.service'

// Interface for the profile data we'll use in auth service
export interface GitHubProfileData {
  id: number
  username: string
  display_name?: string
  emails?: { value: string }[]
  photos?: { value: string }[]
}

// Full GitHub profile from passport-github2
interface GitHubFullProfile {
  id: number
  username: string
  display_name?: string
  photos?: { value: string }[]
  emails?: { value: string }[]
  _json: {
    email?: string
    avatar_url?: string
    name?: string
  }
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
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email', 'read:user'],
    })
  }

  async validate(_: string, __: string, profile: GitHubFullProfile) {
    const email = profile.emails?.[0]?.value || profile._json.email
    const name = profile.display_name || profile._json.name || profile.username
    const avatar = profile.photos?.[0]?.value || profile._json.avatar_url

    if (!email) {
      throw new UnauthorizedException('Email is required from GitHub')
    }

    const profile_data: GitHubProfileData = {
      id: profile.id,
      username: profile.username,
      display_name: name,
      emails: [{ value: email }],
      photos: avatar ? [{ value: avatar }] : undefined,
    }

    const user = await this.authService.validateUser(profile_data)

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
