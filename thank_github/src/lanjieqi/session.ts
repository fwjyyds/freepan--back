import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import {map} from 'rxjs/operators';
interface Data<T>{
    data:T
}
@Injectable() //不可缺少的装饰器
export class Response<T> implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler): Observable<Data<T>> {
     return next.handle().pipe(map(data  =>{
        return {
            data,
            status:200,
            message:'success'
        }//遍历数组把原来结果放在data变成新数组
     }))   
    }
}