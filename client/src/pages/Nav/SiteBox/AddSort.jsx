import { CheckCircleOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Input, Popconfirm, Select } from 'antd';
import { useState } from 'react';
import style from './style.less';
const AddSort = (props) => {
  const [showSortInput, setShowSortInput] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [sortValue, setSortValue] = useState('');
  const [colorVal, setColorVal] = useState('green');

  let inputRef;
  let colorOptions = [
    { value: 'green', label: '鹦鹉绿', backgroundColor: 'rgba(91, 174, 35, 1)' },
    { value: 'orange', label: '淡橘橙', backgroundColor: 'rgba(248, 182, 41, 1)' },
    { value: 'red', label: '山茶红', backgroundColor: 'rgba(237, 85, 106, 1)' },
    { value: 'blue', label: '天湖蓝', backgroundColor: 'rgba(41, 155, 248, 1)' },
    { value: 'yellow', label: '金瓜黄', backgroundColor: 'rgba(252, 210, 23, 1)' },
    { value: 'kongquelan', label: '孔雀蓝', backgroundColor: 'rgba(14, 176, 201, 1)' },
    { value: 'tongGreen', label: '古铜绿', backgroundColor: 'rgba(83, 60, 27, 1)' },
  ];
  const changeSort = (e) => {
    setSortValue(e.target.value.trim());
  };
  const selectColor = (params) => {
    setColorVal(params.value);
    setSelectOpen(false);
  };
  // *切换增加分类确认显示
  const closeAddSort = () => {
    setShowSortInput(false);
    setSortValue('');
    setColorVal('green');
  };
  const submitSort = async () => {
    let res = await props.addSort({ sortName: sortValue, color: colorVal });
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
        <Select
          options={colorOptions}
          value={colorVal}
          open={selectOpen}
          onClick={() => setSelectOpen(!selectOpen)}
          dropdownClassName={style.dropSelect}
          dropdownRender={() => {
            return colorOptions.map((item, key) => {
              return (
                <div key={key} className={style.dropColor} onClick={() => selectColor(item)}>
                  <i
                    style={{
                      display: 'inline-block',
                      width: '2.5rem',
                      height: '1.5rem',
                      backgroundColor: item.backgroundColor,
                    }}
                  ></i>
                  <span style={{ color: '#8492a6' }}>{item.label}</span>
                </div>
              );
            });
          }}
          className={style.sortSelect}
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
export default AddSort;
