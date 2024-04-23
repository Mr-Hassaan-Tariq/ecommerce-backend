import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { VariantsProvider } from './variants.provider';
import { ResponsesService } from '../responses/responses.service';
import { CSERIES, responseMessages } from 'src/constants/constants';
import { CseriesService } from 'src/services/cseries.service';
import axios from 'axios';
import { RSeriesService } from 'src/services/rseries.service';
import { DateHelper } from 'src/utilities/date.helper';

@Injectable()
export class VariantsService {
    constructor(
        private readonly variantsProvider: VariantsProvider,
        private readonly responseService: ResponsesService,
        private readonly cSeriesService: CseriesService,
        private readonly rSeriesService: RSeriesService,
        private readonly dateHelper: DateHelper,
    ) { }
    async create(createVariantDto: CreateVariantDto) {
        const result = await this.variantsProvider.createVariants(createVariantDto);
        return this.responseService.successResponse(
            null,
            responseMessages.OK,
            HttpStatus.OK,
        );
    }

    async findOne(id: number) {
        const result = await this.variantsProvider.getVariantById(id);
        return this.responseService.successResponse(
            result,
            responseMessages.OK,
            HttpStatus.OK,
        );
    }

    async isKeyValueInArray(array: any, value: string) {
        for (let i = 0; i < array.length; i++) {
            // const splitedData = value.split('.');
            if (array[i].title == value) return { status: true, index: i };
        }

        return { status: false };
    }

