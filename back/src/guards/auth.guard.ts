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
    console.log('Token:', token);
    if (!token) {
      throw new ForbiddenException('Token not found');
    }

    try {
      console.log('llego hasta acá');

      const secret = process.env.JWT_SECRET;
      console.log('llego hasta acá 2');
      const payload = this.jwtService.verify(token, { secret });
      console.log('llego hasta acá 3');

      request.user = payload;
      return payload;
    } catch (error) {
      throw new ForbiddenException('Invalid token');
    }
  }
}
