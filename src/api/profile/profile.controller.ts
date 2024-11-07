import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ParseObjectIdPipe } from 'nestjs-object-id'

import { UserDocument } from 'src/models/user.schema'

import { ResponseDTO } from 'src/common/decarators/response.decarator'
import { User } from 'src/common/decarators/user.decarator'

import { UserProfileResponseDTO } from './dto/profile-response.dto'
import { UpdateProfileDTO } from './dto/update-profile.dto'
import { ProfileService } from './profile.service'

@ApiBearerAuth()
@ApiTags('Profile')
@Controller('api/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/me')
  @ResponseDTO(UserProfileResponseDTO)
  async getMe(@User() user: UserDocument) {
    const profile = await this.profileService.getMe(user)

    if (!profile) {
      throw new NotFoundException('Profile not found')
    }

    return { data: profile }
  }

  @Put('/')
  async update(@User() user: UserDocument, @Body() body: UpdateProfileDTO) {
    const update_profile = await this.profileService.update(user, body)

    return { data: update_profile }
  }

  @Delete('/:id')
  async delete(@Param('id', ParseObjectIdPipe) id: string) {
    await this.profileService.deleteProfile(id)

    return { data: null }
  }
}
