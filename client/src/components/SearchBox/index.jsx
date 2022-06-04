import { Tabs } from 'antd';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import SearchBtn from './SearchBtn';
import SearchExtra from './SearchExtra';
import SearchInput from './SearchInput';
import style from './style.less';
const { TabPane } = Tabs;

const SearchBox = memo((props) => {
  const [tabKey, setTabKey] = useState();
  const [activeKey, setActiveKey] = useState();
  const [btns, setBtns] = useState([]);
  const [placeholder, setPlaceholder] = useState('');
  const searchList = useSelector((state) => state.Nav.searchList);
  const dispatch = useDispatch();
  const extraRef = useRef(); //*获取高级搜索附加组件内容
  const inputRef = useRef('');
  useEffect(() => {
    if (searchList.length === 0) {
      dispatch({
        type: 'Nav/querySearchList',
      });
    }
  }, []);
  useEffect(() => {
    searchList.forEach((item, index) => {
      if (item.keyActive === 1) {
        setTabKey(String(index));
        setBtns(searchList[index].btns);
        setPlaceholder(searchList[index].placeholder);
      }
    });
  }, [searchList]);
  const renderTabBar = (props, DefaultTabBar) => {
    return <DefaultTabBar {...props} className={style.sHeader} />;
  };
  const handleTabClick = (key) => {
    searchList.map((item, index) => {
      if (String(index) === key) {
        setTabKey(key);
        setBtns(item.btns);
        setPlaceholder(item.placeholder);
      }
    });
  };
  /**
   * 执行搜索操作
   * @param {*} activeKey
   * @param {*} btn
   */
  const handleSearch = (activeKey, btn) => {
    if (inputRef.current.input && activeKey === btn.btnId) {
      let extra = extraRef.current.extra;
      extra = Object.keys(extra).length > 0 ? extra.value : '';
      let query = extra ? extra : btn.query;
      query = query.replace(/{key}/i, encodeURI(inputRef.current.input.trim()));
      window.open(query);
      query = null;
      extra = null;
      return false;
    }
  };
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      let btn = btns.filter((item) => item.btnId === Number(activeKey));
      if (btn && btn.length > 0 && btn[0].btnId === activeKey) {
        handleSearch(activeKey, btn[0]);
      }
    }
  };
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);;
  }, [activeKey, tabKey]);
  //* 避免重复render
  const SearchBtnList = useMemo(
    (props) => {
      return searchList.map((item, index) => {
        return (
          <TabPane tab={item.title} key={index}>
            <SearchBtn list={item} index={tabKey} handleSearch={handleSearch} updateKey={setActiveKey} />
          </TabPane>
        );
      });
    },
    [searchList,tabKey],
  );
  return (
    <div className={style.searchBox}>
      <div className={style.search}>
        <SearchExtra list={btns} tabKey={tabKey} ref={extraRef} />
        <SearchInput style={{ width: '100%' }} placeholder={placeholder} ref={inputRef} />
      </div>
      <Tabs type="card" renderTabBar={renderTabBar} centered={true} onTabClick={handleTabClick} activeKey={tabKey}>
        {SearchBtnList}
      </Tabs>
    </div>
  );
});

export default SearchBox;
