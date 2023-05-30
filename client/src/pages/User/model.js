import { userApi } from '@/services';
import { message } from 'antd';
import { history } from 'umi';

export default {
  namespace: 'User',
  state: {},
  reducers: {},
  effects: {
    *register({ payload }, { call, put }) {
      const res = yield call(userApi.register, payload);
      if (res.code === 200) {
        message.success(res.msg);
        history.push('/user/login');
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
