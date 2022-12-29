import { useBoolean } from 'ahooks';
import { Button, Descriptions, Image, Tag } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
const SiteInfo = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const siteInfo = useSelector((state) => state.Nav.siteInfo);
  const [screenShot, setScreenShot] = useState('');
  const [isLoading, { toggle, setTrue, setFalse }] = useBoolean(false);
  useImperativeHandle(ref, () => {
    return {
      reset: () => {
        setScreenShot('');
      },
    };
  });
  const refreshShot = async () => {
    setTrue();
    let screenShot = await dispatch({
      type: 'Nav/fetchScreenShot',
      payload: { siteUrl: siteInfo.siteUrl },
    });
    setFalse();
    setScreenShot(screenShot);
  };
  useEffect(() => {
    if (siteInfo.siteUrl && !siteInfo.screenShot) {
      refreshShot();
    } else {
      setScreenShot('');
    }
  }, [siteInfo]);

  return (
    <Descriptions column={1} labelStyle={{ fontWeight: 'bold' }}>
      <Descriptions.Item label="网站名称">{siteInfo.siteName}</Descriptions.Item>
      <Descriptions.Item label="网站地址">
        <a href={siteInfo.siteUrl} target="_blank">
          {siteInfo.siteUrl}
        </a>
      </Descriptions.Item>
      <Descriptions.Item label="网站标签">
        {siteInfo.tags &&
          siteInfo.tags.split(',').map((item, key) => {
            return (
              <Tag key={key} color="#2db7f5">
                {item}
              </Tag>
            );
          })}
      </Descriptions.Item>
      <Descriptions.Item label="网站描述">{siteInfo.siteDesc}</Descriptions.Item>
      <Descriptions.Item label="网站图标">
        <Image src={siteInfo.logoSrc} width={30} />
      </Descriptions.Item>
      <Descriptions.Item label="网站截图">
        <Image src={screenShot ? screenShot : siteInfo.screenShot} width={260} />
        <Button loading={isLoading} onClick={refreshShot} type="primary" size="small">
          更新截图
        </Button>
      </Descriptions.Item>
      <Descriptions.Item label="截图说明">
        <p>截图需要手动将图片传到图片服务器，再将地址更新到网站信息中才能永久更新</p>
      </Descriptions.Item>
    </Descriptions>
  );
});

export default SiteInfo;
