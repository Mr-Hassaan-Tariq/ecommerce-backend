import { Module } from '@nestjs/common';
import { ProductUpdateService } from './product-update.service';
import { ProductUpdateProvider } from './product-update.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductUpdateEntity } from './entities/productUpdates.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ProductUpdateEntity])],
  providers: [ProductUpdateService, ProductUpdateProvider]
})
export class ProductUpdateModule {}
