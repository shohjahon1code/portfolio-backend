import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type SocialDocument = HydratedDocument<Social>

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Social {
  @Prop()
  name: string

  @Prop()
  placeholder: string

  @Prop()
  label: string

  @Prop()
  icon: string
}

export const SocialSchema = SchemaFactory.createForClass(Social)
