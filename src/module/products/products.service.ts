import { Injectable, HttpStatus } from '@nestjs/common';
import { ProductProvider } from './products.provider';
import { ResponsesService } from '../responses/responses.service';
import { CseriesService } from '../../services/cseries.service';
import axios from 'axios';
import { getRequestHeaders, pagination, variantPayloadToaddInDispoLabs } from 'src/utilities/common.utils';
import { extname } from 'path';
import { FileStorage } from '../../utilities/filestorage.utils';
import { v4 as uuidv4 } from 'uuid';
import { DateHelper } from 'src/utilities/date.helper';
import { VariantsProvider } from '../variants/variants.provider';
import { CSERIES, C_SERIES_NAMES, PRODUCT_QUEUE_STATUS, PRODUCT_UPDATE_MESSAGE, responseMessages } from 'src/constants/constants';
import { VariantsService } from '../variants/variants.service';
import { CategoryService } from '../categories/categories.service';
import { ProductsBrandService } from '../productBrand/productBrand.service';
import { ProductUpdateProvider } from '../product-update/product-update.provider';
import { RSeriesService } from 'src/services/rseries.service';
import { ProductBrandsProvider } from '../productBrand/productBrand.provider';
import { CreateVariantDto } from '../variants/dto/create-variant.dto';
import { SystemConfigurationProvider } from '../system_configurations/system_configurations.provider';
import { ItemResponse, RSeriesItems } from 'src/interfaces/common.interface';
import { GoogleAuthApi } from 'src/utilities/google.auth.utils';
const process = require('process');

@Injectable()
export class ProductsService {
    constructor(
        private readonly productProvider: ProductProvider,
        private readonly responseService: ResponsesService,
        private readonly cSeriesService: CseriesService,
        private readonly fileStorage: FileStorage,
        private readonly dateHelper: DateHelper,
        private readonly variantProvider: VariantsProvider,
        private readonly productUpdateProvider: ProductUpdateProvider,
        private readonly variantsService: VariantsService,
        private readonly categoryService: CategoryService,
        private readonly productsBrandService: ProductsBrandService,
        private readonly rSeriesService: RSeriesService,
        private readonly productBrandProvider: ProductBrandsProvider,
        private readonly configurations: SystemConfigurationProvider,
        private readonly googleAuth: GoogleAuthApi
    ) { }

    async getProductFromCSeries(cSeries: number, productId: number) {
        try {
            const reqHeaders = {
                'Content-Type': 'application/json',
                Accept: '*/*',
            };

            const productUrl = await this.cSeriesService.generateApiUrl(cSeries, `products/${productId}`, null, undefined, null, null);

            let productConfig = {
                method: 'get',
                url: productUrl,
                headers: reqHeaders,
            };

            const response = await axios.request(productConfig);
            return { status: true, ...response.data };
        } catch (error) {
            return { status: false };
        }
    }
    async getNewProducts() {
        const newProducts = await this.productProvider.getNewProducts();
        return this.responseService.successResponse(newProducts, 'New Products', HttpStatus.OK);
    }

