import { DownOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Image, Menu, Popconfirm } from 'antd';
import { connect } from 'dva';
import { useEffect, useCallback, useState } from 'react';
import { Link } from 'umi';
import avatarimg from '@/assets/img/huba.jpg';
import style from './style.less';

const UserInfo = (props) => {
  const [dropShow, setDropShow] = useState(false);
  const toggleEdit = () => {
    props.setIsEdit(!props.isEdit);
    setDropShow(false);
  };
  const logout = () => {
    setDropShow(false);
    props.logout({ type: 'logout' });
  };
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={toggleEdit}>
        {props.isEdit ? '完成编辑' : '编辑模式'}
      </Menu.Item>
      <Menu.Divider />
      <Popconfirm title="确认注销吗" onConfirm={logout} okText="是" cancelText="否">
        <Menu.Item key="2">注销</Menu.Item>
      </Popconfirm>
    </Menu>
  );
  return (
    <Dropdown className={style.user} overlay={menu} visible={dropShow} arrow={true}>
      <div>
        {props.userInfo.uid ? (
          <>
            <Avatar className={style.avatar} src={<Image src={`${avatarimg}`} />} />
            <span onClick={() => setDropShow(!dropShow)}>
              {props.userInfo.userName} <DownOutlined className={`${style.setting} ${dropShow ? style.active : ''}`} />
            </span>
          </>
        ) : (
          <>
            <Link to="/user/login">登录</Link> <Link to="/user/register">注册</Link>
          </>
        )}
      </div>
    </Dropdown>
  );
};

const mapStateToProps = (state) => ({
  userInfo: state.User.userInfo,
  isEdit: state.Nav.isEdit,
  func: state.User.func,
  isLogin: state.User.isLogin,
});

const mapDispatchToProps = (dispatch) => ({
  logout(params) {
    return dispatch({
      type: 'User/logout',
      payload: params,
    });
  },
  setIsEdit(params) {
    return dispatch({
      type: 'Nav/setIsEdit',
      payload: params,
    });
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
