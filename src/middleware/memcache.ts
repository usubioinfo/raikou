import memcache from 'memory-cache';
import { Request, Response, NextFunction } from 'express';

const cache = (duration: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = '__express__' + req.originalUrl || req.url;
    const cachedBody = memcache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    }

    
  }
}
