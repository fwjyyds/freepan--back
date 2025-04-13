import { Injectable } from '@nestjs/common';
import { CreateDownloadDto } from './dto/create-download.dto';
import { UpdateDownloadDto } from './dto/update-download.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DHistory } from './entities/download.entity';
import { Repository } from 'typeorm';
import { Body } from '@nestjs/common';
@Injectable()
export class DownloadService {
    constructor(
      @InjectRepository(DHistory)
      private readonly DHistoryRepository: Repository<DHistory>,
    ) {}

  // create(createDownloadDto: CreateDownloadDto) {
  //   return 'This action adds a new download';
  // }

  // findAll() {
  //   return `This action returns all download`;
  // }

  async findUpload(userid: number) {
    
    const attr0Promise = this.DHistoryRepository.find({ where: { userid:userid, attr: 0 } });
    const attr1Promise = this.DHistoryRepository.find({ where: { userid:userid, attr: 1 } });
  
    const [attr0Results, attr1Results] = await Promise.all([attr0Promise, attr1Promise]);
  console .log('userid',userid)
    // 合并结果
    return [...attr0Results, ...attr1Results];


  } 

  async findDownload(userid: number) {
    
    const attr0Promise = this.DHistoryRepository.find({ where: { userid:userid, attr: 2 } });
    const attr1Promise = this.DHistoryRepository.find({ where: { userid:userid, attr: 3 } });
  
    const [attr0Results, attr1Results] = await Promise.all([attr0Promise, attr1Promise]);
  
    // 合并结果
    return [...attr0Results, ...attr1Results];


  } 

  async updateupload(userid: number, s1: any, s2: any) {
    // const attr0Promise = this.DHistoryRepository.find({ where: { userid, attr: 0 } });
    // const attr1Promise = this.DHistoryRepository.find({ where: { userid, attr: 1 } });
    // const [attr0Results, attr1Results] = await Promise.all([attr0Promise, attr1Promise]);
    // 更新 attr 为 0 的记录
    await this.DHistoryRepository.update({ userid:userid, attr: 0} , {array:JSON.stringify(s1)      });
    // 更新 attr 为 1 的记录
    await this.DHistoryRepository.update( {  userid:userid, attr: 1 } ,{array:JSON.stringify(s2)  });

    // // 假设 s1 和 s2 是你需要合并的对象属性
    // const updatedAttr0Results = attr0Results.map((result) => this.DHistoryRepository.merge(result, s1));
    // const updatedAttr1Results = attr1Results.map((result) => this.DHistoryRepository.merge(result, s2));

    // // 如果 merge 方法会自动保存，这里可以忽略。如果没有自动保存，可能需要调用 save 方法
    // await this.DHistoryRepository.save(updatedAttr0Results);
    // await this.DHistoryRepository.save(updatedAttr1Results);

    const a = this.DHistoryRepository.find({ where: { userid, attr: 0 } });
    const b = this.DHistoryRepository.find({ where: { userid, attr: 1 } });
  
    const [c, d] = await Promise.all([a, b]);
  
    // 合并结果
    return [...c,...d];
}

async updatedownload(userid: number, s1: any, s2: any) {
  // const attr0Promise = this.DHistoryRepository.find({ where: { userid, attr: 2 } });
  // const attr1Promise = this.DHistoryRepository.find({ where: { userid, attr: 3 } });
  // const [attr0Results, attr1Results] = await Promise.all([attr0Promise, attr1Promise]);

  // // 假设 s1 和 s2 是你需要合并的对象属性
  // const updatedAttr0Results = attr0Results.map((result) => this.DHistoryRepository.merge(result, s1));
  // const updatedAttr1Results = attr1Results.map((result) => this.DHistoryRepository.merge(result, s2));

  // // 如果 merge 方法会自动保存，这里可以忽略。如果没有自动保存，可能需要调用 save 方法
  // await this.DHistoryRepository.save(updatedAttr0Results);
  // await this.DHistoryRepository.save(updatedAttr1Results);

  await this.DHistoryRepository.update({ userid:userid, attr: 2} , {array:JSON.stringify(s1)      });
  // 更新 attr 为 1 的记录
  await this.DHistoryRepository.update( {  userid:userid, attr: 3 } ,{array:JSON.stringify(s2)  });
  const a = this.DHistoryRepository.find({ where: { userid, attr: 2 } });
  const b = this.DHistoryRepository.find({ where: { userid, attr: 3 } });

  const [c, d] = await Promise.all([a, b]);

  // 合并结果
  return [...c, ...d];
}
  // update(id: number, updateDownloadDto: UpdateDownloadDto) {
  //   return `This action updates a #${id} download`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} download`;
  // }
}
