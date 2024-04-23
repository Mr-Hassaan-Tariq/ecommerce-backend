import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './module/auth/auth.service';
import { CategoryModule } from './module/categories/categories.module';
import { ErrorHandlerMiddleware } from './middlewares/error-handler.middleware';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { ResponsesModule } from './module/responses/responses.module';
import { JwtConfigModule } from './config/jwt.config';
import { DatabaseModule } from './database/database.module';
import { DatabaseConfigService } from './database/database-config.service';
import { EncryptionDecryptionService } from './database/encryptions.service';
import { ProductsModule } from './module/products/products.module';
import { LoggerService } from './logger/logger.service';
import { CustomersModule } from './module/customers/customers.module';
import { VariantsModule } from './module/variants/variants.module';
import { OrdersModule } from './module/orders/orders.module';
import { ScheduleModule as ScheduModulePackege } from './module/schedule/schedule.module';
import { ScheduleService } from './module/schedule/schedule.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductsService } from './module/products/products.service';
import { ProductProvider } from './module/products/products.provider';
import { CseriesService } from './services/cseries.service';
import { FileStorage } from './utilities/filestorage.utils';
import { DateHelper } from './utilities/date.helper';
import { VariantsProvider } from './module/variants/variants.provider';
import { VariantsService } from './module/variants/variants.service';
import { CategoryService } from './module/categories/categories.service';
import { ProductsBrandService } from './module/productBrand/productBrand.service';
import { ResponsesService } from './module/responses/responses.service';
import { RSeriesService } from './services/rseries.service';
import { CategoryProvider } from './module/categories/categories.providor';
import { AxiosWrapperService } from './services/axios.service';
import { ProductEntity } from './module/products/entities/product.entity';
import { VariantEntity } from './module/variants/entities/variant.entity';
import { ProductCategoryEntity } from './module/categories/entity/product_category.entity';
import { ProductBrandEntity } from './module/productBrand/entities/brands.entity';
import { ProductBrandsProvider } from './module/productBrand/productBrand.provider';
import { HttpModule } from '@nestjs/axios';
import { ProductUpdateModule } from './module/product-update/product-update.module';
import { ProductUpdateProvider } from './module/product-update/product-update.provider';
import { ProductUpdateEntity } from './module/product-update/entities/productUpdates.entity';
import { ProductsBrandModule } from './module/productBrand/productBrand.module';
import { SystemConfigurationsModule } from './module/system_configurations/system_configurations.module';
import { SystemConfigurationProvider } from './module/system_configurations/system_configurations.provider';
import { GoogleAuthApi } from './utilities/google.auth.utils';
import { SystemConfiguration } from './module/system_configurations/entities/system_configurations.entity';
import { HealthModule } from './module/healthchecks/health.module';


@Module({
  imports: [
    HealthModule,
    TypeOrmModule.forRootAsync({
      imports: [DatabaseModule],
      useClass: DatabaseConfigService,
      inject: [EncryptionDecryptionService],
    }), ScheduModulePackege, AuthModule, JwtConfigModule, CategoryModule, ResponsesModule, ProductsModule, VariantsModule, OrdersModule, CustomersModule, ProductsBrandModule, SystemConfigurationsModule, ScheduleModule.forRoot(),

    TypeOrmModule.forFeature([ProductEntity, VariantEntity, ProductCategoryEntity, ProductBrandEntity, ProductUpdateEntity, SystemConfiguration]), HttpModule, ProductUpdateModule],

  providers: [AuthService, LoggerService, ScheduleService,

    ProductsService, ProductProvider, CseriesService, FileStorage, DateHelper, ResponsesService, VariantsProvider, VariantsService, CategoryService, ProductsBrandService, ProductBrandsProvider, RSeriesService, CategoryProvider, ProductUpdateProvider, AxiosWrapperService, SystemConfigurationProvider, GoogleAuthApi],
  exports: [JwtConfigModule],
  controllers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, ErrorHandlerMiddleware).forRoutes('*')
  }
}
