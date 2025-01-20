import { userApi } from '@/services';
import { useRequest } from 'ahooks';
import { Button, Card, Col, Row, Tree } from 'antd';
import { useEffect, useState } from 'react';
import Table from './components/Table';
import style from './style.less';
import { message } from 'antd';
const UserRole = () => {
  const [params, setParams] = useState({ page: 1, pageSize: 10 });
  const [page, setPage] = useState(1);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const roleData = useRequest(userApi.queryRoleList, { manual: false });
  const roleAccess = useRequest(userApi.queryRoleCode, { manual: true });
  const saveAccess = useRequest(userApi.saveRoleAccess, { manual: true });
  const { data, loading, run } = useRequest(userApi.queryRoleUserList, { manual: false, defaultParams: params });
  const pageChange = async (values) => {
    let reqParams = JSON.parse(JSON.stringify(params));
    Object.assign(reqParams, values);
    await run(reqParams);
    setPage(values.page);
    setParams(reqParams);
  };
  const getRole = async () => {
    let resp = await roleAccess.runAsync();
    setCheckedKeys(resp.data);
  };
  useEffect(() => {
    getRole();
  }, []);
  const onCheck = (params) => {
    setCheckedKeys(params);
  };
  const submitAccess = async () => {
    let resp = await saveAccess.runAsync(checkedKeys);
    if (resp.code === 200) {
      message.success(resp.msg);
    } else {
      message.error(resp.msg);
      getRole();
    }
  };
  return (
    <div className={style.listContainer}>
      <Row>
        <Col span={5}>
          <Card title="角色权限" bordered={false}>
            {roleData.data && (
              <Tree
                checkable
                className={style.role}
                showSearch
                allowClear
                treeData={roleData.data.data}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                fieldNames={{ key: 'id', title: 'description', children: 'children' }}
              />
            )}
            <Button onClick={submitAccess} type="primary" block>
              保存
            </Button>
          </Card>
        </Col>
        <Col span={19}>
          <Card title="角色用户" bordered={false}>
            <Table
              list={data && data.data && data.data.length > 0 ? data.data : []}
              total={data && data.data && data.data.length > 0 ? data.total : 0}
              page={page}
              loading={loading}
              run={pageChange}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserRole;
