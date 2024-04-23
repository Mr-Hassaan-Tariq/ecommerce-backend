import { Injectable } from "@nestjs/common";
import { CustomersEntity } from "./entity/customer.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomerDto } from './dto/customers.dto';

@Injectable()

export class CustomersProvider {
    constructor(
        @InjectRepository(CustomersEntity)
        private readonly customerRepository: Repository<CustomersEntity>
    ) { }

    async addBulkCustomers(dataArray: any[]): Promise<void> {
        await this.customerRepository
            .createQueryBuilder()
            .insert()
            .into(CustomersEntity)
            .values(dataArray)
            .execute();
    }
    async findCustomer(email: string | undefined, phone_number: string | undefined, is_active: boolean | undefined): Promise<CustomersEntity | undefined> {

        let query = this.customerRepository.createQueryBuilder('c');
        if (email && phone_number) {
            query = query.where('(c.email = :email OR c.phone_number = :phone_number) AND c.is_active = :is_active', { email, phone_number, is_active });
        } else if (email) {
            query = query.andWhere('c.email = :email AND c.is_active = :is_active', { email, is_active });
        } else if (phone_number) {
            query = query.andWhere('c.phone_number = :phone_number AND c.is_active = :is_active', { phone_number, is_active });
        }

        const customer = await query.getOne();
        return customer;

    }
    async createCustomer(data: CustomerDto) {
        const customer = await this.customerRepository.save(data)
        return customer
    }
}