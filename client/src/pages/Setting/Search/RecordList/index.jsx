import { searchApi } from '@/services';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import SearchBox from './components/SearchBox';
import Table from './components/Table';
import style from './style.less';
const RecordList = () => {
  const [params, setParams] = useState({ page: 1, pageSize: 10, status: true });
  const [page, setPage] = useState(1);
  const { data, loading, run } = useRequest(searchApi.getRecordList, { manual: false, defaultParams: params });
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

export default RecordList;
