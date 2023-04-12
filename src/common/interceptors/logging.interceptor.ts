import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>();
        const delay = Date.now() - now;
        this.logger.log(
          `${req.method} request to ${req.originalUrl} with response ${response.statusCode} - ${delay}ms`,
        );
      }),
      catchError((error) => {
        const response = context.switchToHttp().getResponse<Response>();
        const delay = Date.now() - now;
        this.logger.error(
          `${req.method} request to ${req.originalUrl} with response ${response.statusCode} - ${delay}ms`,
        );
        return throwError(error);
      }),
    );
  }
}
