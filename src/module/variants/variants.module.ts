import { Module } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { VariantsController } from './variants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariantEntity } from './entities/variant.entity';
import { VariantsProvider } from './variants.provider';
import { ResponsesService } from '../responses/responses.service';
import { DateHelper } from 'src/utilities/date.helper';
import { CseriesService } from 'src/services/cseries.service';
import { RSeriesService } from 'src/services/rseries.service';
import { AxiosWrapperService } from 'src/services/axios.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [TypeOrmModule.forFeature([VariantEntity]), HttpModule],
    controllers: [VariantsController],
    providers: [VariantsService, VariantsProvider, ResponsesService, DateHelper, CseriesService, RSeriesService, AxiosWrapperService],
    exports: [AxiosWrapperService]
})
export class VariantsModule { }
