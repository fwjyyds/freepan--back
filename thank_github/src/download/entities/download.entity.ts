import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// 建立一个实体映射到数据库表
@Entity('dhistory')
export class DHistory {
  @PrimaryGeneratedColumn()
  did: number;
  @Column()
  userid: number;
  @Column()
  attr: number;
  @Column({ length: 8888 })
  array: string;
}