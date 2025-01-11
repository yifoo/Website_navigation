import utils from '@/utils/libs';
import { CloseCircleFilled, EditOutlined } from '@ant-design/icons';
import { Badge, Button, Divider, Popconfirm, Tag, Tooltip } from 'antd';
import { memo, useEffect, useState } from 'react';
import LazyLoad from 'react-lazyload';
import { useDispatch, useModel, useSelector } from 'umi';
import style from './style.less';
const tagColor = {
    新闻: '#299bf8',
    工具: '#f8b629',
    AI: '#3370FF',
    IT: '#76a0FF',
    NAS: '#a6c0FF',
    搜索: '#ed556a',
    办公: '#1a92f8',
    学习: '#0eb0c9',
    市场: '#248067',
    阅读: '#42B883',
    效率: '#A255FC',
    艺术: '#F2574F',
    音乐: '#DE181B',
    网盘: '#FEAD62',
    导航: '#E4DCAE',
    日常: '#EC8C89',
  };
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
        if (res.data === '200') {
          setPingStatus('success');
        } else if (res.data === '301' || res.data === '302') {
          setPingStatus('warning');
        } else if (res.data === '000' || res.data === '500' || res.data === '501' || res.data === '502') {
          setPingStatus('error');
        } else {
          setPingStatus('default');
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
      className={`${style.site} ${props.draggable ? style.drag : ''} ${props.className} ${style.siteWrapper}`}
      draggable={props.draggable}
      index={props.index}
    >
      <Tooltip title={props.siteDesc} placement="bottom">
        <Button className={style.siteLink} type="text" loading={pingLoading}>
          {!isMobile ? (
            <LazyLoad overflow={false} once={true} throttle={200} debounce={200} className={style.lineimg}>
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
          <div className={style.content} mark="url" data-url={props.siteUrl} data-id={props.id}>
            <div className={style.siteName} mark="url" data-url={props.siteUrl} data-id={props.id}>
              {props.siteName}
            </div>
            <div className={style.ellipsis} mark="url" data-url={props.siteUrl} data-id={props.id}>
              {props.siteDesc}
            </div>
          </div>
        </Button>
      </Tooltip>
      <Divider orientation="left" style={{ margin: 0 }}></Divider>
      {props.tags && !isMobile && (
        <div className={style.tagClass}>
          {props.tags.split(',').map((item, key) => {
            return (
              <Tag color={tagColor[item] || utils.stringToColor(item)} key={key} className={style.tag}>
                {item}
              </Tag>
            );
          })}
        </div>
      )}
      {/* </div> */}
      {isEdit ? (
        <div className={style.edit} index={props.index}>
          <EditOutlined className={style.editSite} onClick={editSite} mark="edit" />
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
