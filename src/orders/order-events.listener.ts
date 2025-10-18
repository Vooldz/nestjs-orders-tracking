import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrdersGateway } from './orders.gateway';
import { Order } from './schemas/order.schema';

@Injectable()
export class OrderEventsListener {
  constructor(private ordersGateway: OrdersGateway) {}
  @OnEvent('order.status.updated')
  handleOrderStatusUpdated(order: Order) {
    this.ordersGateway.broadcastStatusUpdate(order);
  }
}
