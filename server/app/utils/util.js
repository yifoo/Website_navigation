const axios = require('./axios')
const getHtml = async (ctx, url) => {
  let html, favUrl, link;
  let domainReg = /(http|https):\/\/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/i;
  let host = url.match(domainReg)[0];
  let shortcutReg = /<link(\w*\s*)(href=['|"].{0,100}['|"])?(\w*\s*)rel=['|"]?(shortcut|icon|(shortcut icon))+.+?\n?.+?['|"]?\/?>/i;
  let iconUrlReg = /href=['"]?(.{0,80}(\.ico|\.jpg|\.png)+)['"]?/i;
  let res, data, status;
  try {
    data = await axios.get(url);
    data = res.data
    status = res.status
  } catch (err) {
    console.log("获取", host);
    return host + '/favicon.ico'
  }
  if (status === 200) {
    html = data;
  } else {
    return host + '/favicon.ico'
  }
  try {
    link = html.match(shortcutReg)[0];
    console.log('link: ', link);
    let iconUrl = link.match(iconUrlReg)[1];
    if (iconUrl.indexOf("http") == -1 && iconUrl.indexOf("//") == -1) {
      if (iconUrl.slice(0, 1) === "/") {
        favUrl = host + iconUrl;
      } else {
        favUrl = host + "/" + iconUrl;
      }
    } else {
      favUrl = iconUrl;
    }
    if (favUrl.indexOf('=') > 0) {
      throw new Error('error')
    }
    return favUrl
  } catch (error) {
    console.log("获取", host);
    return host + '/favicon.ico'
  }
}
const sortBy = (props) => {
  return function (a, b) {
    return a[props] - b[props];
  }
}
// 创建排序函数
const sortArr = function (arr) {
  // 深拷贝一份数据
  var copy = JSON.parse(JSON.stringify(arr));
  // 创建一个存储数据的对象
  var obj = {};
  // 遍历数据，将数据所有数据添加到对象中，key为数据id，value为原数据对象
  copy.forEach((item, index) => {
    obj[item.sortId] = item;
  });
  // 创建一个最终返回的数组
  var res = [];
  // 遍历数据开始处理
  copy.forEach(item => {
    // 将root数据添加进res数组， 因为数据使引用类型，子元素数据都会带过来，下面的循环会处理子元素数据
    if (item.parentId == null) {
      delete item.parentId
      delete item.orderIndex
      res.push(item);
    }
    // 梳理子元素数据
    Object.keys(obj).forEach((key) => {
      if (item.sortId === obj[key].parentId) {
        let data = obj[key]
        // 处理数据children
        if (item.children) {
          item.children.push({ id: data.id, sortId: data.sortId, sortName: data.sortName, orderIndex: data.orderIndex });
        } else {
          item.children = [{ id: data.id, sortId: data.sortId, sortName: data.sortName, orderIndex: data.orderIndex }];
        }
      }

    })
  });
  let data = []
  res.forEach((item => {
    item.children = item.children.sort(sortBy('orderIndex'))
    data.push(item)
  }))
  return data;
}
module.exports = { getHtml, sortArr }
