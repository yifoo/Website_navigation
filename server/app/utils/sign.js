'use strict';

const createNonceStr = function() {
  return Math.random().toString(36).substr(2, 15);
};

const createTimestamp = function() {
  return parseInt(new Date().getTime() / 1000) + '';
};

const raw = function(args) {
  let keys = Object.keys(args);
  keys = keys.sort();
  const newArgs = {};
  keys.forEach(function(key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  let string = '';
  for (const k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
};

/**
* @synopsis 签名算法
*
* @param jsapi_ticket 用于签名的 jsapi_ticket
* @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
*
* @return
*/
const sign = function(jsapi_ticket, url) {
  const ret = {
    jsapi_ticket,
    nonceStr: createNonceStr(),
    timestamp: createTimestamp(),
    url,
  };
  const string = raw(ret);
  const jsSHA = require('jssha');
  const shaObj = new jsSHA(string, 'TEXT');
  ret.signature = shaObj.getHash('SHA-1', 'HEX');

  return ret;
};

module.exports = sign;
