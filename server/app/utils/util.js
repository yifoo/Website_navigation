const axios = require('./axios')
const sortBy = (props) => {
  return function (a, b) {
    return a[props] - b[props]
  }
}
// 创建排序函数
const sortArr = function (arr) {
  // 深拷贝一份数据
  var copy = JSON.parse(JSON.stringify(arr))
  // 创建一个存储数据的对象
  var obj = {}
  // 遍历数据，将数据所有数据添加到对象中，key为数据id，value为原数据对象
  copy.forEach((item, index) => {
    obj[item.sortId] = item
  })
  // 创建一个最终返回的数组
  var res = []
  // 遍历数据开始处理
  copy.forEach((item) => {
    // 将root数据添加进res数组， 因为数据使引用类型，子元素数据都会带过来，下面的循环会处理子元素数据
    if (item.parentId == null) {
      delete item.parentId
      delete item.orderIndex
      res.push(item)
    }
    // 梳理子元素数据
    Object.keys(obj).forEach((key) => {
      if (item.sortId === obj[key].parentId) {
        let data = obj[key]
        // 处理数据children
        if (item.children) {
          item.children.push({
            id: data.id,
            sortId: data.sortId,
            sortName: data.sortName,
            orderIndex: data.orderIndex
          })
        } else {
          item.children = [
            {
              id: data.id,
              sortId: data.sortId,
              sortName: data.sortName,
              orderIndex: data.orderIndex
            }
          ]
        }
      }
    })
  })
  let data = []
  res.forEach((item) => {
    if (item.children) {
      item.children = item.children.sort(sortBy('orderIndex'))
    } else {
      item.children = []
    }
    data.push(item)
  })
  return data
}
const getFavicon = async (siteUrl) => {
  let domainReg =
    /(http|https):\/\/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?\/?/i
  const siteHost = siteUrl.match(domainReg)[0]
  let iconHost = siteHost
  if (siteHost.slice(siteHost.length - 1) === '/') {
    iconHost = iconHost.slice(0, -1)
  }
  iconUrl = iconHost + '/favicon.ico'
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  let resp = {}
  try {
    resp = await axios({
      method: 'get',
      url: siteHost,
      timeout: 10000,
      headers: {
        'Accept-Language':
        'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6,ko;q=0.5',
        'sec-ch-ua':
        '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': 'macOS',
        'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36'
      }
    })
  } catch (err) {
    console.log('err: ', err.response)
    return null
  }
  let html = resp.data
  let shortcutReg = /<link[^>]+rel=.(icon|shortcut icon|alternate icon)[^>]+>/img
  let link = html.match(shortcutReg)
  if (link&&link.length) {
    link = link[0]
    let icontest = /href=('|")?.*\.(ico|png|jpg|jpeg|bmp)('|")?/ig
    let icon = link.match(icontest)
    if (icon.length > 0) {
      iconUrl = icon[icon.length - 1]
    }
    //*判断是否存在http
    if (
      !/(http|https):\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?/gi.test(iconUrl)
      ) {
      if (/^\/\/.?/.test(iconUrl)) {
        iconUrl = 'https:' + iconUrl
        return iconUrl
      } else if(/\=/.test(iconUrl)){
        iconUrl = iconUrl.match(/\/.*\.(ico|png|jpg|jpeg|bmp)/ig) 
        iconUrl = iconUrl[0]
      }else if (iconUrl.slice(0, 1) !== '/') {
        iconUrl = '/' + iconUrl
      }
      iconUrl = iconHost + iconUrl
    }
  }
  return iconUrl
}
module.exports = { sortArr, getFavicon }
