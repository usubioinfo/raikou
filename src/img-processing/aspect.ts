import { Request, Response } from 'express';
import sharp from 'sharp';

import { Logger } from '@util/logger';
import { resizeImageAspect } from '@img-processing/operations/resize';
import { extractImage } from '@img-processing/operations/extract';

export const processAspectImg = async (req: Request, res: Response) => {
  let image = sharp(`${process.env.IMG_PATH}/${req.params.imgName}`);

  const resizeOp = await resizeImageAspect(image, req);

  if (!resizeOp) {
    return res.sendFile(`${process.env.IMG_PATH}/${process.env.IMG404}`);
  }

  image = resizeOp;

  const extractOp = await extractImage(image, req);

  if (extractOp) {
    image = extractOp;
  }

  if (!extractOp) {
    console.log('What happened?');
  }

  return image
    .sharpen()
    .toBuffer()
    .then((data: Buffer) => {
      res.writeHead(200, {'Content-Type': 'image/png'});
      return res.end(data);
    }).catch((err: any) => {
      Logger.error(`${err} | ${req.get('host')} | ${req.params.imgName}`);
      return res.send('');
    });
}
