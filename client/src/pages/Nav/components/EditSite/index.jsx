import { useBoolean } from 'ahooks';
import { Button, Drawer } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import SiteForm from './SiteForm';
import SiteInfo from './SiteInfo';
const EditSiteDrawer = () => {
  const dispatch = useDispatch();
  const [pingStatus, setPingStatus] = useState('default');
  const showEditSite = useSelector((state) => state.Nav.showEditSite);
  const showEditType = useSelector((state) => state.Nav.showEditType);
  const [isEditSite, { toggle, setTrue, setFalse }] = useBoolean(false);
  const siteInfo = useSelector((state) => state.Nav.siteInfo);
  useEffect(() => {
    if (siteInfo.siteUrl) {
      dispatch({
        type: 'Nav/pingSiteStatus',
        payload: { siteUrl: siteInfo.siteUrl },
      }).then((res) => {
        if (res.data === '200') {
          setPingStatus('success');
        } else if (res.data === '301' || res.data === '302') {
          setPingStatus('warning');
        } else if (res.data === '000') {
          setPingStatus('error');
        } else {
          setPingStatus('default');
        }
      });
    }
  }, [JSON.stringify(siteInfo)]);
  useEffect(() => {
    showEditType === 'edit' ? setTrue() : setFalse();
    if (showEditSite == false) {
      setPingStatus('default');
    }
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
    setSiteInfo({});
    setShowEditSite({ open: false, showEditType: 'show' });
  };

  return (
    <Drawer
      forceRender={true}
      width={480}
      placement="left"
      title={isEditSite ? '编辑网址' : '查看网址'}
      open={showEditSite}
      onClose={handleCancel}
      extra={<Button onClick={toggle}>{isEditSite ? '查看' : '编辑'}</Button>}
    >
      {isEditSite ? <SiteForm pingStatus={pingStatus} /> : <SiteInfo pingStatus={pingStatus} />}
    </Drawer>
  );
};

export default EditSiteDrawer;
