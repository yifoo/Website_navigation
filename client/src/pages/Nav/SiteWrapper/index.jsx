import { Empty } from 'antd';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'umi';
import DoubleDroppable from '../components/DoubleDroppable';
import NavConfig from '../components/NavConfig';
import SiteBox from '../SiteBox';
import AddSort from './AddSort';
import EditSiteModal from './EditSite';
import EditSubSortModal from './EditSubSort';
// import LazyLoad from 'react-lazyload';
import style from './style.less';
const SiteWrapper = (props) => {
  const dispatch = useDispatch();
  const siteList = useSelector((state) => state.Nav.siteList);
  const isEdit = useSelector((state) => state.Nav.isEdit);
  const orderVal = useSelector((state) => state.Nav.orderVal);
  const setOrderSiteList = (params) => {
    dispatch({
      type: 'Nav/setOrderSiteList',
      payload: params,
    });
  };
  const updateSortOrder = (params) =>
    dispatch({
      type: 'Nav/updateSortOrder',
      payload: params,
    });
  const renderSiteBox = useCallback(
    (data) => {
      return (
        // <LazyLoad overflow={false} once={true} height={200} offset={100}>
        <SiteBox data={data} />
        // </LazyLoad>
      );
    },
    [siteList],
  );
  const isDragDisabled = !isEdit || orderVal !== 'sort';

  return (
    <div className={`${props.className}`}>
      <NavConfig />
      <DoubleDroppable
        data={siteList}
        setData={setOrderSiteList}
        updateOrder={updateSortOrder}
        render={(data) => {return <SiteBox data={data} />}}
        isDragDisabled={isDragDisabled}
      />
      {isEdit ? <AddSort/> : null}
      <EditSiteModal />
      <EditSubSortModal />
      {siteList.length === 0 ? <Empty className={style.siteEmpty} description="暂无数据" /> : null}
    </div>
  );
};

export default SiteWrapper;
