import { Card, Radio, Space, Spin } from 'antd';
import { Component } from 'react';
import injector from './injector';
import Search from './Search';
import SiteBox from './SiteBox';
import style from './style.less';
import bg from '@/assets/img/bg.jpeg';
@injector
class NavPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderVal: 1,
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.orderVal === prevState.orderVal) {
      return null;
    }
    return {
      orderVal: nextProps.orderVal,
    };
  }
  onChange = (e) => {
    this.props.setOrderVal(e.target.value);
  };
  async componentDidMount() {
    if (this.props.siteList.length === 0) {
      this.props.setIsLoading(true);
      await this.props.fetchSort();
      await this.props.fetchAllSites();
      this.props.setIsLoading(false);
    }
  }
  render() {
    const { orderVal } = this.state;
    return (
      <Spin tip="加载中..." wrapperClassName={style.loading} spinning={this.props.isLoading} size="large">
        <div className={style.bg} style={{ backgroundImage: `url(${bg})` }}>
          <Search className={`${style.search} ${style.clearfix}`} />
          <SiteBox className={style.siteContainer} />
          {this.props.isEdit && !this.props.isMobile ? (
            <Card
              className={style.orderStyle}
              title="选择排序"
              bordered={false}
              style={{ width: 130 }}
              headStyle={{ padding: '0 10px' }}
              bodyStyle={{ padding: '10px' }}
            >
              <Radio.Group onChange={this.onChange} value={orderVal}>
                <Space direction="vertical">
                  <Radio value={'sort'}>大菜单排序</Radio>
                  <Radio value={'subSort'}>子菜单排序</Radio>
                  <Radio value={'site'}>网址排序</Radio>
                </Space>
              </Radio.Group>
            </Card>
          ) : null}
        </div>
      </Spin>
    );
  }
}
export default NavPage;
