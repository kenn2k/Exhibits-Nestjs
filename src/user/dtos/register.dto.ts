import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Username', description: 'Unique username' })
  @MinLength(2, { message: 'Minimum 2 characters' })
  username: string;

  @ApiProperty({ example: 'Password#', description: 'Minimum 8 characters' })
  @MinLength(8, { message: 'Minimum 8 characters' })
  password: string;
}
