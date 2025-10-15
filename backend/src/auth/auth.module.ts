import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { CognitoHashService } from 'src/common/utils/cognitoHash';

@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, CognitoHashService],
  exports: [AuthService, CognitoHashService],
})
export class AuthModule {}