    async getRecentProducts(cSeries: number) {
        try {
            const reqHeaders = {
                'Content-Type': 'application/json',
                Accept: '*/*',
            };

            const productUrl = await this.cSeriesService.generateApiUrl(cSeries, `products`, null, undefined, null, null);

            let productConfig = {
                method: 'get',
                url: productUrl,
                headers: reqHeaders,
            };

            const response = await axios.request(productConfig);
            return { status: true, ...response.data };
        } catch (error) {
            return false;
        }
    }
    async productUpdateHook(product: any) {
        const productInDb = await this.productProvider.getProductFromFilter({
            internal_id: product.id,
        });
        if (productInDb.length != 0) {
            const productUpdate = await this.productUpdateProvider.getProductUpdate({
                internal_id: product.id,
                status: PRODUCT_QUEUE_STATUS.NEW
            });

            if (productUpdate.length == 0) {
                if (productInDb[0].is_saved == true) {
                    const payload = {
                        internal_id: product.id,
                        title: product.title,
                        product_to: productInDb[0].product_to,
                        created_at: new Date(this.dateHelper.formatDate()),
                        updated_at: new Date(this.dateHelper.formatDate()),
                        status: PRODUCT_QUEUE_STATUS.NEW,
                        message: PRODUCT_UPDATE_MESSAGE.DEFAULT,
                        c_series_name: productInDb[0].c_series_name
                    };

                    const save = await this.productUpdateProvider.createProductUpdate(payload);

                    return this.responseService.successResponse([], 'Added in queue', HttpStatus.OK,);
                } else {
                    return this.responseService.successResponse([], 'Not in Dispolab', HttpStatus.NOT_FOUND,);
                }
            } else
                return this.responseService.successResponse([], 'Already in queue', HttpStatus.FOUND);

        } else
            return this.responseService.successResponse(null, 'Product is not found..', HttpStatus.NOT_FOUND);

    }
    async productDeleteHook(productId: any) {
        const productInDb = await this.productProvider.getProductFromFilter({
            internal_id: productId,
        });
        if (productInDb.length) {

            if (productInDb[0].is_saved == true) {
                const payload = {
                    ...productInDb[0],
                    is_deleted: true,
                    updated_at: new Date(this.dateHelper.formatDate()),
                };

                const save = await this.productProvider.updateProduct(payload);
                const url = await this.cSeriesService.generateApiUrl(CSERIES.dispolabs, '/products', productInDb[0].product_to)
                const reqHeaders = {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                };

                let config = {
                    method: 'delete',
                    url: url,
                    headers: reqHeaders,
                };

                const productApiResponse = await axios.request(config);

                return this.responseService.successResponse(
                    [],
                    'Product is deleted',
                    HttpStatus.OK,
                );
            } else {
                return this.responseService.successResponse(
                    [],
                    'Not in Dispolab',
                    HttpStatus.NOT_FOUND,
                );
            }
        } else {
            return this.responseService.successResponse(
                null,
                'Product is not found..',
                HttpStatus.NOT_FOUND,
            );
        }
    }
    async updateProductFromHook(product: any) {
        try {
            const getProductFromId = await this.productProvider.getProductFromFilter({
                internal_id: product.id,
            });
            if (getProductFromId.length != 0) {
                let productUpdatePayload: any = {
                    id: product.id,
                    updated_at: new Date(this.dateHelper.formatDate()),
                    status: PRODUCT_QUEUE_STATUS.IN_PROGRESS
                };

                const productDetail = await this.getProductFromCSeries(CSERIES.dispolabs, getProductFromId[0].product_to);
                // await this.productUpdateProvider.update(product.id, productUpdatePayload);
                const payload = {
                    product: {
                        visibility: productDetail.product.visibility,
                        data01: product.data01,
                        data02: product.data02,
                        data03: product.data03,
                        title: product.title,
                        fulltitle: product.fulltitle,
                        description: product.description,
                        content: product.content,
                        deliverydate: product.deliverydate,
                        supplier: product.supplier,
                        brand:
                            product.brand != false
                                ? (
                                    await this.productsBrandService.handleBrandsForOtherCSeries(
                                        product,
                                    )
                                ).id
                                : false,
                    },
                };

                // != false?(await this.productsBrandService.handleBrandsForOtherCSeries(product)).id:false
                const reqHeaders = {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                };
                // if (getProductFromId.length) {
                const url = await this.cSeriesService.generateApiUrl(CSERIES.dispolabs, `products/${getProductFromId[0].product_to}`, null, undefined, undefined);

                let config = {
                    method: 'put',
                    url: url,
                    headers: reqHeaders,
                    data: payload,
                };

                const productApiResponse = await axios.request(config);

                // update variant

                await this.variantsService.updateVariantsInOtherCSeries(product, productApiResponse.data.product);

                await this.categoryService.updateCategoryInOtherCSeries(product.id, productApiResponse.data.product.id);
                return this.responseService.successResponse(null, 'Product is updated.', HttpStatus.OK);
            } else {
                return this.responseService.successResponse(null, 'Product is not present in database/Irrelevant Product', HttpStatus.NOT_FOUND);
                // const added = await this.addProductFromHook(product);
                // return added
            }
        } catch (error) {
            return this.responseService.errorResponse(error.message, error.response?.statusText);
        }
    }

