import { RedoOutlined, SettingOutlined, UngroupOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import { useDispatch, useModel, useSelector } from 'umi';
import style from './style.less';
export default function NavConfig(props) {
  const { initialState } = useModel('@@initialState');
  const isEdit = useSelector((state) => state.Nav.isEdit);
  const isLogin = initialState.isLogin;
  const dispatch = useDispatch();
  const handleEdit = () => {
    dispatch({
      type: 'Nav/setIsEdit',
      payload: !isEdit,
    });
  };
  const refresh = async () => {
    props.refresh.setTrue();
    await dispatch({
      type: 'Nav/fetchSort',
    });
    await dispatch({
      type: 'Nav/fetchAll',
    });
    props.refresh.setFalse();
  };
  const content = (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Button type="text" icon={<RedoOutlined />} onClick={refresh}>
        刷新一下
      </Button>
      <Button type="text" icon={<SettingOutlined />} onClick={handleEdit}>
        {!isEdit ? '网址编辑' : '编辑完成'}
      </Button>
    </div>
  );
  return isLogin ? (
    <div className={style.navConfig}>
      <Popover content={content} placement="topRight" overlayClassName="diy-popover" trigger="click">
        <Button size="large" type="primary" shape="circle" icon={<UngroupOutlined />} />
      </Popover>
    </div>
  ) : null;
}
