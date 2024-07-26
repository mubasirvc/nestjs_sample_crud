import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class EUser {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column() 
  password: string;

  @CreateDateColumn()
  createdTime: Date;
  
  @UpdateDateColumn()
  updatedTime: Date;
}
