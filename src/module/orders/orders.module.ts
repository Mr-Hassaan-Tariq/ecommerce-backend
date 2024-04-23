import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrdersProvider } from './orders.provider';
import { ResponsesService } from '../responses/responses.service';
import { DateHelper } from 'src/utilities/date.helper';
import { VariantEntity } from '../variants/entities/variant.entity';
import { VariantsProvider } from '../variants/variants.provider';
import { RSeriesService } from 'src/services/rseries.service';
import { HttpModule } from '@nestjs/axios';
import { AxiosWrapperService } from 'src/services/axios.service';
import { CustomersEntity } from '../customers/entity/customer.entity';
import { CustomersProvider } from '../customers/customers.provider';
import { CseriesService } from 'src/services/cseries.service';

@Module({
    imports: [TypeOrmModule.forFeature([OrderEntity, VariantEntity, CustomersEntity]), HttpModule],
    controllers: [OrdersController],
    providers: [OrdersService, OrdersProvider, ResponsesService, DateHelper, VariantsProvider, RSeriesService, AxiosWrapperService, ResponsesService, CustomersProvider, CseriesService],
    exports: [AxiosWrapperService]
})
export class OrdersModule { }
