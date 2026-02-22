import { User } from '../../user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Exclude, Expose, Type } from 'class-transformer';
import { Comment } from '../../comment/entities/comment.entity';

@Exclude()
@Entity()
export class Exhibit {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column()
  image: string;

  @Expose()
  @Column()
  description: string;

  @Expose()
  commentCount?: number;

  @Expose()
  @Type(() => User)
  @ManyToOne(() => User, (user) => user.exhibits)
  user: User;

  @Expose()
  @Type(() => Comment)
  @OneToMany(() => Comment, (comment) => comment.exhibit)
  comments: Comment[];
}
