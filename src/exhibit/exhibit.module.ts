import { Module } from '@nestjs/common';
import { ExhibitService } from './exhibit.service';
import { ExhibitController } from './exhibit.controller';
import { Exhibit } from './entities/exhibit.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Exhibit]), UserModule],
  controllers: [ExhibitController],
  providers: [ExhibitService],
})
export class ExhibitModule {}
