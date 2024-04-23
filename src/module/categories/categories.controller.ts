import { Body, Controller, Get, Param, Post, Response, UseGuards } from '@nestjs/common';
import { CategoryService } from './categories.service';

import * as express from 'express';
import { addCategoryDataType } from './dto/addCategory.dto';
import { addCategoryArrayDataType } from './dto/addCategoryArray.dto';
import { AuthGuard } from '../auth/auth.guard';
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) { }
}
