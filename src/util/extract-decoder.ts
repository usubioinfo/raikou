import { Region } from 'sharp';

enum DirEnum {
  'l' = 'left',
  'r' = 'width',
  't' = 'top',
  'b' = 'height'
}

enum DirEnumR {
  'left' = 'l',
  'width' = 'r',
  'top' = 't',
  'height' = 'b'
}

type Dict = Partial<Record<DirEnumR, string>>;
const extractMap: Dict = {
  'l': 'left',
  'r': 'width',
  't': 'top',
  'b': 'height'
};


const legalChars = ['l', 'r', 't', 'b'];

// Someone save me from the hell that is input validation
export const decodeExtractLang = (height: number, width: number, code: string): Region | null => {
  let aspects = code.split('-');

  if (!legalChars.includes(aspects[0][0]) || aspects[0].length < 2) {
    return null;
  }

  const aspect1 = parseInt(aspects[0].substring(1));

  const extractOptions = {left: 0, width: width - aspect1, height: height, top: 0};

  if (!aspect1) {
    return  null;
  }

  extractOptions['left'] = aspect1;

  return extractOptions;
}
