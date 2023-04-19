import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookie = createParamDecorator(
  (value: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.cookies[value];
  },
);
