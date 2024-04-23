import { HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { CseriesService } from 'src/services/cseries.service';
import { CSERIES, responseMessages } from 'src/constants/constants';
import { DateHelper } from 'src/utilities/date.helper';
import { ProductBrandsProvider } from './productBrand.provider';
import { ResponsesService } from '../responses/responses.service';
import { getRequestHeaders } from 'src/utilities/common.utils';

@Injectable()
export class ProductsBrandService {
    constructor(
        private readonly productBrandsProvider: ProductBrandsProvider,
        private readonly cSeriesService: CseriesService,
        private readonly dateHelper: DateHelper,
        private readonly responseService: ResponsesService
    ) { }

    async addBrandWithProduct(payload: any) {
        return this.productBrandsProvider.addProductBrand(payload);
    }
    async getBrandWithProduct(filter: any) {
        return this.productBrandsProvider.getbrandFromFilter(filter);
    }

    async addProductInCSeries(cSeries: number, payload: any) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };

        const tagsUrl = await this.cSeriesService.generateApiUrl(cSeries, `tags/products`, null, undefined);
        let tagsConfig = {
            method: 'get',
            url: tagsUrl,
            headers: reqHeaders,
            data: payload,

        };

        try {
            const response = await axios.request(tagsConfig);
            return { tags: response.data.tagsProducts, status: true };
        } catch (error) {
            return { status: false };
        }
    }
    async getBrandsInCSeries(cSeries: number, brandId: number) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };

        const brandsUrl = await this.cSeriesService.generateApiUrl(cSeries, `brands/${brandId}`, null, undefined);

        let brandsConfig = {
            method: 'get',
            url: brandsUrl,
            headers: reqHeaders,

        };

        try {
            const response = await axios.request(brandsConfig);
            return { brand: response.data.brand, status: true };
        } catch (error) {
            console.log("error is ", error.response)
            return { status: false };
        }
    }

    async addBrandInCSeries(cSeries: number, payload: any) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };

        const BrandsUrl = await this.cSeriesService.generateApiUrl(cSeries, `brands`, null, undefined);
        let tagsConfig = {
            method: 'post',
            url: BrandsUrl,
            headers: reqHeaders,
            data: payload

        };

        try {
            const response = await axios.request(tagsConfig);
            return { brand: response.data.brand, status: true };
        } catch (error) {
            console.log("error is ", error.response.data)
            return { status: false };
        }
    }
    async handleBrandsForOtherCSeries(product: any) {

        const brandinDB = await this.productBrandsProvider.getbrandFromFilter({ internal_id: product.brand.resource.id })
        if (brandinDB.length == 0) {
            const brandDetail = await this.getBrandsInCSeries(CSERIES.AladdinGv, product.brand.resource.id)

            if (brandDetail.status) {
                let payload = {
                    "brand": {
                        "title": brandDetail.brand.title,
                        "content": brandDetail.brand.content || ''
                    }
                }
                const saveBrand = await this.addBrandInCSeries(CSERIES.dispolabs, payload);
                if (saveBrand.status) {
                    let payload = {
                        title: brandDetail.brand.title,
                        internal_id: product.brand.resource.id,
                        created_at: new Date(this.dateHelper.formatDate()),
                        updated_at: new Date(this.dateHelper.formatDate()),
                        brand_to: saveBrand.brand.id
                    }
                    const saveInDb = await this.productBrandsProvider.addProductBrand(payload);
                    return { id: saveBrand.brand.id, title: saveBrand.brand.title }
                } else {
                    return { status: false, id: 0 };
                }
            }
        } else {
            return { id: brandinDB[0].brand_to, title: brandinDB[0].title }
        }

    }
    async getAllBrands() {
        const data = []
        const requestHeaders = getRequestHeaders()
        const BrandsUrl = await this.cSeriesService.generateApiUrl(CSERIES.AladdinGv, `brands`, null, undefined, "limit", 250);

        let tagsConfig = {
            method: 'get',
            url: BrandsUrl,
            headers: requestHeaders,
        };
        const response = await axios.request(tagsConfig);
        const brandsData = response.data.brands
        for (let brand of brandsData) {
            const getProductBrand = await this.productBrandsProvider.getbrandFromFilter({ internal_id: brand.id })
            if (getProductBrand.length !== 0)
                continue;

            let payload = {
                "brand": {
                    title: brand.title,
                    content: brand.content || ''
                }
            }
            const saveBrand = await this.addBrandInCSeries(CSERIES.dispolabs, JSON.stringify(payload));

            if (saveBrand.status) {
                let payload = {
                    title: brand.title,
                    internal_id: brand.id,
                    created_at: new Date(this.dateHelper.formatDate()),
                    updated_at: new Date(this.dateHelper.formatDate()),
                    brand_to: saveBrand.brand.id
                }
                data.push(payload)
                // const saveInDb = await this.productBrandsProvider.addProductBrand(payload);
                // console.log(saveInDb)
            }
        }
        await this.productBrandsProvider.bulkInsertIntoDatabase(data)
        return this.responseService.successResponse(response.data, responseMessages.OK, HttpStatus.OK)
    }
}
