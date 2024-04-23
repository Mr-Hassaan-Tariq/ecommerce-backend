import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  visibility: string;

  @IsString()
  data01: string;

  @IsString()
  data02: string;

  @IsString()
  data03: string;

  @IsString()
  title: string;

  @IsString()
  fulltitle: string;

  @IsString()
  description: string;

  @IsString()
  content: string;

  @IsNumber()
  deliverydate: number;

  @IsNumber()
  supplier: number;

  @IsNumber()
  brand: number;
}
