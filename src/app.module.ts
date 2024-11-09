import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'

import { AuthGuard } from './api/auth/auth.guard'
import { AuthModule } from './api/auth/auth.module'
import { CategoryModule } from './api/category/category.module'
import { PortfolioModule } from './api/portfolio/portfolio.module'
import { ProfileModule } from './api/profile/profile.module'
import { SocialModule } from './api/social/social.module'
import configuration from './config'

@Module({
  imports: [
    ConfigModule.forRoot(configuration),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('database.uri'),
        user: config.get('database.user'),
        pass: config.get('database.password'),
        dbName: config.get('database.name'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('jwt_secret'),
        signOptions: {
          expiresIn: '2d',
        },
      }),
      inject: [ConfigService],
      global: true,
    }),
    AuthModule,
    CategoryModule,
    ProfileModule,
    SocialModule,
    PortfolioModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
