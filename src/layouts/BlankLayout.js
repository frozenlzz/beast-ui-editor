import React from 'react';
import { setLocale } from 'umi-plugin-locale';
import { ConfigProvider } from 'antd';
import { getStorage, removeStorage, setStorage } from '@/utils/utils';
import { LOCALE_FORMAT_KEY } from '@/utils/localeUtils';

export default class BlankLayout extends React.Component {

  constructor(props) {
    super(props);
    removeStorage(LOCALE_FORMAT_KEY);
    setStorage(LOCALE_FORMAT_KEY, {}); // LOCALE_FORMAT_KEY 在 localStorage 中用于存放国际化相关的缓存，formatMsgByCn 的实现用到

    let locale = getStorage('umi_locale') || 'zh-CN';
    setLocale(locale, false);
  }

  render() {
    return <ConfigProvider>{this.props.children}</ConfigProvider>;
  }
}
