import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type, Transform, Exclude } from 'class-transformer';

export class Product {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    title: string;
    
    @Exclude()
    otherProperties?: any;
}

export class ProductDto {
    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => Product)
    product: Product;
}
