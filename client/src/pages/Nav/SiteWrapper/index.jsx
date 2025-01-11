import { Anchor, Empty } from 'antd';
import { useDispatch, useModel, useSelector } from 'umi';
import SortBox from '../SortBox';
import AddSort from '../components/AddSort';


import DoubleDroppable from './DoubleDroppable';
import style from './style.less';
const { Link } = Anchor;
const SiteWrapper = (props) => {
  const dispatch = useDispatch();
  const { initialState } = useModel('@@initialState');
  const siteList = useSelector((state) => state.Nav.siteList);
  const isEdit = useSelector((state) => state.Nav.isEdit);
  const orderVal = useSelector((state) => state.Nav.orderVal);
  const isMobile = initialState.isMobile;
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
          <Anchor targetOffset={50}>
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
          return <SortBox data={data} />;
        }}
        isDragDisabled={isDragDisabled}
      />
      {isEdit ? <AddSort /> : null}
      {siteList.length === 0 ? <Empty className={style.siteEmpty} description="暂无数据" /> : null}
    </div>
  );
};

export default SiteWrapper;
