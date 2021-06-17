import { Request, Response } from 'express';
import fs from 'fs/promises';

export const getFilesInDir = async (req: Request, res: Response) => {

  const basePath = process.env.IMG_PATH as string;

  const filePath = `${basePath}/${req.params.filePath}`;

  let results: string[] = [];

  try {
    results = await fs.readdir(filePath);
  } catch (e) {
    return res.json({success: false});
  }

  let files: any[] = [];

  for (let file of results) {
    const stat = await fs.lstat(`${filePath}/${file}`);

    if (stat.isFile()) {
      files.push({filePath: `/image/${req.params.filePath}/${file}`.replace(/\/\//, '/'), type: 'file', name: file});
    } else if (stat.isDirectory()) {
      files.push({filePath: `/dir/${req.params.filePath}/${file}`.replace(/\/\//, '/'), type: 'directory', name: file})
    } else {
      console.log('error');
    }
  }

  console.log(results);

  return res.json({success: true, results: files});
}
