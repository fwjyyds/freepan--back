import { ArgumentsHost, CallHandler, Catch, ExceptionFilter, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { HttpException } from "@nestjs/common";
import {map} from 'rxjs/operators';
interface Data<T>{
    data:T
}
@Catch(HttpException)
export class HttpFilter implements ExceptionFilter{
    catch (exception:HttpException,host:ArgumentsHost){
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        // response.status(200).json({
        //     time: new Date().toLocaleString(),
        //     data: exception.message,
        //     status: 200,
        //     path: request.url
        // });
    }
}