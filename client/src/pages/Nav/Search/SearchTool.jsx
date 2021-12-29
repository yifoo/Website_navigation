import { Button, Row } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import style from './style.less';
const SearchTool = (props) => {
  const [list, setList] = useState([]);
  const [activeKey, setActiveKey] = useState(0);
  const [sBtn, setSBtn] = useState([]);
  const [status, setStatus] = useState(0); // 搜索按钮激活状态
  useEffect(() => {
    setList(JSON.parse(JSON.stringify(props.searchList)));

    props.searchList.length > 0 && setSBtn(props.searchList[0].btns);
    props.searchList.length > 0 && setActiveKey(props.searchList[0].sid);
    if (props.searchList.length) {
      props.searchList[0].btns.map((item) => {
        if (item.btnActive) {
          setStatus(item.key);
        }
      });
    }
  }, [JSON.stringify(props.searchList)]);
  /**
   * 搜索项目大类
   * @returns 搜索项目大类组件
   */
  const SearchItem = () => {
    const sBtnClick = (key) => {
      list.forEach((item, index) => {
        if (item.sid === key) {
          setSBtn(item.btns); // 设置搜索按钮
          setActiveKey(key);
          props.setPlaceholder(item.placeholder); // 设置搜索按钮
          if (item.btnKey) {
            setStatus(item.btnKey); // 设置搜索激活按钮状态
          } else {
            item.btns.map((_item) => {
              if (_item.btnActive) {
                setStatus(_item.key);
              }
            });
          }
        }
      });
    };
    return (
      <Row gutter={10} style={{ padding: '10px 0' }}>
        {list.map((item, key) => {
          return (
            <Button
              key={item.sid}
              type="text"
              className={style.sItemBtn + ` ${item.sid === activeKey ? style.active : ''}`}
              style={{ color: props.isLight ? '#000' : '#e0e0e0' }}
              type={'text'}
              onClick={() => sBtnClick(item.sid)}
            >
              {item.title}
            </Button>
          );
        })}
      </Row>
    );
  };
  /**
   * 执行搜索
   */
  const handleSearch = (params) => {
    // 如果有关键词内容则执行搜索操作
    if (props.searchVal) {
      if (params && props.searchVal) {
        const query = params.query.replace(/{key}/i, encodeURI(props.searchVal));
        window.open(query);
        return false;
      }
      sBtn.map((item) => {
        if (item.key === status) {
          const query = item.query.replace(/{key}/i, encodeURI(props.searchVal));
          window.open(query);
        }
      });
    }
  };
  /**
   * 搜索执行按钮组件
   * @returns 搜索按钮
   */
  const SearchBtn = () => {
    // const [sBtnList, setSBtnList] = useState([]);
    // useEffect(() => {
    //   setSBtnList(sBtn)
    // }, [JSON.stringify(sBtn)])
    /**
     * 监听按键事件
     */
    useEffect(() => {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [props.searchVal]);

    const sBtnClick = (item) => {
      handleSearch(item);
      if (item.key === status) {
        return false;
      }
      // 设置按钮激活
      setStatus(item.key);
    };
    // 将搜索按钮记录下来
    useEffect(() => {
      list.forEach((_item, _key) => {
        if (_item.sid === activeKey) {
          _item.btnKey = status;
          setList(list);
          return false;
        }
      });
    }, [JSON.stringify(list)]);
    /**
     * 按键事件定义
     * @param {*} e
     */
    const handleKeyDown = (e) => {
      if (e.keyCode === 13) {
        handleSearch();
      }
    };
    return (
      <Row gutter={10} justify="center" style={{ padding: '10px 0' }}>
        {sBtn.map((item, key) => {
          return (
            <button
              key={item.key}
              className={style.sbtn + ` ${item.key === status ? style.active : ''}`}
              type="text"
              onClick={() => sBtnClick(item)}
            >
              {item.name}
            </button>
          );
        })}
      </Row>
    );
  };
  return (
    <div>
      <SearchItem />
      {props.children}
      <SearchBtn />
    </div>
  );
};
const mapStateToProps = (state) => ({
  searchList: state.Nav.searchList,
  isLight: state.global.isLight,
});

const mapDispatchToProps = (dispatch) => ({
  fetchList(params) {
    return dispatch({
      type: 'Nav/querySearchList',
      payload: params,
    });
  },
  setPlaceholder(params) {
    return dispatch({
      type: 'Nav/setPlaceholder',
      payload: params,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchTool);
