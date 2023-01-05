import { PlusOutlined } from '@ant-design/icons';
import { Button, Cascader, Divider, Form, Image, Input, message, Select, Space, Typography } from 'antd';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useDispatch, useModel, useSelector } from 'umi';
import style from './style.less';
const { Paragraph } = Typography;
const SiteForm = forwardRef((props, ref) => {
  const { initialState } = useModel('@@initialState');
  const { userInfo } = initialState || {};
  const dispatch = useDispatch();
  const siteInfo = useSelector((state) => state.Nav.siteInfo);
  const sortList = useSelector((state) => state.Nav.sortList);
  const tagsDic = useSelector((state) => state.Nav.tagsDic);
  const [logoInput, setLogoInput] = useState();
  const logoRef = useRef(null);
  const [siteForm] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [iconOptions, setIconOptions] = useState([]);
  useEffect(async () => {
    if (tagsDic.length === 0) {
      await dispatch({
        type: 'Nav/fetchTagsDic',
      });
    }
    setTagOptions(tagsDic);
  }, [JSON.stringify(tagsDic)]);

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
  const addLogoOption = (e) => {
    e.preventDefault();
    let option = [...new Set(iconOptions)];
    option.push(logoRef.current.input.value);
    setIconOptions(option);
    setLogoInput('');
    setTimeout(() => {
      logoRef.current?.focus();
    }, 0);
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
              setShowEditSite({ open: false });
            }
          });
        } else {
          addSite(params).then((resp) => {
            if (resp) {
              setSiteInfo({});
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
    siteInfo.logoSrc && setIconOptions([siteInfo.logoSrc]);
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
      labelCol={{ span: 5 }}
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
                    let arr = [...iconOptions, ...data.logo];
                    arr = [...new Set(arr)];
                    setIconOptions(arr);
                    siteForm.setFieldsValue({
                      logoSrc: arr[0],
                      siteDesc: siteForm.getFieldValue('siteDesc') || data.desc,
                    });
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
        <Input allowClear placeholder="请输入网站地址" />
      </Form.Item>
      <div style={{ position: 'relative' }}>
        <Form.Item
          label="网站图标"
          name="logoSrc"
          extra={'Tips: 输入正确的网址后自动更新图标'}
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
          <Select
            allowClear
            disabled={!userInfo.func.includes(1003)}
            placeholder="请输入网站图标地址"
            options={
              iconOptions.length &&
              iconOptions.map((item, index) => {
                return {
                  label: (
                    <div key={index}>
                      <div className={style.logoOption}>
                        <Paragraph
                          className={style.paragraph}
                          copyable={{
                            text: item,
                            tooltips: ['点击复制链接', '已复制'],
                          }}
                        >
                          <span className={style.logoLink}>{item.split('/')[item.split('/').length - 1]}</span>
                        </Paragraph>
                        <Image src={item} width={25} />
                      </div>
                    </div>
                  ),
                  value: item,
                };
              })
            }
            dropdownRender={(menu) => {
              return (
                <>
                  {menu}
                  <Divider
                    style={{
                      margin: '8px 0',
                    }}
                  />
                  <Space
                    style={{
                      padding: '0 8px 4px',
                    }}
                  >
                    <Input
                      value={logoInput}
                      onChange={(e) => setLogoInput(e.target.value)}
                      placeholder="请输入图标地址"
                      ref={logoRef}
                    />
                    <Button type="text" icon={<PlusOutlined />} onClick={addLogoOption}>
                      添加
                    </Button>
                  </Space>
                </>
              );
            }}
          ></Select>
        </Form.Item>
        {/* <Image src={logoSrc} /> */}
      </div>
      <Form.Item label="网站标签" name="tags">
        <Select
          mode="tags"
          allowClear
          placeholder="请输入网站标签"
          tokenSeparators={[',']}
          options={tagOptions.map((item) => {
            return { label: item, value: item };
          })}
        />
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
        <Input.TextArea rows={4} allowClear placeholder="请输入网站描述" />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 5,
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
