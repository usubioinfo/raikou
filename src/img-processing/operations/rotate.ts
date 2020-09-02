import { Sharp } from 'sharp';
import { Request } from 'express';

export const rotateImg = async (image: Sharp, req: Request): Promise<Sharp | null> => {
  const degrees: string | null = req.query.ro as string | null;

  if (!degrees || !parseInt(degrees)) {
    return null;
  }

  const degreesInt = parseInt(degrees);

  return image.rotate(degreesInt);
}
