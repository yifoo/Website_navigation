import { PlusCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useDispatch, useModel, useSelector } from 'umi';
import { Anchor } from 'antd';
import Site from './Site';
import SortMainTitle from './SortMainTitle';
import style from './style.less';
const { Link } = Anchor;
const SingleSortBox = function (props) {
  const isEdit = useSelector((state) => state.Nav.isEdit);
  const { initialState } = useModel('@@initialState');
  const isLogin = initialState.isLogin;
  const isMobile = initialState.isMobile;
  const dispatch = useDispatch();
  const [startIndex, setStartIndex] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [siteBoxList, setSiteBoxList] = useState([]);
  const [isOrderable, setIsOrderable] = useState(false);
  const [targetOffset, setTargetOffset] = useState(undefined);
  useEffect(() => {
    setIsOrderable(isEdit);
  }, [isEdit]);
  useEffect(() => {
    setTargetOffset(50);
  }, []);
  useEffect(() => {
    if (props.data.children) {
      let keys = [];
      props.data.children.map((item, key) => {
        keys.push(key);
      });
      setSiteBoxList(props.data.children);
    }
  }, [props.data, props.data.sortId]);
  const setShowEditSite = (params) => {
    dispatch({
      type: 'Nav/setShowEditSite',
      payload: params,
    });
  };
  const setSiteInfo = (params) => {
    dispatch({
      type: 'Nav/setSiteInfo',
      payload: params,
    });
  };
  /**
   * 添加网址
   */
  const addSite = (index) => {
    let sortData = siteBoxList[index];
    setSiteInfo({ parentId: props.data.sortId, sortId: sortData.sortId });
    setShowEditSite({ open: true, type: 'edit' });
  };
  // * 拖拽排序
  const reCalcList = (list) => {
    let orderList = [];
    list.forEach((item, key) => {
      orderList.push({ siteId: item.id, index: key });
    });
    dispatch({
      type: 'Nav/updateSiteOrder',
      payload: orderList,
    });
  };
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list.children);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  // * 拖拽开始
  const onDragStart = (e, index) => {
    let sIndex = e.target.getAttribute('index');
    if (!sIndex) {
      return;
    }
    setStartIndex(sIndex);
  };
  const onDragEnter = (e, index) => {
    e.preventDefault();
    let dIndex = e.target.getAttribute('index');
    if (!dIndex) {
      return;
    }
    setDragIndex(dIndex);
  };
  const onDragEnd = (e, index) => {
    e.preventDefault();
    let endIndex = e.target.getAttribute('index');
    if (!endIndex) {
      return;
    }
    let list = reorder(siteBoxList[index], startIndex, dragIndex);
    if (endIndex) {
      setStartIndex(null);
      setDragIndex(null);
    }
    if (JSON.stringify(list) === JSON.stringify(siteBoxList[index].children)) {
      return false;
    }
    // setSiteList(list);
    reCalcList(list);
  };
  //* 单击打开网址
  const openClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.getAttribute('mark') === 'url') {
      window.open(e.target.getAttribute('data-url'));
      isLogin &&
        dispatch({
          type: 'Nav/clickSite',
          payload: { siteId: e.target.getAttribute('data-id') },
        });
    } else if (e.target.getAttribute('mark') === 'img' && isLogin) {
      setShowEditSite({ open: true, type: 'show' });
      dispatch({
        type: 'Nav/fetchSite',
        payload: { siteId: e.target.getAttribute('data-id') },
      });
    }
  };
  return (
    <>
      <div className={style.sortBox} onClick={openClick}>
        {siteBoxList.map((current, index) => {
          return (
            <div className={style.siteContainBox} key={index}>
              <SortMainTitle data={current} />
              <div>
                <div
                  className={style.siteList}
                  onDragStart={(e) => onDragStart(e, index)}
                  onDragEnter={(e) => onDragEnter(e, index)}
                  onDragEnd={(e) => onDragEnd(e, index)}
                >
                  {current.children.map((item, key) => {
                    return (
                      <Site
                        {...item}
                        key={key}
                        index={key}
                        draggable={isOrderable}
                        className={`${(typeof dragIndex !== 'object' && Number(dragIndex)) === key ? style.siteDrag : ''} `}
                      />
                    );
                  })}
                  {isEdit ? (
                    <div className={style.siteAdd}>
                      <div className={style.edit}>
                        <PlusCircleOutlined onClick={() => addSite(index)} />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* {!isMobile ? (
        <div className={style.anchor}>
          <Anchor targetOffset={targetOffset}>
            {siteBoxList.map((item, key) => {
              return <Link href={`#${item.sortId}`} className={style.anchorBtn} key={key} title={item.sortName} />;
            })}
          </Anchor>
        </div>
      ) : null} */}
    </>
  );
};

export default SingleSortBox;
