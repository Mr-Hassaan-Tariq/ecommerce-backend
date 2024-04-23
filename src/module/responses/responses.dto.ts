import { HttpStatus } from "@nestjs/common"

export class ServiceResponseDto {
    message: string
    status: HttpStatus
    data: any
}
