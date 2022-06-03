// import Footer from '@/components/Layout/Footer';
import RightContent from '@/components/Layout/RightContent';
import { userApi } from '@/services';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { PageLoading, SettingDrawer } from '@ant-design/pro-layout';
import {message} from 'antd'
import { history, Link } from 'umi';
import defaultSettings from '../config/defaultSettings';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const regPath = '/user/register';

export const request = {
  timeout: 10000,
  middlewares: [],
  requestInterceptors: [
    (url, options) => {
      return {
        url: isDev ? `${url}` : `https://api.haohome.top${url}`,
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
    const { response } = error;
    message.error(response.status+response.statusText)
    if(response.status===401){
      localStorage.clear('token')
      window.location.reload();
    }
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
          // history.push(loginPath);
          return {};
        }
      } catch (e) {
        console.log('e: ', e);
      }
    }
    return {};
  };
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    try {
      const { userInfo, isLogin } = await fetchUserInfo();
      const isMobile = window.document.body.clientWidth <= 768;
      return {
        userInfo,
        isLogin,
        isMobile,
        fetchUserInfo,
        settings: defaultSettings,
      };
    } catch (e) {
      console.log('e: ', e);
    }
  }
} // ProLayout 支持的api https://procomponents.ant.design/components/layout

export const layout = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: true,
    waterMarkProps: {
      content: initialState?.userInfo?.uname,
    },
    footerRender: () => null,
    onPageChange: () => {
      // console.log('initialState: ', initialState);
      // const { location } = history; // 如果没有登录，重定向到 login
      // if (!initialState?.userInfo && location.pathname !== loginPath && location.pathname !== regPath) {
      //   history.push(loginPath);
      // }
    },
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs" key="docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              hideHintAlert={true}
              hideCopyButton={true}
              colorList={[
                { key: 'black', color: '#202020' },
                { key: 'daybreak', color: '#1890ff' },
                { key: 'yanhong', color: '#ed556a' },
                { key: 'dust', color: '#F5222D' },
                { key: 'volcano', color: '#FA541C' },
                { key: 'sunset', color: '#FAAD14' },
                { key: 'cyan', color: '#13C2C2' },
                { key: 'green', color: '#52C41A' },
                { key: 'geekblue', color: '#2F54EB' },
                { key: 'purple', color: '#722ED1' },
              ]}
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({ ...preInitialState, settings }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};
