import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'What a nice photo!',
    maxLength: 2000,
  })
  @MaxLength(2000, { message: 'Maximum 2000 characters' })
  @IsString()
  text: string;
}
