import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class CognitoHashService {
  constructor(private readonly configService: ConfigService) {}

  generateSecretHash(username: string): string {
    const clientId = this.configService.get<string>('COGNITO_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'COGNITO_CLIENT_SECRET',
    );

    if (!clientId || !clientSecret) {
      throw new Error(
        'Missing Cognito client credentials in environment variables',
      );
    }

    const hmac = crypto.createHmac('SHA256', clientSecret);
    hmac.update(username + clientId);
    return hmac.digest('base64');
  }
}
