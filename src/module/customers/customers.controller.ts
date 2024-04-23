import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Response, query } from 'express';
import { ResponsesService } from '../responses/responses.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('customers')
export class CustomersController {
    constructor(
        private readonly customersService: CustomersService, private readonly responseService: ResponsesService
    ) { }

    @Post('bulk_upload')
    @UseInterceptors(FileInterceptor('file'))
    async bulkUsersUpload(@Res() res: Response, @UploadedFile() file: Express.Multer.File) {
        const result = await this.customersService.bulkUploadsCustomers(file)
        return res.status(200).json({ message: "file uploaded" })
    }

}
