const axios = require('./axios')
const sortBy = (props) => {
  return function (a, b) {
    return a[props] - b[props]
  }
}
// 创建tree
const sortArr = (data) => {
  let parents = data.filter((value) => value.parentId === null)
  let children = data.filter((value) => value.parentId !== null)
  let translator = (parents, children) => {
    parents.forEach((item) => {
      children.forEach((current, index) => {
        if (current.parentId === item.sortId) {
          let temp = JSON.parse(JSON.stringify(children))
          temp.splice(index, 1)
          translator([current], temp)
          typeof item.children !== 'undefined'
            ? item.children.push(current)
            : (item.children = [current])
        }
      })
    })
  }
  translator(parents, children)
  return parents
}
const getFavicon = async (siteUrl) => {
  let domainReg =
    /(http|https):\/\/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?\/?/i
  const siteHost = siteUrl.match(domainReg)[0]
  let iconHost = siteHost
  if (siteHost.slice(siteHost.length - 1) === '/') {
    iconHost = iconHost.slice(0, -1)
  }
  let iconUrl = iconHost + '/favicon.ico'
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  let resp = {}
  try {
    resp = await axios({
      method: 'get',
      url: siteHost,
      timeout: 12000,
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
  let shortcutReg =
    /<link[^>]+rel=.(icon|shortcut icon|alternate icon)[^>]+>/gim
  let link = html.match(shortcutReg)
  if (link && link.length) {
    link = link[0]
    let icontest = /href=('|")?.*\.(ico|png|jpg|jpeg|bmp)('|")?/gi
    let icon = link.match(icontest)
    console.log('icontest: ', icontest,icon);
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
      } else if (/\=/.test(iconUrl)) {
        iconUrl = iconUrl.match(/\/.*\.(ico|png|jpg|jpeg|bmp)/gi)
        iconUrl = iconUrl[0]
        if (/^\/\/.?/.test(iconUrl)) {
          iconUrl = 'https:' + iconUrl
          return iconUrl
        }
      } else if (iconUrl.slice(0, 1) !== '/') {
        iconUrl = '/' + iconUrl
      }
      iconUrl = iconHost + iconUrl
    } else {
      iconUrl = iconUrl.match(
        /(http|https):\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?/gi
      )
      iconUrl = iconUrl[0]
    }
  }
  return iconUrl
}
const getIcon = async (url) => {
  let domainReg =
    /(http|https):\/\/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?\/?/i
  const siteHost = url.match(domainReg)[0]
  let iconUrl
  try {
    iconUrl = await getFavicon(siteHost)
  } catch (e) {
    console.log('e: ', e)
  }
  let icon
  if (!iconUrl) {
    return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${siteHost}&size=32`
  }
  try {
    icon = await axios({
      method: 'get',
      url: iconUrl,
      timeout: 5000
    })
    if (icon && icon.status === 200) {
      console.log('icon: ', icon.data)
      return iconUrl
    } else {
      return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${siteHost}&size=32`
    }
  } catch (e) {
    return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${siteHost}&size=32`
  }
}
module.exports = { sortArr, getFavicon, getIcon }
