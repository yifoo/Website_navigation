import { useModel } from 'umi';
import SiteWrapper from './SiteWrapper';
import OrderConfig from './components/OrderConfig'; //? 网址排序组件
import style from './style.less';

export default function NavPage() {
  const { initialState } = useModel('@@initialState');
  const isMobile = initialState.isMobile;
  return (
    <>
      <SiteWrapper className={style.siteContainer} />;{!isMobile ? <OrderConfig /> : null}
    </>
  );
}
