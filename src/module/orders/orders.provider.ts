import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "./entities/order.entity";
import { Repository } from "typeorm";
import { CreateOrderDto } from "./dto/create-order.dto";

@Injectable()
export class OrdersProvider {
    constructor(@InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>) { }
    async createOrder(data:CreateOrderDto) {
        const result = await this.orderRepository.save(data)
        return result
    }
    async updateOrder(id: number, updates: Record<string, any>){
        const result = await this.orderRepository.createQueryBuilder()
        .update()
        .set(updates)
        .where("id=:id",{id})
        .execute()
        return result.affected
    }
    async getOrder(queryParameters:any):Promise<OrderEntity|null>{
        const result = await this.orderRepository.findOne({where:queryParameters})
        return result
    }
}