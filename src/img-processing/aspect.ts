import { Request, Response } from 'express';
import sharp from 'sharp';

import { Logger } from '@util/logger';
import { validateDimensions } from '@validate/dimensions.validate';

export const processAspectImg = async (req: Request, res: Response) => {
  const anchor: string | null = req.query.a as string | null;
  // Possible values of t, r, l, or b (top, right, left, or bottom).
  const center: string | null = req.query.c as string | null;
  const centerValues = ['t', 'r', 'l', 'b'];
  type Dict = { [key: string]: string}
  const centerValueMap: Dict = {
    't': 'top',
    'b': 'bottom',
    'l': 'left',
    'r': 'right'
  }

  if (center && !centerValues.includes(center)) {
    console.log(404);
    return res.sendFile(`${process.env.IMG_PATH}/${process.env.IMG404}`);
  }

  if (!validateDimensions(req.query.w as string | null, req.query.h as string | null)) {
    console.log(404);
    return res.sendFile(`${process.env.IMG_PATH}/${process.env.IMG404}`);
  }

  const heightConstant: number = parseInt(req.query.h as string);
  const widthConstant: number = parseInt(req.query.w as string);

  const image = sharp(`${process.env.IMG_PATH}/${req.params.imgName}`);

  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    return res.status(404);
  }

  let resizeObject = {
    width: metadata.width,
    height: metadata.height,
    position: center ? centerValueMap[center] as string : 'centre'
  }

  if (anchor && anchor === 'height') {
    resizeObject.width = Math.ceil((resizeObject.height / heightConstant) * widthConstant);
  }

  if (anchor && anchor === 'width') {
    resizeObject.height = Math.ceil((resizeObject.width / widthConstant) * heightConstant);
  }

  if (metadata.width >= metadata.height) {
    resizeObject.height = Math.ceil((resizeObject.width / widthConstant) * heightConstant);
  } else if (metadata.height >= metadata.width) {
    resizeObject.width = Math.ceil((resizeObject.height / heightConstant) * widthConstant);
  }

  return image
    .resize(resizeObject)
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
