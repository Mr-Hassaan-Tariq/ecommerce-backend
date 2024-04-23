import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator"

export class addCategoryDataType{
    
    @IsString()
    @IsNotEmpty()
    @Length(3,20)
    category_name:string;

    @IsString()
    @IsNotEmpty()
    @Length(5,255)
    description:string;

    @IsNumber()
    @IsNotEmpty()
    parent_category_id:number;


    
    @IsDate()
    @IsOptional()
    created_at: Date;

    @IsOptional()
    @IsDate()
    updated_at: Date;


}