import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { ProductsService } from '../products/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductProvider } from '../products/products.provider';
import { CseriesService } from 'src/services/cseries.service';
import { FileStorage } from 'src/utilities/filestorage.utils';
import { DateHelper } from 'src/utilities/date.helper';
import { ResponsesService } from '../responses/responses.service';
import { VariantsProvider } from '../variants/variants.provider';
import { VariantsService } from '../variants/variants.service';
import { CategoryService } from '../categories/categories.service';
import { ProductsBrandService } from '../productBrand/productBrand.service';
import { VariantEntity } from '../variants/entities/variant.entity';
import { RSeriesService } from 'src/services/rseries.service';
import { CategoryProvider } from '../categories/categories.providor';
import { ProductBrandsProvider } from '../productBrand/productBrand.provider';
import { AxiosWrapperService } from 'src/services/axios.service';
import { ProductCategoryEntity } from '../categories/entity/product_category.entity';
import { ProductBrandEntity } from '../productBrand/entities/brands.entity';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ProductUpdateEntity } from '../product-update/entities/productUpdates.entity';
import { ProductUpdateProvider } from '../product-update/product-update.provider';
import { SystemConfigurationProvider } from '../system_configurations/system_configurations.provider';
import { GoogleAuthApi } from 'src/utilities/google.auth.utils';
import { SystemConfiguration } from '../system_configurations/entities/system_configurations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, VariantEntity, ProductCategoryEntity, ProductBrandEntity, ProductUpdateEntity, SystemConfiguration]), HttpModule],
  controllers: [ScheduleController],

  providers: [ScheduleService, ProductsService, ProductProvider, CseriesService, FileStorage, DateHelper, ResponsesService, VariantsProvider, VariantsService, CategoryService, ProductsBrandService, RSeriesService, CategoryProvider, ProductBrandsProvider, AxiosWrapperService, ProductUpdateProvider, SystemConfigurationProvider, GoogleAuthApi]
})
export class ScheduleModule { }
