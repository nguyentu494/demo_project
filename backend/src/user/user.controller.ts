import { UserService } from './user.service';
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { HasTokenGuard } from '../auth/guard/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  @UseGuards(HasTokenGuard)
  async getUser(@Req() request: Request) {
    try {
      const accessToken = request.headers['authorization']?.split(' ')[1];
      if (!accessToken) {
        return {
          success: false,
          error: 'Access token missing',
        };
      }

      const user = await this.userService.getUser(accessToken);
      
      if(!user)
        return {
          success: false,
          error: 'Not find user'
        }
      return {
        success: true,
        data: user
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
