import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import csv from 'csv-parser'; @Injectable()
export class FileStorage {
    private localBasePath: string;

    constructor() { this.localBasePath = process.env.LOCAL_STORAGE_PATH }
    async uploadToLocal(file: Express.Multer.File, key: string, path: string): Promise<string> {
        const filePath = `${this.localBasePath}/${path}/${key}`;
        const result = fs.writeFileSync(process.cwd() + "/" + filePath, file.buffer);
        return filePath;
    }
    async readCSV(filePath: string): Promise<any[]> {
        const results = [];

        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
    }
}