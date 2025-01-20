import { searchApi } from '@/services';
import { EditableProTable, ProCard, ProFormField } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import style from './style.less';
export default (props) => {
  const [editableKeys, setEditableRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    let extra = props.value || [];
    setDataSource(extra);
  }, [props.value]);
  const { run: saveExtra } = useRequest(searchApi.saveExtra, {
    manual: true,
    onSuccess: (result, params) => {
      if (params[0].type === 0) {
        let data = [...dataSource];
        data[data.length - 1].id = result.data;
        setDataSource(data);
      }
      message.success(result.msg);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
  const { run: delExtra } = useRequest(searchApi.delExtra, {
    manual: true,
    onSuccess: (result, params) => {
      message.success(result.msg);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
  const columns = [
    {
      title: '显示名称',
      dataIndex: 'label',
      width: 70,
    },
    {
      title: '搜索代码',
      dataIndex: 'value',
      width: 230,
    },
    {
      title: '描述',
      dataIndex: 'placeholder',
      width: 100,
    },
    {
      title: '顺序',
      dataIndex: 'eIndex',
      width: 80,
      valueType: 'digit',
      tooltip:'3位以内数字'
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            var _a;
            (_a = action === null || action === void 0 ? void 0 : action.startEditable) === null || _a === void 0
              ? void 0
              : _a.call(action, record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            let data = dataSource.filter((item) => item.id !== record.id);
            delExtra({ id: record.id });
            setDataSource(data);
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  return (
    <>
      <EditableProTable
        className={style.editTable}
        rowKey="id"
        headerTitle=""
        maxLength={12}
        recordCreatorProps={{
          position: 'bottom',
          record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
        }}
        loading={false}
        columns={columns}
        // request={async () => ({
        //   data: defaultData,
        //   total: 3,
        //   success: true,
        // })}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            saveExtra({ ...data, type: row.label ? 1 : 0, btnId: props.btnId });
          },
          onChange: setEditableRowKeys,
        }}
      />
      <ProCard title="表格数据" headerBordered collapsible defaultCollapsed>
        <ProFormField
          ignoreFormItem
          fieldProps={{
            style: {
              width: '100%',
            },
          }}
          mode="read"
          valueType="jsonCode"
          text={JSON.stringify(dataSource)}
        />
      </ProCard>
    </>
  );
};
