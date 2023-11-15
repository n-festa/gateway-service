import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorator/roles.decorator';
import { Role } from 'src/enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles =
      this.reflector.getAllAndMerge<Role[]>(ROLES_KEY, [
        context.getClass(),
        context.getHandler(),
      ]) || [];

    if (requiredRoles && requiredRoles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('user', user);

    if (user && !user.permissions) {
      return false;
    }
    const hasRole = () =>
      user.permissions
        ?.split(',')
        .some((role: string) => requiredRoles.find((i) => i === role));

    return user && user.permissions && hasRole();
  }
}
