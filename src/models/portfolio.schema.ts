import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type PortfolioDocument = HydratedDocument<Portfolio>

export enum PortfolioType {
  FREE = 'free',
  PAID = 'paid',
}

export class Skill {
  @Prop()
  name: string

  @Prop()
  logo: string

  @Prop()
  category: string

  @Prop()
  level: string

  @Prop()
  description: string
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Portfolio {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId

  @Prop()
  name: string

  @Prop()
  description?: string

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category: Types.ObjectId

  @Prop({ type: [String] })
  images?: string[]

  @Prop()
  page: number

  @Prop()
  github_link: string

  @Prop()
  live_demo: string

  @Prop({ type: String, enum: PortfolioType })
  type: PortfolioType

  @Prop({
    type: [
      {
        name: String,
        logo: String,
        category: String,
        level: String,
        description: String,
      },
    ],
  })
  skills: Skill[]

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  favoritedBy: Types.ObjectId[]

  @Prop({ type: Number, default: 0 })
  likesCount: number

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  likedBy?: Types.ObjectId[]
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio)
