import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ParseObjectIdPipe } from 'nestjs-object-id'

import { ResponseDTO } from 'src/common/decarators/response.decarator'

import { CreateSocialDTO } from './dto/create-social.dto'
import { SocialResponseDTO } from './dto/response-social.dto'
import { UpdateSocialDTO } from './dto/update-social.dto'
import { SocialService } from './social.service'

@ApiBearerAuth()
@ApiTags('Social')
@Controller('api/social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Get('/')
  @ResponseDTO(SocialResponseDTO, { isArray: true })
  async getAll() {
    const category = await this.socialService.getAll()

    return { data: category }
  }

  @Get('/:id')
  @ResponseDTO(SocialResponseDTO, { isArray: true })
  async get(@Param('id', ParseObjectIdPipe) id: string) {
    const category = await this.socialService.get(id)

    return { data: category }
  }

  @Post('/')
  async create(@Body() body: CreateSocialDTO) {
    const new_category = await this.socialService.create(body)

    return { data: new_category }
  }

  @Put('/:id')
  async update(
    @Body() body: UpdateSocialDTO,
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    const updated_category = await this.socialService.update(body, id)

    if (!updated_category) {
      throw new NotFoundException('Category not found')
    }

    return { data: updated_category }
  }

  @Delete('/:id')
  async delete(@Param('id', ParseObjectIdPipe) id: string) {
    await this.socialService.delete(id)

    return { data: null }
  }
}
