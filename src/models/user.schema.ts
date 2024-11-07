import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema()
class WorkHistory {
  @Prop()
  company_name: string

  @Prop()
  company_url: string

  @Prop()
  role: string

  @Prop()
  start_date: Date

  @Prop()
  end_date: Date
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User {
  @Prop()
  name: string

  @Prop()
  email?: string

  @Prop()
  password?: string

  @Prop()
  avatar?: string

  @Prop()
  github?: string

  @Prop()
  location?: string

  @Prop()
  bio?: string

  @Prop({ unique: true })
  username?: string

  @Prop({ type: [WorkHistory] })
  work_history?: WorkHistory[]

  @Prop({ type: Types.ObjectId, ref: 'Social' })
  social_url?: Types.ObjectId

  @Prop({ default: false })
  is_deleted?: boolean

  @Prop()
  deleted_at?: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.index({ is_deleted: 1 })
