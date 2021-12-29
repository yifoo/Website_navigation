import { Component } from 'react';
import { Result, Button } from 'antd';
import { Redirect } from 'umi';
class NotFoundPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Result
        status="404"
        title="404"
        subTitle="抱歉,您访问的网址不存在"
        extra={
          <Button type="primary">
            <Redirect to="/" />
          </Button>
        }
      />
    );
  }
}

export default NotFoundPage;
