import bg from '@/assets/img/bg.jpeg';
import SearchBox from '@/components/SearchBox';
import EditSiteModal from '@/pages/Nav/components/EditSite';
import EditSubSortModal from '@/pages/Nav/components/EditSubSort';
import { useBoolean } from 'ahooks';
import { Anchor, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useModel, useSelector } from 'umi';
import NavConfig from './NavConfig';
import style from './style.less';
const { Link } = Anchor;
export default function NavLayout(props) {
  const [isLoading, { toggle, setTrue, setFalse }] = useBoolean(false);
  const siteList = useSelector((state) => state.Nav.siteList); //* 全部网址数据
  const sortList = useSelector((state) => state.Nav.sortList); //* 全部分类数据
  const [listSort, setListSort] = useState([]);
  const { initialState } = useModel('@@initialState');
  const isPad = initialState.isPad;
  const isMobile = initialState.isMobile;
  const dispatch = useDispatch();
  const [targetOffset, setTargetOffset] = useState(undefined);
  useEffect(() => {
    setTargetOffset(48);
  }, []);
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
  const getList = () => {
    if (sortList.length > 0 && props.location.pathname.indexOf('/nav/') > -1) {
      let pathname = props.location.pathname.split('/')[2];
      sortList.map((item) => {
        if (item.sortName === pathname) {
          setListSort(item.children);
          return false;
        }
      });
    } else {
      setListSort(sortList);
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
      getList();
      setFalse();
    }
    return setFalse;
  }, [siteList]);
  useEffect(() => {
    getList();
  }, [props.location.pathname]);
  return (
    <Spin tip="加载中..." wrapperClassName={style.loading} spinning={isLoading} size="large">
      <div className={style.bg} style={{ backgroundImage: `url(${bg})` }}>
        <div className={style.searchContainer}>
          <SearchBox />
        </div>
        {props.children}
        {!isMobile && <NavConfig refresh={{ setTrue, setFalse }} />}
        <EditSiteModal />
        <EditSubSortModal />
        {!(isPad || isMobile) ? (
          <div className={style.anchor}>
            <Anchor targetOffset={targetOffset}>
              {listSort.map((item, key) => {
                return <Link href={`#${item.sortId}`} className={style.anchorBtn} key={key} title={item.sortName} />;
              })}
            </Anchor>
          </div>
        ) : null}
      </div>
    </Spin>
  );
}
