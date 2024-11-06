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

import { CategoryService } from './category.service'
import { CategoryResponseDTO } from './dto/category-response.dto'
import { CreateCategoryDTO } from './dto/create-category.dto'
import { UpdateCategoryDTO } from './dto/update-category.dto'

@ApiBearerAuth()
@ApiTags('Category')
@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  @ResponseDTO(CategoryResponseDTO, { isArray: true })
  async getAll() {
    const category = await this.categoryService.getAll()

    return { data: category }
  }

  @Get('/:id')
  @ResponseDTO(CategoryResponseDTO, { isArray: true })
  async get(@Param('id', ParseObjectIdPipe) id: string) {
    const category = await this.categoryService.get(id)

    return { data: category }
  }

  @Post('/')
  async create(@Body() body: CreateCategoryDTO) {
    const new_category = await this.categoryService.create(body)

    return { data: new_category }
  }

  @Put('/:id')
  async update(
    @Body() body: UpdateCategoryDTO,
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    const updated_category = await this.categoryService.update(body, id)

    if (!updated_category) {
      throw new NotFoundException('Category not found')
    }

    return { data: updated_category }
  }

  @Delete('/:id')
  async delete(@Param('id', ParseObjectIdPipe) id: string) {
    await this.categoryService.delete(id)

    return { data: null }
  }
}
