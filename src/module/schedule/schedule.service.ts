import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { ProductsService } from '../products/products.service';
import { CSERIES, C_SERIES_NAMES, IS_PRODUCT_UPDATE_FAILED, PRODUCT_QUEUE_STATUS, PRODUCT_UPDATE_MESSAGE } from 'src/constants/constants';
import { ProductProvider } from '../products/products.provider';
import { DateHelper } from 'src/utilities/date.helper';
import { CategoryService } from '../categories/categories.service';
import { ProductUpdateProvider } from '../product-update/product-update.provider';
import { checkCategory } from 'src/utilities/common.utils';

@Injectable()
export class ScheduleService {
    constructor(
        private readonly productsService: ProductsService,
        private readonly productProvider: ProductProvider,
        private readonly productUpdateProvider: ProductUpdateProvider,
        private readonly categoryService: CategoryService,
        private readonly dateHelper: DateHelper,
        private schedulerRegistry: SchedulerRegistry,
    ) { }

    private shouldRunCronJob(): boolean {
        // Your condition goes here
        if (process.env.ENABLE_CRON_JOB_ADD_PRODUCT == 'true')
            return true;
        return false
    }
    private shouldRunCronJobToUpdate(): boolean {
        // Your condition goes here

        if (process.env.ENABLE_CRON_JOB_UPDATE_PRODUCT == 'true')
            return true;
        return false
    }

    @Cron(process.env.ENABLE_CRON_JOB_ADD_PRODUCT_TIME, { name: 'addProduct' })
    async handleAddProduct() {
        if (this.shouldRunCronJob()) {
            const job = this.schedulerRegistry.getCronJob('addProduct');
            job.stop();

            console.log(job.lastDate());
            const recentProducts = await this.productsService.getRecentProducts(CSERIES.AladdinGv);

            const getLastProduct = await this.productProvider.getLastProduct();
            let getValue = false;
            let index = 0;

            if (recentProducts.status) {
                // recentProducts.products.length
                for (let i = 0; i < recentProducts.products.length && getValue == false; i++) {
                    if (recentProducts.products[i].id == getLastProduct[0].internal_id) {
                        index = i == 0 ? -1 : i - 1;
                        getValue = true;
                        break;
                    }
                }
                for (let i = index; i >= 0; i--) {
                    const categories: any = await this.categoryService.getCategoryFromCSeriesWithProductId(CSERIES.AladdinGv, recentProducts.products[i].id);
                    if (categories.status) {
                        let flag = true;
                        if (categories.category.categoriesProducts.length === 0)
                            flag = false
                        for (const valieCategories of categories.category.categoriesProducts) {
                            //product with no category also syncs, need to fix this
                            flag = (await checkCategory(valieCategories.category.resource.id)).status;
                        }



                        if (flag) {
                            const saveProduct = await this.productsService.addProductFromHook(recentProducts.products[i]);
                        }
                         else {
                            const productpayload = {
                                title: recentProducts.products[i].title,
                                internal_id: recentProducts.products[i].id,
                                image: false,
                                thumbnail: false,
                                visibility: false,
                                created_at: new Date(this.dateHelper.formatDate()),
                                updated_at: new Date(this.dateHelper.formatDate()),
                                product_to: 0,
                                is_active: false,
                                price: 0,
                                quantity: 0,
                                is_saved: false,
                                c_series_name: C_SERIES_NAMES.STONER_MOM
                            };

                            const savePeoduct = await this.productProvider.addProduct(productpayload);
                        }
                    }
                }
            }

            job.start();
        }

    }

    @Cron(process.env.ENABLE_CRON_JOB_UPDATE_PRODUCT_TIME, { name: 'updateProduct' }) //every 1 minut
    async handleUpdate() {
        if (this.shouldRunCronJobToUpdate()) {
            const job = this.schedulerRegistry.getCronJob('updateProduct');
            job.stop();

            const updatedQueue = await this.productUpdateProvider.getProductUpdate({ status: PRODUCT_QUEUE_STATUS.NEW });
            for (const product of updatedQueue) {
                const productDetail = await this.productsService.getProductFromCSeries(CSERIES.AladdinGv, product.internal_id);
                if (productDetail.status) {
                    const update: any = await this.productsService.updateProductFromHook(productDetail.product);
                    let productUpdatePayload: any = {
                        id: product.id,
                        updated_at: new Date(this.dateHelper.formatDate())
                    };

                    if (update.success == true) {
                        productUpdatePayload.status = PRODUCT_QUEUE_STATUS.COMPLETE
                        productUpdatePayload.message = update.message
                    } else {
                        productUpdatePayload.status = PRODUCT_QUEUE_STATUS.FAILED
                        productUpdatePayload.message = update.message
                    }
                    const deleteProductUpdate = await this.productUpdateProvider.update(product.id, productUpdatePayload);
                }
            }
            job.start();
        }

    }


    @Cron(process.env.ACTIVE_INVENTORY_CRON_JOB_TIME, { name: 'syncProducts' }) //every 1 minute
    async syncProductsInExcelSheet() {

        const job = this.schedulerRegistry.getCronJob('syncProducts');
        job.stop();

        if (process.env.ACTIVE_INVENTORY_CRON_JOB == 'true') {
            await this.productsService.syncProductsInExcel()
            job.start();
        }

    }

}
