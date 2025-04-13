import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// 建立一个实体映射到数据库表
@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 15})
  account: string;
  @Column({ length: 30 })
  password: string  ;
  @Column({ length: 15})
  nickname: string;
  @Column({ length: 255 })
  face: string;
  @Column() //length for  string
  isvip:number;
}

 

