import { Module } from '@nestjs/common';
import { DownloadService } from './download.service';
import { DownloadController } from './download.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DHistory } from './entities/download.entity';
@Module({
    imports: [TypeOrmModule.forFeature([DHistory])],
  controllers: [DownloadController],
  providers: [DownloadService],
})
export class DownloadModule {}
