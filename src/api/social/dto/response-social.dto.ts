import { Expose, Transform } from 'class-transformer'

export class SocialResponseDTO {
  @Expose()
  @Transform(({ obj }) => obj._id)
  _id: string

  @Expose()
  name: string

  @Expose()
  label: string

  @Expose()
  placeholder: string

  @Expose()
  icon: string
}
