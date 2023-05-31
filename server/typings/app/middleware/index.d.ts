// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportErrorHandler = require('../../../app/middleware/error_handler');

declare module 'egg' {
  interface IMiddleware {
    errorHandler: typeof ExportErrorHandler;
  }
}
