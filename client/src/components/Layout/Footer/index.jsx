import { DefaultFooter } from '@ant-design/pro-layout';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <DefaultFooter copyright={`${currentYear} 靖风行`} />;
};

export default Footer;
