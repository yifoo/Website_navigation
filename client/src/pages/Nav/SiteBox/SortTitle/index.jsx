import { DashboardOutlined } from '@ant-design/icons';
import hexAlpha from 'hex-alpha';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useDispatch } from 'umi';
import SortMainTitle from './sortMainTitle';
import style from './style.less';
import { EditSubSort, SubSort } from './subSort';

const SortTitle = (props) => {
  const dispatch = useDispatch();
  const { data, activekey, setActivekey } = props;
  const { sortName, color } = data;
  const [sortList, setSortList] = useState([]);
  const [isOrderable, setIsOrderable] = useState(false);
  useEffect(() => {
    setIsOrderable(props.isEdit && props.orderVal === 'subSort');
  }, [props.isEdit, props.orderVal]);
  useEffect(() => {
    setSortList(data.children || []);
  }, [data.children]);
  const toggleSubKey = (e) => {
    if (e.target.getAttribute('data-key')) {
      setActivekey(Number(e.target.getAttribute('data-key')));
    }
  };
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
    dispatch({
      type: 'Nav/updateSortOrder',
      payload: sortList,
    });
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
  const pingSite = async () => {
    dispatch({
      type: 'Nav/setPingSite',
      payload: sortList[activekey].sortId,
    });
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={sortName} direction="horizontal">
        {(provided, snapshot) => (
          <dl
            ref={provided.innerRef}
            className={`${style.sortTop}`}
            style={{ backgroundColor: hexAlpha(color, 0.1) }}
            onClick={toggleSubKey}
          >
            <SortMainTitle data={data} />
            {sortList.map((item, key) => {
              return (
                <Draggable
                  isDragDisabled={!isOrderable}
                  key={item.sortId}
                  draggableId={'sort' + item.sortId}
                  index={key}
                >
                  {(provided, snapshot) => (
                    <dd
                      key={item.sortId}
                      ref={provided.innerRef}
                      data-key={key}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${style.subSort} ${key === activekey ? style.active : ''} ${
                        isOrderable ? style.drag : ''
                      }`}
                      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                    >
                      <SubSort item={item} parent={{ sortId: data.sortId, sortName: data.sortName }} />
                    </dd>
                  )}
                </Draggable>
              );
            })}
            <EditSubSort sortId={data.sortId} />
            {props.isEdit && (
              <span className={style.subSort}>
                <DashboardOutlined onClick={pingSite} />
              </span>
            )}
          </dl>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SortTitle;
