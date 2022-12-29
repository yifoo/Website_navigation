import { Empty } from 'antd';
import { useDispatch, useSelector } from 'umi';
import AddSort from '../components/AddSort';
import DoubleDroppable from './DoubleDroppable';
import EditSiteModal from '../components/EditSite';
import EditSubSortModal from '../components/EditSubSort';
import NavConfig from '../components/NavConfig';
import SiteBox from '../SiteBox';
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
  const isDragDisabled = !isEdit || orderVal !== 'sort';
  return (
    <div className={`${props.className}`}>
      <NavConfig />
      <DoubleDroppable
        data={siteList}
        setData={setOrderSiteList}
        updateOrder={updateSortOrder}
        render={(data) => {
          return <SiteBox data={data} />;
        }}
        isDragDisabled={isDragDisabled}
      />
      {isEdit ? <AddSort /> : null}
      {siteList.length === 0 ? <Empty className={style.siteEmpty} description="暂无数据" /> : null}
      <EditSiteModal />
      <EditSubSortModal />
    </div>
  );
};

export default SiteWrapper;
