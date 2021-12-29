import { PlusCircleOutlined } from '@ant-design/icons';
import { Col } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Site from './Site';
import SortTitle from './SortTitle';
import style from './style.less';
const SiteSort = (props) => {
  const [activekey, setActivekey] = useState(0);
  const [startIndex, setStartIndex] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [siteList, setSiteList] = useState([]);
  const [isOrderable, setIsOrderable] = useState(false);
  const { data } = props;
  useEffect(() => {
    setIsOrderable(props.isEdit && props.orderVal === 'site');
  }, [props.isEdit, props.orderVal]);

  useEffect(() => {
    let listData = data.children[activekey] ? data.children[activekey].children : [];
    setSiteList(listData);
  }, [data, data && data.children[activekey] && JSON.stringify(data.children[activekey].children), activekey]);

  /**
   * 添加网址
   */
  const addSite = () => {
    let sortData = data.children[activekey];
    props.setSiteInfo({ parentId: data.sortId, sortId: sortData.sortId });
    props.setShowEditSite(true);
  };
  // // * 拖拽排序
  // const reCalcList = (list) => {
  //   let orderList = [];
  //   list.forEach((item, key) => {
  //     orderList.push({ siteId: item.siteId, index: key });
  //   });
  //   props.updateSiteOrder(orderList);
  // };
  // const reorder = (list, startIndex, endIndex) => {
  //   const result = Array.from(list);
  //   const [removed] = result.splice(startIndex, 1);
  //   result.splice(endIndex, 0, removed);
  //   return result;
  // };
  // // * 拖拽开始
  // const onDragStart = (e) => {
  //   let sIndex = e.target.getAttribute('index');
  //   if (!sIndex) {
  //     return;
  //   }
  //   setStartIndex(sIndex);
  // };
  // const onDragEnter = (e) => {
  //   e.preventDefault();
  //   let list = JSON.parse(JSON.stringify(siteList));
  //   let dIndex = e.target.getAttribute('index');
  //   if (!dIndex) {
  //     return;
  //   }
  //   setDragIndex(dIndex);
  // };
  // const onDragEnd = (e) => {
  //   e.preventDefault();
  //   let endIndex = e.target.getAttribute('index');

  //   if (!endIndex) {
  //     return;
  //   }
  //   let list = reorder(siteList, startIndex, dragIndex);
  //   if (endIndex) {
  //     setStartIndex(null);
  //     setDragIndex(null);
  //   }
  //   if (JSON.stringify(list) === JSON.stringify(siteList)) {
  //     return false;
  //   }
  //   setSiteList(list);
  //   reCalcList(list);
  // };

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  // const reCalcList = (list) => {
  //   let siteList = [];
  //   list.forEach((item, key) => {
  //     siteList.push({ id: item.id, index: key });
  //   });
  //   props.updateSortOrder(siteList);
  // };
  const reCalcList = (list) => {
    let orderList = [];
    list.forEach((item, key) => {
      orderList.push({ siteId: item.siteId, index: key });
    });
    props.updateSiteOrder(orderList);
  };
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const newSiteList = reorder(siteList, source.index, destination.index);
    if (JSON.stringify(siteList) === JSON.stringify(newSiteList)) {
      return false;
    }
    setSiteList(newSiteList);
    reCalcList(newSiteList);
  };
  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    background: isDragging ? 'lightgreen' : null,
    ...draggableStyle,
  });
  return (
    <div className={`${props.className || ''} ${style.sortBox}`}>
      <SortTitle data={data} activekey={activekey} setActivekey={setActivekey} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={'sort' + data.children[activekey]} direction="horizontal">
          {(provided, snapshot) => (
            <div className={style.siteContainBox} ref={provided.innerRef}>
              {siteList.map((item, key) => {
                return (
                  <Draggable
                    isDragDisabled={!isOrderable}
                    key={item.siteId}
                    draggableId={'site' + item.siteId}
                    index={key}
                    key={key}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={`${isOrderable ? style.drag : ''}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        index={key}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      >
                        <Site {...item} />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {props.isEdit ? (
                <Col>
                  <div className={style.site}>
                    <div className={style.edit}>
                      <PlusCircleOutlined onClick={addSite} />
                    </div>
                  </div>
                </Col>
              ) : null}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
const mapStateToProps = (state) => ({
  showEditSite: state.Nav.showEditSite,
  isEdit: state.Nav.isEdit,
  sortList: state.Nav.sortList,
  orderVal: state.Nav.orderVal,
});

const mapDispatchToProps = (dispatch) => ({
  setShowEditSite(params) {
    return dispatch({
      type: 'Nav/setShowEditSite',
      payload: params,
    });
  },
  setShowEditSubSort(params) {
    return dispatch({
      type: 'Nav/setShowEditSubSort',
      payload: params,
    });
  },
  setSiteInfo(params) {
    return dispatch({
      type: 'Nav/setSiteInfo',
      payload: params,
    });
  },
  setSortInfo(params) {
    return dispatch({
      type: 'Nav/setSortInfo',
      payload: params,
    });
  },
  delSort(params) {
    return dispatch({
      type: 'Nav/delSort',
      payload: params,
    });
  },
  addSort(params) {
    return dispatch({
      type: 'Nav/addSort',
      payload: params,
    });
  },
  updateSort(params) {
    return dispatch({
      type: 'Nav/updateSort',
      payload: params,
    });
  },
  updateSortOrder(params) {
    return dispatch({
      type: 'Nav/updateSortOrder',
      payload: params,
    });
  },
  updateSiteOrder(params) {
    return dispatch({
      type: 'Nav/updateSiteOrder',
      payload: params,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SiteSort);
