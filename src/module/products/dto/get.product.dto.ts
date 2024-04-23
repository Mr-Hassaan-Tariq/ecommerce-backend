import { IsOptional, IsNumber, IsString, IsBoolean } from 'class-validator';

export class GetProductsDto {
    

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsBoolean()
  alphabetical?: boolean;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  pageNumber?: number;

  @IsOptional()
  @IsString()
  limit?: string;
}
