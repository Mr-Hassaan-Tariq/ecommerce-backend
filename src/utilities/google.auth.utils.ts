import { Injectable } from "@nestjs/common";
const { authenticate } = require('@google-cloud/local-auth');
const process = require('process');
const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const SPREADSHEET_ID = process.env.SPREADSHEET_ID

@Injectable()
export class GoogleAuthApi {
    async loadSavedCredentialsIfExist() {
        try {
            const content = await fs.readFile(TOKEN_PATH);
            const credentials = JSON.parse(content);
            return google.auth.fromJSON(credentials);
        } catch (err) {
            return null;
        }
    }

    async saveCredentials(client) {
        const content = await fs.readFile(CREDENTIALS_PATH);
        const keys = JSON.parse(content);
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token,
        });
        await fs.writeFile(TOKEN_PATH, payload);
    }

    async authorize() {
        let client = await this.loadSavedCredentialsIfExist();
        if (client) {
            return client;
        }
        client = await authenticate({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH,
        });
        if (client.credentials) {
            await this.saveCredentials(client);
        }
        return client;
    }

    async appendData(auth, data, sheetId, sheetName) {
        try {
            // Create the Sheets API service
            const sheets = google.sheets({ version: 'v4', auth });

            // Get the current data range
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: sheetId,
                range: `${sheetName}!A1:B`  // Assuming column A always has data
            });

            const numRows = response.data.values ? response.data.values.length : 0;

            // Calculate the range for the new data
            const range = `${sheetName}!A${numRows + 1}`;


            // Append the data
            const appendResponse = await sheets.spreadsheets.values.append({
                spreadsheetId: sheetId,
                range: range,
                valueInputOption: 'RAW',
                resource: {
                    values: data
                }
            });

        } catch (error) {
            console.error('Error appending data:', error);
        }
    }
}