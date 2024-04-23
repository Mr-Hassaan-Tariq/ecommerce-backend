import {
  Controller,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProductsBrandService } from './productBrand.service';
import { ResponsesService } from '../responses/responses.service';

@Controller('product_brands')
export class ProductBrandsController {
  constructor(
    private readonly productBrandsService: ProductsBrandService,
    private readonly responseService:ResponsesService
  ) { }

  @Get('/')
  async getAllBrands(@Req() req: Request, @Res() res: Response) {
    console.log("============")
    const getbrands = await this.productBrandsService.getAllBrands()
    res.status(getbrands.status).json(this.responseService.apiResponse(getbrands))

  }
}
