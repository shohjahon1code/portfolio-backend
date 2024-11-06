import { Expose, Transform } from 'class-transformer'

export class CategoryResponseDTO {
  @Expose()
  @Transform(({ obj }) => obj._id)
  _id: string

  @Expose()
  name: string

  @Expose()
  description: string

  @Expose()
  image: string
}