    async updateVariantInCSeries(
        cSeries: number,
        variantId: any,
        payload: any,
    ) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };
        const url = await this.cSeriesService.generateApiUrl(
            cSeries,
            `variants/${variantId}`,
            null,
            undefined,
            undefined,
        );
        let config = {
            method: 'put',
            url: url,
            headers: reqHeaders,
            data: payload,
        };
        try {
            const response = await axios.request(config);
            return { ...response.data, status: true };
        } catch (error) {
            console.log('error is ', error.response);
            return { status: false };
        }
    }

    async deleteVariantFromCSeries(cSeries: number, variantId: number) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };

        const url = await this.cSeriesService.generateApiUrl(
            cSeries,
            `variants/${variantId}`,
            null,
            undefined,
            undefined,
        );
        let config = {
            method: 'delete',
            url: url,
            headers: reqHeaders,
        };

        try {
            const response = await axios.request(config);
            return { data: response.data, status: true };
        } catch (error) {
            console.log('error is ', error.response.data);
            return { status: true };
        }
    }

    async updateVariantsInOtherCSeries(product: any, productTo: any) {
        const variantResponse = await this.getVariantsFromCSeries(
            CSERIES.AladdinGv,
            product.id,
        );

        // console.log("variantResponse is ",variantResponse)

        if (variantResponse.status == true) {
            const variantResponseFrom2ndCSeries = await this.getVariantsFromCSeries(
                CSERIES.dispolabs,
                productTo.id,
            );

            if (variantResponseFrom2ndCSeries.status) {
                //firstly we add new variants
                let payload = {};

                for (const variant of variantResponse.variants) {

                    const variantinDb = await this.variantsProvider.getVariantsbyFilter({ variant_internal_id: variant.id })
                    const variantPayload = {
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
                        weightValue: variant.weightValue,
                        weightUnit: variant.weightUnit,
                        volume: variant.volume,
                        unitPrice: variant.unitPrice,
                        unitUnit: variant.unitUnit,
                        colli: variant.colli,
                        sizeX: variant.sizeX,
                        sizeY: variant.sizeY,
                        sizeZ: variant.sizeZ,
                        title: variant.title,
                        tax: variant.tax,
                        product: productTo.id,
                    };
                    // const flag = await this.isKeyValueInArray(
                    //   variantResponseFrom2ndCSeries.variants,
                    //   variant.title,
                    // );


                    if (variantinDb.length == 0) {
                        let response: any = await this.addVariantInCSeries(
                            CSERIES.dispolabs,
                            productTo.id,
                            variantPayload,
                        );


                        if (response.status) {
                            const item = await this.getItemsFromRSeries(
                                variant.title,
                                product.title,
                            );
                            if (item.status) {
                                response = response.variant;

                                payload = {
                                    title: variant.title,
                                    price: variant.priceExcl,
                                    stock_quantity: variant.stockLevel,
                                    variant_internal_id: variant.id,
                                    internal_variant_id_to: response.id,
                                    r_series_system_id: Array.isArray(item.item)
                                        ? item.item[0]?.itemID
                                        : item.item.itemID,
                                    is_active: true,
                                    created_at: new Date(this.dateHelper.formatDate()),
                                    updated_at: new Date(this.dateHelper.formatDate()),
                                    internal_id: productTo.id,
                                };
                                const variantSave = await this.variantsProvider.createVariants(payload);
                            }
                        }
                    } else {
                        payload = {
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
                                weightValue: variant.weightValue,
                                weightUnit: variant.weightUnit,
                                volume: variant.volume,
                                unitPrice: variant.unitPrice,
                                unitUnit: variant.unitUnit,
                                colli: variant.colli,
                                sizeX: variant.sizeX,
                                sizeY: variant.sizeY,
                                sizeZ: variant.sizeZ,
                                title: variant.title,
                                tax: variant.tax,
                                product: productTo.id,
                            },
                        };
                        const updateResponse = await this.updateVariantInCSeries(
                            CSERIES.dispolabs,
                            variantinDb[0].internal_variant_id_to,
                            payload,
                        );
                        payload = {
                            title: variant.title,
                            price: variant.priceExcl,
                            stock_quantity: variant.stockLevel,
                            updated_at: new Date(this.dateHelper.formatDate()),
                        };

                        this.variantsProvider.updateVariants(
                            variantinDb[0].id,
                            payload,
                        );
                    }
                }
                //now delete old variants
                for (const variant of variantResponseFrom2ndCSeries.variants) {
                    payload = {
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
                            product: productTo.id,
                        },
                    };
                    if (
                        !(
                            await this.isKeyValueInArray(
                                variantResponse.variants,
                                variant.title,
                            )
                        ).status
                    ) {
                        this.deleteVariantFromCSeries(CSERIES.dispolabs, variant.id);

                        this.variantsProvider.deleteVariant(variant.id);
                    } else {
                    }
                }
            }
        }
    }
    async updateVariantToCseries(
        cSeriesid: number,
        variantId: number,
        variantPayload: any,
    ) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };

        const url = await this.cSeriesService.generateApiUrl(
            cSeriesid,
            `variants/${variantId}`,
            null,
            undefined,
            undefined,
        );
        let config = {
            method: 'put',
            url: url,
            headers: reqHeaders,
            data: variantPayload,
        };

        try {
            const response = await axios.request(config);

            return { data: response.data, status: true };
        } catch (error) {
            return { status: false };
        }
    }
    async getItemsFromRSeries(variantTitle: string, productTitle: string) {
        try {
            const response: any = await this.rSeriesService.executeApi(
                `Item`,
                'get',
                undefined,
                undefined,
                undefined,
                `?description=${productTitle}${variantTitle != 'Default'
                    ? (await this.convertStringToJson(variantTitle)).value
                    : ''
                }&sort=-itemID`,
            );
            const title = `?description=${productTitle}${variantTitle != 'Default'
                ? (await this.convertStringToJson(variantTitle)).value
                : ''
                }`;
            if (response.Item) {
                return { status: true, item: response?.Item };
            } else {
                return { status: false };
            }
        } catch (error) {
            console.log('error is ', error);
            return { status: false };
        }
    }

    async getVariantsFromCSeries(cSeriesId: number, productId: number) {
        try {
            const reqHeaders = {
                'Content-Type': 'application/json',
                Accept: '*/*',
            };
            const getProductVariantUrl = await this.cSeriesService.generateApiUrl(
                cSeriesId,
                'variants',
                null,
                undefined,
                'product',
                productId,
            );
            const getProductVariantApiResponse = await axios.get(
                getProductVariantUrl,
                {
                    headers: reqHeaders,
                },
            );
            return {
                status: true,
                variants: getProductVariantApiResponse.data.variants,
            };
        } catch (error) {
            return { status: false, ...error.response };
        }
    }

    async addVariantInCSeries(cSeries: number, productId: number, payload: any) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };

        let variantPayload = {
            variant: payload,
        };

        try {
            const url = await this.cSeriesService.generateApiUrl(
                cSeries,
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
            const response = await axios.request(config);

            return { ...response.data, status: true };
        } catch (error) {
            return { status: false, ...error.response.data };
        }
    }

    async convertStringToJson(stringData: string) {
        var pairs = stringData.split(',');

        let valueSeperater = '';
        // Create an object from the key-value pairs
        var data = {};
        pairs.forEach(function (pair) {
            var keyValue = pair.split(':');
            var key = keyValue[0].trim().replace(/"/g, ''); // Remove double quotes from the key
            var value = keyValue[1].trim().replace(/"/g, ''); // Remove double quotes from the value
            valueSeperater += ' ' + keyValue[1].trim().replace(/"/g, '');
            data[key] = value;
        });

        // Convert the object to a JSON string
        // var jsonString = JSON.parse(data);

        return { value: valueSeperater, obj: { ...data } };
    }
    async addVariantToCSeries(cSeriesId: number, product: any, productTo: any) {
        const variantResponse = await this.getVariantsFromCSeries(
            cSeriesId,
            product.id,
        );

        const variantResponseFromDispoLab = await this.getVariantsFromCSeries(
            CSERIES.dispolabs,
            productTo.id,
        );
        if (variantResponse.status == true) {
            const idToDeleteVariant = variantResponseFromDispoLab.variants[0].id;
            let payload: any = {};
            let variantPayload = {};
            for (let i = 0; i < variantResponse.variants.length; i++) {
                variantPayload = {
                    isDefault: variantResponse.variants[i].isDefault,
                    sortOrder: variantResponse.variants[i].sortOrder,
                    articleCode: variantResponse.variants[i].articleCode,
                    ean: variantResponse.variants[i].ean,
                    sku: variantResponse.variants[i].sku,
                    hs: variantResponse.variants[i].hs,
                    priceExcl: variantResponse.variants[i].priceExcl,
                    priceIncl: variantResponse.variants[i].priceIncl,
                    priceCost: variantResponse.variants[i].priceCost,
                    oldPriceExcl: variantResponse.variants[i].oldPriceExcl,
                    oldPriceIncl: variantResponse.variants[i].oldPriceIncl,
                    stockTracking: variantResponse.variants[i].stockTracking,
                    stockLevel: variantResponse.variants[i].stockLevel,
                    stockAlert: variantResponse.variants[i].stockAlert,
                    stockMinimum: variantResponse.variants[i].stockMinimum,
                    stockSold: variantResponse.variants[i].stockSold,
                    stockBuyMinimum: variantResponse.variants[i].stockBuyMinimum,
                    stockBuyMaximum: variantResponse.variants[i].stockBuyMaximum,
                    weight: variantResponse.variants[i].weight,
                    weightValue: variantResponse.variants[i].weightValue,
                    weightUnit: variantResponse.variants[i].weightUnit,
                    volume: variantResponse.variants[i].volume,
                    unitPrice: variantResponse.variants[i].unitPrice,
                    unitUnit: variantResponse.variants[i].unitUnit,
                    colli: variantResponse.variants[i].colli,
                    sizeX: variantResponse.variants[i].sizeX,
                    sizeY: variantResponse.variants[i].sizeY,
                    sizeZ: variantResponse.variants[i].sizeZ,
                    title: variantResponse.variants[i].title,
                    tax: variantResponse.variants[i].tax,
                    product: productTo.id,
                };
                let response = await this.addVariantInCSeries(
                    CSERIES.dispolabs,
                    productTo.id,
                    variantPayload,
                );

                // const variantResponseFromDispoLab = await this.getVariantsFromCSeries(
                //   CSERIES.dispolabs,
                //   productTo.id,
                // );

                if (response.status) {
                    const item = await this.getItemsFromRSeries(
                        variantResponse.variants[i].title,
                        productTo.title,
                    );
                    if (item.status) {
                        response = response.variant;
                        payload = {
                            title: variantResponse.variants[i].title,
                            price: variantResponse.variants[i].priceExcl,
                            stock_quantity: variantResponse.variants[i].stockLevel,
                            variant_internal_id: variantResponse.variants[i].id,
                            r_series_system_id: Array.isArray(item.item)
                                ? item.item[0]?.itemID
                                : item.item.itemID,
                            is_active: true,
                            created_at: new Date(this.dateHelper.formatDate()),
                            updated_at: new Date(this.dateHelper.formatDate()),
                            internal_id: productTo.id,
                            internal_variant_id_to: response.id
                        };

                        const add = await this.variantsProvider.createVariants(payload);
                    }
                }
            }

            this.deleteVariantFromCSeries(CSERIES.dispolabs, idToDeleteVariant);
        }
    }
    update(id: number, updateVariantDto: UpdateVariantDto) {
        return `This action updates a #${id} variant`;
    }

    remove(id: number) {
        return `This action removes a #${id} variant`;
    }
}
