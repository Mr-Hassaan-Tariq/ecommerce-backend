import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { GetProductsDto } from './dto/get.product.dto';
import axios from 'axios';
import { CseriesService } from '../../services/cseries.service';
import { CSERIES } from 'src/constants/constants';

@Injectable()
export class ProductProvider {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        private readonly cSeriesService: CseriesService,
    ) { }


    async updateProduct(
        payload: any,
    ) {
        const product = await this.productRepository.save(payload);
        return product;
    }
    async getAllProducts(query: GetProductsDto) {
        const { price, search, sort, brand } = query;
        const products = this.productRepository.createQueryBuilder('p').select('p.*');
        if (price) products.where('p.price=:price', { price: price });
        if (search) {
            products.andWhere('p.title ILIKE :title', { title: `%${search}%` });
        }
        if (sort === 'asc') {
            products.orderBy('p.title', 'ASC');
        } else if (sort === 'desc') {
            products.orderBy('p.title', 'DESC');
        }
        const result = await products.getRawMany();
        return result;
    }
    async getProductDetails(id: number) {
        const checkProduct = await this.productRepository.findOne({
            where: { id },
        });
        return checkProduct;
    }

    async getProductFromFilter(filter: any) {
        const checkProduct = await this.productRepository.find({ where: { is_deleted: false, ...filter } });
        return checkProduct;
    }

    async getLastProduct() {
        const filter: any = {
            order: {
                id: 'DESC',
            },
            where: { is_deleted: false },
            take: 1,
        }
        const checkProduct = await this.productRepository.find(filter);
        return checkProduct;
    }

    async saveMetaDataInCseries(metaData: []) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };

        let metaFieldsPromise = [];

        for (const meta of metaData) {
            const payload = {
                productMetafield: {},
            };
        }
    }

    async convertImageToBase64(url) {
        try {
            // Fetch the image data from the server
            const response = await axios.get(url, { responseType: 'arraybuffer' });

            // Convert the buffer to base64
            const base64Data = Buffer.from(response.data).toString('base64');

            return base64Data;

            // const response = await axios.get(url, { responseType: 'arraybuffer' });
            // const base64Data = Buffer.from(response.data).toString('base64');
            // return base64Data;
        } catch (error) {
            console.error('Error fetching image:', error.message);
            throw error;
        }
    }

    async saveProductImageInCseries(
        cSeries: number,
        images: any,
        productId: number,
    ) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };
        let imagesPromise = [];
        const url = await this.cSeriesService.generateApiUrl(
            cSeries,
            `products/${productId}/images`,
            null,
            undefined,
            undefined,
        );


        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            imagesPromise.push(
                new Promise(async (resolve, reject) => {
                    try {
                        const payload = {
                            productImage: {
                                attachment: await this.convertImageToBase64(image.src),
                                filename: `${image.title}.${image.extension}`,
                            },
                        };
                        const config = {
                            method: 'post',
                            url: url,
                            headers: reqHeaders,
                            data: payload,
                        };
                        const response = await axios.request(config);
                        resolve(response.data);
                    } catch (error) {
                        console.log('reject is ', error.response.data);
                        reject(error.response.data);
                    }
                }),
            );
        }

        const promiseResponse = await Promise.allSettled(imagesPromise);
        return promiseResponse;
    }

    async isKeyValueInArray(array: any, value: string) {
        for (let i = 0; i < array.length; i++) {
            // const splitedData = value.split('.');
            if (array[i].title == value)
                return true;
        }

        return false;
    }

    async updateProductImageInCseries(
        cSeries: number,
        images: any,
        productId: number,
    ) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };
        let imagesPromise = [];

        const imagesFromDispolab = await this.getProductImagesFromCSeries(
            cSeries,
            productId,
        );


        try {
            let url = '';

            let flag = false;
            for (const image of images) {
                flag = await this.isKeyValueInArray(imagesFromDispolab, image.title);
                imagesPromise.push(
                    new Promise(async (resolve, reject) => {
                        try {
                            if (flag == false) {
                                url = await this.cSeriesService.generateApiUrl(
                                    cSeries,
                                    `products/${productId}/images`,
                                    null,
                                    undefined,
                                    undefined,
                                );
                                const payload = {
                                    productImage: {
                                        attachment: await this.convertImageToBase64(image.src),
                                        filename: `${image.title}.${image.extension}`,
                                    },
                                };
                                const config = {
                                    method: 'post',
                                    url: url,
                                    headers: reqHeaders,
                                    data: payload,
                                };
                                const response = await axios.request(config);
                                resolve(response.data);
                            }
                        } catch (error) {
                            reject(error.response.data);
                        }
                    }),
                );
            }

            for (const image of imagesFromDispolab) {
                flag = await this.isKeyValueInArray(images, image.title);
                imagesPromise.push(
                    new Promise(async (resolve, reject) => {
                        try {
                            if (flag == false) {
                                url = await this.cSeriesService.generateApiUrl(
                                    cSeries,
                                    `products/${productId}/images/${image.id}`,
                                    null,
                                    undefined,
                                    undefined,
                                );
                                const payload = {
                                    productImage: {
                                        attachment: await this.convertImageToBase64(image.src),
                                        filename: `${image.title}.${image.extension}`,
                                    },
                                };
                                const config = {
                                    method: 'DELETE',
                                    url: url,
                                    headers: reqHeaders,
                                    data: payload,
                                };
                                const response = await axios.request(config);
                                resolve(response.data);
                            }
                        } catch (error) {
                            reject(error.response.data);
                        }
                    }),
                );
            }

            const promiseResponse: any = await Promise.allSettled(imagesPromise);

            return promiseResponse;
        } catch (error) {
            console.log('errror is ', error);
        }
    }

    async getProductImagesFromCSeries(cSeries: number, productId: number) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };

        const imagesUrl = await this.cSeriesService.generateApiUrl(
            cSeries,
            `products/${productId}/images`,
            null,
            undefined,
            undefined,
        );

        let imagesConfig = {
            method: 'get',
            url: imagesUrl,
            headers: reqHeaders,
        };

        try {
            const data = await axios.request(imagesConfig);

            return data.data.productImages;
        } catch (error) {
            console.log('error is ', error.response);
            return error.response;
        }
    }

    async deleteProductImageFromCSeries(
        cSeries: number,
        productId: number,
        imageId: number,
    ) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };

        const imagesUrl = await this.cSeriesService.generateApiUrl(
            cSeries,
            `products/${productId}/images/${imageId}`,
            null,
            undefined,
            undefined,
        );

        let imagesConfig = {
            method: 'delete',
            url: imagesUrl,
            headers: reqHeaders,
        };
        const data = await axios.request(imagesConfig);

        return data;
    }

    async addImageToCSeries(
        cSeries: number,
        productId: number,
        imageUrl: string,
        imageTitle: string,
    ) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };
        const url = await this.cSeriesService.generateApiUrl(
            cSeries,
            `products/${productId}/images`,
            null,
            undefined,
            undefined,
        );

        try {
            const payload = {
                productImage: {
                    attachment: await this.convertImageToBase64(imageUrl),
                    filename: imageTitle,
                },
            };
            const config = {
                method: 'post',
                url: url,
                headers: reqHeaders,
                data: payload,
            };
            const response = await axios.request(config);

            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    async savetagsInCseries(cSeries: number, tags: any, productTo: number) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };
        let metaFieldsPromise = [];

        for (const tag of tags) {
            metaFieldsPromise.push(async function (resolve, reject) {
                const payload = {
                    tagsProduct: {
                        tag: tag.id,
                        product: productTo,
                    },
                };
                const url = await this.cSeriesService.generateApiUrl(
                    cSeries,
                    `tags/products`,
                    null,
                    undefined,
                    undefined,
                );

                let config = {
                    method: 'post',
                    url: url,
                    headers: reqHeaders,
                    data: payload,
                };
                axios.request(config);
            });
        }

        const promiseResponse = await Promise.allSettled(metaFieldsPromise);
        return promiseResponse;
    }

    async getNewProducts() {
        const newProducts = await this.productRepository
            .createQueryBuilder('p')
            .select('p.*')
            .orderBy('p.id', 'DESC')
            .limit(10)
            .getRawMany();
        return newProducts;
    }

    async saveVariantFromProduct(productId: number, productTo: number) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };

        const variantResponse = await this.getProductVariantFromCseries(productId);

        // save variant in second c series
        let variantPromise = [];

        for (const variant of variantResponse.data.variants) {
            variantPromise.push(async function (resolve, reject) {
                let variantPayload = {
                    variant: {
                        isDefault: variant.isDefault,
                        sortOrder: variant.sortOrder,
                        articleCode: variant.articleCode,
                        ean: variant.ean,
                        sku: variant.sku,
                        hs: variant.hs,
                        priceExcl: variant.priceExcl,
                        priceIncl: variant.priceIncl,
                        priceCost: variant.priceCost,
                        oldPriceExcl: variant.oldPriceExcl,
                        oldPriceIncl: variant.oldPriceIncl,
                        stockTracking: variant.stockTracking,
                        stockLevel: variant.stockLevel,
                        stockAlert: variant.stockAlert,
                        stockMinimum: variant.stockMinimum,
                        stockSold: variant.stockSold,
                        stockBuyMinimum: variant.stockBuyMinimum,
                        stockBuyMaximum: variant.stockBuyMaximum,
                        weight: variant.weight,
                        volume: variant.volume,
                        colli: variant.colli,
                        sizeX: variant.sizeX,
                        sizeY: variant.sizeY,
                        sizeZ: variant.sizeZ,
                        title: variant.title,
                        tax: variant.tax,
                        product: productTo,
                    },
                };

                const url = await this.cSeriesService.generateApiUrl(
                    2,
                    'variants',
                    null,
                    undefined,
                    undefined,
                );

                let config = {
                    method: 'post',
                    url: url,
                    headers: reqHeaders,
                    data: variantPayload,
                };
                axios.request(config);
            });
        }

        const promiseResponse = await Promise.allSettled(variantPromise);
        return promiseResponse;
    }
    async updateVariantFromProduct(productId: number, productTo: number) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };

        const variantResponse = await this.getProductVariantFromCseries(productId);

        // save variant in second c series
        let variantPromise = [];

        for (const variant of variantResponse.data.variants) {
            variantPromise.push(async function (resolve, reject) {

                let variantPayload = {
                    variant: {
                        isDefault: variant.isDefault,
                        sortOrder: variant.sortOrder,
                        articleCode: variant.articleCode,
                        ean: variant.ean,
                        sku: variant.sku,
                        hs: variant.hs,
                        priceExcl: variant.priceExcl,
                        priceIncl: variant.priceIncl,
                        priceCost: variant.priceCost,
                        oldPriceExcl: variant.oldPriceExcl,
                        oldPriceIncl: variant.oldPriceIncl,
                        stockTracking: variant.stockTracking,
                        stockLevel: variant.stockLevel,
                        stockAlert: variant.stockAlert,
                        stockMinimum: variant.stockMinimum,
                        stockSold: variant.stockSold,
                        stockBuyMinimum: variant.stockBuyMinimum,
                        stockBuyMaximum: variant.stockBuyMaximum,
                        weight: variant.weight,
                        volume: variant.volume,
                        colli: variant.colli,
                        sizeX: variant.sizeX,
                        sizeY: variant.sizeY,
                        sizeZ: variant.sizeZ,
                        title: variant.title,
                        tax: variant.tax,
                        product: productTo,
                    },
                };

                // this.variantsService.updateVariantToCseries(CSERIES.dispolabs,variant.id,variantPayload)

            });
        }

        const promiseResponse = await Promise.allSettled(variantPromise);

        return promiseResponse;
    }

    async getProductVariantFromCseries(productId) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };
        const getProductVariantUrl = await this.cSeriesService.generateApiUrl(
            1,
            'variants',
            null,
            undefined,
            'product',
            parseInt(productId),
        );
        const getProductVariantApiResponse = await axios.get(getProductVariantUrl, {
            headers: reqHeaders,
        });

        return getProductVariantApiResponse;
    }
    async addProduct(data) {
        console.log("data to save is ")
        const add = await this.productRepository.save(data);
        return add;
    }
    async bulkInsertIntoDatabase(dataArray: any[]): Promise<void> {
        await this.productRepository
            .createQueryBuilder()
            .insert()
            .into(ProductEntity)
            .values(dataArray)
            .execute();
    }

}
