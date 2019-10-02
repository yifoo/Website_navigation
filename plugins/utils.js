import Vue from 'vue'
var MyUtils = {};
MyUtils.install = function (Vue, options) {
  Vue.prototype.$utils = {
    /**
     * 获得cookie
     */
    getCookie: function (name) {
      var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
      else
        return null;
    },
    /**
     * 设置cookie
     * @param name 参数名称
     * @param value 参数值
     * @param exdays 过期时间,单位(天)
     */
    setCookie: function (name, value, exdays) {
      var Days = exdays;
      var exp = new Date();
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
      document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    /**
     * 删除cookie
     * @param name:参数名称
     */
    delCookie: function (name) {
      document.cookie = name + "=;expires=" + "-1";
    },
    clearCookie: function () {
      var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if (keys) {
        for (var i = keys.length; i--;) {
          document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
        }
      }
    },
    /**
     * @name:瀑布流
     * @param:parent(容器元素)
     * @param:oneGap(只有一列时元素的间距,其他列数自适应)
     * @description:自适应瀑布流,多列间距自适应
     */
    waterFall: function (parent, oneGap = 0, padding = 0) {
      /**容器的宽度(包含内边距、边框) */
      var width = parent.offsetWidth - padding;
      /**容器内盒子元素的宽度(包含内边距、边框)  */
      var items = parent.children;
      var itemWidth = items[0].offsetWidth;
      /* 所有空隙的宽度和*/
      var gap = (width - parseInt(width / itemWidth) * itemWidth);
      /**计算每列放的盒子元素个数 */
      var columns = parseInt(width / (itemWidth + gap / 2));
      /**定义一个空数组,用来储存每列元素的高度 */
      var arr = [];
      for (var i = 0; i < items.length; i++) {
        /**1.将第一行元素的高度都存到arr中 */
        if (i < columns) {
          items[i].style.top = padding + 'px';
          items[i].style.left = (itemWidth + gap) * i + padding - padding * (i % 2) + 'px';
          arr.push(items[i].offsetHeight);
        } else { /**2.找到每一行的最小高度 */
          var minHeight = arr[0];
          var index = 0;
          for (var j = 0; j < arr.length; j++) {
            if (minHeight > arr[j]) {
              minHeight = arr[j]; //获得当前行最小高度
              index = j; //记下当前列下标
            }
          }
          /**3.设置下一行第一个盒子的位置,
           * top值就是最小高度值+gap
           * left值就是最小列距离左边的距离
           */
          if (gap != 0) {
            items[i].style.top = arr[index] + oneGap + padding + 'px';
            items[i].style.left = items[index].offsetLeft + 'px';
            /**4.修改最小列的高度 
             * 最小列的高度 = 当前自己的高度 + 拼接过来的高度 + 间隙的高度
             */
            arr[index] = arr[index] + items[i].offsetHeight + oneGap;
          } else {
            items[i].style.top = arr[index] + oneGap + padding + 'px';
            items[i].style.left = padding + 'px';
            arr[index] = arr[index] + items[i].offsetHeight + oneGap;
          }
        }
        if (columns === 1) {
          parent.style.height = arr[0] + oneGap + 'px'
        } else {
          var height = arr[0] > arr[1] ? arr[0] : arr[1]
          if (i < items.length - 1) {
            parent.style.height = height + oneGap + padding + 'px'
          } else {
            parent.style.height = height + padding * 2 + 'px'
          }
        }
      }
    },
    browser() {
      if (process.browser) {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
          return "mobile";
        } else if (bIsIpad) {
          return "pad";
        } else {
          return "pc";
        }
      }
    }
  }
}
export default () => {
  Vue.use(MyUtils, {})
}
