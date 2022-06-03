'use strict'

const Controller = require('egg').Controller
class SearchController extends Controller {
  *query() {
    const { ctx } = this
    let result = []
    try {
      result = yield ctx.service.search.querySearchList()
      // ctx.body = { code: 200, msg: '获取数据成功', data: result }
      // return false
      let list = [],
        parent = [],
        i = 0
      result.forEach((item, key) => {
        parent.push({
          sid: item.sid,
          title: item.title,
          activeBtn: item.activeBtn,
          keyActive: item.keyActive,
          placeholder: item.placeholder,
          btns: []
        })
        if (list.length === 0) {
          list.push({
            sid: item.sid,
            btnId: item.btnId,
            name: item.name,
            icon: item.icon,
            query: item.query,
            extra: item.label
              ? [{ label: item.label, value: item.value, placeholder:  item.tips||''  }]
              : []
          })
          i++
        } else {
          if (list[i - 1].btnId === item.btnId) {
            item.label &&
              list[i - 1]['extra'].push({
                label: item.label,
                value: item.value,
                placeholder:  item.tips||'' 
              })
          } else {
            list.push({
              sid: item.sid,
              btnId: item.btnId,
              name: item.name,
              icon: item.icon,
              query: item.query,
              extra: item.label
                ? [{ label: item.label, value: item.value, placeholder: item.tips||'' }]
                : []
            })
            i++
          }
        }
      })
      let hash = {}
      parent = parent.reduce((preVal, curVal) => {
        hash[curVal.sid] ? '' : (hash[curVal.sid] = true && preVal.push(curVal))
        return preVal
      }, [])
      parent.forEach((item) => {
        list.forEach((_item) => {
          if (item.sid === _item.sid) {
            item.btns.push(_item)
          }
        })
      })
      ctx.body = { code: 200, msg: '获取数据成功', data: parent }
      parent = null
      list = null
    } catch (err) {
      console.log('e: ', err)
      ctx.body = { code: 201, msg: '获取数据错误', err }
    }
  }
  *updateActiveBtn() {
    const { ctx } = this
    const params = ctx.request.body
    let res = {}
    try {
      res = yield ctx.service.search.updateSbtnActive(params)
      if (res.changedRows > 0) {
        ctx.body = { code: 200, msg: '更新成功' }
      } else {
        ctx.body = { code: 402, msg: '更新失败' }
      }
    } catch (err) {
      console.log('err: ', err)
      ctx.body = { code: 403, msg: '更新错误', err }
    }
  }
  *delBtn() {
    const { ctx } = this
    const params = ctx.request.body
    let res = {}
    try {
      res = yield ctx.service.search.delBtn(params)
      if (res.affectedRows > 0) {
        ctx.body = { code: 200, msg: '删除成功' }
      } else {
        ctx.body = { code: 402, msg: '删除失败' }
      }
    } catch (err) {
      console.log('err: ', err)
      ctx.body = { code: 403, msg: '删除错误', err }
    }
  }
  *fetchBtn() {
    const { ctx } = this
    const params = ctx.request.body
    let res = {},
      btnInfo = {}
    try {
      res = yield ctx.service.search.fetchBtn(params)
      res.forEach((item, key) => {
        if (key === 0) {
          btnInfo = {
            sid: item.sid,
            btnId: item.btnId,
            name: item.name,
            icon: item.icon,
            query: item.query,
            btnIndex:item.btnIndex,
            extra: item.id
              ? [
                  {
                    id: item.id,
                    label: item.label,
                    value: item.value,
                    eIndex:item.eIndex,
                    placeholder: item.placeholder
                  }
                ]
              : []
          }
        } else {
          btnInfo.extra.push(
            item.id
              ? {
                  id: item.id,
                  label: item.label,
                  value: item.value,
                  eIndex:item.eIndex,
                  placeholder: item.placeholder
                }
              : []
          )
        }
      })
      if (res && res.length > 0) {
        ctx.body = { code: 200, msg: `查询成功`, data: btnInfo }
      } else {
        ctx.body = { code: 200, msg: '不存在', data: {} }
      }
    } catch (err) {
      console.log('err: ', err)
      ctx.body = { code: 403, msg: '查询错误', err }
    }
  }
  *updateBtn() {
    const { ctx } = this
    const params = ctx.request.body
    let res = {}
    try {
      res = yield ctx.service.search.updateBtn(params)
      if (res.changedRows > 0) {
        ctx.body = { code: 200, msg: '更新成功' }
      } else {
        ctx.body = { code: 402, msg: '无更新' }
      }
    } catch (err) {
      console.log('err: ', err)
      ctx.body = { code: 403, msg: '更新错误', err }
    }
  }
  *addBtn() {
    const { ctx } = this
    const params = ctx.request.body
    let res = {}
    try {
      res = yield ctx.service.search.addBtn(params)
      if (res.insertId) {
        ctx.body = { code: 200, msg: '添加成功' }
      } else {
        ctx.body = { code: 402, msg: '无更新' }
      }
    } catch (err) {
      console.log('err: ', err)
      ctx.body = { code: 403, msg: '更新错误', err }
    }
  }
  *delExtra() {
    const { ctx } = this
    const params = ctx.request.body
    let res = {}
    try {
      res = yield ctx.service.search.delExtra(params)
      if (res.affectedRows > 0) {
        ctx.body = { code: 200, msg: '删除成功' }
      } else {
        ctx.body = { code: 402, msg: '删除失败' }
      }
    } catch (err) {
      console.log('err: ', err)
      ctx.body = { code: 403, msg: '更新错误', err }
    }
  }
  *saveExtra() {
    const { ctx } = this
    const params = ctx.request.body
    let res = {}
    try {
      if (params.type) {
        res = yield ctx.service.search.updateExtra(params)
        if (res.changedRows > 0) {
          ctx.body = { code: 200, msg: '更新成功' }
        } else {
          ctx.body = { code: 402, msg: '无更新' }
        }
        return
      } else {
        
        res = yield ctx.service.search.addExtra(params)
        if (res.insertId) {
          ctx.body = { code: 200, msg: '添加成功',data:res.insertId }
        } else {
          ctx.body = { code: 402, msg: '无更新' }
        }
        return
      }
    } catch (err) {
      console.log('err: ', err)
      ctx.body = { code: 403, msg: '更新错误', err }
    }
  }
  *updateKeyActive() {
    const { ctx } = this
    const params = ctx.request.body
    let result = ctx.service.search.updateKeyActive(params)
    yield Promise.all(result)
      .then((res) => {
        if (res.length === 2) {
          ctx.body = { code: 200, msg: '更新成功' }
        } else {
          ctx.body = { code: 402, msg: '更新失败' }
        }
      })
      .catch((err) => {
        console.log('err: ', err)
        ctx.body = { code: 403, msg: '更新错误', err }
      })
  }
}

module.exports = SearchController
