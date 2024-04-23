import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { ResponsesService } from '../responses/responses.service';
import { Request, Response, json } from 'express';

@Controller('variants')
export class VariantsController {
    constructor(
        private readonly variantsService: VariantsService,
        private readonly responseService: ResponsesService
    ) { }

}
