import { Module } from '@nestjs/common';
import { ExhibitService } from './exhibit.service';
import { ExhibitController } from './exhibit.controller';

@Module({
  controllers: [ExhibitController],
  providers: [ExhibitService],
})
export class ExhibitModule {}
