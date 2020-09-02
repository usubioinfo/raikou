// The file is called extract, but the effect is the same as cropping
import { Sharp } from 'sharp';
import { Request } from 'express';

import { decodeExtractLang } from '@util/extract-decoder';

export const extractImage = async (image: Sharp, req: Request): Promise<Sharp | null> => {
  const { data, info } = await image.toBuffer({resolveWithObject: true});

  if (!info.width || !info.height) {
    console.log('Metadata got screwed up');
    return null;
  }

  if (!req.query.e) {
    console.log(`There's no e bruh`);
    return null;
  }

  console.log(`${info.height}, ${info.width}`);

  const extractOptions = decodeExtractLang(info.height, info.width, req.query.e as string);

  if (!extractOptions) {
    console.log('Failed to decode extract options');
    return null;
  }

  return image.extract(extractOptions);
}
