import { HttpStatus, Injectable } from '@nestjs/common';
import { OrdersProvider } from './orders.provider';
import { DateHelper } from '../../utilities/date.helper';
import { VariantsProvider } from '../variants/variants.provider';
import { RSeriesService } from '../../services/rseries.service';
import { createRSeriesSale, createSaleLine, getRequestHeaders, saleReturnPayload, shippingSaleLine, shiptToPayloadFunc } from 'src/utilities/common.utils';
import { ResponsesService } from '../responses/responses.service';
import { CSERIES, ORDER_STATUS, responseMessages } from 'src/constants/constants';
import { CustomersProvider } from '../customers/customers.provider';
import { CseriesService } from 'src/services/cseries.service';
import axios from 'axios';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
    constructor(private readonly cSeriesService: CseriesService, private readonly OrderProvider: OrdersProvider, private readonly dateHelper: DateHelper, private readonly variantProvider: VariantsProvider, private readonly rSeriesService: RSeriesService, private readonly responseService: ResponsesService, private readonly customerProvider: CustomersProvider) { }

    async create(order_data: any) {
        const getOrder = await this.OrderProvider.getOrder({ order_internal_id: order_data.id })
        if (getOrder)
            return this.responseService.errorResponse(responseMessages.CONFLICT, HttpStatus.CONFLICT)
        const SaleLineArray = []
        let phone: string = ''
        let customerID: string = '';
        let totalAmount: number = 0;
        let shipmentCost: number = 0;
        const orderUrl = await this.cSeriesService.generateApiUrl(CSERIES.dispolabs, "orders", order_data.id)

        const requstHeaders = getRequestHeaders()
        let orderConfig = {
            method: 'get',
            url: orderUrl,
            headers: requstHeaders,
        };
        let createOrderData: any
        try {
            createOrderData = await axios.request(orderConfig);
        } catch (error) {
            return this.responseService.errorResponse(responseMessages.NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        createOrderData = createOrderData.data?.order
        const customer = createOrderData?.customer?.resource?.embedded
        const productVariant = createOrderData?.products?.resource?.embedded
        phone = customer.phone || customer.mobile;
        for (const value of productVariant) {
            const getVariant = await this.variantProvider.getVariant({ internal_variant_id_to: value.variant.resource.id })
            if (!getVariant)
                return this.responseService.errorResponse("Variant not exist", HttpStatus.NOT_FOUND)
            const saleLine = createSaleLine(new Date(this.dateHelper.formatDate()), value.basePriceExcl, value.quantityOrdered, getVariant.r_series_system_id)
            SaleLineArray.push(saleLine)
            totalAmount += value.basePriceExcl * value.quantityOrdered
            totalAmount.toFixed(2)
        }
        
        if (createOrderData.shipmentIsPickup != true && createOrderData.priceIncl != totalAmount ) {
            const shippingprice = createOrderData.priceIncl - totalAmount
            SaleLineArray.push(shippingSaleLine(new Date(this.dateHelper.formatDate()), shippingprice, 1))
            totalAmount = createOrderData.priceIncl
        }

        const customerValue = await this.customerProvider.findCustomer(customer.email, phone, true)
        let createRSeriesCustomer: any;
        if (!customerValue) {
            const customerPayload = {
                firstName: customer.firstname,
                lastName: customer.lastname,
                title: '',
                company: '',
                companyRegistrationNumber: '',
                vatNumber: '',
                creditAccountID: '0',
                Contact: {
                    custom: '',
                    noEmail: 'true',
                    noPhone: 'true',
                    noMail: 'true',
                    Addresses: {
                        ContactAddress: {
                            address1: customer.addressBillingNumber,
                            address2: customer.addressBillingStreet,
                            city: customer.addressBillingCity,
                            state: customer.addressBillingRegion,
                            zip: customer?.addressBillingZipcode,
                            country: customer.addressShippingCountry.title,
                            countryCode: customer.addressShippingCountry.code,
                            stateCode: ""
                        }
                    },
                    Phones: {
                        ContactPhone: {
                            number: phone,
                            useType: "Home"
                        }
                    },
                    Emails: {
                        ContactEmail: {
                            address: customer.email,
                            useType: "Primary"
                        }
                    },
                    Websites: '',
                    timeStamp: new Date(this.dateHelper.formatDate())
                }
            }
            createRSeriesCustomer = await this.rSeriesService.executeApi('Customer', 'post', JSON.stringify(customerPayload))
            const customerCreatePayload = {
                email: customer.email,
                phone_number: phone,
                customer_internal_id: createRSeriesCustomer.Customer.customerID,
                is_active: true,
                created_at: new Date(this.dateHelper.formatDate()),
                updated_at: new Date(this.dateHelper.formatDate())
            }

            await this.customerProvider.createCustomer(customerCreatePayload)
            customerID = createRSeriesCustomer.Customer.customerID
        } else {
            customerID = customerValue?.customer_internal_id
        }

        const shipToPayload = shiptToPayloadFunc(customer, phone, customerID, new Date(this.dateHelper.formatDate())) //create shipment payload
        const payload = createRSeriesSale(new Date(this.dateHelper.formatDate()), (totalAmount).toFixed(2), customerID, shipToPayload, SaleLineArray)
        const response = await this.rSeriesService.executeApi('Sale', 'post', JSON.stringify(payload)) as { Sale: { saleID: string } }
        const createOrderPayload: CreateOrderDto = {
            status: createOrderData.paymentStatus,
            order_internal_id: createOrderData.id,
            created_at: new Date(this.dateHelper.formatDate()),
            order_date: new Date(this.dateHelper.formatDate()),
            total_amount: (totalAmount).toFixed(2),
            is_completed: true,
            sale_internal_id: response?.Sale?.saleID
        }
        const order = this.OrderProvider.createOrder(createOrderPayload);

        return this.responseService.successResponse(response, responseMessages.OK, HttpStatus.OK)
    }

    async updateOrder(order_data: any) {

        const orderUrl = await this.cSeriesService.generateApiUrl(CSERIES.dispolabs, "orders", order_data.id)
        const requstHeaders = getRequestHeaders()
        let orderConfig = {
            method: 'get',
            url: orderUrl,
            headers: requstHeaders,
        };

        let order: any = await axios.request(orderConfig);
        order = order.data?.order

        if (order?.status === ORDER_STATUS.CANCELLED) {
            const getOrder = await this.OrderProvider.getOrder({ order_internal_id: order_data.id })
            if (!getOrder)
                return this.responseService.errorResponse(responseMessages.NOT_FOUND, HttpStatus.NOT_FOUND)
            let payload = saleReturnPayload()
            const response = await this.rSeriesService.executeApi('Sale', 'post', JSON.stringify(payload), parseInt(getOrder.sale_internal_id), "refund")
        }
        return order
    }

}
