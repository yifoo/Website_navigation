import { Empty } from 'antd';
import { Component } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import injector from '../injector';
import AddSort from './AddSort';
import EditSiteModal from './EditSite';
import EditSubSortModal from './EditSubSort';
import SiteSort from './SiteSort';
import style from './style.less';

@injector
class SiteBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siteList: [],
      list1: [],
      list2: [],
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.siteList) === JSON.stringify(prevState.siteList)) {
      return null;
    }
    let list1 = [],
      list2 = [];
    nextProps.siteList.forEach((item, key) => {
      if (key % 2 == 0) {
        list1.push(item);
      } else {
        list2.push(item);
      }
    });
    return {
      siteList: nextProps.siteList,
      list1,
      list2,
    };
  }
  // a little function to help us with reordering the result
  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);
    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    return result;
  };
  reCalcList = (data1, data2) => {
    let data = [],
      length = Math.max(data1.length, data2.length) - 1;
    for (let i = 0; i < length; i++) {
      if (data1[i]) {
        data.push(data1[i]);
      }
      if (data2[i]) {
        data.push(data2[i]);
      }
    }
    let order = [];
    if (
      JSON.stringify(data1) === JSON.stringify(this.state.list1) &&
      JSON.stringify(data2) === JSON.stringify(this.state.list2)
    ) {
      return false;
    }
    this.props.setOrderSiteList(data);
    data.forEach((item, key) => {
      order.push({ id: item.id, index: key });
    });
    this.props.updateSortOrder(order);
  };
  onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      const items = this.reorder(this.state[source.droppableId], source.index, destination.index);
      if (source.droppableId === 'list1') {
        this.reCalcList(items, this.state.list2);
      } else {
        this.reCalcList(this.state.list1, items);
      }
    } else {
      const result = this.move(
        this.state[source.droppableId],
        this.state[destination.droppableId],
        source,
        destination,
      );
      this.reCalcList(result['list1'], result['list2']);
    }
  };
  getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    background: isDragging ? 'lightgreen' : null,
    ...draggableStyle,
  });
  render() {
    const { list1, list2 } = this.state;
    const { isEdit, orderVal } = this.props;
    const isDragDisabled = !(isEdit && orderVal === 'sort' && !this.props.isMobile);
    // if (siteList.length === 0) return false;
    return (
      <div className={`${this.props.className}`}>
        <div className={`${style.siteBox} ${!isDragDisabled ? style.sortDrag : ''}`}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="list1">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} className={style.grid}>
                  {list1.map((item, key) => {
                    return (
                      <Draggable
                        isDragDisabled={isDragDisabled}
                        key={item.id}
                        draggableId={'sort' + item.id}
                        index={key}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={this.getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                          >
                            <SiteSort data={item} dataIndex={JSON.stringify(item)} />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                </div>
              )}
            </Droppable>
            <Droppable droppableId="list2">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} className={style.grid}>
                  {list2.map((item, key) => {
                    return (
                      <Draggable
                        isDragDisabled={isDragDisabled}
                        key={item.id}
                        draggableId={'sort' + item.id}
                        index={key}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={this.getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                          >
                            <SiteSort data={item} dataIndex={JSON.stringify(item)} />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                </div>
              )}
            </Droppable>
            {this.props.isEdit ? <AddSort addSort={this.props.addSort} /> : null}
            <EditSiteModal />
            <EditSubSortModal />
          </DragDropContext>
        </div>
        {!this.props.isEdit && this.state.siteList.length === 0 ? (
          <Empty className={style.siteEmpty} description="暂无数据" />
        ) : null}
      </div>
    );
  }
}

export default SiteBox;
