import { DISPOLABS_SHIPPING, DISPO_LABS_EMPLOYEE, PaymentTypeID, REGISTER_ID, SHOP_ID, Valide_CATEGORIES } from "src/constants/constants";

const paginate = require("jw-paginate");
export function pagination(pageNumber, items, limit) {
    const page = parseInt(pageNumber) || 1;

    // get pager object for specified page
    const pageSize = limit;
    const pager = paginate(items.length, page, pageSize);

    // get page of items from items array
    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);
    if (pager.endIndex === -1)
        pager.startIndex = -1
    return { pager, pageOfItems };
}

export const createSaleLine = (createTime: Date, basePriceExcl: number, quantityOrdered: number, itemID: string) => {
    return (
        {
            createTime: createTime,
            timeStamp: createTime,
            unitQuantity: quantityOrdered.toString(),
            unitPrice: basePriceExcl.toFixed(2),
            normalUnitPrice: '0',
            discountAmount: '0',
            discountPercent: '0',
            avgCost: basePriceExcl.toFixed(2),
            fifoCost: basePriceExcl.toFixed(2),
            tax: 'false',
            tax1Rate: '0',
            tax2Rate: '0',
            isLayaway: 'false',
            isWorkorder: 'false',
            isSpecialOrder: 'false',
            displayableSubtotal: basePriceExcl.toFixed(2),
            displayableUnitPrice: basePriceExcl.toFixed(2),
            calcLineDiscount: '0',
            calcTransactionDiscount: '0',
            calcTotal: (basePriceExcl * quantityOrdered).toFixed(2),
            calcSubtotal: (basePriceExcl * quantityOrdered).toFixed(2),
            calcTax1: '0',
            calcTax2: '0',
            taxClassID: '8',
            customerID: '0',
            discountID: '0',
            employeeID: DISPO_LABS_EMPLOYEE, 
            itemID: itemID,
            noteID: '0',
            parentSaleLineID: '0',
            shopID: SHOP_ID 
        }
    )
}

export const shippingSaleLine = (createTime: Date, basePriceExcl: number, quantityOrdered: number, itemID: string = DISPOLABS_SHIPPING) => {
    return (
        {
            createTime: createTime,
            timeStamp: createTime,
            unitQuantity: quantityOrdered.toString(),
            unitPrice: basePriceExcl.toFixed(2),
            normalUnitPrice: '0',
            discountAmount: '0',
            discountPercent: '0',
            avgCost: basePriceExcl.toFixed(2),
            fifoCost: basePriceExcl.toFixed(2),
            tax: 'false',
            tax1Rate: '0',
            tax2Rate: '0',
            isLayaway: 'false',
            isWorkorder: 'false',
            isSpecialOrder: 'false',
            displayableSubtotal: basePriceExcl.toFixed(2),
            displayableUnitPrice: basePriceExcl.toFixed(2),
            calcLineDiscount: '0',
            calcTransactionDiscount: '0',
            calcTotal: (basePriceExcl * quantityOrdered).toFixed(2),
            calcSubtotal: (basePriceExcl * quantityOrdered).toFixed(2),
            calcTax1: '0',
            calcTax2: '0',
            taxClassID: '8',
            customerID: '0',
            discountID: '0',
            employeeID: DISPO_LABS_EMPLOYEE, 
            itemID: itemID,
            noteID: '0',
            parentSaleLineID: '0',
            shopID: SHOP_ID 
        }
    )
}


