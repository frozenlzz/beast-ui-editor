import React, { Component } from 'react';
import styles from './index.less';

import PageHeaderTop from '/common/components/PageHeaderTop';

class DashboardPage extends Component {


  render() {

    return (
      <div className="header-page-top">
        <PageHeaderTop />
        <div className={styles.contentWrapper}>

        </div>
      </div>
    );
  }
}

export default DashboardPage;
