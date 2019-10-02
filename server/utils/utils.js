import axios from "./axios";
import _ from 'lodash'
import path from 'path';
import fs from 'fs';
export default {
  init() {
    Date.prototype.format = function(fmt) {
      //author: meizz
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    };
  },
  async getHtml(url) {
    var { data, status } = await axios.get(url);
    var html, favUrl, link;
    var domainReg = /(http|https):\/\/(www.)?(\w+(\.)?)+/i;
    var shortcutReg = /<link(\w*\s*)(href=['|"].{0,100}['|"])?(\w*\s*)rel=['|"]?(shortcut|icon|(shortcut icon))+.+?\n?.+?['|"]?\/?>/i;
    // var shortcutReg = /<link.+?rel=['|"]?(shortcut|icon|(shortcut icon))+.+?\n?.+?['|"]?>/i;
    var iconUrlReg = /href=['"]?(.{0,80}(\.ico|\.jpg|\.png)+)['"]?/i;
    if (status === 200) {
      html = data;
    } else {
      return "";
    }
    try {
      var host = url.match(domainReg)[0];
      link = html.match(shortcutReg)[0];
      var iconUrl = link.match(iconUrlReg)[1];
      if (iconUrl.indexOf("http") == -1 && iconUrl.indexOf("//") == -1) {
        if (iconUrl.slice(0, 1) === "/") {
          favUrl = host + iconUrl;
        } else {
          favUrl = host + "/" + iconUrl;
        }
      } else {
        favUrl = iconUrl;
      }
      return { logoSrc: favUrl, mark: true };
    } catch (error) {
      console.log("获取", error);
      var { data, status } = await axios.get(host + '/favicon.ico');
      if(status===200){
        return {logoSrc:host + '/favicon.ico',mark:false}
      }else{
        throw new Error(error);
      }
    }
  },
  /**
   * 遍历目录下的文件
   * @param  d
   */
  mapDir(d) {
    const tree = {}
    // 获得当前文件夹下的所有的文件夹和文件
    const [dirs, files] = _(fs.readdirSync(d)).partition(p => fs.statSync(path.join(d, p)).isDirectory())
    // 映射文件夹
    dirs.forEach(dir => {
      tree[dir] = this.mapDir(path.join(d, dir))
    })
    // 映射文件
    files.forEach(file => {
      if (path.extname(file) === '.js') {
        tree[path.basename(file, '.js')] = require(path.join(d, file)).default
      }
    })
    return tree
  },
};
