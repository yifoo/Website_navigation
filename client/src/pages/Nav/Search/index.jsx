import { Tag } from 'antd';
import jsonp from 'jsonp';
import { Component } from 'react';
import injector from '../injector';
import DebounceSelect from './DebounceSelect';
import SearchTool from './SearchTool';
@injector
class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }
  changeVal = (newValue) => {
    this.setState({
      value: newValue,
    });
  };
  querySearch = () => {
    const value = this.state.value;
    try {
      return new Promise((resolve, reject) => {
        jsonp(
          `https://www.baidu.com/sugrec?ie=utf-8&json=1&prod=wise&from=wise_web&wd=${value}`,
          {
            param: 'callback',
          },
          async (err, data) => {
            if (data.g && data.g.length > 0) {
              let list = [];
              for (var item of data.g) {
                list.push({
                  label: (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{item.q}</span>
                      <span>
                        <Tag color="#2db7f5">百度</Tag>
                      </span>
                    </div>
                  ),
                  value: item.q,
                  orign: 'baidu',
                });
              }
              resolve(list);
            }
          },
        );
      });
    } catch (err) {
      console.log('err: ', err);
    }
  };
  componentDidMount() {
    if (this.props.searchList.length === 0) {
      this.props.fetchSearchList();
    }
  }
  render() {
    const { value } = this.state;
    return (
      <div className={this.props.className}>
        <SearchTool searchVal={value}>
          <DebounceSelect
            value={value}
            size="large"
            placeholder={this.props.placeholder}
            fetchOptions={this.querySearch}
            onChange={this.changeVal}
            style={{
              width: '100%',
            }}
          />
        </SearchTool>
      </div>
    );
  }
}

export default SearchBox;
