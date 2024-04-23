/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SystemConfigurationsService } from './system_configurations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemConfiguration } from './entities/system_configurations.entity';
import { ResponsesService } from '../responses/responses.service';
import { SystemConfigurationProvider } from './system_configurations.provider';
import { DateHelper } from 'src/utilities/date.helper';

@Module({
  imports: [TypeOrmModule.forFeature([SystemConfiguration])],
  controllers: [],
  providers: [SystemConfigurationsService, DateHelper, ResponsesService, SystemConfigurationProvider]
})
export class SystemConfigurationsModule { }
