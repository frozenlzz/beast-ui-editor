import React, { PureComponent } from 'react';
import { Menu, Icon, Avatar } from 'antd';
import HeaderDropdown from '@/components/HeaderDropdown';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {

  render() {
    const {
      onMenuClick,
      theme,
      userInfo
    } = this.props;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userCenter">
          <Icon type="setting" /><span>个人设置</span>
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="logout">
          <Icon type="logout"/><span>退出登录</span>
        </Menu.Item>
      </Menu>
    );
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        <HeaderDropdown overlay={menu} placement="bottomRight">
            <span className={`${styles.action} ${styles.account}`}>
              {
                userInfo.photo ? (
                  <Avatar
                    size="small"
                    className={styles.avatar}
                    src={userInfo.photo}
                    alt="avatar"
                  />
                ) : (
                  <Avatar size={'small'} className={styles.avatar} icon="user"/>
                )
              }
              <span
                className={styles.name}>{userInfo.name || userInfo.phone || userInfo.email || userInfo.code || '账号信息'}</span>
            </span>
        </HeaderDropdown>

      </div>
    );
  }
}
