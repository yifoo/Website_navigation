import { ControlOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useDispatch, useSelector, useModel } from 'umi';
import style from './style.less';
export default function NavConfig() {
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
  return isLogin ? (
    <div className={style.navConfig}>
      <Tooltip title="网址编辑">
        <Button
          type="text"
          icon={<ControlOutlined />}
          size="middle"
          onClick={handleEdit}
          className={isEdit ? style.isEdit : ''}
        />
      </Tooltip>
    </div>
  ) : null;
}
