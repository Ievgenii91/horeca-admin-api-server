import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export const ClientId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<Request>();
    if (req.headers['x-auth-client']) {
      return req.headers['x-auth-client'] as string;
    }
    if (req.params && req.params.clientId) {
      return req.params.clientId;
    }
    if (req.query && req.query.clientId) {
      return req.query.clientId as string;
    }
    if (req.body && req.body.clientId) {
      return req.body.clientId;
    }
    throw new BadRequestException(`set client id`);
  },
);
