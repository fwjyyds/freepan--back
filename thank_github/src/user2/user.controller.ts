import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, Req, Res, Session
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as svgCaptcha from 'svg-captcha';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

import * as jwt from 'jsonwebtoken';

import * as CryptoJS from 'crypto-js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('getusers')
  async getusers(@Req() req, @Res() res) {
    const users = await this.userService.findAll();
    res.send({
      status: 200,
      message: 'get users success',
      data: users
    })
  }
  @Get('create')
  createsvg(@Req() req, @Res() res, @Session() session) {

    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 150,
      height: 60,
      background: '#f0f0f0',
    });
            console.log('当前的验证码',captcha.text)
    session.code = captcha.text;
    res.type('image/svg+xml');
    res.send(captcha.data);
  }

  @Post('login')
  async login(@Req() req, @Body() body, @Session() session) {
      // AES-GCM加密函数
      async function encrypt(key, data, iv) {
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(data);
  
        const encryptedData = await crypto.subtle.encrypt(
          {
            name: "AES-GCM",
            iv: iv
          },
          key,
          encodedData
        );
  
        // 将ArrayBuffer转换为Base64字符串以便存储或传输
        return {
          iv: btoa(String.fromCharCode(...new Uint8Array(iv))),
          data: btoa(String.fromCharCode(...new Uint8Array(encryptedData)))
        };
      }
  
      // AES-GCM解密函数
      async function decrypt(key, encrypted) {
        const decoder = new TextDecoder();
        const ivBuffer = Uint8Array.from(atob(encrypted.iv), c => c.charCodeAt(0));
        const encryptedBuffer = Uint8Array.from(atob(encrypted.data), c => c.charCodeAt(0));
  
        const decryptedData = await crypto.subtle.decrypt(
          {
            name: "AES-GCM",
            iv: ivBuffer
          },
          key,
          encryptedBuffer
        );
  
        // 将解密后的ArrayBuffer转换回字符串
        return decoder.decode(decryptedData);
      }
  
      // 生成AES密钥的函数
      async function generateKey() {
        return await crypto.subtle.generateKey(
          {
            name: "AES-GCM",
            length: 256,
          },
          true,
          ["encrypt", "decrypt"]
        );
      }
  // 导出AES密钥为JWK格式的函数
async function exportKey(key) {
  return await crypto.subtle.exportKey('jwk', key);
}
async function jwkToCryptoKey(jwk) {
  return await crypto.subtle.importKey(
    "jwk", // 导入格式
    jwk,   // JWK对象
    {
      name: "AES-GCM",
      length: 256, // 密钥长度
    },
    true,  // 是否可以导出密钥
    ["encrypt", "decrypt"] // 密钥用法
  );
}

      // 使用示例
      // (async () => {
      //   const key = await generateKey();
      //   const data = "Hello, World!";
      //   const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM需要一个12字节的IV
  
      //   const encrypted = await encrypt(key, data, iv);
      //   console.log("Encrypted:", encrypted,key);
  
      //   const decrypted = await decrypt(key, encrypted);
      //   console.log("Decrypted:", decrypted);
      // })();
console.log('body and session',body.code,session.code)
    if (body.code === session.code) {
      //数据库判断
      const response = await this.userService.findOne(body.username).then(async res => {
        if (res === null) {
          return {
            status: 400,
            message: '该账户不存在'
          }
        }
        else if (res?.password === body.password) {
          session.user = { userid:res.id,accout: res.account, nickname: res.nickname, face: res.face, isvip: res.isvip }
          const key = await generateKey();
          const data = JSON.stringify(session.user);
          const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM需要一个12字节的IV
          const exportedKey = await exportKey(key);
          const encrypted = await encrypt(key, data, iv);
      
          return {
            status: 200,
            message: '登陆成功',
            info: {
            key:exportedKey,
            encrypted:encrypted
            }
          }

        }
        else {
          return {
            status: 400,
            message: '密码错误'
          }
        }
      });
      return response;
    } else {
      return {
        status: 400,
        message: '验证码错误'
      }
    }
  }
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
