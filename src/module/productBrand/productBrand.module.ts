import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RSeriesService } from 'src/services/rseries.service';
import { AxiosWrapperService } from 'src/services/axios.service';
import { HttpModule } from '@nestjs/axios';
import { ProductBrandEntity } from './entities/brands.entity';
import { ProductBrandsController } from './productBrand.controller';
import { ProductsBrandService } from './productBrand.service';
import { ProductBrandsProvider } from './productBrand.provider';
import { ResponsesService } from '../responses/responses.service';
import { DateHelper } from 'src/utilities/date.helper';
import { CseriesService } from 'src/services/cseries.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductBrandEntity]),HttpModule],
  controllers: [ProductBrandsController],
  providers: [ProductsBrandService,ProductBrandsProvider,RSeriesService,AxiosWrapperService,ResponsesService,ProductBrandsProvider,DateHelper,CseriesService],
})
export class ProductsBrandModule { }
