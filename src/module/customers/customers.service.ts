import { Injectable, HttpStatus } from '@nestjs/common';
import { ResponsesService } from '../responses/responses.service';
import { extname } from 'path';
import { FileStorage } from '../../utilities/filestorage.utils';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { DateHelper } from 'src/utilities/date.helper';
import { CustomersProvider } from './customers.provider';

@Injectable()
export class CustomersService {
    constructor(
        private readonly responseService: ResponsesService,
        private readonly fileStorage: FileStorage,
        private readonly customersProvider: CustomersProvider,
        private readonly dateHelper: DateHelper,
    ) { }

    async bulkUploadsCustomers(file: any) {
        const originalName = file.originalname;
        const fileExt = extname(originalName)
        const randomName = `${uuidv4()}${fileExt}`
        const result = await this.fileStorage.uploadToLocal(file, randomName, "users")
        file.path = result
        const dataArray = await this.fileStorage.readCSV(file.path);

        const batchSize = 1000;

        for (let i = 0; i < dataArray.length; i += batchSize) {
            const batch = dataArray.slice(i, i + batchSize);
            let data = [];

            batch.forEach((each) => {
                let phone = '';
                if (each['Email'] != '' && (each['Mobile'] != '' || each['Home'] != '')) {
                    if (each['Mobile'] != '') {
                        phone = each['Mobile']
                    } else if (each['Home'] != '') {
                        phone = each['Home']
                    }
                    data.push({
                        email: each['Email'],
                        phone_number: phone,
                        customer_internal_id: each['Customer ID'],
                        is_active: true,
                        created_at: new Date(this.dateHelper.formatDate()),
                        updated_at: new Date(this.dateHelper.formatDate())
                    })
                }
            })

            // Insert data in batches
            await this.customersProvider.addBulkCustomers(data);

            // Write the current batch to a file
            fs.writeFileSync(`./data_batch_${i / batchSize}.json`, JSON.stringify(data, null, 2));
        }

        return this.responseService.successResponse(null, "created", HttpStatus.OK)
    }

}

