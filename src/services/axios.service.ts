import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AxiosWrapperService {
    constructor(private readonly httpService: HttpService) { }

    request<T>(method: string, url: string, data?: any, headers?: any, token?: string): Observable<T> {
        const config: AxiosRequestConfig = {
            method,
            url,
            data,
            headers: {
                ...headers,
                Authorization: token ? `Bearer ${token}` : undefined,
            },
        };

        return this.httpService.request<T>(config)
            .pipe(
                map((response: AxiosResponse<T>) => response.data),
                catchError((error: AxiosError) => throwError(this.handleError(error))),
            );
    }

    private handleError(error: AxiosError): any {
        if (error.response) {
            console.error('Response Error:', error.response.data);
            return error.response.data;
        } else if (error.request) {
            console.error('Request Error:', error.request);
            return { error: 'No response received from the server.' };
        } else {
            console.error('Error:', error.message);
            return { error: 'An error occurred while setting up the request.' };
        }
    }
}
