import ColorPicker from '@/components/ColorPicker';
import { CheckCircleOutlined, EditOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Input, message, Popconfirm, Popover } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import style from './style.less';
const SortMainTitle = (props) => {
  const [showSortInput, setShowSortInput] = useState(false);
  const dispatch = useDispatch();
  const isEdit = useSelector((state) => state.Nav.isEdit);
  const [sortValue, setSortValue] = useState('');
  const [color, setColor] = useState('#299bf8');

  useEffect(() => {
    setColor(props.data.color);
  }, [props.data.color]);
  useEffect(() => {
    setSortValue(props.data.sortName);
  }, [props.data.sortName]);
  //?请求添加一级分类
  const submitSort = async () => {
    let res = await dispatch({
      type: 'Nav/updateSort',
      payload: {
        sortId: props.data.sortId,
        sortName: sortValue,
        color,
      },
    });
    if (res) {
      setShowSortInput(false);
    }
  };
  //?编辑一级分类
  const editSort = () => {
    setShowSortInput(!showSortInput);
  };
  //?请求删除一级分类
  const confirmSortDel = () => {
    if (props.data.children && props.data.children.length > 0) {
      message.warn('当前分类下还存在内容,请清空后在操作');
      return false;
    }
    dispatch({
      type: 'Nav/delSort',
      payload: { sortId: props.data.sortId },
    });
  };
  const ComfirmPicker = () => {
    return (
      <>
        <ColorPicker color={color} onChange={setColor} />
        <Button type="primary" size="small" onClick={submitSort} block>
          确认
        </Button>
      </>
    );
  };
  const hideColor = () => {
    setColor(props.data.color);
  };
  return (
    <dt className={style.sortTitle} style={{ backgroundColor: color }}>
      {isEdit && (
        <span className={style.edit}>
          <EditOutlined onClick={editSort} />
        </span>
      )}
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
      ) : isEdit ? (
        <Popover content={<ComfirmPicker />} title="" trigger="hover" onOpenChange={hideColor}>
          <span style={{ margin: '0 5px' }}>{props.data.sortName}</span>
        </Popover>
      ) : (
        <span style={{ margin: '0 5px' }}>{props.data.sortName}</span>
      )}
      {isEdit && !showSortInput ? (
        <Popconfirm title={`确认删除该分类吗`} onConfirm={confirmSortDel} okText="是" cancelText="否">
          <MinusCircleOutlined className={style.del} />
        </Popconfirm>
      ) : null}
    </dt>
  );
};

export default SortMainTitle;
