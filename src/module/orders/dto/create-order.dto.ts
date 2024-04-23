import { IsObject, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderEntity } from '../entities/order.entity';
import { PartialType } from '@nestjs/mapped-types';

export class CreateOrderDto extends PartialType(OrderEntity) { }
export class Order {
    @IsNotEmpty()
    id: number;
}
export class OrderDto {
    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => Order)
    order: Order;
}
