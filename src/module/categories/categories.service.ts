import { HttpStatus, Injectable } from '@nestjs/common';
import { CategoryProvider } from './categories.providor';
import { addCategoryDataType } from './dto/addCategory.dto';
import { ResponsesService } from '../responses/responses.service';
import { DateHelper } from 'src/utilities/date.helper';
import { CseriesService } from 'src/services/cseries.service';
import axios from 'axios';
import { CSERIES } from 'src/constants/constants';

@Injectable()
export class CategoryService {
    constructor(
        private readonly categoryProvider: CategoryProvider,
        private readonly responseService: ResponsesService,
        private readonly dateHelper: DateHelper,
        private readonly cSeriesService: CseriesService,
    ) { }


    async getCategoryInCSeries(cSeries: number, categoryId: number) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };

        const categoryUrl = await this.cSeriesService.generateApiUrl(
            cSeries,
            `categories/${categoryId}`,
            null,
            undefined,
        );

        let categoryConfig = {
            method: 'get',
            url: categoryUrl,
            headers: reqHeaders,
        };

        try {
            const response = await axios.request(categoryConfig);
            return { ...response.data, status: true };
        } catch (error) {
            console.log('error is ', error.response.data);
            return { status: false };
        }
    }

    async getCategoryFromCSeriesWithProductId(
        cSeries: number,
        productId: number,
    ) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };

        const categoryUrl = await this.cSeriesService.generateApiUrl(
            cSeries,
            `categories/products`,
            null,
            undefined,
            'product',
            productId,
        );

        let categoryConfig = {
            method: 'get',
            url: categoryUrl,
            headers: reqHeaders,
        };


        try {
            const response = await axios.request(categoryConfig);
            return { category: response.data, status: true };
        } catch (error) {
            console.log('error is ', error);
            return { status: false };
        }
    }

    async addCategoryInCSeries(cSeries: number, payload: any) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };

        const categoryUrl = await this.cSeriesService.generateApiUrl(
            cSeries,
            `categories`,
            null,
            undefined,
        );
        let categoryConfig = {
            method: 'post',
            url: categoryUrl,
            headers: reqHeaders,
            data: payload,
        };

        try {
            const response = await axios.request(categoryConfig);
            return { category: response.data.category, status: true };
        } catch (error) {
            console.log('error is ', error.response.data);
            return { status: false };
        }
    }
    async linkCategoryWithProductInCSeries(cSeries: number, payload: any) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        }

        const categortUrl = await this.cSeriesService.generateApiUrl(
            cSeries,
            `categories/products`,
            null,
            undefined,
        );
        let categoryConfig = {
            method: 'post',
            url: categortUrl,
            headers: reqHeaders,
            data: payload,
        };

        try {
            const response = await axios.request(categoryConfig);
            return { category: response.data, status: true };
        } catch (error) {
            console.log('error is in category line', error.response.data);
            return { status: false };
        }
    }



    async isKeyValueInArray(array: any, key: string, value: any) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].category.resource[key] == value)
                return true;
        }
        return false;
    }

    async storeCategoryInOtherCSeries(productId: number, productToId: number) {
        const getCategoryForAladdin =
            await this.getCategoryFromCSeriesWithProductId(
                CSERIES.AladdinGv,
                productId,
            );
        if (getCategoryForAladdin.status) {
            for (const category of getCategoryForAladdin.category
                .categoriesProducts) {
                const getCategoryFromDb =
                    await this.categoryProvider.getCategoryFromFilter({
                        internal_id: category.category.resource.id,
                    });

                if (getCategoryFromDb.length == 0) {
                    const categoryDetail = await this.getCategoryInCSeries(
                        CSERIES.AladdinGv,
                        category.category.resource.id,
                    );
                    if (categoryDetail.status) {
                        const categoryPayload = {
                            category: {
                                type: categoryDetail.category.type,
                                title: categoryDetail.category.title,
                                fulltitle: categoryDetail.category.fulltitle,
                                description: categoryDetail.category.description,
                                content: categoryDetail.category.content,
                            },
                        };
                        const addCategoryResponse = await this.addCategoryInCSeries(
                            CSERIES.dispolabs,
                            categoryPayload,
                        );

                        if (addCategoryResponse.status) {
                            let categorylink = {
                                categoriesProduct: {
                                    sortOrder: 1,
                                    category: addCategoryResponse.category.id,
                                    product: productToId,
                                },
                            };

                            this.linkCategoryWithProductInCSeries(
                                CSERIES.dispolabs,
                                categorylink,
                            );
                            const tagForDb = {
                                title: addCategoryResponse.category.title,
                                internal_id: category.category.resource.id,
                                created_at: new Date(this.dateHelper.formatDate()),
                                updated_at: new Date(this.dateHelper.formatDate()),
                                category_to: addCategoryResponse.category.id,
                            };
                            this.categoryProvider.addCategory(tagForDb);
                        }
                    }
                } else {
                    // for (const category of getCategoryFromDb) {
                    let categorylink = {
                        categoriesProduct: {
                            sortOrder: 1,
                            category: getCategoryFromDb[0].category_to,
                            product: productToId,
                        },
                    };

                    this.linkCategoryWithProductInCSeries(
                        CSERIES.dispolabs,
                        categorylink,
                    );
                    // }
                }
            }
        }
    }
    async updateCategoryInOtherCSeries(productId: number, productToId: number) {
        const getCategoryForAladdin =
            await this.getCategoryFromCSeriesWithProductId(
                CSERIES.AladdinGv,
                productId,
            );

        if (getCategoryForAladdin.status) {
            const getCategoryForDispolab = await this.getCategoryFromCSeriesWithProductId(
                CSERIES.dispolabs,
                productToId,
            );

            for (const category of getCategoryForAladdin.category
                .categoriesProducts) {
                const getCategoryFromDb = await this.categoryProvider.getCategoryFromFilter({
                    internal_id: category.category.resource.id,
                });

                if (getCategoryFromDb.length == 0) {
                    const categoryDetail = await this.getCategoryInCSeries(
                        CSERIES.AladdinGv,
                        category.category.resource.id,
                    );
                    if (categoryDetail.status) {
                        const categoryPayload = {
                            category: {
                                type: categoryDetail.category.type,
                                title: categoryDetail.category.title,
                                fulltitle: categoryDetail.category.fulltitle,
                                description: categoryDetail.category.description,
                                content: categoryDetail.category.content,
                            },
                        };
                        const addCategoryResponse = await this.addCategoryInCSeries(
                            CSERIES.dispolabs,
                            categoryPayload,
                        );

                        if (addCategoryResponse.status) {
                            let categorylink = {
                                categoriesProduct: {
                                    sortOrder: 1,
                                    category: addCategoryResponse.category.id,
                                    product: productToId,
                                },
                            };

                            this.linkCategoryWithProductInCSeries(
                                CSERIES.dispolabs,
                                categorylink,
                            );
                            const tagForDb = {
                                title: addCategoryResponse.category.title,
                                internal_id: category.category.resource.id,
                                created_at: new Date(this.dateHelper.formatDate()),
                                updated_at: new Date(this.dateHelper.formatDate()),
                                category_to: addCategoryResponse.category.id,
                            };
                            this.categoryProvider.addCategory(tagForDb);
                        }
                    }
                } else {
                    for (const categoryFromDb of getCategoryFromDb) {
                        const flag = this.isKeyValueInArray(getCategoryForDispolab.category.categoriesProducts, 'id', categoryFromDb.category_to)
                        // if(this.isKeyValueInArray())
                        if (!flag) {
                            let categorylink = {
                                categoriesProduct: {
                                    sortOrder: 1,
                                    category: categoryFromDb.category_to,
                                    product: productToId,
                                },
                            };
                            this.linkCategoryWithProductInCSeries(
                                CSERIES.dispolabs,
                                categorylink,
                            );
                        }
                    }
                }
            }
        }
    }
}
