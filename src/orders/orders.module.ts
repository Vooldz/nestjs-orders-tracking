import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrdersGateway } from './orders.gateway';
import { JwtModule } from '@nestjs/jwt';
import { OrderEventsListener } from './order-events.listener';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    JwtModule,
  ],
  controllers: [OrdersController],
  providers: [OrderEventsListener, OrdersService, OrdersGateway],
  exports: [OrdersGateway],
})
export class OrdersModule {}
