import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import {map} from 'rxjs/operators';
interface Data<T>{
    data:T | null;
}
@Injectable() //不可缺少的装饰器
export class Response<T> implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler): Observable<Data<T>> {
        const request = context.switchToHttp().getRequest();
 const HttpStatus = request.res.constructor;
          // 检查 session.user 是否存在
        //   if ((!request.session || !request.session.user) &&(request.url!='/user/login')) {
        //     // 如果不存在，返回 400 状态码和错误信息
        //     return next.handle().pipe(map(data  =>{
        //         return {
        //             data:null,
        //             status:HttpStatus.BAD_REQUEST,
        //             message:'session过期了，请重新登录'
        //         }//遍历数组把原来结果放在data变成新数组
        //      }))   
        // }
     return next.handle().pipe(map(data  =>{
        return {
            data,
            status:200,
            message:'success'
        }//遍历数组把原来结果放在data变成新数组
     }))   
    }
}