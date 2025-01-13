import { CloseCircleFilled, EditOutlined } from '@ant-design/icons';
import { Badge, Button, Popconfirm, Tooltip } from 'antd';
import { memo, useEffect, useState } from 'react';
import LazyLoad from 'react-lazyload';
import { useDispatch, useModel, useSelector } from 'umi';
import style from './style.less';
const Site = memo((props) => {
  const { initialState } = useModel('@@initialState');
  const isEdit = useSelector((state) => state.Nav.isEdit);
  const pingSite = useSelector((state) => state.Nav.pingSite);
  const [pingStatus, setPingStatus] = useState('default');
  const [pingLoading, setPingLoading] = useState(false);
  const isMobile = initialState.isMobile;
  const dispatch = useDispatch();
  useEffect(() => {
    if (pingSite && props.sortId === pingSite) {
      setPingLoading(true);
      dispatch({
        type: 'Nav/pingSiteStatus',
        payload: { siteUrl: props.siteUrl },
      }).then((res) => {
        setPingLoading(false);
        switch (res.data) {
          case '200':
            setPingStatus('success');
            break;
          case '301':
          case '403':
          case '405':
            setPingStatus('warning');
            break;
          case undefined:
          case '000':
          case '404':
          case '500':
          case '501':
          case '502':
            setPingStatus('error');
            break;
          default:
            setPingStatus('default');
            break;
        }
        dispatch({
          type: 'Nav/setPingSite',
          payload: null,
        });
      });
    }
  }, [pingSite]);
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
        <Button className={style.siteLink} type="text" loading={pingLoading}>
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
        </Button>
      </Tooltip>
      {isEdit ? (
        <div className={style.edit} index={props.index}>
          <EditOutlined onClick={editSite} mark="edit" />
          <Popconfirm title="确认删除该网址吗" onConfirm={confirmDel} okText="是" cancelText="否">
            <CloseCircleFilled className={style.delSite} />
          </Popconfirm>
          <Badge status={pingStatus} className={style.pingStatus} />
        </div>
      ) : null}
    </div>
  );
});

export default Site;
