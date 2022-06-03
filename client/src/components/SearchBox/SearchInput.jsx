import { searchApi } from '@/services';
import { AutoComplete, Spin, Switch, Tag } from 'antd';
import jsonp from 'jsonp';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useSelector } from 'umi';
import style from './style.less';
let timeout;
let currentValue;
const DebounceSelect = forwardRef((props, ref) => {
  const [fetching, setFetching] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [mode, setMode] = useState(false);
  const [data, setData] = useState([]);
  useImperativeHandle(ref, () => ({
    input: inputVal,
  }));
  const sortList = useSelector((state) => state.Nav.sortList);
  const handleChange = (val) => {
    setInputVal(val);
  };

  /**
   * 内置防抖的请求
   * @param {搜索框的value} value
   * @param {*} callback
   * @returns
   */
  const fetch = (value, callback) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;
    let fetchSuggest = () => {};
    if (mode) {
      fetchSuggest = async () => {
        setFetching(true);
        let res = await searchApi.querySite({ siteName: value });
        setFetching(false);
        if (currentValue === value) {
          let list = [];
          for (var item of res.data) {
            let sitePath = '';
            let site = '';
            sortList.forEach((item1) => {
              item1.children.forEach((item2) => {
                if (item2.sortId === item.sortId) {
                  sitePath = `${item1.sortName}/${item2.sortName}/${item.siteName}`;
                  site = `${item.siteName}`;
                }
              });
            });
            list.push({
              label: sitePath,
              value: `${site}`,
              orign: '本地',
            });
            callback(list);
          }
        }
      };
    } else {
      fetchSuggest = () => {
        setFetching(true);
        jsonp(
          `https://www.baidu.com/sugrec?ie=utf-8&json=1&prod=wise&from=wise_web&wd=${value}`,
          {
            param: 'callback',
          },
          async (err, d) => {
            setFetching(false);
            try {
              if (currentValue === value) {
                const { g } = d;
                const data = g ? g.map((item) => ({ value: item.q, label: item.q, orign: '百度' })) : [];
                callback(data);
              }
            } catch (e) {
              callback([]);
            }
          },
        );
      };
    }
    timeout = setTimeout(fetchSuggest, 500);
  };
  const getOptionsData = (newValue) => {
    if (newValue) {
      fetch(newValue, setData);
    } else {
      setData([]);
    }
  };
  const options = data.map((item) => {
    return {
      label: (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>{item.label}</span>
          <span>
            <Tag color="#2db7f5">{item.orign}</Tag>
          </span>
        </div>
      ),
      value: item.value,
    };
  });
  return (
    <>
      <AutoComplete
        value={inputVal}
        size="large"
        placeholder={props.placeholder}
        onChange={handleChange}
        filterOption={false}
        onSearch={getOptionsData}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        options={options}
        style={{ width: '100%' }}
      />
      <div className={style.sBoxCheck}>
        <Switch onChange={setMode} size="small" checkedChildren="内" unCheckedChildren="外" defaultChecked={false} />
      </div>
      <div className={style.searchConfig}></div>
    </>
  );
});

export default DebounceSelect;
