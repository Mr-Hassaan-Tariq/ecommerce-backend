/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsBoolean, IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrUpdateCustomerDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone_number: string;

    @IsNumber()
    @IsNotEmpty()
    internal_id: number;

    @IsDate()
    @IsNotEmpty()
    created_at: Date;

    @IsDate()
    @IsNotEmpty()
    updated_at: Date;

    @IsBoolean()
    @IsNotEmpty()
    is_active: boolean;

}


export class CustomerDto extends PartialType(CreateOrUpdateCustomerDto) { }