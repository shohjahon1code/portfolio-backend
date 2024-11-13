import { Injectable } from '@nestjs/common'
import { path as root_path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'

import { FileResponseDTO } from './dto/file-response.dto'

@Injectable()
export class UploadService {
  async upload(file: Express.Multer.File, folder: string = 'default') {
    const unique_id = uuidv4()
    const extension = path.extname(file.originalname)
    const file_name = `${unique_id}${extension}`
    const folder_path = path.join(root_path, 'uploads', folder)

    await ensureDir(folder_path)
    await writeFile(path.join(folder_path, file_name), file.buffer)

    const response: FileResponseDTO = {
      url: `/uploads/${folder}/${file_name}`,
      name: file.originalname,
    }

    return response
  }
}
