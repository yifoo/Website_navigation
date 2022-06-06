import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import style from './style.less';
const SearchBtn = memo((props) => {
  const [activeKey, setActiveKey] = useState();
  const activeBtnList = useSelector((state) => state.Nav.activeBtnList);
  const dispatch = useDispatch();
  const updateKey = (key) => {
    setActiveKey(key);
    props.updateKey(key);
  };
  useEffect(() => {
    if (activeBtnList[props.index] !== activeKey) {
      updateKey(activeBtnList[props.index]);
      // return ()=>setActiveKey()
    }
  }, [activeBtnList,props.index]);
  /**
   * *切换搜索按钮
   */
  const changeActiveBtn = (e) => {
    if (e.target.getAttribute('index')) {
      let btn = props.list.btns[e.target.getAttribute('index')];
      const btnId = Number(btn.btnId);
      let arr = Array.from(activeBtnList);
      updateKey(btnId);
      props.handleSearch(activeKey, btn);
      if (arr[props.index] !== btnId) {
        arr[props.index] = btnId;
        dispatch({
          type: 'Nav/updateActiveBtnList',
          payload: arr,
        });
      }
    }
  };
  return (
    <>
      <div className={style.sBtns} onClick={changeActiveBtn}>
        {props.list.btns.map((btn, key) => {
          return (
            <span
              className={`${style.sbtn} ${btn.btnId === activeKey ? style.active : ''}`}
              key={btn.btnId}
              index={key}
            >
              {btn.name}
            </span>
          );
        })}
      </div>
    </>
  );
});

export default SearchBtn;
