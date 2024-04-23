import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SystemConfiguration } from "./entities/system_configurations.entity";
import { Repository } from "typeorm";
import { CreateSystemConf, SystemConfDto } from "./dto/system_configurations.dto";

@Injectable()
export class SystemConfigurationProvider {

    constructor(
        @InjectRepository(SystemConfiguration)
        private readonly systemConfRepo: Repository<SystemConfiguration>) { }

    async create(createSystemConf: SystemConfDto) {
        return await this.systemConfRepo.save(createSystemConf)
    }

    async findSystemConfiguration(name: string) {
        let query = this.systemConfRepo.createQueryBuilder('sc')
        if (name) {
            query = query.where('sc.name ILIKE :name', { name: `%${name}%` });
        }
        query.orderBy('sc.id', "ASC")
        const systemConfigurations = await query.getRawMany();
        return systemConfigurations
    }

    async updateSystemConfigurations (id: number, updateSystemConf: SystemConfDto) {
        const result = await this.systemConfRepo.update(id, updateSystemConf)
        return result
    }
}