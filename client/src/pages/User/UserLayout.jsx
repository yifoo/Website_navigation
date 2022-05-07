import { Component } from 'react';
import injector from './injector';
import style from './style.less';
import bg from '@/assets/img/bg.jpeg';
@injector
class UserLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderVal: 1,
    };
  }
  render() {
    return (
      <div className={style.bg} style={{ backgroundImage: `url(${bg})` }}>
        <div className={style.user}>{this.props.children}</div>
      </div>
    );
  }
}

export default UserLayout;
