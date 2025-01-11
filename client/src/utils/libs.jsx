export default {
  sort: (a, b, item) => {
    if (a[item] > b[item]) {
      return 1;
    } else {
      return -1;
    }
  },
  myBrowser: () => {
    var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf('Opera') > -1; // 判断是否Opera浏览器
    var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera; // 判断是否IE浏览器
    var isEdge = userAgent.indexOf('Edge') > -1; // 判断是否IE的Edge浏览器
    var isFF = userAgent.indexOf('Firefox') > -1; // 判断是否Firefox浏览器
    var isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1; // 判断是否Safari浏览器
    var isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1; // 判断Chrome浏览器

    if (isIE) {
      var reIE = new RegExp('MSIE (\\d+\\.\\d+);');
      reIE.test(userAgent);
      var fIEVersion = parseFloat(RegExp['$1']);
      if (fIEVersion === 7) {
        return 'IE7';
      } else if (fIEVersion === 8) {
        return 'IE8';
      } else if (fIEVersion === 9) {
        return 'IE9';
      } else if (fIEVersion === 10) {
        return 'IE10';
      } else if (fIEVersion === 11) {
        return 'IE11';
      } else {
        return '0';
      } // IE版本过低
    }
    if (isOpera) {
      return 'Opera';
    }
    if (isEdge) {
      return 'Edge';
    }
    if (isFF) {
      return 'FF';
    }
    if (isSafari) {
      return 'Safari';
    }
    if (isChrome) {
      return 'Chrome';
    }
  },
  /**
   * 导出文件
   * @param {*} data
   * @param {*} filename
   */
  exportXlsx: (data, filename) => {
    console.log('data: ', data);
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
    });
    if ('download' in document.createElement('a')) {
      // 非IE下载
      const elink = document.createElement('a');
      // console.log('myBrowser(): ', this.myBrowser());
      // if (this.myBrowser() === 'Safari' || this.myBrowser() === 'Chrome') {
      //   filename += '.xlsx'
      // }
      elink.download = filename;
      elink.style.display = 'none';
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    } else {
      // IE10+下载
      navigator.msSaveBlob(blob, filename);
    }
  },
  /**
   * 根据字符串生成颜色值
   * @param {*} 字符串
   */
  stringToColor: (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xff;
      color += ('00' + value.toString(16)).slice(-2);
    }
    return color;
  }
};
