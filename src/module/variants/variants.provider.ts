import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VariantEntity } from './entities/variant.entity';
import { Repository } from 'typeorm';
import { CreateVariantDto } from './dto/create-variant.dto';

@Injectable()
export class VariantsProvider {
    constructor(
        @InjectRepository(VariantEntity)
        private readonly variantsRepository: Repository<VariantEntity>,
    ) { }

    async createVariants(
        createVariantDTO: CreateVariantDto,
    ): Promise<CreateVariantDto | null> {
        const createVariant = await this.variantsRepository.save(createVariantDTO);
        return createVariant;
    }

    async updateVariants(variant_internal_id: any, payload: any) {
        const updateResult = await this.variantsRepository.update(
            { variant_internal_id },
            payload,
        );
        if (updateResult.affected >= 1) {
            return true;
        } else {
            return false;
        }
    }

    async deleteVariant(variant_internal_id: any) {
        const deleteVariantResponse = await this.variantsRepository.delete({
            variant_internal_id,
        });
        if (deleteVariantResponse.affected >= 1) {
            return true;
        } else {
            return false;
        }
    }

    async bulkInsertIntoDatabaseVariant(dataArray: any[]): Promise<void> {
        await this.variantsRepository
            .createQueryBuilder()
            .insert()
            .into(VariantEntity)
            .values(dataArray)
            .execute();
    }
    async getVariantById(internal_id: number) {
        const result = await this.variantsRepository
            .createQueryBuilder('v')
            .where('v.internal_id=:internal_id', { internal_id: internal_id })
            .getOne();
        return result;
    }
    async getVariantsbyFilter(filter: object) {
        const result = await this.variantsRepository.find({
            where: { ...filter },
        });
        return result;
    }
    async getVariant(filter: object) {
        const result = await this.variantsRepository.findOne({
            where: { ...filter },
        });
        return result;
    }
}
