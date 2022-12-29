import { CloseCircleFilled, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Tooltip } from 'antd';
import { memo } from 'react';
import LazyLoad from 'react-lazyload';
import { useDispatch, useModel, useSelector } from 'umi';
import style from './style.less';
const Site = memo((props) => {
  const { initialState } = useModel('@@initialState');
  const isEdit = useSelector((state) => state.Nav.isEdit);
  const isMobile = initialState.isMobile;
  const dispatch = useDispatch();
  const editSite = () => {
    dispatch({
      type: 'Nav/fetchSite',
      payload: { siteId: props.id },
    });
    dispatch({
      type: 'Nav/setShowEditSite',
      payload: { open: true, type: 'edit' },
    });
  };
  const confirmDel = () => {
    dispatch({
      type: 'Nav/delSite',
      payload: { siteId: props.id },
    });
  };
  return (
    <div
      className={`${style.site} ${props.draggable ? style.drag : ''} ${props.className}`}
      draggable={props.draggable}
      index={props.index}
    >
      <Tooltip title={props.siteDesc} placement="bottom">
        <div className={style.siteLink}>
          {!isMobile ? (
            <LazyLoad overflow={false} once={true} throttle={200} debounce={200}>
              <img
                className={style.icon}
                src={props.logoSrc}
                mark="img"
                data-id={props.id}
                onError={(e) => {
                  e.target.src = 'https://img.haohome.top/uPic/blankico.jpg';
                }}
              />
            </LazyLoad>
          ) : null}
          <span className={style.siteName} mark="url" data-url={props.siteUrl} data-id={props.id}>
            {props.siteName}
          </span>
        </div>
      </Tooltip>
      {isEdit ? (
        <div className={style.edit}>
          <EditOutlined onClick={editSite} mark="edit" />
          <Popconfirm title="确认删除该网址吗" onConfirm={confirmDel} okText="是" cancelText="否">
            <CloseCircleFilled className={style.delSite} />
          </Popconfirm>
        </div>
      ) : null}
    </div>
  );
});

export default Site;
