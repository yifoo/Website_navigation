import { Badge, Descriptions, Image, Tag } from 'antd';
import { forwardRef } from 'react';
import { useSelector } from 'umi';
import utils from '@/utils/libs';
import style from './style.less';
const tagColor = {
    新闻: '#299bf8',
    工具: '#f8b629',
    AI: '#3370FF',
    IT: '#76a0FF',
    NAS: '#a6c0FF',
    搜索: '#ed556a',
    办公: '#1a92f8',
    学习: '#0eb0c9',
    市场: '#248067',
    阅读: '#42B883',
    效率: '#A255FC',
    艺术: '#F2574F',
    音乐: '#DE181B',
    网盘: '#FEAD62',
    导航: '#E4DCAE',
    日常: '#EC8C89',
  };
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
              <Tag key={key} color={tagColor[item] || utils.stringToColor(item)}>
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
