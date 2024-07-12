import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/enum/role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
        context.getHandler(),
        context.getClass(),
      ]);

      const request = context.switchToHttp().getRequest();

      const user = request.user;

      const hasRole = () =>
        requiredRoles.some((role) => user.role?.includes(role));

      const valid: boolean = user && user.role && hasRole();

      if (!valid) throw new ForbiddenException('Unauthorized');

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new error();
    }
  }
}
