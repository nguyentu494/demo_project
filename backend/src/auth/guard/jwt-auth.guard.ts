import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class HasTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers['authorization'];
    const token = authHeader?.replace('Bearer ', '').trim();

    if (!token) {
      throw new UnauthorizedException('Missing or empty token');
    }

    req.token = token;

    return true;
  }
}
