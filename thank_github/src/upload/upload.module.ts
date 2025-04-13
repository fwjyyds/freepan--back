import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import { existsSync, mkdirSync } from 'fs';
import{join,resolve,extname} from 'path';
import {Session} from '@nestjs/common'
interface SessionInner {
  user?: string;
}
@Module({
  imports: [
    // MulterModule.register({
    // storage:diskStorage({
    //   destination: ( username,file, callback) => {
    //     console.log(username,'=======================')
    //     // const session:SessionInner = req.session; // 假设你有一个请求对象 req，从中获取 session
    //     // if (!session || !session.user) {
    //     //   return callback(new Error('No user session found'), '');
    //     // }
    //     // const userFolder = join(__dirname, '../user_files', session.user);
    //     // if (!existsSync(userFolder)) {
    //     //   mkdirSync(userFolder, { recursive: true });
    //     // }
    //     return callback(null, '123');
    //   },
    //   filename:(_,file,callback)=>{
    //     const filename=new Date().getTime()+extname(file.originalname);
    //     console.log(filename,'0000000');
    //     return callback(null,filename);
    //   }
    // })
    //   })
    ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
