import { searchApi } from '@/services';
import { CloseCircleFilled, FormOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, List, message, Popconfirm, Switch, Image } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';

import style from './style.less';

const SearchConfig = (props) => {
  const [activeBtn, setActiveBtn] = useState(props.activeBtn);
  const searchList = useSelector((state) => state.Nav.searchList);
  const dispatch = useDispatch();
  useEffect(() => {
    setActiveBtn(props.activeBtn);
  }, [props.activeBtn]);
  const { run: update } = useRequest(searchApi.updateActiveBtn, {
    manual: true,
    onSuccess: (result, params) => {
      message.success(result.msg);
      let list = searchList.map((item) => {
        if (item.sid === params[0].sid) {
          item.activeBtn = params[0].activeBtn;
        }
        return item;
      });
      dispatch({
        type: 'Nav/setSearchList',
        payload: list,
      });
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
  const { run: del } = useRequest(searchApi.delBtn, {
    manual: true,
    onSuccess: (result, params) => {
      message.success(result.msg);
      let list = searchList.map((item) => {
        if (item.sid === props.sid) {
          let btns = item.btns.filter((btn) => {
            return btn.btnId !== params[0].btnId;
          });
          item.btns = btns;
        }
        return item;
      });
      dispatch({
        type: 'Nav/setSearchList',
        payload: list,
      });
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
  const handleSwitch = useCallback(
    (btnId) => {
      if (btnId !== activeBtn) {
        update({ activeBtn: btnId, sid: props.sid });
      }
    },
    [activeBtn],
  );
  const confirmDel = useCallback(
    (btnId) => {
      if (btnId === activeBtn) {
        message.error('默认选项不能删除');
        return false;
      }
      del({ btnId });
    },
    [activeBtn],
  );
  return (
    <List
      dataSource={props.btns}
      renderItem={(item) => (
        <List.Item
          key={item.btnId}
          size="small"
          actions={[
            <Switch
              size="small"
              checkedChildren="默认"
              unCheckedChildren=""
              checked={item.btnId === activeBtn}
              onClick={() => handleSwitch(item.btnId)}
            />,
            <Button size="small" type="link" onClick={() => props.handleEdit({ btnId: item.btnId })}>
              <FormOutlined />
            </Button>,
            <Popconfirm title="确认删除该项吗" onConfirm={() => confirmDel(item.btnId)} okText="是" cancelText="否">
              <Button size="small" type="text" danger>
                <CloseCircleFilled />
              </Button>
            </Popconfirm>,
          ]}
        >
          <Image
            src={item.icon}
            width={'1rem'}
            onError={(e) => {
              e.target.src = 'https://img.haohome.top/uPic/blankico.jpg';
            }}
          />
          {item.name}
        </List.Item>
      )}
    />
  );
};

export default SearchConfig;
