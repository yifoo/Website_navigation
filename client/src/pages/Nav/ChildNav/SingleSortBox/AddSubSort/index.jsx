import { CheckCircleOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Input, Popconfirm } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'umi';
import style from './style.less';
const AddSubSort = (props) => {
  const [showSortInput, setShowSortInput] = useState(false);
  const [sortValue, setSortValue] = useState('');
  const dispatch = useDispatch();
  let inputRef;
  const changeSort = (e) => {
    setSortValue(e.target.value.trim());
  };
  // *切换增加分类确认显示
  const closeAddSort = () => {
    setShowSortInput(false);
    setSortValue('');
  };
  const submitSort = async () => {
    let res = await dispatch({
      type: 'Nav/addSort',
      payload: { sortName: sortValue, parentId: props.sortId, color: props.color },
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
export default AddSubSort;
