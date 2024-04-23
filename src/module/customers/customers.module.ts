import { Module } from '@nestjs/common';
import { ResponsesService } from '../responses/responses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileStorage } from 'src/utilities/filestorage.utils';
import { DateHelper } from 'src/utilities/date.helper';
import { CustomersController } from './customers.controller';
import { CustomersEntity } from './entity/customer.entity';
import { CustomersService } from './customers.service';
import { CustomersProvider } from './customers.provider';

@Module({
    imports: [TypeOrmModule.forFeature([CustomersEntity])],
    controllers: [CustomersController],
    providers: [ResponsesService, FileStorage, DateHelper, CustomersService, CustomersProvider],
})
export class CustomersModule { }
