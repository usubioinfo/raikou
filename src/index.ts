// tslint:disable-next-line
require('tsconfig-paths/register');

import { Request, Response } from 'express';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import cluster from 'cluster';

import { processRawImg } from '@img-processing/raw';
import { processAspectImg } from '@img-processing/aspect';
import { getFilesInDir } from './getfolder';

require('dotenv-defaults/config');

const MAX_WORKERS = parseInt(process.env.MAX_WORKERS as string) || 4;
console.log(`Max Workers: ${MAX_WORKERS}`);

if (cluster.isMaster) {
  console.log('Setting up cluster...')

  for (let i = 0; i < MAX_WORKERS; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker: cluster.Worker) => {
    console.log(`Worker ${worker.process.pid} online`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log('\t code ' + code);
    console.log('\t signal ' + signal);
  });
} else {
  const app = express();
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(helmet());

  const apiPrefix = process.env.API_PREFIX;

  // a = anchor, w = width, h = height

  app.get(`${apiPrefix}/image/aspect/:imgName(*)`, processAspectImg);

  app.get(`${apiPrefix}/test`, getFilesInDir);
  app.get(`${apiPrefix}/dir/:imgName(*)`, getFilesInDir);

  app.get(`${apiPrefix}/image/raw/:imgName(*)`, processRawImg);

  app.get(`${apiPrefix}/image/:imgName(*)`, (req, res, next) => {
    return res.sendFile(`${process.env.IMG_PATH}/${req.params.imgName}`);
  });

  app.get(`${apiPrefix}/header-img`, (req, res, next) => {
    const date = new Date();
    if (date.getMonth() <= 1 || date.getMonth() >= 10) {
      return res.sendFile(`${process.env.IMG_PATH}/bioinfo/usuwinter.jpeg`);
    }

    return res.sendFile(`${process.env.IMG_PATH}/bioinfo/ususpring6.jpg`);
  });

  app.listen(process.env.PORT, () => {
    console.log('\nRaikou started in mode \'' + process.env.NODE_ENV + '\'');
    console.log('TLS/HTTPS is off.');
    console.log('Port: ' + process.env.PORT);
  });
}
