import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from '../../auth/roles.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,6})+$/,
      'Please enter a valid email',
    ],
  })
  email: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({ default: Role.USER, enum: Role })
  role: Role;

  @Prop({ required: true, trim: true, minlength: 2, maxlength: 50 })
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 });
