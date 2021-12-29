import { message } from 'antd';
import service from './service.js';

export default {
  namespace: 'Nav',
  state: {
    searchList: [],
    searchVal: '',
    placeholder: '请输入关键词',
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
    // bgImg: require('@/assets/img/bg.jpeg'),
  },

  reducers: {
    setBgImg(state, { payload }) {
      return {
        ...state,
        bgImg: payload,
      };
    },
    setPlaceholder(state, { payload }) {
      return {
        ...state,
        placeholder: payload,
      };
    },
    clearSiteSort(state, { payload }) {
      return {
        ...state,
        originSiteList: [],
        siteList: [],
        sortList: [],
      };
    },
    //* 设置操作记录信息
    setSearchList(state, { payload }) {
      return {
        ...state,
        searchList: payload.list,
      };
    },
    setOrderSiteList(state, { payload }) {
      return {
        ...state,
        siteList: payload,
      };
    },
    setSiteList(state, { payload, status }) {
      let siteList = Array.from(state.sortList);
      if (payload.length === 0) {
        siteList = [];
      }
      siteList.forEach((item, key) => {
        if (item.children && item.children.length > 0) {
          item.children.forEach((_item, _key) => {
            _item.children = [];
            payload.forEach((data, i) => {
              if (_item.sortId === data.sortId) {
                _item.children.push(data);
              }
            });
          });
        } else {
          item.children = [];
        }
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
      const res = yield call(service.querySearchList, payload);
      if (res.code === 200) {
        yield put({
          type: 'setSearchList',
          payload: res.data,
        });
      }
    },
    *fetchAll({ payload }, { call, put }) {
      const token = localStorage.getItem('token');
      // yield put({ type: 'setIsLoading', payload: true });
      const res = yield call(token ? service.fetchAll : service.fetchAllCom, payload);
      // yield put({ type: 'setIsLoading', payload: false });
      if (res && res.code === 200) {
        yield put({
          type: 'setSiteList',
          payload: res.data,
        });
      }
    },
    *fetchSite({ payload }, { call, put }) {
      const res = yield call(service.fetchSite, payload);
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
      const res = yield call(token ? service.fetchSort : service.fetchSortCom, payload);
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
      const res = yield call(service.addSort, payload);
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
      const res = yield call(service.delSort, payload);
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
      const res = yield call(service.updateSort, payload);
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
      const res = yield call(service.updateSortOrder, payload);
      if (res && res.code === 200) {
        message.success(res.msg);
        // 更新网址分类和所有分类下网址
        yield put({
          type: 'fetchSort',
          payload: {},
        });
        return true;
      } else {
        message.errror(res.msg);
        return false;
      }
    },
    *addSite({ payload }, { call, put }) {
      const res = yield call(service.addSite, payload);
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
    *updateSite({ payload }, { call, put }) {
      const res = yield call(service.updateSite, payload);
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
      const res = yield call(service.updateSiteOrder, payload);
      if (res && res.code === 200) {
        message.success(res.msg);
        yield put({
          type: 'fetchAll',
          payload: {},
        });
        return true;
      } else {
        message.errror(res.msg);
        return false;
      }
    },
    *delSite({ payload }, { call, put }) {
      const res = yield call(service.delSite, payload);
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
      const res = yield call(service.checkSite, payload);
      if (res && res.code === 200) {
        return res.data;
      } else {
        return {};
      }
    },
  },
};
