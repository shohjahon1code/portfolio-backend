import {
  BadRequestException,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'

import { UploadService } from './upload.service'

@ApiBearerAuth()
@ApiTags('Upload')
@Controller('api/upload')
export class UploadController {
  private allowed_mimeTypes: string[]
  constructor(private readonly uploadService: UploadService) {
    this.allowed_mimeTypes = [
      'image/jpeg',
      'image/heic',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ]
  }

  @Post('/')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    const max_file_size = 100 * 1024 * 1024

    if (!file) {
      throw new HttpException('File is undefined', HttpStatus.BAD_REQUEST)
    }

    if (file.size && file.size > max_file_size) {
      throw new BadRequestException('File size exceeds')
    }

    if (!this.allowed_mimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only image files are allowed.',
      )
    }

    const file_response = await this.uploadService.upload(file, folder)

    return { data: file_response }
  }
}
