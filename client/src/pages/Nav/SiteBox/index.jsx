import { PlusCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import Site from '../Site';
import SortTitle from '../SortTitle';
import style from './style.less';
const SiteBox = function (props) {
  const isEdit = useSelector((state) => state.Nav.isEdit);
  const orderVal = useSelector((state) => state.Nav.orderVal);
  const dispatch = useDispatch();
  const [activekey, setActivekey] = useState(0);
  const [startIndex, setStartIndex] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [siteList, setSiteList] = useState([]);
  const [isOrderable, setIsOrderable] = useState(false);
  const { data = {} } = props;
  useEffect(() => {
    setIsOrderable(isEdit && orderVal === 'site');
  }, [orderVal, isEdit]);
  useEffect(() => {
    if (data.children) {
      let listData = data.children[activekey] ? data.children[activekey].children : [];
      setSiteList(listData);
    }
  }, [data, data.children, activekey]);

  /**
   * 添加网址
   */
  const addSite = () => {
    let sortData = data.children[activekey];
    dispatch({
      type: 'Nav/setSiteInfo',
      payload: { parentId: data.sortId, sortId: sortData.sortId },
    });
    dispatch({
      type: 'Nav/setShowEditSite',
      payload: true,
    });
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
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  // * 拖拽开始
  const onDragStart = (e) => {
    let sIndex = e.target.getAttribute('index');
    if (!sIndex) {
      return;
    }
    setStartIndex(sIndex);
  };
  const onDragEnter = (e) => {
    e.preventDefault();
    let dIndex = e.target.getAttribute('index');
    if (!dIndex) {
      return;
    }
    setDragIndex(dIndex);
  };
  const onDragEnd = (e) => {
    e.preventDefault();
    let endIndex = e.target.getAttribute('index');
    if (!endIndex) {
      return;
    }
    let list = reorder(siteList, startIndex, dragIndex);
    if (endIndex) {
      setStartIndex(null);
      setDragIndex(null);
    }
    if (JSON.stringify(list) === JSON.stringify(siteList)) {
      return false;
    }
    setSiteList(list);
    reCalcList(list);
  };
  const isDragDisabled = !isEdit || orderVal !== 'sort';
  const countClick = (e) => {
    e.preventDefault();
    if (e.target.getAttribute('data-url')) {
      window.open(e.target.getAttribute('data-url'));
      dispatch({
        type: 'Nav/clickSite',
        payload: { siteId: e.target.getAttribute('data-id') },
      });
    }
  };
  return (
    <div className={`${isDragDisabled ? '' : style.drag} ${style.sortBox}`}>
      <SortTitle data={data} activekey={activekey} setActivekey={setActivekey} isEdit={isEdit} orderVal={orderVal} />
      <div className={style.siteContainBox}>
        {data.children.map((current, index) => {
          return (
            <div
              key={index}
              className={style.siteList}
              style={{
                opacity: index === activekey ? 1 : 0,
                transform: index === activekey ? 'rotateX(0deg)' : 'rotateX(-90deg)',
                height: index === activekey ? 'auto' : 0,
              }}
              onClick={countClick}
              onDragStart={onDragStart}
              onDragEnter={onDragEnter}
              onDragEnd={onDragEnd}
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
                <div className={style.site}>
                  <div className={style.edit}>
                    <PlusCircleOutlined onClick={addSite} />
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default SiteBox;
