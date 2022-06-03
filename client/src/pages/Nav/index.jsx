import bg from '@/assets/img/bg.jpeg';
import SearchBox from '@/components/SearchBox';
import { useBoolean } from 'ahooks';
import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useModel, useSelector } from 'umi';
import OrderConfig from './components/OrderConfig';
import SiteWrapper from './SiteWrapper';
import style from './style.less';

export default function NavPage() {
  const [isLoading, { toggle, setTrue, setFalse }] = useBoolean(false);
  const siteList = useSelector((state) => state.Nav.siteList);
  const { initialState } = useModel('@@initialState');
  const isMobile = initialState.isMobile;
  const dispatch = useDispatch();
  const fetchSort = () =>
    dispatch({
      type: 'Nav/fetchSort',
    });
  const fetchAllSites = () =>
    dispatch({
      type: 'Nav/fetchAll',
    });
  const handleEdit = () => {
    dispatch({
      type: 'Nav/setIsEdit',
      payload: false,
    });
  };
  useEffect(() => {
    if (siteList.length === 0) {
      setTrue();
      fetchSort();
      fetchAllSites();
    }
    return handleEdit;
  }, []);
  useEffect(() => {
    setTrue();
    if (siteList.length > 0) {
      setFalse();
    }
    return setFalse;
  }, [siteList]);
  return (
    <Spin tip="加载中..." wrapperClassName={style.loading} spinning={isLoading} size="large">
      <div className={style.bg} style={{ backgroundImage: `url(${bg})` }}>
        <div className={style.searchContainer}>
          <SearchBox />
        </div>
        <SiteWrapper className={style.siteContainer} />
        {!isMobile ? <OrderConfig /> : null}
      </div>
    </Spin>
  );
}
