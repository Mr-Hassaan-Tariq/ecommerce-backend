export interface ItemResponse {
    Item?: {
        itemID?: string;
    };
    // Add more properties as needed based on the actual response structure
}

export interface RSeriesItems {
    Item?: [{
        systemSku?: string;
        description?: string;
        categoryID?:string;
        Category?: {
            fullPathName?: string;
        }
    }]
}