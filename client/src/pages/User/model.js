import { message } from 'antd';
import { history } from 'umi';
import service from './service.js';

export default {
  namespace: 'User',
  state: {
    userInfo: {},
    func: [],
    isLogin: false,
  },

  reducers: {
    //* 设置操作记录信息
    setLogin(state, { payload }) {
      return {
        ...state,
        userInfo: payload.userInfo,
        func: payload.userInfo.func,
        isLogin: true,
      };
    },
    setUserInfo(state, { payload }) {
      return {
        ...state,
        userInfo: payload.userInfo,
        func: payload.userInfo.func,
        isLogin: true,
      };
    },
    clearUserInfo(state, { payload }) {
      return {
        ...state,
        userInfo: {},
        func: [],
        isLogin: false,
      };
    },
  },
  effects: {
    *login({ payload }, { call, put }) {
      const res = yield call(service.login, payload);
      if (res.code === 200) {
        localStorage.setItem('token', res.token);
        yield put({
          type: 'setLogin',
          payload: res,
        });
        return true
      }else{
        return false
      }
    },
    *register({ payload }, { call, put }) {
      const res = yield call(service.register, payload);
      if (res.code === 200) {
        message.success(res.msg);
        history.push('/user/login');
      }
    },
    *fetchUser({ payload }, { call, put }) {
      const res = yield call(service.fetchUser, payload);
      if (res.code === 200) {
        yield put({
          type: 'setUserInfo',
          payload: res,
        });
      }
    },
    *logout({ payload }, { call, put }) {
      yield put({
        type: 'clearUserInfo',
      });
      yield put({
        type: 'Nav/clearSiteSort',
        payload: [],
      });
      yield put({
        type: 'Nav/setIsEdit',
        payload: false,
      });
      let res;
      if (payload && payload.type === 'logout') {
        res = yield call(service.logout, payload);
        if (res.code === 200) {
          message.success(res.msg);
          localStorage.clear('token');
          yield put({
            type: 'Nav/fetchSort',
            payload: {},
          });
          yield put({
            type: 'Nav/fetchAll',
            payload: {},
          });
        }
      }
    },
    *checkUserEmail({ payload }, { call, put }) {
      const res = yield call(service.checkUserEmail, payload);
      return res;
    },
    *checkUname({ payload }, { call, put }) {
      const res = yield call(service.checkUname, payload);
      return res;
    },
    *sendCode({ payload }, { call, put }) {
      const res = yield call(service.sendCode, payload);
      return res;
    },
  },
};
