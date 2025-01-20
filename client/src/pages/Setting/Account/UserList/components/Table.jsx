import utils from "@/utils/libs";
import { Drawer, Pagination, Popconfirm, Space, Table, Tag } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'umi';
import style from '../style.less';
import EditRoleUser from './EditRoleUser';
const TableComponent = (props) => {
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [roleInfo, setRoleInfo] = useState({});

  const handleCancel = () => {
    setOpen(false);
  };
  const editUser = (params) => {
    setRoleInfo(params);
    setOpen(true);
  };
  const columns = [
    {
      title: '编号',
      dataIndex: 'uid',
      key: 'uid',
      width: 80,
    },
    {
      title: '昵称',
      dataIndex: 'userName',
      key: 'userName',
      width: 100,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 100,
    },
    {
      title: '登录名',
      dataIndex: 'uname',
      key: 'uname',
      width: 60,
      sorter: (a, b) => a.uname.length - b.uname.length,
      render: (_, record) => {
        return decodeURI(record.uname);
      },
    },
    {
      title: '用户角色',
      dataIndex: 'roleDesc',
      key: 'roleDesc',
      width: 80,
      render: (_, record) => {
        return record.roleDesc&&<Tag color={utils.stringToColor(record.roleDesc)}>{record.roleDesc}</Tag>;
      },
    },
    {
      title: '注册时间',
      dataIndex: 'regTime',
      key: 'regTime',
      width: 140,
      sorter: (a, b) => new Date(a.regTime) - new Date(b.regTime),
    },
    {
      title: '最近登录时间',
      dataIndex: 'loginTime',
      key: 'loginTime',
      width: 140,
      sorter: (a, b) => new Date(a.loginTime) - new Date(b.loginTime),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => editUser(record)}>编辑</a>
          <Popconfirm title={`确认删除该用户吗？`} onConfirm={() => deleUser(record.uid)} okText="是" cancelText="否">
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
  const fetchUserList = (bool) => {
    if (bool) {
      props.run({ page: 1, pageSize });
    }
    setOpen(false);
  };
  const deleUser = async (uid) => {
    let resp = await dispatch({
      type: 'Config/deleUser',
      payload: { uid },
    });
    if (resp) {
      props.run({ page: 1, pageSize });
    }
  };
  return (
    <div>
      <Table dataSource={props.list} columns={columns} rowKey="uid" size="small" pagination={false} loading={props.loading} />
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
      <Drawer forceRender={true} width={480} placement="right" title="编辑用户角色" open={open} onClose={handleCancel}>
        <EditRoleUser data={roleInfo} run={fetchUserList} />
      </Drawer>
    </div>
  );
};

export default TableComponent;
