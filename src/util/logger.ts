import { createLogger, format, transports } from 'winston';

export const Logger = createLogger({
  level: 'error',
  format: format.json(),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error'})
  ]
});
