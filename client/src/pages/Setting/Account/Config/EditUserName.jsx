import { userApi } from '@/services';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-form';
import { Button, message } from 'antd';
import CryptoJS from 'crypto-js';
import { useRef } from 'react';
import styles from './index.less';
window.CryptoJS = CryptoJS;
const EditUserName = () => {
  const formRef = useRef();
  const handleSubmit = async (values) => {
    try {
      // 登录
      const res = await userApi.editUname({
        uname:  values.uname?values.uname.trim():'',
        userName: values.userName?values.userName.trim():'',
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
          grid={false}
          title="账户修改"
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
          <ProFormText
            name="uname"
            label="登录名"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined  className={styles.prefixIcon} />,
            }}
            placeholder="请输入新的登录名"
          />
          <ProFormText
            name="userName"
            label="昵称"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            placeholder="请输入新的昵称"
          />
          <ProFormText.Password
            name="upwd"
            label="密码"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            placeholder="请输入密码确认"
            rules={[
              {
                required: true,
                message: '请输入密码确认',
              },
            ]}
          />
        </LoginForm>
      </div>
    </div>
  );
};

export default EditUserName;
