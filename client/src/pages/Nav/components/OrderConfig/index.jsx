import { Card, Radio, Space } from 'antd';
import { useDispatch, useSelector, useModel } from 'umi';
import style from './style.less';

export default () => {
  const dispatch = useDispatch();
  const { initialState } = useModel('@@initialState');
  const isEdit = useSelector((state) => state.Nav.isEdit);
  const orderVal = useSelector((state) => state.Nav.orderVal);
  const isMobile = initialState.isMobile;
  const onChange = (e) => {
    dispatch({
      type: 'Nav/setOrderVal',
      payload: e.target.value,
    });
  };
  return (
    <div>
      {isEdit && !isMobile ? (
        <Card
          className={style.orderStyle}
          title="选择排序"
          bordered={false}
          style={{ width: 130 }}
          headStyle={{ padding: '0 10px' }}
          bodyStyle={{ padding: '10px' }}
        >
          <Radio.Group onChange={onChange} value={orderVal}>
            <Space direction="vertical">
              <Radio value={'sort'}>大类排序</Radio>
              <Radio value={'subSort'}>子类排序</Radio>
              <Radio value={'site'}>网址排序</Radio>
            </Space>
          </Radio.Group>
        </Card>
      ) : null}
    </div>
  );
};
