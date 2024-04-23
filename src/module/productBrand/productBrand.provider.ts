import { Injectable } from '@nestjs/common';
import { ProductBrandEntity } from './entities/brands.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductBrandsProvider {
    constructor(
        @InjectRepository(ProductBrandEntity)
        private readonly productBrandRepository: Repository<ProductBrandEntity>,
    ) { }

    async addProductBrand(payload: any) {
        const addProduct = await this.productBrandRepository.save(payload);
        return addProduct;
    }

    async getbrandFromFilter(filter: any) {
        const getbrand = await this.productBrandRepository.find({ where: { ...filter } });
        return getbrand;
    }
    async bulkInsertIntoDatabase(dataArray: any[]): Promise<void> {
        await this.productBrandRepository
            .createQueryBuilder()
            .insert()
            .into(ProductBrandEntity)
            .values(dataArray)
            .execute();
    }

}