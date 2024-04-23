import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductUpdateEntity } from './entities/productUpdates.entity';

@Injectable()
export class ProductUpdateProvider {
    constructor(
        @InjectRepository(ProductUpdateEntity)
        private readonly productUpdateEntity: Repository<ProductUpdateEntity>,
    ) { }

    async createProductUpdate(
        payload: any,
    ) {
        const createVariant = await this.productUpdateEntity.save(payload);
        return createVariant;
    }

    async updateProductUpdate(internal_id: any, payload: any) {
        const body = { internal_id }
        const updateResult = await this.productUpdateEntity.update(
            body,
            payload,
        );
        if (updateResult.affected >= 1) {
            return true;
        } else {
            return false;
        }
    }

    async deleteProductUpdate(internal_id: any) {
        const payload = {
            internal_id,
        }
        const deleteVariantResponse = await this.productUpdateEntity.delete(payload);
        if (deleteVariantResponse.affected >= 1) {
            return true;
        } else {
            return false;
        }
    }


    async getProductUpdate(filter: object) {
        const result = await this.productUpdateEntity.find({
            where: { ...filter },
        });
        return result;
    }

    async update(id: number, payload: object) {
        const result = await this.productUpdateEntity.createQueryBuilder()
            .update()
            .set(payload)
            .where("id = :id", { id })


        console.log(result.getQuery())
        const res = await result.execute()
        return res.affected

    }
}
