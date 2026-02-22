import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class CreateExhibitDto {
  @ApiProperty({
    example: 'What a beautiful sky!',
    description: 'Maximum 250 characters',
    maxLength: 250,
  })
  @MaxLength(250, { message: 'Maximum 250 characters' })
  description: string;
}
