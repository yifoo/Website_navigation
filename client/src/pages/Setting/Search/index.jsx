import SearchBox from '@/components/SearchBox';
import { searchApi } from '@/services';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Collapse, Switch } from 'antd';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import EditSearchItem from './EditSearchItem';
import SearchItem from './SearchItem';
import style from './style.less';
const { Panel } = Collapse;

const SearchConfig = () => {
  const searchList = useSelector((state) => state.Nav.searchList);
  const activeList = useSelector((state) => state.Nav.activeList);
  const [editVisible, setEditVisible] = useState(false);
  const [editBtnId, setEditBtnId] = useState(0);
  const [parent, setParent] = useState({});
  const dispatch = useDispatch();
  const { run: update } = useRequest(searchApi.updateKeyActive, {
    manual: true,
    onSuccess: (result, params) => {
      message.success(result.msg);
    },
    onError: (error) => {
      //!回退数据
      dispatch({
        type: 'Nav/querySearchList',
      });
      message.error(error.message);
    },
  });
  const handleSwitch = useCallback(
    (key, keyActive) => {
      if (keyActive) {
        return false;
      }
      let keySidList = [];
      let newSearchlist = searchList.map((item, index) => {
        if (item.keyActive === 1) {
          item.keyActive = 0;
          keySidList.push({
            sid: item.sid,
            keyActive: 0,
          });
        } else {
          if (index === key) {
            item.keyActive = 1;
            keySidList.push({
              sid: item.sid,
              keyActive: 1,
            });
          }
        }
        return item;
      });
      update(keySidList);
      //!这里直接更新状态，错误时从服务器端拉取最新数据
      dispatch({
        type: 'Nav/setSearchList',
        payload: newSearchlist,
      });
    },
    [activeList],
  );
  const handleEdit = (parent,params) => {
    setParent({sid:parent.sid,title:parent.title});
    setEditBtnId(params.btnId);
    setEditVisible(true);
  };
  const closeEdit=()=>{
    setParent({});
    setEditBtnId(0);
    setEditVisible(false);
  }
  const handleAdd = (parent) => {
    setParent({sid:parent.sid,title:parent.title});
    setEditVisible(true);
  };
  return (
    <div className={style.main}>
      <div className={style.searchContainer}>
        <SearchBox />
      </div>
      <Collapse collapsible="header" accordion className={style.collapse}>
        {searchList.map((current, key) => {
          return (
            <Panel
              header={current.title}
              key={key}
              extra={
                <div className={style.searchAction}>
                  <Button type="link" size="small" className={style.add} onClick={()=>handleAdd(current)}>
                    <PlusCircleOutlined />
                  </Button>
                  <Switch
                    className={style.switch}
                    size="small"
                    checkedChildren="默认"
                    unCheckedChildren=""
                    checked={activeList[key]}
                    onClick={() => handleSwitch(key, activeList[key])}
                  />
                </div>
              }
            >
              <SearchItem btns={current.btns} activeBtn={current.activeBtn} sid={current.sid} handleEdit={params=>handleEdit(current,params)} />
            </Panel>
          );
        })}
      </Collapse>
      <EditSearchItem visible={editVisible} closeEdit={closeEdit} btnId={editBtnId} parent={parent}/>
    </div>
  );
};

export default SearchConfig;
