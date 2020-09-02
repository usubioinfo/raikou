import { Sharp } from 'sharp';
import { Request } from 'express';
import { validateDimensions } from '@validate/dimensions.validate';

const centerValues = ['t', 'r', 'l', 'b', 'c'];
type Dict = { [key: string]: string};
const centerValueMap: Dict = {
  't': 'top',
  'b': 'bottom',
  'l': 'left',
  'r': 'right',
  'c': 'centre'
}

// For now, input validation is done here
export const resizeImageAspect = async (image: Sharp, req: Request): Promise<Sharp | null> => {
  const anchor: string | null = req.query.a as string | null;
  let center: string | null = req.query.c as string | null;

  if (center && !centerValues.includes(center)) {
    center = 'c';
  }

  if (!validateDimensions(req.query.w as string | null, req.query.h as string | null)) {
    console.log(404);
    return null;
  }

  const heightConstant: number = parseInt(req.query.h as string);
  const widthConstant: number = parseInt(req.query.w as string);

  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    return null;
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

  return image.resize(resizeObject);
}

/*
export const resizeImageRaw = (image: Sharp, req: Request): Sharp => {

}
*/
