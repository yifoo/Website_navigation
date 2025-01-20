import { userApi } from '@/services';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import SearchBox from './components/SearchBox';
import Table from './components/Table';
import style from './style.less';
const AccountList = () => {
  const [params, setParams] = useState({ page: 1, pageSize: 10 });
  const [page, setPage] = useState(1);
  const { data, loading, run } = useRequest(userApi.queryUserList, { manual: false, defaultParams: params });
  const runSearch = async (values) => {
    let reqParams = JSON.parse(JSON.stringify(params));
    Object.assign(reqParams, values);
    reqParams.page = 1;
    await run(reqParams);
    setPage(1);
    setParams(reqParams);
  };
  const pageChange = async (values) => {
    let reqParams = JSON.parse(JSON.stringify(params));
    Object.assign(reqParams, values);
    await run(reqParams);
    setPage(values.page);
    setParams(reqParams);
  };
  return (
    <div className={style.listContainer}>
      <SearchBox run={runSearch} />
      <Table
        list={data && data.data && data.data.length > 0 ? data.data : []}
        total={data && data.data && data.data.length > 0 ? data.total : 0}
        page={page}
        loading={loading}
        run={pageChange}
      />
    </div>
  );
};

export default AccountList;
