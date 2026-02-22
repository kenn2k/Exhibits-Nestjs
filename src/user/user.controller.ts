import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dtos/register.dto';
import {
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

/* Create a new user */
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create a new user.' })
  @ApiResponse({
    status: 201,
    description: 'The user have successfully registered.',
  })
  @ApiConflictResponse({ description: 'This username already exists.' })
  register(@Body() data: RegisterDto) {
    return this.userService.registerUser(data);
  }
}
