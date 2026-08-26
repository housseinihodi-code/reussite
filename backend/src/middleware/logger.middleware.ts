import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Request');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    res.on('finish', () => {
      this.logger.log(`${method} ${originalUrl} ${res.statusCode} — ${ip}`);
    });
    next();
  }
}
