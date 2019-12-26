import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '/common/components/GlobalFooter';

const { Footer } = Layout;

const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2019 广州简汇信息科技有限公司
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
