import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CartId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.cookies['bc_cartId'] || request.query.cartId;
  },
);
