import { Badge, Descriptions, Image, Tag } from 'antd';
import { forwardRef } from 'react';
import { useSelector } from 'umi';
import style from './style.less';
const SiteInfo = forwardRef((props, ref) => {
  const siteInfo = useSelector((state) => state.Nav.siteInfo);
  return (
    <Descriptions column={1} labelStyle={{ fontWeight: 'bold' }}>
      <Descriptions.Item label="网站名称">{siteInfo.siteName}</Descriptions.Item>
      <Descriptions.Item label="网站地址">
        <div className={style.siteUrl}>
          <a href={siteInfo.siteUrl} target="_blank">
            {siteInfo.siteUrl}
          </a>
          <Badge status={props.pingStatus} />
        </div>
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
      <Descriptions.Item label="网站实时">
        <div className={style.iframeBox}>
          <iframe
            name="shot"
            className={style.iframe}
            src={siteInfo.siteUrl}
            frameBorder="0"
            security="restricted"
            sandbox="allow-same-origin allow-scripts"
          ></iframe>
        </div>
      </Descriptions.Item>
    </Descriptions>
  );
});

export default SiteInfo;
