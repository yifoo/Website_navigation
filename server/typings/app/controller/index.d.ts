// This file is created by egg-ts-helper@2.1.0
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportNavSearch = require('../../../app/controller/nav/search');
import ExportNavSite = require('../../../app/controller/nav/site');
import ExportNavSiteDic = require('../../../app/controller/nav/siteDic');
import ExportUserAccount = require('../../../app/controller/user/account');
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
      account: ExportUserAccount;
      check: ExportUserCheck;
      logReg: ExportUserLogReg;
    }
  }
}
