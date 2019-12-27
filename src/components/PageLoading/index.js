import React from 'react';
import { Spin } from 'antd';
import { formatLocaleDocTitle } from '@/utils/localeUtils';

// loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport
export default class PageLoading extends React.Component {

  componentDidMount() {
    if ('undefined' !== typeof NProgress) {
      NProgress.start();
      NProgress.set(0.3);
    }
  }

  componentWillUnmount() {
    // console.log('this.props.match', this.props.match);
    if ('undefined' !== typeof NProgress) {
      NProgress.done();

      // 根据路由，将【页面标题】国际化
      if (this.props.match) {
        let pathname = this.props.match.path;
        let routes = [this.props.route];
        setTimeout(() => {
          // 根据路由，将【页面标题】国际化
          formatLocaleDocTitle(pathname, routes);
        }, 10);
      }
    }
  }

  render() {
    return (
      <div style={{ paddingTop: 100, textAlign: 'center' }}>
        <Spin/>
      </div>
    );
  }
}
