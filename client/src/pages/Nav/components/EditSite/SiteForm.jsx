import { Button, Cascader, Form, Image, Input, message, Select } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import style from './style.less';
const SiteForm = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const siteInfo = useSelector((state) => state.Nav.siteInfo);
  const sortList = useSelector((state) => state.Nav.sortList);
  const tagsDic = useSelector((state) => state.Nav.tagsDic);
  const func = useSelector((state) => state.User.func);
  const [logoSrc, setLogoSrc] = useState();
  const [siteForm] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  useEffect(async () => {
    if (tagsDic.length === 0) {
      await dispatch({
        type: 'Nav/fetchTagsDic',
      });
    }
    let items = [];
    items = tagsDic.map((item) => {
      return { label: item, value: item };
    });
    setTagOptions(items);
  }, [JSON.stringify(tagsDic)]);
  useImperativeHandle(ref, () => {
    return {
      reset: () => {
        setLogoSrc('');
      },
    };
  });

  const updateSite = (params) => {
    return dispatch({
      type: 'Nav/updateSite',
      payload: params,
    });
  };
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
  const addSite = (params) => {
    return dispatch({
      type: 'Nav/addSite',
      payload: params,
    });
  };
  const checkSite = (params) => {
    return dispatch({
      type: 'Nav/checkSite',
      payload: params,
    });
  };
  useEffect(() => {
    let list = sortList ? JSON.parse(JSON.stringify(sortList)) : [];
    setOptions(list);
  }, [JSON.stringify(sortList)]);
  // 修改网址
  const handleOk = () => {
    siteForm
      .validateFields()
      .then((params) => {
        let newSiteInfo = JSON.parse(JSON.stringify(siteInfo));
        params.siteId = newSiteInfo.siteId;
        params.tags = params.tags.join(',');
        sortList.forEach((item, key) => {
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
        Object.assign(newSiteInfo, params);
        if (JSON.stringify(siteInfo) === JSON.stringify(newSiteInfo)) {
          message.warn('未做任何修改');
          return false;
        }
        //* 如果存在siteId,就更新网址,否则就新增网址
        if (newSiteInfo.siteId) {
          updateSite(params).then((resp) => {
            if (resp) {
              setSiteInfo({});
              setLogoSrc('');
              setShowEditSite({ open: false });
            }
          });
        } else {
          addSite(params).then((resp) => {
            if (resp) {
              setSiteInfo({});
              setLogoSrc('');
              setShowEditSite({ open: false });
            }
          });
        }
      })
      .catch((errorInfo) => {
        console.log('errorInfo: ', errorInfo);
      });
  };
  useEffect(() => {
    setLogoSrc(siteInfo.logoSrc);
    siteForm.setFieldsValue({
      sort: siteInfo.sort,
      siteName: siteInfo.siteName,
      siteUrl: siteInfo.siteUrl,
      logoSrc: siteInfo.logoSrc,
      siteDesc: siteInfo.siteDesc,
      tags: siteInfo.tags ? siteInfo.tags.split(',') : [],
    });
  }, [JSON.stringify(siteInfo), siteForm]);
  return (
    <Form
      form={siteForm}
      className={style.siteForm}
      name="siteForm"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      autoComplete="off"
      colon={false}
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
        <Cascader options={options} fieldNames={{ label: 'sortName', value: 'sortId' }} allowClear />
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
        <Input allowClear placeholder="请输入网站名称" />
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
                let res = await checkSite({
                  siteId: siteInfo.siteId,
                  siteUrl: val,
                });
                if (res.code === 200) {
                  let data = res.data;
                  if (data.sortId) {
                    let sitePath = '';
                    sortList.forEach((item) => {
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
        <Input allowClear />
      </Form.Item>
      <div style={{ position: 'relative' }}>
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
          {/* <Input disabled={!func[1020]} onChange={(e) => setLogoSrc(e.target.value)} /> */}
          <Input
            // disabled={!func[1020]}
            onChange={(e) => setLogoSrc(e.target.value)}
            allowClear
            placeholder="请输入网站图标地址"
          />
        </Form.Item>
        <Image src={logoSrc} />
      </div>
      <Form.Item label="网站标签" name="tags">
        <Select mode="tags" allowClear placeholder="请输入网站标签" tokenSeparators={[',']} options={tagOptions} />
      </Form.Item>
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
        <Input.TextArea allowClear placeholder="请输入网站描述" />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 4,
          span: 16,
        }}
      >
        <Button type="primary" block onClick={handleOk}>
          提交
        </Button>
      </Form.Item>
    </Form>
  );
});

export default SiteForm;
