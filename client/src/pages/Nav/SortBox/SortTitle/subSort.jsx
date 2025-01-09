import { CheckCircleOutlined, EditOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Input, message, Popconfirm } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import style from './style.less';

export function SubSort(props) {
  const isEdit = useSelector((state) => state.Nav.isEdit);
  const dispatch = useDispatch();
  const confirmDel = (params) => {
    if (params.children && params.children.length > 0) {
      message.warn('当前分类下还存在内容,请清空后在操作');
      return false;
    }
    dispatch({
      type: 'Nav/delSort',
      payload: { sortId: params.sortId },
    });
  };
  //?编辑二级分类
  const editSubSort = (params) => {
    dispatch({
      type: 'Nav/setSortInfo',
      payload: {
        sortId: props.parent.sortId,
        sortName: props.parent.sortName,
        subSortId: params.sortId,
        subSortName: params.sortName,
      },
    });
    dispatch({
      type: 'Nav/setShowEditSubSort',
      payload: true,
    });
  };
  return (
    <>
      {isEdit ? (
        <span className={style.edit}>
          <EditOutlined onClick={() => editSubSort(props.item)} />
        </span>
      ) : null}
      {props.item.sortName}
      {isEdit ? (
        <span className={style.edit}>
          <Popconfirm title="确认删除该分类吗" onConfirm={() => confirmDel(props.item)} okText="是" cancelText="否">
            <MinusCircleOutlined className={style.del} />
          </Popconfirm>
        </span>
      ) : null}
    </>
  );
}

export function EditSubSort(props) {
  const isEdit = useSelector((state) => state.Nav.isEdit);
  const dispatch = useDispatch();
  const [showSubSortInput, setShowSubSortInput] = useState(false);
  const [subSortValue, setSubSortValue] = useState('');
  const [showAddConfirm, setShowAddConfirm] = useState(false);
  let inputRef;
  //*显示添加二级分类弹窗
  const showAdd = () => {
    if (subSortValue) {
      setShowAddConfirm(true);
    } else {
      setShowSubSortInput(false);
    }
  };
  //?取消添加二级分类
  const cancelAddSubSort = () => {
    setSubSortValue('');
    setShowAddConfirm(false);
    setShowSubSortInput(false);
  };
  // ?请求添加二级分类
  const addSubSort = () => {
    dispatch({
      type: 'Nav/addSort',
      payload: { parentId: props.sortId, sortName: subSortValue, color: props.color },
    });
    cancelAddSubSort();
  };
  return isEdit ? (
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
          open={showAddConfirm}
        >
          <CheckCircleOutlined style={!showSubSortInput ? { display: 'none' } : {}} onClick={showAdd} />
        </Popconfirm>
      </dd>
    </>
  ) : null;
}
