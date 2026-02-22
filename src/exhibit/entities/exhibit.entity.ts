import { User } from '../../user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Exclude, Expose, Type } from 'class-transformer';

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
  @Type(() => User)
  @ManyToOne(() => User, (user) => user.exhibits)
  user: User;
}
