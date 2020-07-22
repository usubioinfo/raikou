import { Request, Response } from 'express';
import sharp from 'sharp';

import { Logger } from '@util/logger';

export const processRawImg = async (req: Request, res: Response) => {
  console.log(`${process.env.IMG_PATH}/${req.params.imgName}`);
  const height: number = parseInt(req.query.h as string);
  const width: number = parseInt(req.query.w as string);

  let resizeObject: {height?: number, width?: number} = {};

  if (height) {
    resizeObject['height'] = height;
  }

  if (width) {
    resizeObject['width'] = width;
  }

  sharp(`${process.env.IMG_PATH}/${req.params.imgName}`)
    .resize(resizeObject)
    .toBuffer()
    .then((data: any) => {
      res.writeHead(200, {'Content-Type': 'image/png'});
      res.end(data);
    }).catch((err: any) => {
      Logger.error(`${err} | ${req.get('host')} | ${req.params.imgName}`);
      res.send('');
    });
}
