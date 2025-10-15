import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot.dto';
import { ConfirmForgotDto } from './dto/confirm-forgot.dto';
import { VerifySignatureDto } from './dto/verify-signature.dto';
import { ConfirmOtpDto } from './dto/confirm-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { HasTokenGuard } from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createAuthDto: CreateAuthDto) {
    try {
      const result = await this.authService.register(createAuthDto);
      return {
        success: true,
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('login')
  async login(
    @Body() loginAuthDto: LoginAuthDto,
  ) {
    try {
      const result = await this.authService.login(loginAuthDto);

      return {
        success: true,
        message: result.message,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      const result = await this.authService.forgotPassword(forgotPasswordDto);
      return {
        success: true,
        message: result.message,
        codeDeliveryDetails: result.data.CodeDeliveryDetails,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('confirm-forgot')
  async confirmForgot(@Body() confirmForgotDto: ConfirmForgotDto) {
    try {
      const result = await this.authService.confirmForgot(confirmForgotDto);
      return {
        success: true,
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('log-out')
  async logout(
   @Body() body: {refreshToken: string}
  ) {
    try {
      const refreshToken = body.refreshToken;

      if (!refreshToken) {
        return {
          success: false,
          error: 'Missing refresh token',
        };
      }

      await this.authService.logout(refreshToken);

      return {
        success: true,
        code: 200,
        message: 'Logged out successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('check-me')
  @UseGuards(HasTokenGuard)
  async checkMe() {
    try {
      await this.authService.checkMe();
      return {
        authenticated: true,
      };
    } catch (error) {
      return {
        authenticated: false,
        error: error.message,
      };
    }
  }

  @Post('verify')
  async verify(@Body() verifySignatureDto: VerifySignatureDto) {
    try {
      const { address, message, signature } = verifySignatureDto;
      // This would typically verify the signature
      const result = await this.authService.signMessage(address, signature);
      return {
        verified: result.verified,
      };
    } catch (error) {
      return {
        verified: false,
        error: error.message,
      };
    }
  }

  @Get('sign-message')
  async signMessage() {
    try {
      // Generate a random message for wallet signing
      const nonce = Math.random().toString(36).substring(2, 15);
      const timestamp = Date.now();
      const message = `Sign this message to authenticate: ${nonce}-${timestamp}`;

      return {
        success: true,
        data: {
          message,
          nonce,
          timestamp,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('confirm-otp')
  async confirmOtp(@Body() confirmOtpDto: ConfirmOtpDto) {
    try {
      const result = await this.authService.confirmOtp(
        confirmOtpDto.username,
        confirmOtpDto.code,
      );
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('resend-otp')
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    try {
      const result = await this.authService.resendOtp(resendOtpDto.username);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
