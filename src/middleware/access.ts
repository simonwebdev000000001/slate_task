import {Injectable, NestMiddleware, MiddlewareFunction} from '@nestjs/common';

@Injectable()
export class AccessMiddleware implements NestMiddleware {
    resolve(...args: any[]): MiddlewareFunction {
        return (req, res, next) => {
            res.cookie('USER_ID','test', { maxAge: 900000, httpOnly: true });
            next();
        };
    }
}