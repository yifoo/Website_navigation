import { Affix, Anchor, Empty, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import SiteBox from '../SiteBox';
import AddSort from '../components/AddSort';
import EditSiteModal from '../components/EditSite';
import EditSubSortModal from '../components/EditSubSort';

import DoubleDroppable from './DoubleDroppable';
import style from './style.less';
const { Link } = Anchor;
const SiteWrapper = (props) => {
  const dispatch = useDispatch();
  const siteList = useSelector((state) => state.Nav.siteList);
  const isEdit = useSelector((state) => state.Nav.isEdit);
  const orderVal = useSelector((state) => state.Nav.orderVal);
  const [targetOffset, setTargetOffset] = useState(undefined);
  const isMobile = window.document.body.clientWidth <= 991;
  useEffect(() => {
    setTargetOffset(50);
  }, []);
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
    <div className={props.className}>
      {!isMobile ? (
        <div className={style.anchor}>
          <Anchor targetOffset={targetOffset}>
            {siteList.map((item, key) => {
              return <Link href={`#${item.sortId}`} className={style.anchorBtn} key={key} title={item.sortName} />;
            })}
          </Anchor>
        </div>
      ) : null}

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
