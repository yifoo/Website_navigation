import { Select } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useSelector } from 'umi';
import style from './style.less';
const { Option } = Select;
const SelectExtra = forwardRef((props, ref) => {
  const activeBtnList = useSelector((state) => state.Nav.activeBtnList);
  const [extraList, setExtraList] = useState([]);
  const [value, setValue] = useState({label:'默认',value:0});
  useImperativeHandle(ref, () => ({
    extra: value,
  }));
  useEffect(() => {
    props.list.forEach((item) => {
      if (item.btnId === activeBtnList[Number(props.tabKey)]) {
        if (item.extra) {
          setExtraList(item.extra);
          setValue({label:'默认',value:0})
        } else {
          setExtraList([]);
        }
      }
    });
  }, [props.list, activeBtnList]);
  return extraList.length > 0 ? (
    <Select size="large" value={value} className={style.searchExtra} onChange={setValue} labelInValue={true}>
      <Option value={''} key={0}>
        默认
      </Option>
      {extraList.map((extra) => {
        return (
          <Option value={extra.value} key={extra.value}>
            {extra.label}
          </Option>
        );
      })}
    </Select>
  ) : null;
});

export default SelectExtra;
