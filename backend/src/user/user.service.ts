import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class UserService {
  private readonly client = new CognitoIdentityProviderClient({
    region: 'us-east-1',
  });

  async getUser(accessToken: string) {
    if (!accessToken) {
      throw new UnauthorizedException('Missing access token');
    }

    try {
      const res = await this.client.send(
        new GetUserCommand({ AccessToken: accessToken }),
      );

      const attributes: Record<string, string> = {};
      res.UserAttributes?.forEach((attr) => {
        if (attr.Name) attributes[attr.Name] = attr.Value ?? '';
      });

      return {
        username: res.Username,
        attributes,
      };
    } catch (err: any) {
      console.error('GetUser error:', err);
      throw new UnauthorizedException(err.message);
    }
  }
}
