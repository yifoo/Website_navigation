import { Component } from 'react';
import injector from './injector';
import style from './style.less';
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
      <div className={style.bg} style={{ backgroundImage: `url(${this.props.bgImg})` }}>
        <div className={style.user}>{this.props.children}</div>
      </div>
    );
  }
}

export default UserLayout;
