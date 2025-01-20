'use strict';
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt } = app;
  router.post('/api/nav/search/query', controller.nav.search.querySearchList);
  router.post('/api/nav/search/updateActiveBtn', controller.nav.search.updateActiveBtn);
  router.post('/api/nav/search/delBtn', controller.nav.search.delBtn);
  router.post('/api/nav/search/fetchBtn', controller.nav.search.fetchBtn);
  router.post('/api/nav/search/updateBtn', controller.nav.search.updateBtn);
  router.post('/api/nav/search/addBtn', controller.nav.search.addBtn);
  router.post('/api/nav/search/saveExtra', controller.nav.search.saveExtra);
  router.post('/api/nav/search/delExtra', controller.nav.search.delExtra);
  router.post('/api/nav/search/updateKeyActive', controller.nav.search.updateKeyActive);
  router.post('/api/nav/search/record', jwt, controller.nav.search.record);
  router.post('/api/nav/search/deleSearchRecord', jwt, controller.nav.search.deleSearchRecord);
  router.post('/api/nav/search/recordCom', controller.nav.search.record);
  router.post('/api/nav/search/getRecordList', jwt, controller.nav.search.getRecordList);
};
