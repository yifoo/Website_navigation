import { Pagination, Space, Table, Tag } from 'antd';
import { useState } from 'react';
import style from '../style.less';
import utils from "@/utils/libs"

const TableComponent = (props) => {
  const [pageSize, setPageSize] = useState(10);

  const deleRole = () => {};

  const columns = [
    {
      title: '编号',
      dataIndex: 'rid',
      key: 'rid',
      width: 40,
    },
    {
      title: '角色',
      dataIndex: 'roleDesc',
      key: 'roleDesc',
      width: 80,
    },
    {
      title: '用户集合',
      dataIndex: 'userList',
      key: 'userList',
      width: 340,
      render: (text, record) => (
        <Space size="small" className={style.tag}>
          {record.userList.map((item) => {
            return (
              item.userName&&item.uname&&<Tag color={utils.stringToColor(item.userName || item.uname)} key={item.uid}>
                {item.userName || item.uname}
              </Tag>
            );
          })}
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
      <Table dataSource={props.list} columns={columns} rowKey="rid" size="small" pagination={false} loading={props.loading} />
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
