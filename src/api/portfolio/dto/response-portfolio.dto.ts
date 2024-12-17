import { Expose, Transform, Type } from 'class-transformer'

class CategoryDTO {
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

class UserDTO {
  @Expose()
  @Transform(({ obj }) => obj._id)
  _id: string

  @Expose()
  name: string

  @Expose()
  email: string

  @Expose()
  avatar: string

  @Expose()
  bio: string
}

class SkillDTO {
  @Expose()
  name: string

  @Expose()
  logo: string

  @Expose()
  category: string

  @Expose()
  level: string

  @Expose()
  description: string
}

export class PortfolioResponseDTO {
  @Expose()
  @Transform(({ obj }) => obj._id)
  _id: string

  @Expose()
  name: string

  @Expose()
  description: string

  @Expose()
  @Type(() => CategoryDTO)
  category: CategoryDTO[]

  @Expose()
  @Type(() => UserDTO)
  user: UserDTO

  @Expose()
  images: string[]

  @Expose()
  page: number

  @Expose()
  github_link: string

  @Expose()
  live_demo: string

  @Expose()
  @Type(() => SkillDTO)
  skills: SkillDTO[]

  @Expose()
  type: string
}
