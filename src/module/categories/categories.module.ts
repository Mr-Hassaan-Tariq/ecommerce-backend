import { Module } from '@nestjs/common';
import { CategoryService } from './categories.service';
import { CategoryProvider } from './categories.providor';
import { CategoryController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { CategoriesEntity } from './entity/categories.entity';
import { AuthService } from '../auth/auth.service';
import { JwtConfigModule } from 'src/config/jwt.config';
import { ResponsesService } from '../responses/responses.service';
import { DateHelper } from 'src/utilities/date.helper';
import { CseriesService } from 'src/services/cseries.service';
import { ProductCategoryEntity } from './entity/product_category.entity';
@Module({
  providers: [CategoryService, CategoryProvider,AuthService,ResponsesService,DateHelper,CseriesService],
  controllers: [CategoryController],
  imports:[TypeOrmModule.forFeature([ProductCategoryEntity]),JwtConfigModule]
})
export class CategoryModule {}
