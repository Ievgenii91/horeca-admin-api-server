import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/authz/interfaces/jwt-payload.interface';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
