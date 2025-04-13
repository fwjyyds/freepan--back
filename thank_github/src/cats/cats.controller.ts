import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Request } from 'express';
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}
  @Post('/create')
  create(@Body() createCatDto: CreateCatDto) {
    console.log(createCatDto);
    return this.catsService.create(createCatDto);
  }
}
