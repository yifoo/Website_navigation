import { CheckCircleOutlined, EditOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Input, message, Popconfirm } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import style from './style.less';
const SortTitle = (props) => {
  const { data, activekey, setActivekey } = props;
  const { sortName, color } = data;
  const [sortList, setSortList] = useState([]);
  const [showSubSortInput, setShowSubSortInput] = useState(false);
  const [showSortInput, setShowSortInput] = useState(false);
  const [subSortValue, setSubSortValue] = useState('');
  const [sortValue, setSortValue] = useState('');
  const [showAddConfirm, setShowAddConfirm] = useState(false);
  const [isOrderable, setIsOrderable] = useState(false);
  useEffect(() => {
    setIsOrderable(props.isEdit && props.orderVal === 'subSort');
  }, [props.isEdit, props.orderVal]);
  useEffect(() => {
    setSortList(data.children || []);
  }, [JSON.stringify(data.children)]);
  let inputRef;
  const changeSubSort = (key) => {
    setActivekey(key);
  };
  const confirmDel = (params) => {
    if (params.children && params.children.length > 0) {
      message.warn('当前分类下还存在内容,请清空后在操作');
      return false;
    }
    props.delSort({ sortId: params.sortId });
  };
  //*显示添加二级分类弹窗
  const showAdd = () => {
    if (subSortValue) {
      setShowAddConfirm(true);
    } else {
      setShowSubSortInput(false);
    }
  };
  // ?请求添加二级分类
  const addSubSort = () => {
    props.addSort({ parentId: data.sortId, sortName: subSortValue });
    cancelAddSubSort();
  };
  //?编辑二级分类
  const editSubSort = (params) => {
    props.setSortInfo({
      sortId: data.sortId,
      sortName: data.sortName,
      subSortId: params.sortId,
      subSortName: params.sortName,
    });
    props.setShowEditSubSort(true);
  };
  //?取消添加二级分类
  const cancelAddSubSort = () => {
    setSubSortValue('');
    setShowAddConfirm(false);
    setShowSubSortInput(false);
  };
  //?请求添加一级分类
  const submitSort = () => {
    let res = props.updateSort({
      sortId: data.sortId,
      sortName: sortValue,
    });
    if (res) {
      setShowSortInput(false);
    }
  };
  //?编辑一级分类
  const editSort = () => {
    setSortValue(sortName);
    setShowSortInput(!showSortInput);
  };
  //?请求删除一级分类
  const confirmSortDel = () => {
    if (data.children && data.children.length > 0) {
      message.warn('当前分类下还存在内容,请清空后在操作');
      return false;
    }
    props.delSort({ sortId: data.sortId });
  };
  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  const reCalcList = (list) => {
    let sortList = [];
    list.forEach((item, key) => {
      sortList.push({ id: item.id, index: key });
    });
    props.updateSortOrder(sortList);
  };
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const newSortList = reorder(sortList, source.index, destination.index);
    if (JSON.stringify(sortList) === JSON.stringify(newSortList)) {
      return false;
    }
    setSortList(newSortList);
    reCalcList(newSortList);
  };
  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    background: isDragging ? 'lightgreen' : null,
    ...draggableStyle,
  });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <dl className={`${style.sortTop} ${style[color]}`}>
        <dt className={style.sortTitle}>
          {props.isEdit ? (
            <span className={style.edit}>
              <EditOutlined onClick={editSort} />
            </span>
          ) : null}
          <Input
            className={`${style.sortInput} ${showSortInput ? style.sortEdit : ''}`}
            value={sortValue}
            placeholder="四个字以内最佳"
            onChange={(e) => setSortValue(e.target.value)}
          />
          {showSortInput ? (
            <Popconfirm
              title={`确认修改该分类吗`}
              onConfirm={submitSort}
              onCancel={() => setShowSortInput(false)}
              okText="是"
              cancelText="否"
            >
              <CheckCircleOutlined />
            </Popconfirm>
          ) : (
            <span style={{ margin: '0 5px' }}>{sortName}</span>
          )}
          {props.isEdit && !showSortInput ? (
            <Popconfirm title={`确认删除该分类吗`} onConfirm={confirmSortDel} okText="是" cancelText="否">
              <MinusCircleOutlined className={style.del} />
            </Popconfirm>
          ) : null}
        </dt>
        <Droppable droppableId={sortName} direction="horizontal">
          {(provided, snapshot) => (
            <div ref={provided.innerRef}>
              {sortList.map((item, key) => {
                return (
                  <Draggable isDragDisabled={!isOrderable} key={item.id} draggableId={'sort' + item.id} index={key}>
                    {(provided, snapshot) => (
                      <dd
                        key={key}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => changeSubSort(key)}
                        className={`${style.subSort} ${key === activekey ? style.active : ''} ${
                          props.isEdit ? style.edit : ''
                        } ${isOrderable ? style.drag : ''}`}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      >
                        {props.isEdit ? (
                          <span className={style.edit}>
                            <EditOutlined onClick={() => editSubSort(item)} />
                          </span>
                        ) : null}
                        {item.sortName}
                        {props.isEdit ? (
                          <span className={style.edit}>
                            <Popconfirm
                              title="确认删除该分类吗"
                              onConfirm={() => confirmDel(item)}
                              okText="是"
                              cancelText="否"
                            >
                              <MinusCircleOutlined className={style.del} />
                            </Popconfirm>
                          </span>
                        ) : null}
                      </dd>
                    )}
                  </Draggable>
                );
              })}
              {props.isEdit ? (
                <>
                  <dd
                    className={`${style.subSort} `}
                    style={{
                      borderRadius: 0,
                      padding: 0,
                    }}
                  >
                    <Input
                      ref={(input) => (inputRef = input)}
                      className={`${style.subSortInput} ${showSubSortInput ? style.showSubSortInput : ''}`}
                      value={subSortValue}
                      onChange={(e) => setSubSortValue(e.target.value.trim())}
                      onBlur={showAdd}
                    />
                  </dd>
                  <dd className={`${style.subSort} ${style.addSubSort}`}>
                    <PlusCircleOutlined
                      onClick={() => {
                        setShowSubSortInput(true);
                        inputRef.focus();
                      }}
                      style={showSubSortInput ? { display: 'none' } : {}}
                    />
                    <Popconfirm
                      title="确认添加该分类吗"
                      onConfirm={addSubSort}
                      onCancel={cancelAddSubSort}
                      okText="是"
                      cancelText="否"
                      visible={showAddConfirm}
                    >
                      <CheckCircleOutlined style={!showSubSortInput ? { display: 'none' } : {}} onClick={showAdd} />
                    </Popconfirm>
                  </dd>
                </>
              ) : null}{' '}
            </div>
          )}
        </Droppable>
      </dl>
    </DragDropContext>
  );
};
const mapStateToProps = (state) => ({
  isEdit: state.Nav.isEdit,
  orderVal: state.Nav.orderVal,
});

const mapDispatchToProps = (dispatch) => ({
  setShowEditSubSort(params) {
    return dispatch({
      type: 'Nav/setShowEditSubSort',
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
});

export default connect(mapStateToProps, mapDispatchToProps)(SortTitle);
