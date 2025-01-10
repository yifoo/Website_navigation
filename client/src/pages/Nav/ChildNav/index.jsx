import { useBoolean } from 'ahooks';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import SingleSortBox from './SingleSortBox';
import { Anchor, Empty } from 'antd';
export default function ChildNavPage(props) {
  const [isLoading, { toggle, setTrue, setFalse }] = useBoolean(false);
  const [sortData, setSortData] = useState({});
  const siteList = useSelector((state) => state.Nav.siteList); //* 全部网址数据
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
      const sortName = props.match.params.sort;
      siteList.map((item) => {
        if (sortName === item.sortName) {
          setSortData(item);
          return false;
        }
      });
    }
    return setFalse;
  }, [JSON.stringify(siteList)]);

  return Object.keys(sortData).length && <SingleSortBox data={sortData} />;
}
