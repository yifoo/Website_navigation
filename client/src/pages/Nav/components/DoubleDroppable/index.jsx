import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import style from './style.less';
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 5;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  background: isDragging ? 'lightgreen' : null,
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : '',
  padding: `0 ${grid}px`,
  // width: 250,
});
export default (props) => {
  const [list1, setList1] = useState([]);
  const [list2, setList2] = useState([]);
  const getList = (id) => {
    if (id === 'droppable') return list1;
    if (id === 'droppable2') return list2;
  };
  useEffect(() => {
    let list1 = [],
      list2 = [];
    props.data.forEach((item, key) => {
      if (key % 2 == 0) {
        list1.push(item);
      } else {
        list2.push(item);
      }
    });
    setList1(list1);
    setList2(list2);
  }, [props.data]);
  const reCalcList = (data1, data2) => {
    if (JSON.stringify(data1) === JSON.stringify(list1) && JSON.stringify(data2) === JSON.stringify(list2)) {
      return false;
    }
    let data = [],
      length = Math.max(data1?data1.length:0, data2?data2.length:0);
    for (let i = 0; i < length; i++) {
      if (data1&&data1[i]) {
        data.push(data1[i]);
      }
      if (data2&&data2[i]) {
        data.push(data2[i]);
      }
    }
    let order = [];

    data.forEach((item, key) => {
      order.push({ id: item.id, index: key });
    });
    props.updateOrder(order); //*更新远程排序
    props.setData(data); //* 更新状态排序数据
  };
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    let state = {};
    if (source.droppableId === destination.droppableId) {
      const list = reorder(getList(source.droppableId), source.index, destination.index);
      state = { list1: list };
      if (source.droppableId === 'droppable2') {
        state = { list2: list };
      }
    } else {
      const result = move(getList(source.droppableId), getList(destination.droppableId), source, destination);
      state = { list1: result.droppable, list2: result.droppable2 };
      setList1(state.list1);
      setList2(state.list2);
    }
    let list1 = state.list1 ? state.list1 : list1;
    let list2 = state.list2 ? state.list2 : list2;
    reCalcList(list1, list2);
  };

  if (list1.length === 0) return null;
  return (
    <div className={style['drag-box']}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} className={style.grid}>
              {getList('droppable').map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id + item.sortName}
                  index={index}
                  isDragDisabled={props.isDragDisabled}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                    >
                      {props.render(item)}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Droppable droppableId="droppable2">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} className={style.grid}>
              {getList('droppable2').map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id + item.sortName}
                  index={index}
                  isDragDisabled={props.isDragDisabled}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                    >
                      {props.render(item)}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
