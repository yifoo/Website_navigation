import { message } from 'antd';
import { history } from 'umi';
import { userApi } from '@/services';

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
      const res = yield call(userApi.login, payload);
      if (res.code === 200) {
        localStorage.setItem('token', res.token);
        yield put({
          type: 'setLogin',
          payload: res,
        });
        return true;
      } else {
        res && message.error(res.msg);
        return false;
      }
    },
    *register({ payload }, { call, put }) {
      const res = yield call(userApi.register, payload);
      if (res.code === 200) {
        message.success(res.msg);
        history.push('/user/login');
      }
    },
    *fetchUser({ payload }, { call, put }) {
      const res = yield call(userApi.fetchUser, payload);
      if (res && res.code === 200) {
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
        res = yield call(userApi.logout, payload);
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
      const res = yield call(userApi.checkUserEmail, payload);
      return res;
    },
    *checkUname({ payload }, { call, put }) {
      const res = yield call(userApi.checkUname, payload);
      return res;
    },
    *sendCode({ payload }, { call, put }) {
      const res = yield call(userApi.sendCode, payload);
      return res;
    },
  },
};
