import { CloseCircleFilled, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Tooltip } from 'antd';
import { connect } from 'dva';
import LazyLoad from 'react-lazyload';
import style from './style.less';
const Site = (props) => {
  const editSite = (params) => {
    let res = props.fetchSite({ siteId: params.siteId });
    if (res) {
      props.setShowEditSite(true);
    }
  };
  const confirmDel = () => {
    props.delSite({ siteId: props.siteId });
  };
  return (
    <div className={style.site}>
      <Tooltip title={props.siteTips} placement="bottom">
        <a href={props.siteUrl} target="_blank">
          {!props.isMobile ? (
            <LazyLoad overflow={false} once={true} throttle={200} debounce={200}>
              <img
                className={style.icon}
                src={props.logoSrc}
                onError={(e) => {
                  e.target.src = 'https://img.haohome.top/uPic/blankico.jpg';
                }}
              />
            </LazyLoad>
          ) : null}
          <span className={style.siteName}>{props.siteName}</span>
        </a>
      </Tooltip>
      {props.isEdit ? (
        <div className={style.edit}>
          <EditOutlined onClick={() => editSite(props)} />
          <Popconfirm title="确认删除该网址吗" onConfirm={confirmDel} okText="是" cancelText="否">
            <CloseCircleFilled className={style.delSite} />
          </Popconfirm>
        </div>
      ) : null}
    </div>
  );
};
const mapStateToProps = (state) => ({
  showEditSite: state.Nav.showEditSite,
  isEdit: state.Nav.isEdit,
  orderVal: state.Nav.orderVal,
  isMobile: state.global.isMobile,
});

const mapDispatchToProps = (dispatch) => ({
  setShowEditSite(params) {
    return dispatch({
      type: 'Nav/setShowEditSite',
      payload: params,
    });
  },
  fetchSite(params) {
    return dispatch({
      type: 'Nav/fetchSite',
      payload: params,
    });
  },
  delSite(params) {
    return dispatch({
      type: 'Nav/delSite',
      payload: params,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Site);
