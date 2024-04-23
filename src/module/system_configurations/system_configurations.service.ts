import { ResponsesService } from './../responses/responses.service';
import { CreateSystemConf, SystemConfDto } from './dto/system_configurations.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { SystemConfiguration } from './entities/system_configurations.entity';
import { SystemConfigurationProvider } from './system_configurations.provider';
import { DateHelper } from 'src/utilities/date.helper';

@Injectable()
export class SystemConfigurationsService {
    constructor(
        private readonly systemConfigurationProvider: SystemConfigurationProvider,
        private readonly dateHelper: DateHelper,
        private readonly responseService: ResponsesService) { }


    async getSystemConf(name: string) {
        const result = await this.systemConfigurationProvider.findSystemConfiguration(name)
        return this.responseService.successResponse(result, "System Configurations found", HttpStatus.OK)

    }

    async updateSystemConf(id: number, updateSystemConf: Partial<SystemConfiguration>) {
        updateSystemConf.updated_at = new Date(this.dateHelper.formatDate(new Date))
        const result = await this.systemConfigurationProvider.updateSystemConfigurations(id, updateSystemConf)
        if (!result.affected) {
            return this.responseService.errorResponse("System configurations not updated", HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return this.responseService.successResponse(null, "System configuration updated", HttpStatus.OK)
    }

}
