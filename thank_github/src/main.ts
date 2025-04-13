import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session'
import * as svgCaptcha from 'svg-captcha'
import * as cors from 'cors'
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import {Response} from  './lanjieqi/index'
import {HttpFilter} from './lanjieqi/filter'
import { Res } from '@nestjs/common';
import * as express from 'express';

import { WsAdapter } from '@nestjs/platform-ws';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, 'files'),{prefix:'/yufeng'})
  app.use(session({secret:'SYF',name:'syf.sid',cookie:{path:'/',httpOnly:true,secure:false,maxAge:60000},rolling:true,resave:false,saveUninitialized:false  }))
  // app.use(cors({
  //   origin:  (origin, callback) => {
  //     console.log(origin)
  //     //白名单
  //     const allowedOrigins = ['http://localhost:4173', 'https://example.com'];
  //     if (origin && allowedOrigins.indexOf(origin) !== -1) {
  //       return    callback(null, true);
  //     } else {
  //      return callback(new Error('Not allowed by CORS'));
  //     }
  //   },
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 允许的 HTTP 方法
  //   credentials: true, // 允许发送 cookies 和认证信息
  //   allowedHeaders: 'Content-Type, Accept, Authorization', // 允许的请求头
  // }));
  app.enableCors();
  app.use((req,res,next)=>{
    console.log(req.url)
    if (req.url !== '/user/login') { 
 
      next();
    } else {
      next();
    }

  })
    // 设置请求体的最大大小
    app.use(express.json({ limit: '1000mb' }));
    app.use(express.urlencoded({ limit: '1000mb', extended: true }));
app.useGlobalInterceptors(new Response())
app.useGlobalFilters(new HttpFilter())
app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen( 3000);

}
bootstrap() ; 
