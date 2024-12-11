import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'

import { User, UserSchema } from 'src/models/user.schema'

import { EmailService } from 'src/services/email.service'
import { SmsService } from 'src/services/sms.service'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { GitHubStrategy } from './github.strategy'
import { GoogleStrategy } from './google.strategy'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: ['github', 'google'] }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SmsService, GitHubStrategy, GoogleStrategy, EmailService],
  exports: [AuthService],
})
export class AuthModule {}
