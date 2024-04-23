import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { CategoriesEntity } from './entity/categories.entity';
import { Repository } from 'typeorm';
import { addCategoryDataType } from './dto/addCategory.dto';
import { ResponsesService } from '../responses/responses.service';
import { ProductCategoryEntity } from './entity/product_category.entity';

@Injectable()
export class CategoryProvider {
    constructor(
        @InjectRepository(ProductCategoryEntity)
        private categoryRepository: Repository<ProductCategoryEntity>,
        // private readonly responseServcie: ResponsesService,
    ) { }


    async addCategory(payload: any) {
        const addCategory = await this.categoryRepository.save(payload);
        return addCategory;
    }

    async getCategoryFromFilter(filter: any) {
        const getCategory = await this.categoryRepository.find({ where: { ...filter } });

        return getCategory;
    }
}
