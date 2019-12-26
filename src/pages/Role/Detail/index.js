import React, { Component } from 'react';
import { isFunction } from 'lodash';
import { connect } from 'dva';
import { createDetail } from '/common/components/HocCRUD';
import config,{ modelName } from '../config';
import PageItem from '/common/components/PageItem';
import DetailForm from './DetailForm';
import { Modal } from 'antd';

@connect(({ role: { detail, isShowDetail } }) => ({
  detail,
  isShowDetail,
}))
@createDetail({config, modelName })
class RoleDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.itemRef = React.createRef();
  }

  async handleOk() {
    // console.log('this.itemRef', this.itemRef);
    const {
      saveDetail
    } = this.props;
    const itemRef = this.itemRef.current;

    if (itemRef && isFunction(itemRef.getAjaxData)) {
      try {
        const values = await itemRef.getAjaxData();
        console.info('RoleDetail get ajaxData values', values);
        Modal.confirm({
          title: '确认保存信息吗?',
          centered: true,
          onOk() {
            saveDetail(values, false);
          }
        });
      } catch (e) {
        // console.log(e);
      }

    } else {
      console.error('RoleDetail Have not getAjaxData function');
    }
  };

  handleCancel(e) {
    this.props.hideDetail();
  }

  render() {
    const { match, id } = this.props;
    const isEdit = (match && match.params.id > 0) || id > 0;
    return (
      <PageItem location={this.props.location}
                title={`${isEdit > 0 ? '编辑' : '新建'}角色`}
                visible={this.props.isShowDetail}
                onOk={this.handleOk.bind(this)}
                onCancel={this.handleCancel.bind(this)}
      >
        <DetailForm compData={this.props.detail}
                    wrappedComponentRef={this.itemRef}/>
      </PageItem>
    );
  }
}

RoleDetail.propTypes = {};

export default RoleDetail;
