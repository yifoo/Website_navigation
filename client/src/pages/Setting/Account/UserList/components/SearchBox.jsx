import { ProForm, ProFormSelect } from '@ant-design/pro-form';
import { message } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'umi';
import styles from '../style.less';
const SearchBox = (props) => {
  const dispatch = useDispatch();
  const userAccount = useSelector((state) => state.Config.userAccount);
  const queryUsers = (params) => {
    return dispatch({
      type: 'Config/queryUsers',
      payload: params,
    });
  };
  useEffect(() => {
    if (userAccount.length == 0) {
      queryUsers();
    }
  }, []);
  return (
    <div className={styles.container}>
      <ProForm
        layout={'inline'}
        grid={false}
        autoFocusFirstInput={false}
        submitter={{
          // 配置按钮文本
          searchConfig: {
            resetText: '重置',
            submitText: '搜索',
          },
        }}
        onFinish={async (values) => {
          let res = await props.run({
            uid: values.uid,
          });
          if (res.code === 200) {
            message.success(res.msg);
            return {};
          } else {
            message.error(res.msg);
          }
        }}
      >
        <ProFormSelect showSearch name="uid" width="sm" label="用户昵称" placeholder="请选择用户昵称" options={userAccount} />
      </ProForm>
    </div>
  );
};

export default SearchBox;
