import { Controller } from '@nestjs/common';
import { ExhibitService } from './exhibit.service';

@Controller('exhibit')
export class ExhibitController {
  constructor(private readonly exhibitService: ExhibitService) {}
}
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
}