    async addProductFromHook(product: any) {
        try {
            const getProductFromId = await this.productProvider.getProductFromFilter({
                internal_id: product.id,
            });

            if (getProductFromId.length == 0) {
                // console.log("product product is ",await this.getProductFromCSeries(CSERIES.AladdinGv,product.id))
                const payload = {
                    product: {
                        visibility: product.visibility,
                        data01: product.data01,
                        data02: product.data02,
                        data03: product.data03,
                        title: product.title,
                        fulltitle: product.fulltitle,
                        description: product.description,
                        content: product.content,
                        deliverydate: product.deliverydate,
                        supplier: product.supplier,
                        brand:
                            product.brand != false
                                ? (
                                    await this.productsBrandService.handleBrandsForOtherCSeries(
                                        product,
                                    )
                                ).id
                                : false,
                    },
                };

                // != false?(await this.productsBrandService.handleBrandsForOtherCSeries(product)).id:false
                const reqHeaders = {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                };

                // save product in c-series 2
                const url = await this.cSeriesService.generateApiUrl(
                    CSERIES.dispolabs,
                    'products',
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
                const productApiResponse = await axios.request(config);

                const productpayload = {
                    title: product.title,
                    internal_id: product.id,
                    image: product.image ? product.image.src : false,
                    thumbnail: product.image ? product.image.src : false,
                    visibility: product.visibility == 'hidden' ? false : true,
                    created_at: new Date(this.dateHelper.formatDate()),
                    updated_at: new Date(this.dateHelper.formatDate()),
                    product_to: productApiResponse.data.product.id,
                    is_active: product.visibility == 'hidden' ? false : true,
                    price: 0,
                    quantity: 0,
                    is_saved: true,
                    c_series_name: C_SERIES_NAMES.DISPOLABS
                };

                const productSave = await this.productProvider.addProduct(productpayload);

                console.log("productSave is ", productSave)

                const saveVariant = await this.variantsService.addVariantToCSeries(
                    CSERIES.AladdinGv,
                    product,
                    productApiResponse.data.product,
                );

                await this.categoryService.storeCategoryInOtherCSeries(
                    product.id,
                    productApiResponse.data.product.id,
                );

                return this.responseService.successResponse(
                    null,
                    productApiResponse.statusText,
                    productApiResponse.status,
                );
            } else {
                return this.responseService.errorResponse(
                    'product already found.',
                    HttpStatus.FOUND,
                );
            }
        } catch (error) {
            console.log('error is ', error);
            return this.responseService.errorResponse(
                error.response?.statusText,
                error.response?.status,
            );
        }
    }

    async getTagsFromCSeries(cSeries: number, productId: number) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };

        const tagsUrl = await this.cSeriesService.generateApiUrl(cSeries, `/tags/products/${productId}`, null, undefined, 'id', productId);

        let tagsConfig = {
            method: 'get',
            url: tagsUrl,
            headers: reqHeaders,
        };

