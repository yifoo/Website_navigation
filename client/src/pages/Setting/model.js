import { searchApi, userApi } from '@/services';
import { message } from 'antd';

export default {
  namespace: 'Config',
  state: {
    userAccount: [],
    roleList: [],
  },
  reducers: {
    setUserAccount(state, { payload }) {
      return {
        ...state,
        userAccount: payload,
      };
    },
    setRoleList(state, { payload }) {
      return {
        ...state,
        roleList: payload,
      };
    },
  },
  effects: {
    *queryUsers({ payload }, { call, put }) {
      const res = yield call(userApi.queryUsers, payload);
      let options = [];
      try {
        options = res.data.map((item) => {
          return {
            label: item.user_name || item.uname,
            value: item.uid,
          };
        });
        yield put({
          type: 'setUserAccount',
          payload: options,
        });
        return options;
      } catch (e) {
        console.log('e: ', e);
      }
    },
    *queryUserList({ payload }, { call, put }) {},

    *queryRoleUser({ payload }, { call, put }) {
      const res = yield call(userApi.queryUsers, payload);
      let options = [];
      try {
        options = res.data.map((item) => {
          return {
            label: item.user_name || item.uname,
            value: item.uid,
          };
        });
        yield put({
          type: 'setUserAccount',
          payload: options,
        });
        return options;
      } catch (e) {
        console.log('e: ', e);
      }
    },
    *queryRoleList({ payload }, { call, put }) {
      const res = yield call(userApi.queryRoleList, payload);
      let options = [];
      try {
        options = res.data.map((item) => {
          return {
            label: item.description || item.name,
            value: item.id,
          };
        });
        yield put({
          type: 'setRoleList',
          payload: options,
        });
        return options;
      } catch (e) {
        console.log('e: ', e);
      }
    },
    *deleUser({ payload }, { call, put }) {
      try {
        const res = yield call(userApi.deleUser, payload);
        if (res.code === 200) {
          message.success(res.msg);
          yield put({
            type: 'queryUsers',
            payload: {},
          });
          return true;
        } else {
          message.error(res.msg);
          return false;
        }
      } catch (e) {
        console.log('e: ', e);
      }
    },
    *deleSearchRecord({ payload }, { call, put }) {
      try {
        const res = yield call(searchApi.delRecord, payload);
        if (res.code === 200) {
          message.success(res.msg);
          return true;
        } else {
          message.error(res.msg);
          return false;
        }
      } catch (e) {
        console.log('e: ', e);
      }
    },
    *saveUserRole({ payload }, { call, put }) {
      try {
        const res = yield call(userApi.saveUserRole, payload);
        if (res.code === 200) {
          message.success(res.msg);
          return true;
        } else {
          message.error(res.msg);
          return false;
        }
      } catch (e) {
        console.log('e: ', e);
      }
    },
  },
};
