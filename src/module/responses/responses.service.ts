/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ResponsesService {
    successResponse(data: any, message: string, status: HttpStatus) {
        return {
            success: true,
            message,
            data,
            status: status
        }
    }
    errorResponse(message: string, status: HttpStatus) {
        return {
            success: false,
            message,
            data: null,
            status: status
        }
    }

    apiResponse(obj: any) {
        return {
            success: obj.success,
            message: obj.message,
            data: obj.data
        }
    }
}

