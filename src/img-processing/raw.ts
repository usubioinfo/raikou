import { Request, Response } from 'express';
import sharp from 'sharp';

import { Logger } from '@util/logger';

export const processRawImg = async (req: Request, res: Response) => {
  console.log(`${process.env.IMG_PATH}/${req.params.imgName}`);
  const height: number = parseInt(req.query.h as string);
  const width: number = parseInt(req.query.w as string);

  let center: string | null = req.query.c as string | null;
  const centerValues = ['t', 'r', 'l', 'b', 'c'];
  type Dict = { [key: string]: string}
  const centerValueMap: Dict = {
    't': 'top',
    'b': 'bottom',
    'l': 'left',
    'r': 'right',
    'c': 'centre' // British people, amiright?
  }

  if (center && !centerValues.includes(center)) {
    center = 'c';
  }

  let resizeObject: {height?: number, width?: number, position?: string} = {};

  if (height) {
    resizeObject['height'] = height;
  }

  if (width) {
    resizeObject['width'] = width;
  }

  if (center && centerValues.includes(center)) {
    resizeObject['position'] = centerValueMap[center];
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
