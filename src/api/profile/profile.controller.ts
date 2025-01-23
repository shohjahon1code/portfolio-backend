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

import { Public } from '../../common/decarators/public.decarator'
import { UserProfileResponseDTO } from './dto/profile-response.dto'
import { ChangePasswordDTO, UpdateProfileDTO } from './dto/update-profile.dto'
import { ProfileService } from './profile.service'

@ApiBearerAuth()
@ApiTags('Profile')
@Controller('api/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Public()
  @Get('/all')
  async getAllUsers() {
    const users = await this.profileService.getAllUsers()

    return { data: users }
  }

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

  @Put('/password')
  async updatePassword(
    @User() user: UserDocument,
    @Body() body: ChangePasswordDTO,
  ) {
    const update_passowrd = await this.profileService.changePassword(
      user,
      body.old_password,
      body.new_password,
    )

    return { data: update_passowrd }
  }

  @Delete('/:id')
  async delete(@Param('id', ParseObjectIdPipe) id: string) {
    await this.profileService.deleteProfile(id)

    return { data: null }
  }
}
