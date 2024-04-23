import { ArrayMaxSize, IsArray, IsNotEmpty, IsNotEmptyObject, ValidateNested } from "class-validator";
import { addCategoryDataType } from "./addCategory.dto";
import { Type } from "class-transformer";

export class addCategoryArrayDataType{
    
    @IsArray()
    @ValidateNested({each:true})
    @ArrayMaxSize(1,{ message: 'Array must contain at least one item' })
    @Type(()=>addCategoryDataType)
    categories:addCategoryDataType[]
}