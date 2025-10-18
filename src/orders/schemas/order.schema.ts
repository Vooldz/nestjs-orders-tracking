import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { orderStatus } from '../status.enum';
import { User } from '../../users/schemas/user.schema';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  _id: Types.ObjectId;

  @Prop({ required: true })
  clientName: string;

  @Prop({ default: orderStatus.PENDING, enum: orderStatus })
  status?: orderStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User | Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
