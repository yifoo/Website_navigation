import ColorPicker from '@/components/ColorPicker';
import { CheckCircleOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Popover } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'umi';
import style from './style.less';
const AddSort = (props) => {
  const [showSortInput, setShowSortInput] = useState(false);
  const [sortValue, setSortValue] = useState('');
  const [color, setColor] = useState('#299bf8');
  const dispatch = useDispatch();
  let inputRef;
  const changeSort = (e) => {
    setSortValue(e.target.value.trim());
  };
  // *切换增加分类确认显示
  const closeAddSort = () => {
    setShowSortInput(false);
    setSortValue('');
    setColor('#299bf8');
  };
  const submitSort = async () => {
    let res = await dispatch({
      type: 'Nav/addSort',
      payload: { sortName: sortValue, color },
    });
    if (res) {
      closeAddSort();
    }
  };
  return (
    <div className={`${style.addSort}`}>
      <div className={`${style.addSortInput} ${showSortInput ? style.showSortInput : ''}`}>
        <Input
          ref={(input) => (inputRef = input)}
          className={`${style.sortInput} `}
          value={sortValue}
          placeholder="四个字以内最佳"
          onChange={changeSort}
        />
        <Popover content={<ColorPicker color={color} onChange={setColor} />} title="" trigger="click">
          <Button
            type="text"
            style={{ backgroundColor: color, color: '#fff', textShadow: '1px 1px 2px #666', fontWeight: 'bold' }}
          >
            点我选主题
          </Button>
        </Popover>
      </div>
      <div className={style.addSortIcon}>
        {!showSortInput ? (
          <PlusCircleOutlined
            onClick={() => {
              setShowSortInput(true);
              inputRef.focus();
            }}
          />
        ) : null}
        {showSortInput ? (
          <>
            <Popconfirm title={`确认添加 ${sortValue} 分类吗`} onConfirm={submitSort} okText="是" cancelText="否">
              <CheckCircleOutlined className={style.yes} />
            </Popconfirm>
            <MinusCircleOutlined onClick={closeAddSort} className={style.del} />
          </>
        ) : null}
      </div>
    </div>
  );
};
export default AddSort;
