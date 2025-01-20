import { userApi } from '@/services';
import { LockOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-form';
import { Button, message } from 'antd';
import CryptoJS from 'crypto-js';
import { useRef } from 'react';
import styles from './index.less';
window.CryptoJS = CryptoJS;
const AccountList = () => {
  const formRef = useRef();
  const handleSubmit = async (values) => {
    try {
      // 登录
      const res = await userApi.editUpwd({
        opwd: CryptoJS.MD5(values.opwd).toString(),
        upwd: CryptoJS.MD5(values.upwd).toString(),
      });
      if (res.code === 200) {
        message.success(res.msg);
        formRef.current.resetFields();
      } else {
        message.error(res.msg);
      }
    } catch (error) {
      console.log('error: ', error);
      message.error('修改失败，请重试');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          formRef={formRef}
          title="密码修改"
          subTitle="我的导航我做主"
          submitter={{
            // 配置按钮文本
            searchConfig: {
              resetText: '重置',
              submitText: '提交',
            },
            submitButtonProps: {},
            // 完全自定义整个区域
            render: (props, doms) => {
              return [
                <Button key="rest" onClick={() => formRef.current.resetFields()}>
                  重置
                </Button>,
                <Button type="primary" key="submit" onClick={() => handleSubmit(formRef.current.getFieldsValue())}>
                  提交
                </Button>,
              ];
            },
          }}
        >
          <ProFormText.Password
            name="opwd"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            placeholder="请输入旧密码"
            rules={[
              {
                required: true,
                message: '请输入正确的旧密码',
              },
              {
                validator: (rule, val, callback) => {
                  if (val !== undefined && val !== '') {
                    return Promise.resolve();
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
            placeholder="请输入新密码"
            rules={[
              {
                required: true,
                message: '请输入新密码',
              },
              {
                validator: (rule, val, callback) => {
                  if (val !== undefined && val !== '') {
                    if (!new RegExp(/^[\da-zA-Z*]{6,}$/).test(val)) {
                      return Promise.reject(new Error('请输入6位以上由数字、字母组合密码'));
                    } else {
                      return Promise.resolve();
                    }
                  } else {
                    return Promise.resolve();
                  }
                },
              },
              {
                validator: (rule, val, callback) => {
                  if (val !== undefined && val !== '') {
                    let preupwd = formRef.current.getFieldValue('opwd') || '';
                    if (val === preupwd) return Promise.reject(new Error('两次输入的密码相同'));
                    return Promise.resolve();
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          />
        </LoginForm>
      </div>
    </div>
  );
};

export default AccountList;
