import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user2/user.module';
import { CatsModule } from './cats/cats.module';
import { WsModule } from './ws/ws.module';
import { AaaModule } from './aaa/aaa.module';
import { WebsocketModule } from './websocket/websocket.module';
import { DownloadModule } from './download/download.module';

import { WsStartGateway }from './websocket/websocket.gateway'
import envConfig from '../config/env';


//引入multer模块
@Module({
  imports: [ UploadModule,   UserModule,CatsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '865341156qaz',
      database: 'd2',
      entities: [  'dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    WsModule,
    AaaModule,
    WebsocketModule,
    DownloadModule,
  //    ConfigModule.forRoot({
  //   isGlobal: true, // 设置为全局
  //   envFilePath: [envConfig.path],
  // }),
  // TypeOrmModule.forRootAsync({
  //   imports: [ConfigModule],
  //   inject: [ConfigService],
  //   useFactory: async (configService: ConfigService) => ({
  //     type: 'mysql', // 数据库类型
  //     entities: [PostsEntity], // 数据表实体，synchronize为true时，自动创建表，生产环境建议关闭
  //     host: configService.get('DB_HOST'), // 主机，默认为localhost
  //     port: configService.get<number>('DB_PORT'), // 端口号
  //     username: configService.get('DB_USER'), // 用户名
  //     password: configService.get('DB_PASSWD'), // 密码
  //     database: configService.get('DB_DATABASE'), //数据库名
  //     timezone: '+08:00', //服务器上配置的时区
  //     synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
  //   }),
  // }),

 // CatsModule,

],
  controllers: [AppController],
  providers: [AppService,WsStartGateway],
  exports: [AppService],
})
export class AppModule {}
