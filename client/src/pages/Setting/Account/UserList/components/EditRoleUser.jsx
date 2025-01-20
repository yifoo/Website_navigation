import { ProForm, ProFormSelect } from '@ant-design/pro-form';
import { Form } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'umi';
import styles from '../style.less';
const EditRoleUser = (props) => {
  const dispatch = useDispatch();
  const [roleForm] = Form.useForm();
  const roleList = useSelector((state) => state.Config.roleList);
  const queryRoleList = (params) => {
    return dispatch({
      type: 'Config/queryRoleList',
      payload: params,
    });
  };
  useEffect(() => {
    if (roleList.length == 0) {
      queryRoleList();
    }
  }, []);
  useEffect(() => {
    if (props.data) {
      roleForm.setFieldsValue({ rid: props.data.rid });
    }
  }, [JSON.stringify(props.data)]);
  const onFinish = async (val) => {
    let resp = await dispatch({
      type: 'Config/saveUserRole',
      payload: { uid: props.data.uid, rid: val.rid },
    });
    props.run(resp);
  };
  return (
    <div className={styles.container}>
      <h3>{props.data.userName||props.data.uname}</h3>
      <ProForm
        form={roleForm}
        autoFocusFirstInput={false}
        submitter={{
          // 配置按钮文本
          searchConfig: {
            resetText: '重置',
            submitText: '保存',
          },
        }}
        onFinish={(values) => onFinish(values)}
      >
        <ProFormSelect showSearch name="rid" width="md" label="角色选择" size="large" placeholder="请选择用户角色" options={roleList} />
      </ProForm>
    </div>
  );
};

export default EditRoleUser;
