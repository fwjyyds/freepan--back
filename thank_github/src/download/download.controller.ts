import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { DownloadService } from './download.service';
import { CreateDownloadDto } from './dto/create-download.dto';
import { UpdateDownloadDto } from './dto/update-download.dto';
import * as fs from 'fs-extra'
import * as https from 'https'
import { join } from 'path'
@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {

  }

  @Post('upload')
  getupload(@Body() body: any) {
    console.log(body);
    return this.downloadService.findUpload(body.userid);
  }
  @Post('download')
  getdownload(@Body() body: any) {
    return this.downloadService.findDownload(body.userid);
  }
  @Post('updateupload')
  getupdateupload(@Body() body: any) {
    
    return this.downloadService.updateupload(body.userid, body.s1.array, body.s2.array)
  }
  @Post('updatedownload')
  getupdatedownload(@Body() body: any) {

    return this.downloadService.updatedownload(body.userid, body.s1.array, body.s2.array);

  }


  //下载操作
  @Post('downloadFile')
  async downloadFile(@Body() body: any, @Res() res: any) {
    try {
      let fileUrl = join(__dirname, '../../../files')
      fileUrl = join(fileUrl, body.userid)
      fileUrl = join(fileUrl, body.path)
      console.log('后端->前端 fileUrl', fileUrl)
      const file = fs.createReadStream(fileUrl)
      file.pipe(res)
    }
    catch (err) {
      console.log('后端->前端 errorXuX', err)
    }
  }
}
