import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'Username', description: 'Unique username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'Password#', description: 'Minimum 8 characters' })
  @IsString()
  password: string;
}
