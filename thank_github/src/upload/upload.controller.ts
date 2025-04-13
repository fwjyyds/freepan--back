import { Controller, Res, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, Query, Session, Req, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { join } from 'path';
import { Response } from 'express';
import multer, { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { zip } from 'compressing';

import { Readable } from 'stream';
import * as Busboy from 'busboy';
import { writeFileSync } from 'fs';
import * as path from 'path';
import * as fs from 'fs-extra';
var currentpath = ''
var filelist: file1[] = []
interface file1 {
  filename: string,
  blobarray: any[]
}
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }
  //设置当前路径
  @Post('setpath')
  setpath(@Body() body: any) {
    try {
      let path2 = join(__dirname, '../../../files')
      path2 = join(path2, body.userid)
      path2 = join(path2, body.path)
      if (!existsSync(path2)) {
        console.log('创建文件夹：', body.userid, path2);
        mkdirSync(path2, { recursive: true });
      }
      currentpath = path2
    } catch (error) {
      console.error('创建文件夹失败：', error);
    }
  }
  //busboy方法上传文件

  // @Post('ulfile2')
  // async ulfile2(@Body('files') files:any,@Req() req: any) {
  //   const busboy = new Busboy({ headers: req.headers });
  //   console .log(busboy,'busboy');
  //   const uploadDir = './uploads';

  //   if (!fs.existsSync(uploadDir)) {
  //     fs.mkdirSync(uploadDir);
  //   }

  //   busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
  //     const filePath = path.join(uploadDir, filename);
  //     const writeStream = fs.createWriteStream(filePath, { flags: 'a' });
  //     let totalBytes = 0;
  //     const fileSize = req.headers['content-length'] ? parseInt(req.headers['content-length'], 10) : 0;

  //     file.on('data', (data) => {
  //       totalBytes += data.length;
  //       const progress = (totalBytes / fileSize) * 100;
  //       console.log(`Progress: ${progress.toFixed(2)}%`);
  //       writeStream.write(data);
  //     });

  //     file.on('end', () => {
  //       writeStream.end();
  //       console.log(`File ${filename} uploaded`);
  //     });
  //   });

  //   busboy.on('finish', () => {
  //     console.log('Upload complete');
  //   });

  //   req.pipe(busboy);
  // }
  @Post('createfolder')
  async createfolder(@Body() body: any, @Res() res: Response) {
    try {
      let path2 = join(__dirname, '../../../files')
      path2 = join(path2, body.userid)
      path2 = join(path2, body.path)
      if (!existsSync(path2)) {
        console.log('创建文件夹：', body.userid, path2);
        mkdirSync(path2, { recursive: true });
      }
      currentpath = path2
      res.send({ status: 200, message: '创建文件夹成功' })
    } catch (error) {
      console.error('创建文件夹失败：', error);
    }
  }
  //MULTER方法上传文件
  @Post('ulfile')
  async ulfile(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    async function base64ToUint8Array(base64String) {
      // 使用Buffer从Base64字符串创建二进制数据
      const buffer = Buffer.from(base64String, 'base64');
      // 将Buffer转换为Uint8Array
      return new Uint8Array(buffer);
    }
    try {

      // 文件路径
      let path2 = join(__dirname, '../../../files')
      path2 = join(path2, body.userid)
      path2 = join(path2, body.path)
      if (!existsSync(path2)) {
        console.log('创建文件夹：', body.userid, path2);
        mkdirSync(path2, { recursive: true });
      }
      currentpath = path2
      //start
      if (body.index === 0) {
        const filehead = { filename: body.filename, blobarray: [body.chunk] }
        filelist.push(filehead)
        console.log('上传文件:', body.filename)

      }
      else {
        const file = filelist.filter(item => item.filename === body.filename)
        console.log('现在的filelist:', body.filename)
        if (file[0]) {
          file[0].blobarray.push(body.chunk)
          const percent = ((body.index + 1) / body.total * 100).toFixed(1)
          console.log('进度:', percent, '%')
        }
        else {
          console.log('文件不存在')
        }

      }
      console.log(body.filename,body.index+1,body.total)
      if (body.total == body.index + 1) {
        console.log('所有数据上传完 毕', filelist.map(item => item.filename))
        // 将所有Base64块转换为Buffer并合并
        const filetmp = filelist.filter(item => item.filename === body.filename)
        const buffers = filetmp[0].blobarray.map(chunk => Buffer.from(chunk, 'base64'));
        const mergedBuffer = Buffer.concat(buffers);
        //设置路径
        let topath = join(__dirname, '../../../files')
        topath = join(topath, body.userid)
        topath = join(topath, body.path)
        console.log('合并路径', body.userid, topath, join(topath, body.filename))
        fs.writeFileSync(join(topath, body.filename), mergedBuffer);
        console.log('文件合并完成', body.filename)
        filelist = filelist.filter(item => item.filename !== body.filename)
        res.send({ status: 200, message: `${body.filename}文件合并成功`, now: (body.index + 1), total: body.total, filename: body.filename })
      }
      else {
        res.send({ status: 201, message: '文件上传中', now: (body.index + 1), total: body.total, filename: body.filename })
      }


    } catch (error) {
      console.error('创建文件夹失败：', error);
    }

  }
  @Post('filetree')
  async getfiletree(@Body() body: any, @Res() res: Response) {

    // async function buildTree(dir) {
    //   const isDirectory = (source) => fs.lstatSync(source).isDirectory();
    //   const files = fs.readdirSync(dir);
    //   const tree = files.map(async file => {
    //     const fullPath = path.join(dir, file);
    //     const item:any = { name: file };
    //     if (isDirectory(fullPath)) {
    //       item.childrens = await buildTree(fullPath);
    //     }
    //     return item;
    //   });
    //   return tree;
    // }
    async function buildTree(dir) {
      const isDirectory = (source) => fs.lstatSync(source).isDirectory();
      const files = fs.readdirSync(dir);
      const treePromises = files.map(async file => {
        const fullPath = path.join(dir, file);
        const stats = fs.lstatSync(fullPath);
        let aftersize = '未知'
        if (stats.size < 1024) {
          aftersize = stats.size + 'B'
        }
        else if (stats.size < 1024 * 1024) {
          aftersize = (stats.size / 1024).toFixed(1) + 'KB'
        }
        else if (stats.size < 1024 * 1024 * 1024) {
          aftersize = (stats.size / 1024 / 1024).toFixed(1) + 'MB'
        }
        else {
          aftersize = (stats.size / 1024 / 1024 / 1024).toFixed(1) + 'GB'
        }

        const date = new Date(stats.mtime.toString());

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1，并补零
        const day = String(date.getDate()).padStart(2, '0'); // 补零
        const hours = String(date.getHours()).padStart(2, '0'); // 补零
        const minutes = String(date.getMinutes()).padStart(2, '0'); // 补零
        const seconds = String(date.getSeconds()).padStart(2, '0'); // 补零

        const aftertile = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        const item: any = {
          title: file,
          key: fullPath,
          attr: isDirectory(fullPath) ? '文件夹' : fullPath.split('.')[fullPath.split('.').length - 1],
          size: aftersize,
          mtime: aftertile,
          size2: stats.size
        };
        if (isDirectory(fullPath)) {
          item.childrens = await buildTree(fullPath);
        }
        return item;
      });
      return Promise.all(treePromises);
    }
    // 使用示例
    // (async () => {
    let directory = join(__dirname, '../../../files'); // 替换为你要遍历的文件夹路径

    directory = join(directory, body.userid)

    directory = join(directory, body.path)
    const tree = await buildTree(directory);
    // console.log(tree, directory); // 输出JSON格式的树结构
    res.send({
      status: 200,
      message: 'get filetree success',
      data: tree
    })
    // })();

  }
  @Post('deletefile')
  async deletefile(@Body() body: any, @Res() res: Response) {
    try {
      let path2 = join(__dirname, '../../../files')
      path2 = join(path2, body.userid)
      path2 = join(path2, body.path)

      fs.unlinkSync(path2)

      res.send({ status: 200, message: '删除成功' })
    } catch (error) {
      let path2 = join(__dirname, '../../../files')
      path2 = join(path2, body.userid)
      path2 = join(path2, body.path)
      fs.remove(path2)
      res.send({ status: 200, message: '删除成功' })
      console.error('失败：', error);

    }

  }


  @Get('dlfile2')
  async downloadFile2(@Res() res: Response) {
    const url = join(__dirname, '../../../files/1738645510745.png');
    await res.download(url, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).send('File download failed');
      }
    })


  }
  @Get('dlfile')
  async downloadFile(@Query('filename') filename: string, @Res() res: Response) {
    const tarStream = new zip.Stream()

    const url = join(__dirname, '../../../files', filename);

    try {
      await tarStream.addEntry(url)
    }
    catch (err) {
      console.error('Error adding file to tar stream:', err);
      res.status(500).send('File download failed');
      return
    }
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', 'attachment; filename=myfile.zip')
    tarStream.pipe(res)
  }
  @Post()
  create(@Body() createUploadDto: CreateUploadDto) {
    return this.uploadService.create(createUploadDto);
  }

  @Get()
  findAll() {
    return this.uploadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return 123;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUploadDto: UpdateUploadDto) {
    return this.uploadService.update(+id, updateUploadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadService.remove(+id);
  }
}
