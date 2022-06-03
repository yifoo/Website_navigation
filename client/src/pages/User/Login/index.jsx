import Footer from '@/components/Layout/Footer';
import { userApi } from '@/services';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { message } from 'antd';
import CryptoJS from 'crypto-js';
import React from 'react';
import { history, Link, useModel, useDispatch } from 'umi';
import styles from './index.less';
window.CryptoJS = CryptoJS;
const Login = () => {
  const dispatch = useDispatch();
  const { setInitialState } = useModel('@@initialState');
  const handleSubmit = async (values) => {
    try {
      // 登录
      const res = await userApi.login({
        uname: window.encodeURIComponent(values.uname),
        upwd: CryptoJS.MD5(values.upwd).toString(),
      });

      if (res.code === 200) {
        message.success('登录成功');
        localStorage.setItem('token', res.token);
        await setInitialState((s) => ({ ...s, userInfo: res.userInfo, isLogin: true, token: res.token }));
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query;
        history.push(redirect || '/');
        dispatch({ type: 'Nav/clearSiteSort' });
        dispatch({ type: 'Nav/fetchSort' });
        dispatch({ type: 'Nav/fetchAll' });
        return;
      }
      console.log(res); // 如果失败去设置用户错误信息
    } catch (error) {
      console.log('error: ', error);
      message.error('登录失败，请重试');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/loading.png" />}
          title="个人收藏夹"
          subTitle="我的导航我做主"
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
          actions={
            <p style={{ margin: '1rem auto' }}>
              没有账号?请先
              <Link to="/user/register"> 注 册</Link>
            </p>
          }
        >
          <ProFormText
            name="uname"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            placeholder="请输入登录名"
            rules={[
              {
                required: true,
                message: '请输入登录名',
              },
            ]}
          />
          <ProFormText.Password
            name="upwd"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            placeholder="请输入密码"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
          />
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
