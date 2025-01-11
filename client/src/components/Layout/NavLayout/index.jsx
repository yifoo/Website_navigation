import bg from '@/assets/img/bg.jpeg';
import SearchBox from '@/components/SearchBox';
import EditSiteModal from '@/pages/Nav/components/EditSite';
import EditSubSortModal from '@/pages/Nav/components/EditSubSort';
import { useBoolean } from 'ahooks';
import { Spin } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useModel, useSelector } from 'umi';
import NavConfig from './NavConfig';
import style from './style.less';

export default function NavPage(props) {
  const [isLoading, { toggle, setTrue, setFalse }] = useBoolean(false);
  const siteList = useSelector((state) => state.Nav.siteList); //* 全部网址数据
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
  const updateFromLocalSiteList = () => {
    let localSiteList = localStorage.getItem('siteList');
    let localSorList = localStorage.getItem('sortList');
    if (localSiteList && localSorList) {
      localSiteList = JSON.parse(localSiteList);
      dispatch({
        type: 'Nav/setOrderSiteList',
        payload: localSiteList,
      });
      localSorList = JSON.parse(localSorList);
      dispatch({
        type: 'Nav/setSortList',
        payload: localSorList,
      });
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    if (siteList.length === 0) {
      let status = updateFromLocalSiteList();
      if (!status) {
        setTrue();
        fetchSort();
        fetchAllSites();
      }
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
        {props.children}
        {!isMobile&&<NavConfig refresh={{ setTrue, setFalse }} />}
        <EditSiteModal />
      <EditSubSortModal />
      </div>
    </Spin>
  );
}
