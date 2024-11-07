import { Expose, Transform, Type } from 'class-transformer'

class WorkHistoryDTO {
  @Expose()
  company_name: string

  @Expose()
  company_url: string

  @Expose()
  role: string

  @Expose()
  start_date: Date

  @Expose()
  end_date: Date
}

class SocialDTO {
  @Expose()
  name: string

  @Expose()
  link: string
}

export class UserProfileResponseDTO {
  @Expose()
  @Transform(({ obj }) => obj._id)
  _id: string

  @Expose()
  name: string

  @Expose()
  email: string

  @Expose()
  username: string

  @Expose()
  avatar: string

  @Expose()
  location: string

  @Expose()
  bio: string

  @Expose()
  @Type(() => WorkHistoryDTO)
  work_history: WorkHistoryDTO[]

  @Expose()
  @Type(() => SocialDTO)
  social_url: SocialDTO[]
}
