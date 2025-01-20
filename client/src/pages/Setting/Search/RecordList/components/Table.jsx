import utils from "@/utils/libs";
import { Pagination, Popconfirm, Space, Table, Tag } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'umi';
import style from '../style.less';
const TableComponent = (props) => {
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(10);
  const deleSearchRecord = async (kid) => {
    let resp = await dispatch({
      type: 'Config/deleSearchRecord',
      payload: { kid },
    });
    if (resp) {
      props.run({ page: 1, pageSize });
    }
  };
  const columns = [
    {
      title: '编号',
      dataIndex: 'kid',
      key: 'kid',
      width: 80,
    },
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
      width: 120,
      render: (_, record) => {
        return record.userName?<Tag color={utils.stringToColor(record.userName)}>{record.userName}</Tag>:"";
      },
    },
    {
      title: '搜索词',
      dataIndex: 'keyword',
      key: 'keyword',
      width: 300,
    },
    {
      title: '搜索频率',
      dataIndex: 'count',
      key: 'count',
      width: 80,
    },
    {
      title: '最新记录',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm title={`确认删除该记录吗？`} onConfirm={() => deleSearchRecord(record.kid)} okText="是" cancelText="否">
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const pageChange = async (page, size) => {
    if (size === pageSize) {
      await props.run({ page: page, pageSize });
    }
  };
  const pageSizeChange = async (current, size) => {
    await props.run({ page: 1, pageSize: size });
    setPageSize(size);
  };
  return (
    <div>
      <Table dataSource={props.list} columns={columns} rowKey="kid" size="small" pagination={false} loading={props.loading}/>
      <div className={style.page}>
        <Pagination
          showTotal={(total) => `共 ${JSON.stringify(total)} 条`}
          showQuickJumper
          showSizeChanger
          pageSizeOptions={[10, 15, 25, 50, 100]}
          current={props.page}
          total={props.total}
          onChange={pageChange}
          onShowSizeChange={pageSizeChange}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default TableComponent;
