import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface AuthenticatedClient {
  id: string;
  email: string;
}

/** Extracts the authenticated Client (SaaS tenant) attached by JwtAuthGuard. */
export const CurrentClient = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthenticatedClient => {
  const request = ctx.switchToHttp().getRequest<Request & { user: AuthenticatedClient }>();
  return request.user;
});
