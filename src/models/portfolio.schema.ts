import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type PortfolioDocument = HydratedDocument<Portfolio>

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
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio)
