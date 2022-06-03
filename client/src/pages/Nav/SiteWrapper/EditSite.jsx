import { Cascader, Form, Image, Input, message, Modal } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import style from './style.less';
const EditSiteModal = (props) => {
  const [logoSrc, setLogoSrc] = useState();
  const [isSubmit, setIsSubmit] = useState(false);
  const [siteForm] = Form.useForm();
  const [options, setOptions] = useState([]);
  useEffect(() => {
    let list = props.sortList ? JSON.parse(JSON.stringify(props.sortList)) : [];
    setOptions(list);
  }, [JSON.stringify(props.sortList)]);
  // 修改网址
  const handleOk = () => {
    setIsSubmit(true);
    siteForm
      .validateFields()
      .then((params) => {
        setIsSubmit(false);
        let siteInfo = JSON.parse(JSON.stringify(props.siteInfo));
        params.siteId = props.siteInfo.siteId;
        props.sortList.forEach((item, key) => {
          if (params.sort[0] === item.sortId) {
            params.parentId = item.sortId;
            item.children.forEach((_item, _key) => {
              if (_item.sortId === params.sort[1]) {
                params.sortId = _item.sortId;
                params.sortName = _item.sortName;
              }
            });
          }
        });
        Object.assign(siteInfo, params);
        if (JSON.stringify(siteInfo) === JSON.stringify(props.siteInfo)) {
          message.warn('未做任何修改');
          return false;
        }
        //* 如果存在siteId,就更新网址,否则就新增网址
        if (props.siteInfo.siteId) {
          props.updateSite(params).then((resp) => {
            if (resp) {
              props.setSiteInfo({});
              setLogoSrc('');
              props.setShowEditSite(false);
            }
          });
        } else {
          props.addSite(params).then((resp) => {
            if (resp) {
              props.setSiteInfo({});
              setLogoSrc('');
              props.setShowEditSite(false);
            }
          });
        }
      })
      .catch((errorInfo) => {
        console.log('errorInfo: ', errorInfo);
      });
  };
  const handleCancel = () => {
    props.setSiteInfo({});
    setLogoSrc('');
    props.setShowEditSite(false);
  };
  useEffect(() => {
    setLogoSrc(props.siteInfo.logoSrc);
    siteForm.setFieldsValue({
      sort: props.siteInfo.sort,
      siteName: props.siteInfo.siteName,
      siteUrl: props.siteInfo.siteUrl,
      logoSrc: props.siteInfo.logoSrc,
      siteDesc: props.siteInfo.siteDesc,
    });
  }, [JSON.stringify(props.siteInfo), siteForm]);
  return (
    <>
      <Modal
        forceRender={true}
        getContainer={false}
        title="编辑网址"
        visible={props.showEditSite}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={siteForm}
          className={style.siteForm}
          name="siteForm"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
        >
          <Form.Item
            label="分类"
            name="sort"
            hasFeedback
            rules={[
              {
                required: true,
                message: '请选择分类',
              },
            ]}
          >
            <Cascader options={options} fieldNames={{ label: 'sortName', value: 'sortId' }} />
          </Form.Item>
          <Form.Item
            label="网站名称"
            name="siteName"
            hasFeedback
            rules={[
              {
                required: true,
                message: '请输入网站名称',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="网站地址"
            name="siteUrl"
            hasFeedback
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: '请输入网站地址',
              },
              {
                validator: async (rule, val, callback) => {
                  if (siteForm.getFieldValue('logoSrc')) {
                    return Promise.resolve();
                  }
                  if (val) {
                    let res = await props.checkSite({
                      siteId: props.siteInfo.siteId,
                      siteUrl: val,
                    });
                    if (res.code === 200) {
                      let data = res.data;
                      if (data.sortId) {
                        let sitePath = '';
                        props.sortList.forEach((item) => {
                          item.children.forEach((_item) => {
                            if (_item.sortId === data.sortId) {
                              sitePath = `${item.sortName}/${_item.sortName}/${data.siteName}`;
                            }
                          });
                        });
                        return Promise.reject(new Error(`当前网址已存在于 "${sitePath}" `));
                      } else {
                        setLogoSrc(data.logoSrc);
                        siteForm.setFieldsValue({ logoSrc: data.logoSrc });
                        return Promise.resolve();
                      }
                    } else {
                      message.error(res.msg);
                      return Promise.resolve();
                    }
                  }
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="图标地址"
            name="logoSrc"
            extra={'Tips: 输入正确的网址后自动更新图标'}
            hasFeedback
            rules={[
              {
                required: true,
                message: '请输入图标地址',
              },
              {
                max: 255,
                message: '地址太长啦',
              },
            ]}
          >
            {/* <Input disabled={!props.func[1020]} onChange={(e) => setLogoSrc(e.target.value)} /> */}
            <Input onChange={(e) => setLogoSrc(e.target.value)} />
          </Form.Item>
          <Image src={logoSrc} />
          <Form.Item
            label="网站描述"
            name="siteDesc"
            rules={[
              {
                required: false,
                message: '请输入网站描述',
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  showEditSite: state.Nav.showEditSite,
  sortList: state.Nav.sortList,
  siteInfo: state.Nav.siteInfo,
  func: state.User.func,
});

const mapDispatchToProps = (dispatch) => ({
  setShowEditSite(params) {
    return dispatch({
      type: 'Nav/setShowEditSite',
      payload: params,
    });
  },
  addSite(params) {
    return dispatch({
      type: 'Nav/addSite',
      payload: params,
    });
  },
  updateSite(params) {
    return dispatch({
      type: 'Nav/updateSite',
      payload: params,
    });
  },
  fetchAllSites(params) {
    return dispatch({
      type: 'Nav/fetchAll',
      payload: params,
    });
  },
  checkSite(params) {
    return dispatch({
      type: 'Nav/checkSite',
      payload: params,
    });
  },
  setSiteInfo(params) {
    return dispatch({
      type: 'Nav/setSiteInfo',
      payload: params,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditSiteModal);
