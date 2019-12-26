import React, { Component } from 'react';
import { Divider, Popconfirm } from 'antd';
import { createList } from '/common/components/HocCRUD';
import * as config from './config';
import DeleteBtn from '/common/componentsTpl/ButtonComp/DeleteBtn';
import ButtonComp from '/common/componentsTpl/ButtonComp';
import MainWrap from '/common/components/HocCRUD/MainWrap';

export const actionFunc = (props, text, record) => (
  <>
    <ButtonComp btnType={'a'} onClick={() => {
      props.showDetail(record);
    }}>详情</ButtonComp>
    <Popconfirm
      title={'确认删除吗？'}
      onConfirm={() => {
        props.deleteRecord(record);
      }}
      okText={'确认'}
      cancelText={'取消'}>
      <DeleteBtn btnType={'a'}><Divider type="vertical"/>
        删除
      </DeleteBtn>
    </Popconfirm>
  </>
);
@createList({
  config,
  initSearchData: (props, data) => {
    return {
      ...data,
      fuzzyMatch: 'code,name',
    };
  },
  initFilterData: null,
})
export default class Role extends Component {

  render() {

    const tableProps = {
      columns: [
        {
          title: '序号',
          dataIndex: 'no',
          key: 'no',
        },
        {
          title: '角色编码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '角色名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => (actionFunc(this.props, text, record)),
        },
      ],
    };

    return (
      <MainWrap
        {...this.props}
        tableProps={tableProps}
      >
        {
          this.props.children
        }
      </MainWrap>
    );
  }
}
