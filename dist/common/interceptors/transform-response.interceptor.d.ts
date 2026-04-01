import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import type { ApiResponse } from '../interfaces/api-response.interface';
export declare class TransformResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T | null>> {
    private readonly reflector;
    constructor(reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T | null>>;
}
