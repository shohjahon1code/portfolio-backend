import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type CategoryDocument = HydratedDocument<Category>

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Category {
  @Prop()
  name: string

  @Prop()
  description?: string

  @Prop()
  image?: string
}

export const CategorySchema = SchemaFactory.createForClass(Category)
