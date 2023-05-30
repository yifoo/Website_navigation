import { searchApi } from '@/services';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'umi';
import EditSitemTable from './EditSitemTable';
export default (props) => {
  const [modalVisit, setModalVisit] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const editFrom = useRef({});
  const { run: fetch } = useRequest(searchApi.fetchBtn, {
    manual: true,
    onSuccess: (result, params) => {
      setFormData(result.data);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
  useEffect(() => {
    if (props.visible !== modalVisit) {
      setModalVisit(props.visible);
      if (props.visible && props.btnId) {
        fetch({ btnId: props.btnId });
      }
    }
  }, [props.visible]);
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      editFrom.current.setFieldsValue({
        btnId: formData.btnId,
        name: formData.name,
        btnIndex:formData.btnIndex,
        query: formData.query,
        icon: formData.icon,
        extra: formData.extra,
      });
    }
  }, [formData]);

  const { run: update } = useRequest(searchApi.updateBtn, {
    manual: true,
    onSuccess: (result, params) => {
      props.closeEdit();
      dispatch({
        type: 'Nav/querySearchList',
      });
      message.success(result.msg);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
  const { run: add } = useRequest(searchApi.addBtn, {
    manual: true,
    onSuccess: (result, params) => {
      dispatch({
        type: 'Nav/querySearchList',
      });
      props.closeEdit();
      message.success(result.msg);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const onCancel = () => {
    props.closeEdit();
  };
  const updateExtra = (extra) => {
    let data = { ...formData };
    data.extra = extra;
    setFormData(data);
  };
  return (
    <ModalForm
      formRef={editFrom}
      width={850}
      title="编辑搜索项"
      layout={'horizontal'}
      visible={modalVisit}
      modalProps={{ onCancel: onCancel, destroyOnClose: true, centered: true }}
      onFinish={async (values) => {
        if (values.btnId) {
          update(values);
        } else {
          add({ ...values, sid: props.parent.sid });
        }
        return true;
      }}
    >
      <ProForm.Group>
        {props.btnId ? (
          <>
            <ProFormText width="xs" name="btnId" label="ID编号" readonly />
            <ProFormText width="xs" name="btnIndex" label="顺序编号" />
          </>
        ) : null}

        <ProFormText width="sm" label="分类名称" readonly value={props.parent.title} />
        <ProFormText width="sm" name="name" label="搜索名称" placeholder="请输入搜索名称" />
      </ProForm.Group>
      <ProFormText width="xl" name="query" label="搜索格式" placeholder="请输入搜索格式" />
      <ProFormText width="xl" name="icon" label="搜索图标" placeholder="请输入图标地址" />
      {props.btnId ? (
        <ProForm.Item label="" name="extra">
          <EditSitemTable updateExtra={updateExtra} btnId={props.btnId} />
        </ProForm.Item>
      ) : null}
    </ModalForm>
  );
};
