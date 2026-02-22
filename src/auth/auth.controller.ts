import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { IUser } from './types';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';

interface RequestWithUser extends ExpressRequest {
  user: IUser;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /* Login user */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Login user and receiving JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description:
      'The user has successfully logged in, receiving a JWT token and username.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  loginUser(@Request() req: RequestWithUser) {
    return this.authService.loginUser(req.user);
  }
}
