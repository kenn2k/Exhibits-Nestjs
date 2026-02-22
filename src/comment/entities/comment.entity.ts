import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Exclude, Expose, Type } from 'class-transformer';
import { Exhibit } from '../../exhibit/entities/exhibit.entity';
import { User } from '../../user/entities/user.entity';

@Exclude()
@Entity()
export class Comment {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column()
  text: string;

  @Expose()
  @Type(() => User)
  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @Expose()
  @Type(() => Exhibit)
  @ManyToOne(() => Exhibit, (exhibit) => exhibit.comments)
  exhibit: Exhibit;
}
