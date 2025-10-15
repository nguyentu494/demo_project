import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  RevokeTokenCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from '@nestjs/config';

import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot.dto';
import { ConfirmForgotDto } from './dto/confirm-forgot.dto';
import { HasTokenGuard } from './guard/jwt-auth.guard';
import { CognitoHashService } from 'src/common/utils/cognitoHash';

@Injectable()
export class AuthService {
  private cognito: CognitoIdentityProviderClient;
  private clientId: string;
  private clientSecret: string;
  constructor(
    private readonly config: ConfigService,
    private readonly hashService: CognitoHashService,
  ) {
    this.cognito = new CognitoIdentityProviderClient({
      region: this.config.get('COGNITO_REGION') || 'us-east-1',
    });
    this.clientId = this.config.get('COGNITO_CLIENT_ID') || '';
    this.clientSecret = this.config.get('COGNITO_CLIENT_SECRET') || '';
  }

  async register(dto: CreateAuthDto) {
    const { username, password, email } = dto;

    try {
      const cmd = new SignUpCommand({
        ClientId: this.clientId,
        Username: username,
        Password: password,
        SecretHash: this.hashService.generateSecretHash(username),
        UserAttributes: [{ Name: 'email', Value: email }],
      });

      const res = await this.cognito.send(cmd);
      return { message: 'User registered', data: res };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async login(dto: LoginAuthDto) {
    const { username, password } = dto;

    try {
      const cmd = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: this.clientId,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
          SECRET_HASH: this.hashService.generateSecretHash(username),
        },
      });

      const res = await this.cognito.send(cmd);

      return {
        message: 'Login successful',
        accessToken: res.AuthenticationResult?.AccessToken,
        refreshToken: res.AuthenticationResult?.RefreshToken,
        idToken: res.AuthenticationResult?.IdToken,
      };
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    try {
      const cmd = new ForgotPasswordCommand({
        ClientId: this.clientId,
        Username: dto.username,
        SecretHash: this.hashService.generateSecretHash(dto.username),
      });

      const res = await this.cognito.send(cmd);
      return { message: 'OTP sent to user', data: res };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async confirmForgot(dto: ConfirmForgotDto) {
    try {
      const cmd = new ConfirmForgotPasswordCommand({
        ClientId: this.clientId,
        Username: dto.username,
        ConfirmationCode: dto.code,
        Password: dto.newPassword,
        SecretHash: this.hashService.generateSecretHash(dto.username),
      });

      const res = await this.cognito.send(cmd);
      return { message: 'Password reset successful', data: res };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async logout(refreshToken: string) {
    try {
      const cmd = new RevokeTokenCommand({
        ClientId: this.clientId,
        Token: refreshToken,
        ClientSecret: this.clientSecret,
      });

      await this.cognito.send(cmd);
      return true;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @UseGuards(HasTokenGuard)
  async checkMe() {
    return { authenticated: true };
  }

  async verify(code: string) {
    return { message: `Verified code ${code}` };
  }

  async signMessage(address: string, signature: string) {
    return { address, verified: true };
  }

  async confirmOtp(username: string, code: string) {
    try {
      const cmd = new ConfirmSignUpCommand({
        ClientId: this.clientId,
        ConfirmationCode: code,
        SecretHash: this.hashService.generateSecretHash(username),
        Username: username,
      });

      const res = await this.cognito.send(cmd);
      return {
        success: true,
        message: 'Xác minh thành công! Bạn có thể đăng nhập ngay.',
        data: res,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async resendOtp(username: string) {
    try {
      const cmd = new ResendConfirmationCodeCommand({
        ClientId: this.clientId,
        SecretHash: this.hashService.generateSecretHash(username),
        Username: username,
      });

      const res = await this.cognito.send(cmd);
      return {
        success: true,
        message:
          'Mã xác minh mới đã được gửi lại. Vui lòng kiểm tra email hoặc SMS của bạn.',
        data: {
          destination: res.CodeDeliveryDetails?.Destination,
          deliveryMedium: res.CodeDeliveryDetails?.DeliveryMedium,
        },
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
