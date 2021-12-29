import router from '@/config/routes';
import ProLayout from '@ant-design/pro-layout';
import { ConfigProvider, Empty } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import style from './style.less';
import UserInfo from './UserInfo';
const path = history.location.pathname;
const Layout = (props) => {
  const [pathname, setPathname] = useState(path);
  const token = localStorage.getItem('token');
  //? 获取token
  useEffect(() => {
    if (token && Object.keys(props.userInfo).length === 0) {
      props.fetchUser();
    }
    //? 判断是否移动端
    const isMobile = window.document.body.clientWidth <= 768;
    props.setIsMobile(isMobile);
  }, [token]);
  //? 菜单按钮点击切换路由
  const menuItemRender = (item, dom) => {
    return (
      <a
        onClick={() => {
          history.push(item.path);
          setPathname(item.path);
        }}
      >
        {dom}
      </a>
    );
  };
  const routes = router[1].routes;
  let menuList = [];
  //? 菜单显示权限控制
  routes.map((item, key) => {
    if (props.func[item.accessCode]) {
      menuList.push(item);
    }
  });
  if (menuList.length === 1 && menuList[0].path === '/') {
    menuList = [];
  }
  return (
    <div>
      <ProLayout
        location={{ pathname }}
        route={{ routes: menuList }}
        title={''}
        logo={'https://raw.githubusercontent.com/yifoo/Sidea/master/src/img/s.png'}
        contentStyle={{ margin: 0 }}
        className={style.nav}
        onMenuHeaderClick={(e) => console.log(e)}
        menuItemRender={menuItemRender}
        rightContentRender={() => <UserInfo />}
        contentWidth="Fluid"
        fixSiderbar={true}
        fixedHeader={true}
        layout="mix"
        navTheme="dark"
        headerTheme="dark"
        splitMenus={true}
      >
        <div id="container" className={style.mainBg}>
          <ConfigProvider locale={zhCN} renderEmpty={() => <Empty />} theme={{ textColor: '#25b864' }}>
            {props.children}
          </ConfigProvider>
        </div>
      </ProLayout>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userInfo: state.User.userInfo,
  func: state.User.func,
});

const mapDispatchToProps = (dispatch) => ({
  fetchUser(params) {
    return dispatch({
      type: 'User/fetchUser',
      payload: params,
    });
  },
  setIsMobile(params) {
    return dispatch({
      type: 'global/setIsMobile',
      payload: params,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
