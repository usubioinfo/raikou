// tslint:disable-next-line
require('tsconfig-paths/register');

import dotenv from 'dotenv';

import { Request, Response } from 'express';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import sharp from 'sharp';

import { processRawImg } from '@img-processing/raw';
import { processAspectImg } from '@img-processing/aspect';

dotenv.config();
require('dotenv-defaults/config');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(helmet());

const apiPrefix = process.env.API_PREFIX;

// a = anchor, w = width, h = height

app.get(`${apiPrefix}/image/aspect/:imgName(*)`, processAspectImg);

app.get(`${apiPrefix}/image/raw/:imgName(*)`, processRawImg);

app.listen(process.env.PORT, () => {
  console.log('\nRaikou started in mode \'' + process.env.NODE_ENV + '\'');
  console.log('TLS/HTTPS is off.');
  console.log('Port: ' + process.env.PORT);
});
