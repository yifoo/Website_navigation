import { Button, Checkbox, Divider, Form, Input } from 'antd';
import CryptoJS from 'crypto-js';
import { connect } from 'dva';
import { Link } from 'umi';
import style from './style.less';
const Register = (props) => {
  const isMobile = window.document.body.clientWidth <= 575;
  const [regForm] = Form.useForm();
  const onFinish = async (value) => {
    props.register({
      uname: window.encodeURIComponent(value.uname),
      userName: value.userName,
      upwd: CryptoJS.MD5(value.upwd).toString(),
      email: value.email,
      isInit: value.isInit ? 1 : 0,
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  // const sendCode = ()=>{
  //   if(!(regForm.getFieldValue('email')&&regForm.getFieldValue('uname'))){
  //     message.err('请先输入Email和登录名')
  //     return false
  //   }
  //   props.sendCode({
  //     email:regForm.getFieldValue('email').trim(),
  //     uname:regForm.getFieldValue('uname').trim()
  //   })
  // }
  return (
    <div className={style.login}>
      <h1 className={style.title}>注 册</h1>
      <Form
        name="login"
        form={regForm}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ isInit: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="登录名"
          name="uname"
          hasFeedback
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: '请输入登录名',
            },
            {
              validator: async (rule, val, callback) => {
                if (val !== undefined && val !== '') {
                  let res = await props.checkUname({ uname: window.encodeURIComponent(val.trim()) });
                  if (res && res.code === 200) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(res.msg));
                }
              },
            },
          ]}
        >
          <Input placeholder="请输入登录名" size="large" />
        </Form.Item>
        <Form.Item
          label="昵称"
          name="userName"
          hasFeedback
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: '请输入昵称',
            },
          ]}
        >
          <Input placeholder="请输入昵称" size="large" />
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="email"
          hasFeedback
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: '请输入电子邮箱',
            },
            {
              validator: async (rule, val, callback) => {
                if (val !== undefined && val !== '') {
                  let res = await props.checkUserEmail({ email: val.trim() });
                  if (res && res.code === 200) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(res.msg));
                }
              },
            },
          ]}
        >
          <Input placeholder="请输电子邮箱" size="large" />
        </Form.Item>
        {/* <Form.Item label="验证码" style={{ marginBottom: 0 }}>
        <Form.Item name="code"
          wrapperCol={{
            offset: 0,
            span: 16,
          }}
          hasFeedback
          rules={[
            {
              required: true,
              message: '请输入验证码',
            },
            {
              validator: (rule, val, callback) => {
                console.log('val: ', val);
                if (val !== undefined && val !== "") {
                  if (!new RegExp(/^[\da-zA-Z]{4}$/).test(val)) {
                    return Promise.reject(new Error("请输入4位有效验证码"));
                  } else {
                    return Promise.resolve();
                  }
                } else {
                  return Promise.resolve();
                }
              },
            }
          ]}
        >
          <Input placeholder="请输入4位验证码" onClick={sendCode} size="large" />
        </Form.Item>
        <Button type='primary' className={style.sendCode}>发送验证码</Button>
      </Form.Item> */}
        <Form.Item
          label="密码"
          name="preupwd"
          hasFeedback
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
        >
          <Input.Password placeholder="请输入6位以上由数字、字母组合密码" size="large" />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="upwd"
          hasFeedback
          rules={[
            {
              required: true,
              message: '请确认密码',
            },
            {
              validator: (rule, val, callback) => {
                if (val !== undefined && val !== '') {
                  let preupwd = regForm.getFieldValue('preupwd') || '';
                  if (val !== preupwd) return Promise.reject(new Error('两次输入的密码不一致'));
                  return Promise.resolve();
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <Input.Password placeholder="请确认密码" size="large" />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: isMobile ? 0 : 4,
            span: 16,
          }}
          name="isInit"
          valuePropName="checked"
        >
          <Checkbox>是否默认公共网址</Checkbox>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: isMobile ? 0 : 4,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" block size="large">
            注册
          </Button>
          <p style={{ margin: '1rem auto', color: '#fff' }}>
            已有账号?直接
            <Link to="/user/login"> 登 录</Link>
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
  checkUserEmail(params) {
    return dispatch({
      type: 'User/checkUserEmail',
      payload: params,
    });
  },
  checkUname(params) {
    return dispatch({
      type: 'User/checkUname',
      payload: params,
    });
  },
  sendCode(params) {
    return dispatch({
      type: 'User/sendCode',
      payload: params,
    });
  },
  register(params) {
    return dispatch({
      type: 'User/register',
      payload: params,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
