import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductProvider } from './products.provider';
import { ResponsesService } from '../responses/responses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { CseriesService } from 'src/services/cseries.service';
import { FileStorage } from 'src/utilities/filestorage.utils';
import { DateHelper } from 'src/utilities/date.helper';
import { VariantsProvider } from '../variants/variants.provider';
import { VariantEntity } from '../variants/entities/variant.entity';
import { VariantsService } from '../variants/variants.service';
import { RSeriesService } from 'src/services/rseries.service';
import { HttpModule } from '@nestjs/axios';
import { AxiosWrapperService } from 'src/services/axios.service';
import { CategoryService } from '../categories/categories.service';
import { CategoryProvider } from '../categories/categories.providor';
import { ProductCategoryEntity } from '../categories/entity/product_category.entity';
import { ProductsBrandService } from '../productBrand/productBrand.service';
import { ProductBrandsProvider } from '../productBrand/productBrand.provider';
import { ProductBrandEntity } from '../productBrand/entities/brands.entity';
import { ProductUpdateEntity } from '../product-update/entities/productUpdates.entity';
import { ProductUpdateProvider } from '../product-update/product-update.provider';
import { GoogleAuthApi } from 'src/utilities/google.auth.utils';
import { SystemConfiguration } from '../system_configurations/entities/system_configurations.entity';
import { SystemConfigurationProvider } from '../system_configurations/system_configurations.provider';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, VariantEntity, ProductCategoryEntity, ProductBrandEntity, ProductUpdateEntity, RSeriesService, SystemConfiguration]), HttpModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductProvider, CategoryService, CategoryProvider, ProductsBrandService, ProductBrandsProvider, ResponsesService, CseriesService, FileStorage, DateHelper, VariantsProvider, VariantsService, AxiosWrapperService, ProductUpdateProvider, RSeriesService, GoogleAuthApi, SystemConfigurationProvider],
})
export class ProductsModule { }