export const createRSeriesSale = (timeStamp: Date, totalAmount: string, customer: string, shipto: object, saleLine: any,) => {
    return (
        {
            timeStamp: timeStamp,
            discountPercent: '0',
            completed: 'true',
            archived: 'false',
            voided: 'false',
            enablePromotions: 'false',
            isTaxInclusive: 'false',
            completeTime: timeStamp,
            referenceNumber: '#1',
            referenceNumberSource: 'Dispo Labs API',
            tax1Rate: '0',
            tax2Rate: '0',
            change: '0',
            receiptPreference: 'printed',
            displayableSubtotal: totalAmount,
            total: totalAmount,
            totalDue: totalAmount,
            displayableTotal: totalAmount,
            balance: '0',
            customerID: customer,
            discountID: '0',
            employeeID: DISPO_LABS_EMPLOYEE,
            quoteID: '0',
            registerID: REGISTER_ID,
            shipToID: '0',
            shopID: SHOP_ID,
            taxCategoryID: '4',
            tipEmployeeID: '0',
            ShipTo: shipto,
            SaleLines: { SaleLine: saleLine },
            SalePayments: {
                SalePayment: {
                    amount: totalAmount,
                    tipAmount: '0',
                    createTime: timeStamp,
                    remoteReference: '',
                    paymentID: '',
                    paymentTypeID: PaymentTypeID,
                    ccChargeID: '0',
                    refPaymentID: '0',
                    registerID: REGISTER_ID,
                    employeeID: DISPO_LABS_EMPLOYEE,
                    creditAccountID: '0',
                    PaymentType: {
                        paymentTypeID: PaymentTypeID,
                        code: '',
                        name: 'Dispolabs-payments',
                        requireCustomer: false,
                        archived: 'false',
                        internalReserved: 'false',
                        type: 'user defined',
                        channel: 'online',
                        refundAsPaymentTypeID: PaymentTypeID
                    }
                }
            }
        }

    )
}

export const saleReturnPayload = () => {
    return (
        {
            employeeId: DISPO_LABS_EMPLOYEE,
            registerId: REGISTER_ID,
            shopId: SHOP_ID,
            SalePayments: {
                SalePayment: {
                    paymentTypeID: PaymentTypeID
                }
            }
        }
    )
}

export const shiptToPayloadFunc = (params: any, phone: string, customerID: string, timestamp: Date) => {
    return ({
        shipped: false,
        timeStamp: timestamp,
        shipNote: ' This is a sample shipment note.',
        firstName: params.firstname,
        lastName: params.lastname,
        customerID: customerID,
        Contact: {
            custom: '',
            noEmail: 'true',
            noPhone: 'true',
            noMail: 'true',
            Addresses: {
                ContactAddress: {
                    address1: params.addressBillingNumber,
                    address2: params.addressBillingStreet,
                    city: params.addressBillingCity,
                    state: params.addressBillingRegion,
                    zip: params?.addressBillingZipcode,
                    country: params.addressShippingCountry.title,
                    countryCode: params.addressShippingCountry.code,
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
                    address: params.email,
                    useType: "Primary"
                }
            },
            Websites: '',
            timeStamp: timestamp
        }

    })
}

export const getRequestHeaders = () => {
    return (
        {
            'Content-Type': 'application/json',
            Accept: '*/*',
        }
    )
}

export const returnConfig = () => {

}
export const variantPayloadToaddInDispoLabs = (data: any, productID: string, image: string, filename: string) => {
    return (
        {
            variant: {
                isDefault: true,
                sortOrder: data?.sortOrder,
                articleCode: '',
                ean: data?.ean,
                sku: data.sku,
                hs: data.hs,
                priceExcl: data?.priceExcl,
                priceIncl: data?.priceIncl,
                priceCost: data?.priceCost,
                oldPriceExcl: data?.oldPriceExcl,
                oldPriceIncl: data?.oldPriceIncl,
                stockTracking: data?.stockTracking,
                stockLevel: data?.stockLevel,
                stockAlert: data?.stockAlert,
                stockMinimum: data?.stockMinimum,
                stockSold: data?.stockSold,
                stockBuyMinimum: data?.stockBuyMinimum,
                stockBuyMaximum: data?.stockBuyMaximum,
                weight: data?.weight,
                volume: data?.volume,
                colli: data?.colli,
                sizeX: data?.sizeX,
                sizeY: data?.sizeY,
                sizeZ: data?.sizeZ,
                title: data?.title,
                tax: data?.tax,
                product: productID,
                ...(image != "" && { // Only include image if it's not empty
                    image: {
                        attachment: image,
                        filename: filename
                    }
                })
            }
        }
    )
}
export const extractFlavor = (title: string) => {
    const colonIndex = title.indexOf(':');

    if (colonIndex !== -1) {
        return title.substring(colonIndex + 1).trim();
    }

    // Return the original title if ':' is not found
    return title;
};

export const checkCategory = async (categoryId: number) => {
    for (let i = 0; i < Valide_CATEGORIES.length; i++) {
        if (Valide_CATEGORIES[i].id == categoryId) {
            return { status: true, ...Valide_CATEGORIES[i] };
        }
    }

    return { status: false };
}