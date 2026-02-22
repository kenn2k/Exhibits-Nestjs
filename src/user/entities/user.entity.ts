import { Exhibit } from '../../exhibit/entities/exhibit.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Expose()
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Exhibit, (exhibit) => exhibit.user)
  exhibits: Exhibit[];
}
