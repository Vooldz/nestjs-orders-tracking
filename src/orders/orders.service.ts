import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Model, Types } from 'mongoose';
import { Role } from 'src/auth/roles.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    const order = new this.orderModel({ ...createOrderDto, user: userId });
    return await order.save();
  }

  async findAll(userId: string, userRole: Role): Promise<Order[]> {
    if (userRole === Role.ADMIN) {
      return await this.orderModel.find().exec();
    }
    return await this.orderModel.find({ user: userId }).exec();
  }

  async findOne(id: string, userId: string, userRole: Role): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    if (
      !new Types.ObjectId(userId).equals(order.user._id) &&
      userRole !== Role.ADMIN
    ) {
      throw new ForbiddenException('Cannot access this order');
    }
    return order;
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
    userRole: Role,
    userId: string,
  ): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (
      !new Types.ObjectId(userId).equals(order.user._id) &&
      userRole !== Role.ADMIN
    ) {
      throw new ForbiddenException('Access denied');
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();

    return updatedOrder as Order;
  }
}
