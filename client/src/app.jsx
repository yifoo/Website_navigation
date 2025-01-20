import Footer from '@/components/Layout/Footer';
import RightContent from '@/components/Layout/RightContent';
import { userApi } from '@/services';
import { PageLoading } from '@ant-design/pro-layout';
import { message } from 'antd';
import { history } from 'umi';
import defaultSettings from '../config/defaultSettings';
import paramConfig from '../config/paramConfig';
const isDev = process.env.NODE_ENV === 'development';

export const request = {
  timeout: 15000,
  middlewares: [],
  requestInterceptors: [
    (url, options) => {
      return {
        url: isDev ? `${url}` : `${paramConfig.apiUrl}${url}`,
        options: {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          interceptors: true,
        },
      };
    },
  ],
  errorHandler: (error) => {
    console.log('error: ', error);
    const { response } = error;
    message.error(response.status + response.statusText);
    if (response && response.status === 401) {
      localStorage.clear('token');
      window.location.reload();
    }
    return error;
  },
};
/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export async function getInitialState() {
  const fetchUserInfo = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await userApi.fetchUser();
        if (res.code === 200) {
          return { ...res, isLogin: true };
        } else {
          return {};
        }
      } catch (e) {
        console.log('e: ', e);
      }
    }
    return {};
  };
  // 如果不是登录页面，执行
  if (history.location.pathname !== paramConfig.loginPath) {
    try {
      const { userInfo, isLogin } = await fetchUserInfo();
      const isPad = window.document.body.clientWidth <= 991 && window.document.body.clientWidth > 768;
      const isMobile = window.document.body.clientWidth <= 768;
      return {
        userInfo,
        isLogin,
        isMobile,
        isPad,
        fetchUserInfo,
        settings: defaultSettings,
      };
    } catch (e) {
      console.log('e: ', e);
    }
  }
} // ProLayout 支持的api https://procomponents.ant.design/components/layout

export const layout = ({ initialState, setInitialState }) => {
  // const onCollapse = (collapsed) => {
  //   setInitialState((s) => ({ ...s, settingShow: !initialState.settingShow }));
  // };
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: true,
    waterMarkProps: {
      content: initialState?.userInfo?.uname,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      // console.log('initialState: ', initialState);
      // const { location } = history; // 如果没有登录，重定向到 login
      // if (!initialState?.userInfo && location.pathname !== paramConfig.loginPath && location.pathname !== regPath) {
      //   history.push(paramConfig.loginPath);
      // }
    },
    links: [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
        </>
      );
    },
    ...initialState?.settings,
  };
};
