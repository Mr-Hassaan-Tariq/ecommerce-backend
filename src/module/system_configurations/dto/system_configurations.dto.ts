/* eslint-disable prettier/prettier */
import { PartialType } from "@nestjs/mapped-types";
import { IsDate, IsString } from "class-validator";
import { SystemConfiguration } from "../entities/system_configurations.entity";

export class CreateSystemConf {
    @IsString()
    name: string;
    @IsString()
    value: string;
    @IsString()
    description: string;
}

export class SystemConfDto extends PartialType(SystemConfiguration) { }