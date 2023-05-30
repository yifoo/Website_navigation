// @ts-nocheck
const axios = require('./axios')
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
  let headers = {
    accept: '*/*',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6',
    'sec-ch-ua-platform': '"macOS"',
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
  }
  let host = siteUrl.match(
    /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/i
  )[0]
  let domainReg =
    /(http|https):\/\/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?\/?/i
  const siteHost = siteUrl.match(domainReg)[0]
  let iconHost = siteHost
  if (siteHost.slice(siteHost.length - 1) === '/') {
    iconHost = iconHost.slice(0, -1)
  }
  let resp = {}
  try {
    resp = await axios({
      method: 'get',
      url: siteHost,
      timeout: 12000,
      headers: headers
      // responseEncoding: 'utf8',
    })
  } catch (err) {
    console.log('err: ', err.response)
    return null
  }
  let html = resp.data
  let shortcutReg =
    /<link[^>]+rel=.?(icon|shortcut icon|alternate icon|apple-touch-icon|apple-touch-icon-precomposed|fluid-icon|mask-icon)[^>]+>/gi
  let link = html.match(shortcutReg)
  console.log('link: ', link)
  // return link
  let iconList = []
  try {
    if (link && link.length) {
      let icontest = /href=('|")?\S*\.(svg|ico|gif|png|jpg|jpeg|bmp)('|")?/gi
      link.map((item, index) => {
        let icon = item.match(icontest)
        if (icon && icon.length > 0) {
          icon = icon[0]
          if (/'/.test(icon)) {
            icon = icon.split(`'`)[1]
          } else if (/"/.test(icon)) {
            icon = icon.split(`"`)[1]
          } else {
            icon = icon.split('=')[1]
          }
          //*判断是否存在http
          if (
            /(http|https)\:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?/gi.test(icon)
          ) {
            icon = icon.match(
              /(http|https):\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?/gi
            )
            icon = icon[0]
          } else {
            //* 如果以/开头，
            if (/^\//.test(icon) && !/^\/\//.test(icon)) {
              icon = iconHost + icon
            } else if (icon.slice(0, 1) === '.') {
              icon = icon.slice(1)
              icon = iconHost + '/' + icon
            }
          }
          iconList.push(icon)
        }
      })
    } else {
      iconList.push('https://img.haohome.top/uPic/blankico.jpg')
      iconList.push(iconHost + '/favicon.ico')
    }
  } catch (e) {
    console.log('e: ', e)
  }
  let logoList = [...new Set(iconList)] //利用了Set结构不能接收重复数据的特点
  let descContent = html.match(
    /<meta[^>]+name="[D|d]escription"\s*content=?[^>]+>/gi
  )
  try {
    if (descContent && descContent.length) {
      descContent = descContent[0].match(/content=?[^>]+[^/>]/gi)[0]
      console.log('descContent: ', descContent)
      descContent = descContent.split('"')[1]
      console.log('descContent: ', descContent)
    }
  } catch (e) {
    console.log('e: ', e)
  }
  return {
    logo: logoList,
    desc: descContent
  }
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