        return await axios.request(tagsConfig);
    }

    async getTagDetail(cSeries: number, tagId: number) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };
        const tagDetailUrl = await this.cSeriesService.generateApiUrl(cSeries, `tags/${tagId}`, null, undefined, undefined);

        let tagConfig = {
            method: 'get',
            url: tagDetailUrl,
            headers: reqHeaders,
        };

        return await axios.request(tagConfig);
    }
    async saveTagToCSeries(productId: number, productTo: number) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };

        this.getTagsFromCSeries(CSERIES.AladdinGv, productId)
            .then(async (data) => {
                let tagArray = data.data.tagsProducts;
            })
            .catch((error) => {
                console.log('error is ', error.response.data);
            });
    }

    async getProductFilter(productId: number) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };

        const metaUrl = await this.cSeriesService.generateApiUrl(
            CSERIES.AladdinGv,
            `products/${productId}/filtervalues`,
            null,
            undefined,
            undefined,
        );
        let metaConfig = {
            method: 'get',
            url: metaUrl,
            headers: reqHeaders,
        };

        return await axios.request(metaConfig);
    }

    async addProductFilter(productId: number) {
        this.getMetaField(productId)
            .then((data) => { })
            .catch((error) => {
                console.log('error is ', error.response.data);
            });
    }

    async getMetaField(productId: number) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };

        const metaUrl = await this.cSeriesService.generateApiUrl(CSERIES.AladdinGv, `products/${productId}/metafields`, null, undefined, undefined);
        let metaConfig = {
            method: 'get',
            url: metaUrl,
            headers: reqHeaders,
        };

        return await axios.request(metaConfig);
    }

    async addMetaField(productId: number, productTo: number) {
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };

        let metaApiResponse: any = {};
        this.getMetaField(productId)
            .then(async (data) => {
                metaApiResponse = data;

                const tagDetailUrl = await this.cSeriesService.generateApiUrl(CSERIES.dispolabs, `products/${productTo}/metafields`, null, undefined, undefined);
                let payload = {};
                for (let i = 0; i < data.data.productMetafields.length; i++) {
                    payload = {
                        productMetafield: {
                            key: data.data.productMetafields[i].key,
                            value: data.data.productMetafields[i].value,
                        },
                    };
                    const config = {
                        method: 'post',
                        url: tagDetailUrl,
                        headers: reqHeaders,
                        data: payload,
                    };
                    axios
                        .request(config)
                        .then((data) => { })
                        .catch((error) => {
                            console.log('error in meta field is ', error.response);
                        });
                }
            })
            .catch((error) => {
                console.log('error is ', error.response.data);
            });
    }

    async aladdinGVToDisPolabsBulkInsertions(file: any, c_series_name: string) {

        const data = []
        const originalName = file.originalname;
        const fileExt = extname(originalName);
        const randomName = `${uuidv4()}${fileExt}`;
        const result = await this.fileStorage.uploadToLocal(
            file,
            randomName,
            'products',
        );
        file.path = result;
        const dataArray = await this.fileStorage.readCSV(file.path);
        const reqHeaders = {
            'Content-Type': 'application/json',
            Accept: '*/*',
        };
        for (let each of dataArray) {

            //check if the product aleady exist in the system
            const getProductFromDB = await this.productProvider.getProductFromFilter({ internal_id: each.Internal_ID })
            const getVariantFromDB = await this.variantProvider.getVariant({ variant_internal_id: each.Internal_Variant_ID })
            console.log(getProductFromDB, getVariantFromDB)
            if (getProductFromDB.length !== 0 && getVariantFromDB !== null) {
                continue;
            }
            else if (getProductFromDB.length !== 0 && getVariantFromDB === null) {
                //if product exist and  variant does not
                const requestHeader = getRequestHeaders()
                const url = await this.cSeriesService.generateApiUrl(CSERIES.AladdinGv, 'variants', each.Internal_Variant_ID);
                let getVariantFromAladdinGvConfig = { method: 'get', maxBodyLength: Infinity, url: url, headers: reqHeaders };
                let getVariantFromAladdinGv;
                try {
                    getVariantFromAladdinGv = await axios.request(getVariantFromAladdinGvConfig);

                } catch (error) {
                    continue
                }

                let imageTitle = ""
                let image = ""
                if (getVariantFromAladdinGv.data.variant.image != false) {
                    image = await this.productProvider.convertImageToBase64(getVariantFromAladdinGv.data.variant.image.src)
                    imageTitle = `${getVariantFromAladdinGv.data.variant.image.title}.${getVariantFromAladdinGv.data.variant.image.extension}`
                }
                const addVariantToDispolabPayload = variantPayloadToaddInDispoLabs(getVariantFromAladdinGv.data?.variant, (getProductFromDB[0].product_to.toString()), image, imageTitle)

                const addVariantInDispolabURL = await this.cSeriesService.generateApiUrl(CSERIES[c_series_name], 'variants', null);
                let addVariantIntoDispolabsconfig = {
                    method: 'post',
                    url: addVariantInDispolabURL,
                    headers: requestHeader,
                    data: JSON.stringify(addVariantToDispolabPayload),
                };

                const addVariantIntoDispolabsApiResponse = await axios.request(addVariantIntoDispolabsconfig);
                // const itemFromRSeries = await this.rSeriesService.getItemFromRSeries(getProductFromDB[0], addVariantToDispolabPayload)
                const addVariantIntoDbPayload: CreateVariantDto = {
                    title: addVariantToDispolabPayload.variant.title,
                    price: addVariantToDispolabPayload.variant.priceExcl,
                    stock_quantity: addVariantToDispolabPayload.variant.stockLevel,
                    internal_variant_id_to: addVariantIntoDispolabsApiResponse?.data?.variant?.id,
                    variant_internal_id: each.Internal_Variant_ID,
                    is_active: true,
                    internal_id: getProductFromDB[0].product_to,
                    r_series_system_id: each['R Series System ID']
                }
                const variantDb = await this.variantProvider.createVariants(addVariantIntoDbPayload)

            } else if (getProductFromDB.length === 0 && getVariantFromDB === null) {
                //if product and variant does exist 
                const productUrl = await this.cSeriesService.generateApiUrl(CSERIES.AladdinGv, 'products', each.Internal_ID);
                let config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: productUrl,
                    headers: reqHeaders,
                };
                let productApiResponse
                try {

                    productApiResponse = await axios.request(config);
                } catch (error) {
                    continue
                }
                const productsData = productApiResponse?.data.product
                if (!productsData) {
                    continue
                }
                // console.log(productsData.brand.resource.id)
                //Add product in dispolabs from AladdinGV
                let getBrandId
                try {

                    getBrandId = await this.productBrandProvider.getbrandFromFilter({ internal_id: productsData.brand.resource.id })
                } catch (error) {
                    continue
                }
                const payload = {
                    product: {
                        visibility: productsData.visibility,
                        data01: productsData.data01,
                        data02: productsData.data02,
                        data03: productsData.data03,
                        title: productsData.title,
                        fulltitle: productsData.fulltitle,
                        description: productsData.description,
                        content: productsData.content,
                        deliverydate: productsData.deliverydate,
                        supplier: productsData.supplier,
                        brand: getBrandId[0].brand_to,
                    },
                };
                const requstHeaders = getRequestHeaders()
                const url = await this.cSeriesService.generateApiUrl(CSERIES[c_series_name], 'products', null);

                let addDProductIntoDispolabsconfig = {
                    method: 'post',
                    url: url,
                    headers: requstHeaders,
                    data: JSON.stringify(payload),
                };
                const addProductIntoDispolabsApiResponse = await axios.request(addDProductIntoDispolabsconfig);

                const productpayload = {
                    title: productsData.title,
                    internal_id: each.Internal_ID,
                    image: productsData.image ? productsData.image.src : false,
                    thumbnail: productsData.image ? productsData.image.src : false,
                    visibility: productsData.visibility == 'hidden' ? false : true,
                    created_at: new Date(this.dateHelper.formatDate()),
                    updated_at: new Date(this.dateHelper.formatDate()),
                    is_active: productsData.visibility == 'hidden' ? false : true,
                    price: 0,
                    quantity: 0,
                    product_to: addProductIntoDispolabsApiResponse?.data?.product?.id
                };

                const saveProduct = await this.productProvider.addProduct(productpayload);

                const getVariantFromAladdinGVURL = await this.cSeriesService.generateApiUrl(CSERIES.AladdinGv, 'variants', each.Internal_Variant_ID);
                let getVariantFromAladdinGvConfig = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: getVariantFromAladdinGVURL,
                    headers: reqHeaders,
                };
                const getVariantFromAladdinGv = await axios.request(getVariantFromAladdinGvConfig);

                let imageTitle = ""
                let image = ""
                if (getVariantFromAladdinGv.data.variant.image != false) {
                    image = await this.productProvider.convertImageToBase64(getVariantFromAladdinGv.data.variant.image.src)
                    imageTitle = `${getVariantFromAladdinGv.data.variant.image.title}.${getVariantFromAladdinGv.data.variant.image.extension}`
                }
                const addVariantToDispolabPayload = variantPayloadToaddInDispoLabs(getVariantFromAladdinGv.data?.variant, addProductIntoDispolabsApiResponse?.data?.product?.id, image, imageTitle)
                const itemFromRSeries = await this.rSeriesService.getItemFromRSeries(productsData, addVariantToDispolabPayload)
                const addVariantInDispolabURL = await this.cSeriesService.generateApiUrl(CSERIES[c_series_name], 'variants', null);
                let addVariantIntoDispolabsconfig = {
                    method: 'post',
                    url: addVariantInDispolabURL,
                    headers: requstHeaders,
                    data: JSON.stringify(addVariantToDispolabPayload),
                };
                const addVariantIntoDispolabsApiResponse = await axios.request(addVariantIntoDispolabsconfig);

                const variantToDelete = await this.variantsService.getVariantsFromCSeries(CSERIES[c_series_name], addProductIntoDispolabsApiResponse.data.product.id)
                const isVaraintDeleted = await this.variantsService.deleteVariantFromCSeries(CSERIES[c_series_name], variantToDelete.variants[1].id)

                const addProductCategory = await this.categoryService.storeCategoryInOtherCSeries(each.Internal_ID, addProductIntoDispolabsApiResponse?.data?.product?.id);
                const addVariantIntoDbPayload: CreateVariantDto = {
                    title: addVariantToDispolabPayload.variant.title,
                    price: addVariantToDispolabPayload.variant.priceExcl,
                    stock_quantity: addVariantToDispolabPayload.variant.stockLevel,
                    internal_variant_id_to: addVariantIntoDispolabsApiResponse?.data?.variant?.id,
                    variant_internal_id: each.Internal_Variant_ID,
                    is_active: true,
                    internal_id: addProductIntoDispolabsApiResponse?.data?.product?.id,
                    r_series_system_id: each['R Series System ID']
                }
                const variantDb = await this.variantProvider.createVariants(addVariantIntoDbPayload)

                // data.push(addProductIntoDispolabsApiResponse.data)

            }

        }
        return this.responseService.successResponse(data, "ok", HttpStatus.OK)
    }

    async syncProductsInExcel() {
        //get id of last synced product from database
        const auth = await this.googleAuth.authorize()
        const rSeries = await this.configurations.findSystemConfiguration(process.env.R_SERIES_CONFIGURATION)
        const sheetId = await this.configurations.findSystemConfiguration(process.env.SPREADSHEET_ID)
        const sheetName = await this.configurations.findSystemConfiguration(process.env.SHEET_NAME)
        const newItems = []

        //get all proucts from r series
        const items: RSeriesItems = await this.rSeriesService.executeApi('Item', 'get', undefined, undefined, undefined, '?sort=-itemID&load_relations=["Category"]&archived=true');
        //iterate over products from r series and macth with last synced id
        for (let each of items.Item) {
            if (each.systemSku === rSeries[0].sc_value)
                break
            else {
                await this.googleAuth.appendData(auth, [[each.systemSku, each.description, each.categoryID === '0' ? "None" : each.Category.fullPathName]], sheetId[0].sc_value, sheetName[0].sc_value)
                newItems.push(each)
            }
        }

        //push all non matching ids to new array
        await this.configurations.updateSystemConfigurations(rSeries[0].sc_id, {
            updated_at: new Date(this.dateHelper.formatDate(new Date)),
            name: process.env.R_SERIES_CONFIGURATION,
            value: newItems.length === 0 ? rSeries[0].sc_value : newItems[0].systemSku
        })
    }
}