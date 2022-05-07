import { message, Button, Form, Input } from 'antd';
import CryptoJS from 'crypto-js';
import { connect } from 'dva';
import { Link } from 'umi';
import { history } from 'umi';
import style from './style.less';
const Login = (props) => {
  const isMobile = window.document.body.clientWidth <= 575;
  const onFinish = async (value) => {
    props.logout({ type: 'clearToken' });
    let res = await props.login({
      uname: window.encodeURIComponent(value.uname),
      upwd: CryptoJS.MD5(value.upwd).toString(),
    });
    if (res) {
      message.success('登录成功!', 1, () => history.push('/'));
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={style.login}>
      <h1 className={style.title}>登 录</h1>
      <Form
        name="login"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="登录名"
          name="uname"
          rules={[
            {
              required: true,
              message: '请输入登录名',
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="upwd"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: isMobile ? 0 : 4,
            span: 16,
          }}
        >
          <Button size="large" type="primary" htmlType="submit" block>
            登录
          </Button>
          <p style={{ margin: '1rem auto', color: '#fff' }}>
            没账号?请先
            <Link to="/user/register"> 注 册</Link>
          </p>
        </Form.Item>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userInfo: state.User.userInfo,
  isLight: state.global.isLight,
});

const mapDispatchToProps = (dispatch) => ({
  login(params) {
    return dispatch({
      type: 'User/login',
      payload: params,
    });
  },
  logout(params) {
    return dispatch({
      type: 'User/logout',
      payload: { type: 'clearToken' },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
