import { useEffect, useState } from 'react';
import { useSelector } from 'umi';
import SingleSortBox from './SingleSortBox';
export default function ChildNavPage(props) {
  const [sortData, setSortData] = useState({});
  const siteList = useSelector((state) => state.Nav.siteList); //* 全部网址数据
  useEffect(() => {
    if (siteList.length > 0) {
      const sortName = props.match.params.sort;
      siteList.map((item) => {
        if (sortName === item.sortName) {
          setSortData(item);
          return false;
        }
      });
    }
  }, [JSON.stringify(siteList)]);

  return Object.keys(sortData).length && <SingleSortBox data={sortData} />;
}
