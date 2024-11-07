import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Social, SocialSchema } from 'src/models/social.schema'

import { SocialController } from './social.controller'
import { SocialService } from './social.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Social.name, schema: SocialSchema }]),
  ],
  providers: [SocialService],
  controllers: [SocialController],
})
export class SocialModule {}
