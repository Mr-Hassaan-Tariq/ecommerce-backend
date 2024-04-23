import { Injectable } from "@nestjs/common";
import axios from "axios";
import { AxiosWrapperService } from "./axios.service";
import { response } from 'express';
import { extractFlavor } from "src/utilities/common.utils";
import { ItemResponse } from "src/interfaces/common.interface";

@Injectable()
export class RSeriesService {
    constructor(private readonly axiosWrapperService: AxiosWrapperService) { }

    async getAuthToken() {
        const client_id = process.env.CLIENT_ID;
        const client_secret = process.env.CLIENT_SECRET;
        const url = process.env.R_SERIES_URL;
        const rSeriesRefreshToken = process.env.R_SERIES_REFRESH_TOKEN;
        const grantType = process.env.GRANT_TYPE;

        const formData = new URLSearchParams();
        formData.append('client_id', client_id);
        formData.append('client_secret', client_secret);
        formData.append('refresh_token', rSeriesRefreshToken);
        formData.append('grant_type', grantType);

        try {
            const response = await axios.post(url, formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            return response.data.access_token;
        } catch (error) {
            return error.response.data;
        }
    }


    async executeApi(endpoint: string, method: string, body: any | undefined = undefined, id: number | undefined = undefined, endpointSecond: string | undefined = undefined, queryParam: string | undefined = undefined) {
        const token = await this.getAuthToken()
        if (!token)
            throw Error("Failed to authenticate with R-series API")
        const URL = process.env.R_SERIES_APIS_URL;
        const accountID = process.env.ACCOUNT_ID
        const reqHeaders = {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        }
        let url = `${URL}/${accountID}/${endpoint}`;
        if (id)
            url += `/${id}`
        if (endpointSecond)
            url += `/${endpointSecond}`
        url += '.json'
        if (queryParam != undefined)
            url += queryParam

        console.log(url)
        const response = this.axiosWrapperService.request(method, url, body, { headers: reqHeaders }, token)

        return new Promise((resolve, reject) => {
            response.subscribe((data) => resolve(data),
                (error) => reject(error))
        })
    }


    async getItemFromRSeries(productsData: { title: string }, addVariantToDispolabPayload: { variant: { title: string } }): Promise<ItemResponse> {
        const itemVariant = extractFlavor(addVariantToDispolabPayload.variant.title);

        // Encoding both productsData.title and itemVariant for URL
        const encodedTitle = encodeURIComponent(`${productsData.title} ${itemVariant}`);
        const encodedTitleWithDoubleSpace = encodeURIComponent(`${productsData.title}  ${itemVariant}`);

        // Initial API call with the title having a single space
        const response: ItemResponse = await this.executeApi('Item', 'get', undefined, undefined, undefined, `?description=${encodedTitle}`);

        // Check if the API response contains the item
        const hasItem = response && response.Item && response.Item.itemID;

        // Only make a second API call if the item is not found in the first call
        if (!hasItem) {
            const finalEncodedTitle = encodedTitleWithDoubleSpace;
            const secondResponse: ItemResponse = await this.executeApi('Item', 'get', undefined, undefined, undefined, `?description=${finalEncodedTitle}`);

            // Return the second response regardless of whether the item was found
            return secondResponse;
        }

        // Return the first response if the item was found
        return response;
    }



}
