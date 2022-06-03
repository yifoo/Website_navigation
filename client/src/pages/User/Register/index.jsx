import Footer from '@/components/Layout/Footer';
import { userApi } from '@/services';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { message, Button } from 'antd';
import CryptoJS from 'crypto-js';
import React, { useRef } from 'react';
import { history, Link } from 'umi';
import styles from '../Login/index.less';
window.CryptoJS = CryptoJS;
const Register = () => {
  const formRef = useRef();
  const handleSubmit = async (values) => {
    try {
      // 登录
      const res = await userApi.register({
        uname: window.encodeURIComponent(values.uname),
        userName: values.userName,
        upwd: CryptoJS.MD5(values.upwd).toString(),
        email: values.email,
        isInit: values.isInit ? 1 : 0,
      });
      if (res.code === 200) {
        message.success('注册成功');
        history.push('/user/login');
        return;
      }
      console.log(res); // 如果失败去设置用户错误信息
    } catch (error) {
      console.log('error: ', error);
      message.error('注册失败，请重试');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/loading.png" />}
          formRef={formRef}
          title="个人收藏夹"
          subTitle="我的导航我做主"
          initialValues={{
            isInit: true,
          }}
          submitter={{
            // 配置按钮文本
            searchConfig: {
              resetText: '重置',
              submitText: '提交',
            },
            submitButtonProps: {},
            // 完全自定义整个区域
            render: (props, doms) => {
              console.log(props);
              return [
                <Button  key="rest" onClick={() => formRef.current.resetFields()}>
                  重置
                </Button>,
                <Button type="primary" key="submit" onClick={() => handleSubmit(formRef.current.getFieldsValue())}>
                  提交
                </Button>,
              ];
            },
          }}
          actions={
            <p style={{ margin: '1rem auto' }}>
              已有账号?直接
              <Link to="/user/login"> 登 录</Link>
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
              {
                validator: async (rule, val, callback) => {
                  if (val !== undefined && val !== '') {
                    let res = await userApi.checkUname({ uname: window.encodeURIComponent(val.trim()) });
                    if (res && res.code === 200) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(res.msg));
                  }
                },
              },
            ]}
          />
          <ProFormText
            name="userName"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            placeholder="默认与登录名义一致"
            rules={[
              {
                required: false,
                message: '请输入昵称',
              },
            ]}
          />
          <ProFormText
            name="email"
            fieldProps={{
              size: 'large',
              prefix: <MailOutlined className={styles.prefixIcon} />,
            }}
            placeholder="请输入邮箱"
            rules={[
              {
                required: true,
                message: '请输入电子邮箱',
              },
              {
                validator: async (rule, val, callback) => {
                  if (val !== undefined && val !== '') {
                    let res = await userApi.checkUserEmail({ email: val.trim() });
                    if (res && res.code === 200) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(res.msg));
                  }
                },
              },
            ]}
          />
          <ProFormText.Password
            name="preupwd"
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
              {
                validator: (rule, val, callback) => {
                  if (val !== undefined && val !== '') {
                    if (!new RegExp(/^[\da-zA-Z]{6,}$/).test(val)) {
                      return Promise.reject(new Error('请输入6位以上由数字、字母组合密码'));
                    } else {
                      return Promise.resolve();
                    }
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          />
          <ProFormText.Password
            name="upwd"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            placeholder="请确认密码"
            rules={[
              {
                required: true,
                message: '请确认密码',
              },
              {
                validator: (rule, val, callback) => {
                  if (val !== undefined && val !== '') {
                    let preupwd = formRef.current.getFieldValue('preupwd') || '';
                    if (val !== preupwd) return Promise.reject(new Error('两次输入的密码不一致'));
                    return Promise.resolve();
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          />
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="isInit">
              初始化公共网址
            </ProFormCheckbox>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
