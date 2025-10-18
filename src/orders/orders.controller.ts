/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return await this.ordersService.create(createOrderDto, req.user._id);
  }

  @Get()
  async findAll(@Request() req) {
    return await this.ordersService.findAll(req.user._id, req.user.role);
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string, @Request() req) {
    return await this.ordersService.findOne(id, req.user._id, req.user.role);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Request() req,
  ) {
    return await this.ordersService.update(
      id,
      updateOrderDto,
      req.user.role,
      req.user._id,
    );
  }
}
