import { useBoolean } from 'ahooks';
import { Button, Drawer } from 'antd';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'umi';
import SiteForm from './SiteForm';
import SiteInfo from './SiteInfo';
const EditSiteDrawer = () => {
  const dispatch = useDispatch();
  // const formRef = useRef(null);
  // const infoRef = useRef(null);
  const showEditSite = useSelector((state) => state.Nav.showEditSite);
  const showEditType = useSelector((state) => state.Nav.showEditType);
  const [isEditSite, { toggle, setTrue, setFalse }] = useBoolean(false);

  useEffect(() => {
    showEditType === 'edit' ? setTrue() : setFalse();
  }, [showEditType]);

  const setSiteInfo = (params) => {
    dispatch({
      type: 'Nav/setSiteInfo',
      payload: params,
    });
  };
  const setShowEditSite = (params) => {
    dispatch({
      type: 'Nav/setShowEditSite',
      payload: params,
    });
  };
  const handleCancel = () => {
    // isEditSite && formRef.current.reset();
    setSiteInfo({});
    setShowEditSite({ open: false });
    setFalse();
  };

  return (
    <>
      <Drawer
        forceRender={true}
        width={480}
        placement="left"
        title={isEditSite ? '编辑网址' : '查看网址'}
        open={showEditSite}
        onClose={handleCancel}
        extra={<Button onClick={toggle}>{isEditSite ? '查看' : '编辑'}</Button>}
      >
        {isEditSite && <SiteForm />}
        <div style={{ display: isEditSite ? 'none' : 'block' }}>
          <SiteInfo />
        </div>
      </Drawer>
    </>
  );
};

export default EditSiteDrawer;
