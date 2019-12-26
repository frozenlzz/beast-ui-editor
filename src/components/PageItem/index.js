import { Button, Card, PageHeader, Spin } from 'antd';
import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import SaveBtn from '/common/componentsTpl/ButtonComp/SaveBtn';
import isFunction from 'lodash/isFunction';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';

@connect(({ global: { siderWidth } }) => ({
  siderWidth,
}))
class PageItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      pageBodyStyle: {
        top: 58,
        bottom: 66,
      },
    };
  }

  componentDidMount() {
    this.setState({
      visible: this.props.visible,
      pageBodyStyle: {
        ...this.state.pageBodyStyle,
        top: this.headerRef.offsetHeight,
        // bottom:this.footerRef.offsetHeight,
        bottom: ('footer' === this.props.actionPos && this.props.finalAction)?this.footerRef.offsetHeight:0,
      },
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.visible !== this.props.visible) {
      this.setState({ visible: this.props.visible });
    }
    if (!this.state.visible) {
      this.handleClosed();
    } else {
      document.body.classList.add('over-hidden');
    }
  }

  componentWillUnmount() {
    this.handleClosed();
  }

  handleOk() {
    isFunction(this.props.onOk) && this.props.onOk();
  };

  handleCancel() {
    isFunction(this.props.onCancel) && this.props.onCancel();
  };

  /**
   * 浮层完全关闭之后的回调
   */
  handleClosed() {
    document.body.classList.remove('over-hidden');
  };

  render() {
    const { pageBodyStyle, visible } = this.state;
    const { headerProps, siderWidth, action, actionPos = 'footer', loading, showAction,showHeader } = this.props;
    const styleO = visible ? {
      opacity: 1,
      transform: `translateX(0)`,
    } : {
      opacity: 0,
      transform: `translateX(${document.body.offsetWidth - 0}px)`,
    };
    const wrapStyleO = { left: 0 };

    if (!this.props.animated || (this.props.location && this.props.location.query && 'none' === this.props.location.query.animated)) {
      styleO.transition = 'none';
    }

    const finalAction = showAction ? (isEmpty(action) ? (
      <>
        <Button onClick={this.handleCancel.bind(this)}>返回</Button>
        <SaveBtn loading={loading} onClick={this.handleOk.bind(this)} type={'primary'}>确认</SaveBtn>
      </>
    ) : action) : null;
    const detailClass = classNames(styles.detailWrapper,'detailWrapers');
    return (
      <div className={detailClass} style={wrapStyleO}>
        <div className={styles.innerPage} style={styleO}>
          <header className={styles.header} ref={node => (this.headerRef = node)}>
            {
              showHeader&&<PageHeader
                onBack={this.handleCancel.bind(this)}
                title={this.props.title}
                extra={'header' === actionPos ? finalAction : null}
                {...headerProps}
              />
            }

          </header>
          <div className={`${classNames(styles.body,this.props.bodyClassName)}`} style={pageBodyStyle}>
            <Card bordered={false}
                  bodyStyle={{ padding: 0 }}>
              <Spin spinning={loading}>
                {
                  this.props.children
                }
              </Spin>
            </Card>
          </div>
           {
             ('footer' === actionPos && finalAction)&&
              <footer className={styles.footer} ref={node => (this.footerRef = node)}>
                {/* {'footer' === actionPos && finalAction} */}
                {finalAction}
              </footer>
           }     
          
        </div>
      </div>
    );
  }
}

PageItem.defaultProps = {
  visible: false, // 是否显示
  animated: true, // 是否需要动画
  loading: false, // 是否正在加载
  title: '',
  showAction: true, // 是否显示操作按钮
  action: null, // 自定义操作按钮
  actionPos: 'footer', // 操作按钮区域的位置，'footer'：底部，’header'：头部
  onOk: null, // 点击确认后的回调
  onCancel: null, // 点击取消后的回调
  headerProps: {}, // pageHeader 组件的属性
  showHeader:true,
  bodyClassName:''
};

export default PageItem;
