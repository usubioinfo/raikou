import cluster from 'cluster';
require('dotenv-defaults/config');

const MAX_WORKERS = parseInt(process.env.MAX_WORKERS as string) || 4;
console.log(`Max Workers: ${MAX_WORKERS}`);

export const forkProcesses = (PORT: number) => {

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

  }

}
