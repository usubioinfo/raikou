// tslint:disable-next-line
require('tsconfig-paths/register');

import dotenv from 'dotenv';
import https from 'https';

import { Request, Response } from 'express';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import sharp from 'sharp';

dotenv.config();
require('dotenv-defaults/config');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(helmet());

const apiPrefix = process.env.API_PREFIX;

app.get(`${apiPrefix}/image/:imgName([^/]+/[^/]+)`, (req: Request, res: Response) => {
  const height: number = parseInt(req.query.height as string);
  const width: number = parseInt(req.query.width as string);

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
      console.log(err);
      res.send('');
    });
});

app.listen(process.env.PORT, () => {
  console.log('\nRaikou started in mode \'' + process.env.NODE_ENV + '\'');
  console.log('TLS/HTTPS is off.');
  console.log('Port: ' + process.env.PORT);
});
