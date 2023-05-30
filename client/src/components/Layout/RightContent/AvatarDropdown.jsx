import { userApi } from '@/services';
import { Avatar, message, Spin } from 'antd';
import { useCallback } from 'react';
import { history, Link, useDispatch, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const AvatarDropdown = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const dispatch = useDispatch();
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    const { query = {}, search, pathname } = history.location;
    // const { redirect } = query; // Note: There may be security issues, please note
    let res = await userApi.logout();
    if (res.code === 200) {
      message.success(res.msg);
      localStorage.removeItem('token');
      setInitialState((s) => ({ ...s, userInfo: undefined, isLogin: false, token: null }));
      dispatch({ type: 'Nav/clearSiteSort' });
      dispatch({ type: 'Nav/fetchSort' });
      dispatch({ type: 'Nav/fetchAll' });
      dispatch({
        type: 'Nav/setTagsDic',
        payload: [],
      });
      // window.location.reload();
      if (window.location.pathname !== '/user/login' && window.location.pathname !== '/nav') {
        history.replace({
          pathname: '/',
        });
      }
    }
  };
  const toggleSetting = () => {
    setInitialState((s) => ({ ...s, settingShow: !initialState.settingShow }));
  };
  const onMenuClick = useCallback(
    (event) => {
      const { key } = event;
      switch (key) {
        case 'logout':
          loginOut();
          break;
        case 'layout':
          toggleSetting();
          break;
        default:
          break;
      }
    },
    [setInitialState],
  );
  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { userInfo } = initialState;

  if (!userInfo || !userInfo.uid) {
    return (
      <div>
        <Link to="/user/login" className={`${styles.name} `} style={{ marginRight: '.7rem' }}>
          登录
        </Link>
        <Link to="/user/register" className={`${styles.name} `}>
          注册
        </Link>
      </div>
    );
  }
  let menuNode = {
    items: [
      { label: '样式配置', key: 'layout' },
      { label: '退出登录', key: 'logout' },
    ],
    onClick: onMenuClick,
  };
  // const menuHeaderDropdown = <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick} items={menuNode} />;
  return (
    <HeaderDropdown menu={menuNode}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={userInfo.avatar} alt="avatar" />
        <span className={`${styles.name} `}>{userInfo.userName}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
