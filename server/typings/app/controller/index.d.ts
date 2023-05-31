// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportNavSearch = require('../../../app/controller/nav/search');
import ExportNavSite = require('../../../app/controller/nav/site');
import ExportNavSiteDic = require('../../../app/controller/nav/siteDic');
import ExportUserCheck = require('../../../app/controller/user/check');
import ExportUserLogReg = require('../../../app/controller/user/logReg');

declare module 'egg' {
  interface IController {
    nav: {
      search: ExportNavSearch;
      site: ExportNavSite;
      siteDic: ExportNavSiteDic;
    }
    user: {
      check: ExportUserCheck;
      logReg: ExportUserLogReg;
    }
  }
}
