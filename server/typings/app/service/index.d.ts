// This file is created by egg-ts-helper@1.33.1
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportNav = require('../../../app/service/nav');
import ExportSearch = require('../../../app/service/search');

declare module 'egg' {
  interface IService {
    nav: AutoInstanceType<typeof ExportNav>;
    search: AutoInstanceType<typeof ExportSearch>;
  }
}
