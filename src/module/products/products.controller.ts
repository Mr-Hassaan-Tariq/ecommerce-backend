import {
    Controller, Get, Post,
    Body,
    Patch,
    Param,
    Delete,
    Res,
    Query,
    UploadedFile,
    UseInterceptors,
    Req,
    HttpStatus,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Response, query, Request } from 'express';
import { ResponsesService } from '../responses/responses.service';
import { GetProductsDto } from './dto/get.product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Http } from 'winston/lib/winston/transports';
import { ProductDto } from './dto/product.dto';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly responseService: ResponsesService,
    ) { }

    @Post('delete')
    async deleteProductFromWebHook(@Body() body: any, @Req() request: Request, @Res() res: Response) {
        if (request.headers['x-product-id']) {
            const result = await this.productsService.productDeleteHook(
                request.headers['x-product-id'],
            );

            return res.status(result.status || 500).json(result);
        } else {
            const response = this.responseService.errorResponse(
                'Invalid webhook event is called.',
                HttpStatus.FORBIDDEN,
            );
            return res.status(response.status || 500).json(response);
        }
    }

    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('update')
    async updateProductFromWebHook(@Body() body: ProductDto, @Req() request: Request, @Res() res: Response) {
        if (body.product) {
            const result = await this.productsService.productUpdateHook(body.product);
            return res.status(result.status || 500).json(result);
        } else {
            const response = this.responseService.errorResponse('Invalid webhook event is called.', HttpStatus.FORBIDDEN);
            return res.status(response.status || 500).json(response);
        }

    }

    @Post('/integration/bulk')
    @UseInterceptors(FileInterceptor('file'))
    async aladdinGVToDispolabs(
        @Res() res: Response,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
    ) {
        const result = await this.productsService.aladdinGVToDisPolabsBulkInsertions(file, body.c_series_name);
        return res.status(200).json(this.responseService.apiResponse(result));
    }

}
