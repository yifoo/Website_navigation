// @ts-nocheck
const axios = require('./axios')
const https = require('https')
const cheerio = require('cheerio')
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
          typeof item.children !== 'undefined' ? item.children.push(current) : (item.children = [current])
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
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
  }
  let domainReg = /(http|https):\/\/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?\/?/i
  const siteHost = siteUrl.match(domainReg)[0]
  let iconHost = siteHost
  if (siteHost.slice(siteHost.length - 1) === '/') {
    iconHost = iconHost.slice(0, -1)
  }
  let resp = {}
  let iconList = []
  try {
    resp = await axios({
      method: 'get',
      url: siteHost,
      timeout: 12000,
      headers: headers,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      }),
      contentType: 'application/x-www-form-urlencoded; charset=gkb'
      // responseEncoding: 'utf8'
    })
  } catch (err) {
    console.log('err: ', err.response)
    return null
  }
  const $ = cheerio.load(resp.data) // 初始化cheerio对象
  try {
    $('link').each(function () {
      const rel = $(this).attr('rel')
      const type = $(this).attr('type')
      if (/icon/.test(rel) || rel === 'icon' || type === 'image/x-icon') {
        let favico = $(this).attr('href')
        //*判断是否存在http
        if (/(http|https)\:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?/gi.test(favico)) {
          favico = favico.match(/(http|https):\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?/gi)
          favico = favico[0]
        } else {
          if (/^\/\//.test(favico)) {
            favico = 'https:' + favico
          } else {
            //* 如果以/开头，
            if (/^\//.test(favico)) {
              favico = iconHost + favico
            } else if (favico.slice(0, 1) === '.') {
              favico = favico.slice(1)
              favico = iconHost + favico
            }
          }
        }
        iconList.push(favico) // 这里的函数不要使用箭头函数！！否则this会丢失
      }
    })
  } catch (e) {
    console.log('e12: ', e)
  }
  if (iconList.length === 0) {
    iconList.push(iconHost + '/favicon.ico')
    iconList.push('https://i.sevencdn.com/favicon/' + iconHost)
    iconList.push('https://img.haohome.top/uPic/blankico.jpg')
  }
  let logoList = [...new Set(iconList)] //利用了Set结构不能接收重复数据的特点
  let descContent = ''
  try {
    descContent = $('meta[name="description"]').attr('content')
  } catch (e) {
    console.log('e344: ', e)
  }
  return {
    logo: logoList,
    desc: descContent
  }
}
const getIcon = async (url) => {
  let domainReg = /(http|https):\/\/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?\/?/i
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
const formatDate=(date)=> {
  return date
    .toISOString() // 转换为 ISO 格式（例如：2023-10-05T14:30:45.000Z）
    .replace('T', ' ') // 将 'T' 替换为空格
    .slice(0, 19) // 截取前 19 个字符（去掉毫秒和时区部分）
}
module.exports = { sortArr, getFavicon, getIcon, formatDate }
