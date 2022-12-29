'use strict'
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, jwt } = app

  router.post('/api/nav/site/fetchSort', jwt, controller.nav.site.fetchSort)
  router.post('/api/nav/site/fetchAll', jwt, controller.nav.site.fetchAll)

  router.post('/api/nav/site/fetch', jwt, controller.nav.site.fetch)
  router.post('/api/nav/site/checkSite', jwt, controller.nav.site.checkSite)
  router.post('/api/nav/site/querySite', jwt, controller.nav.site.querySite)
  router.post('/api/nav/site/addSite', jwt, controller.nav.site.addSite)
  router.post('/api/nav/site/updateSite', jwt, controller.nav.site.updateSite)
  router.post(
    '/api/nav/site/updateSiteOrder',
    jwt,
    controller.nav.site.updateSiteOrder
  )
  router.post('/api/nav/site/delSite', jwt, controller.nav.site.delSite)
  router.post('/api/nav/site/clickSite', jwt, controller.nav.site.clickSite)
  // router.pos/apit('/nav/site/addSubSort',jwt, controller.nav.site.addSubSort);
  // router.pos/apit('/nav/site/updateSubSort',jwt, controller.nav.site.updateSubSort);
  router.post('/api/nav/site/addSort', jwt, controller.nav.site.addSort)
  router.post('/api/nav/site/updateSort', jwt, controller.nav.site.updateSort)
  router.post(
    '/api/nav/site/updateSortOrder',
    jwt,
    controller.nav.site.updateSortOrder
  )
  router.post('/api/nav/site/delSort', jwt, controller.nav.site.delSort)

  router.post('/api/nav/search/query', controller.nav.search.query)
  router.post(
    '/api/nav/search/updateActiveBtn',
    controller.nav.search.updateActiveBtn
  )
  router.post('/api/nav/search/delBtn', controller.nav.search.delBtn)
  router.post('/api/nav/search/fetchBtn', controller.nav.search.fetchBtn)
  router.post('/api/nav/search/updateBtn', controller.nav.search.updateBtn)
  router.post('/api/nav/search/addBtn', controller.nav.search.addBtn)
  router.post('/api/nav/search/saveExtra', controller.nav.search.saveExtra)
  router.post('/api/nav/search/delExtra', controller.nav.search.delExtra)
  router.post(
    '/api/nav/search/updateKeyActive',
    controller.nav.search.updateKeyActive
  )
  router.post('/api/nav/site/fetchAllCom', controller.nav.site.fetchAllCom)
  router.post('/api/nav/site/fetchSortCom', controller.nav.site.fetchSortCom)
  router.get('/api/nav/site/shot', controller.nav.site.fetchScreenShot)

  router.post('/api/nav/dic/fetchTags', jwt, controller.nav.siteDic.fetchTags)
}
