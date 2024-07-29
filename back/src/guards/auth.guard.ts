import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

dotenvConfig({ path: '.env' });

@Injectable()
export class AuthGUard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new ForbiddenException('Token not found');
    }

    try {
      const secret = process.env.JWT_SECRET;
      const payload = this.jwtService.verify(token, { secret });

      request.user = payload;
      return payload;
    } catch (error) {
      throw new ForbiddenException('Invalid token');
    }
  }
}
