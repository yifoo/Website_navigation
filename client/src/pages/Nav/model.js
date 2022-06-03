import { searchApi, navApi } from '@/services';
import { message } from 'antd';

export default {
  namespace: 'Nav',
  state: {
    activeList: [],
    searchList: [],
    activeBtnList: [],
    originSiteList: [],
    siteList: [],
    isLoading: false,
    isEdit: false,
    showEditSite: false,
    showEditSubSort: false,
    siteInfo: {},
    sortInfo: {},
    sortList: [],
    orderVal: 'sort',
  },
  reducers: {
    setSearchList(state, { payload }) {
      let activeBtnList = [];
      let activeList = [];
      payload.forEach((item) => {
        activeBtnList.push(item.activeBtn);
        activeList.push(item.keyActive);
      });
      return {
        ...state,
        searchList: payload,
        activeBtnList,
        activeList,
      };
    },
    updateActiveBtnList(state, { payload }) {
      return {
        ...state,
        activeBtnList: payload,
      };
    },
    updateActiveList(state, { payload }) {
      return {
        ...state,
        activeList: payload,
      };
    },
    setBgImg(state, { payload }) {
      return {
        ...state,
        bgImg: payload,
      };
    },
    clearSiteSort(state, { payload }) {
      return {
        ...state,
        originSiteList: [],
        siteList: [],
        sortList: [],
        orderVal: 'sort',
        isEdit: false,
      };
    },
    setOrderSiteList(state, { payload }) {
      return {
        ...state,
        siteList: payload,
      };
    },
    setSiteList(state, { payload }) {
      let siteList = JSON.parse(JSON.stringify(state.sortList));
      if (payload.length === 0) {
        siteList = [];
      }
      siteList.forEach((item) => {
        item.children &&
          item.children.forEach((_item, _key) => {
            _item.children = _item.children ? _item.children : [];
            payload.forEach((data) => {
              if (_item.sortId === data.sortId) {
                _item.children.push(data);
                return null;
              }
            });
          });
      });
      return {
        ...state,
        siteList: siteList,
        originSiteList: payload,
      };
    },
    setIsLoading(state, { payload }) {
      return {
        ...state,
        isLoading: payload,
      };
    },
    setIsEdit(state, { payload }) {
      return {
        ...state,
        isEdit: payload,
      };
    },
    setShowEditSite(state, { payload }) {
      return {
        ...state,
        showEditSite: payload,
        siteInfo: payload ? state.siteInfo : {},
      };
    },
    setShowEditSubSort(state, { payload }) {
      return {
        ...state,
        showEditSubSort: payload,
      };
    },
    setSiteInfo(state, { payload }) {
      if (payload && Object.keys(payload).length) {
        payload.sort = [payload.parentId, payload.sortId];
      }
      return {
        ...state,
        siteInfo: payload,
      };
    },
    setSortInfo(state, { payload }) {
      return {
        ...state,
        sortInfo: payload,
      };
    },
    setSortList(state, { payload }) {
      return {
        ...state,
        sortList: payload,
      };
    },
    setOrderVal(state, { payload }) {
      return {
        ...state,
        orderVal: payload,
      };
    },
  },
  effects: {
    *querySearchList({ payload }, { call, put }) {
      const res = yield call(searchApi.querySearchList, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'setSearchList',
          payload: res.data,
        });
        return res.data;
      } else {
        message.error(res.msg);
      }
    },
    *fetchAll({ payload }, { call, put }) {
      const token = localStorage.getItem('token');
      // yield put({ type: 'setIsLoading', payload: true });
      const res = yield call(token ? navApi.fetchAll : navApi.fetchAllCom, payload);
      // yield put({ type: 'setIsLoading', payload: false });
      if (res && res.code === 200) {
        yield put({
          type: 'setSiteList',
          payload: res.data,
        });
      }
    },
    *fetchSite({ payload }, { call, put }) {
      const res = yield call(navApi.fetchSite, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'setSiteInfo',
          payload: res.data,
        });
        return res.data.length ? true : false;
      } else {
        message.error(res.msg);
      }
    },
    *fetchSort({ payload }, { call, put, select }) {
      const token = localStorage.getItem('token');
      const res = yield call(token ? navApi.fetchSort : navApi.fetchSortCom, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'setSortList',
          payload: res.data,
        });
        const { originSiteList } = yield select((state) => state.Nav);
        if (originSiteList.length !== 0) {
          yield put({
            type: 'setSiteList',
            payload: originSiteList,
          });
        }
      }
    },
    *addSort({ payload }, { call, put, select }) {
      const res = yield call(navApi.addSort, payload);
      if (res && res.code === 200) {
        message.success(res.msg);
        // 更新网址分类和所有分类下网址
        yield put({
          type: 'fetchSort',
          payload: {},
        });
        return true;
      } else {
        return false;
      }
    },
    *delSort({ payload }, { call, put }) {
      const res = yield call(navApi.delSort, payload);
      if (res && res.code === 200) {
        message.success(res.msg);
        // 更新网址分类和所有分类下网址
        yield put({
          type: 'fetchSort',
          payload: {},
        });
        return true;
      } else {
        return false;
      }
    },
    *updateSort({ payload }, { call, put, select }) {
      const res = yield call(navApi.updateSort, payload);
      if (res && res.code === 200) {
        message.success(res.msg);
        // 更新网址分类和所有分类下网址
        yield put({
          type: 'fetchSort',
          payload: {},
        });
        return true;
      } else {
        return false;
      }
    },
    *updateSortOrder({ payload }, { call, put, select }) {
      const res = yield call(navApi.updateSortOrder, payload);
      if (res && res.code === 200) {
        message.success(res.msg);
        // 更新网址分类和所有分类下网址
        yield put({
          type: 'fetchSort',
          payload: {},
        });
        return true;
      } else {
        message.error(res.msg);
        return false;
      }
    },
    *addSite({ payload }, { call, put }) {
      const res = yield call(navApi.addSite, payload);
      if (res && res.code === 200) {
        message.success(res.msg);
        yield put({
          type: 'fetchAll',
          payload: {},
        });
        return true;
      } else {
        return false;
      }
    },
    *clickSite({ payload }, { call, put }) {
      yield call(navApi.clickSite, payload);
    },
    *updateSite({ payload }, { call, put }) {
      const res = yield call(navApi.updateSite, payload);
      if (res && res.code === 200) {
        message.success(res.msg);
        yield put({
          type: 'fetchAll',
          payload: {},
        });
        return true;
      } else {
        return false;
      }
    },
    *updateSiteOrder({ payload }, { call, put }) {
      const res = yield call(navApi.updateSiteOrder, payload);
      if (res && res.code === 200) {
        message.success(res.msg);
        yield put({
          type: 'fetchAll',
          payload: {},
        });
        return true;
      } else {
        message.error(res.msg);
        return false;
      }
    },
    *delSite({ payload }, { call, put }) {
      const res = yield call(navApi.delSite, payload);
      if (res && res.code === 200) {
        message.success(res.msg);
        yield put({
          type: 'fetchAll',
          payload: {},
        });
        return true;
      } else {
        return false;
      }
    },
    *checkSite({ payload }, { call, put }) {
      const res = yield call(navApi.checkSite, payload);
      return res;
    },
  },
};
