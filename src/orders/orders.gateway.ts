/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Order } from './schemas/order.schema';
import { Role } from 'src/auth/roles.enum';

interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

@WebSocketGateway(3002, {})
export class OrdersGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService) {}

  afterInit() {}

  broadcastStatusUpdate(order: Order) {
    this.server.emit('order_updated', order);
  }

  async handleConnection(client: Socket) {
    try {
      const authHeader = client.handshake.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        client.disconnect();
        return;
      }
      const token = authHeader.substring(7);
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_SECRET || '123456789',
      });
      console.log(`User ${payload.sub} is connected`);
    } catch (error) {
      client.disconnect();
    }
  }
  handleDisconnect(client: Socket) {}
}
