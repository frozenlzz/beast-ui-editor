import React, { Component } from 'react';
import { Input, Button, Card, Table } from 'antd';
import ExportComp from '@/components/ExportComp';
import { connect } from 'dva';
import isFunction from 'lodash/isFunction';
import SaveBtn from '@/componentsTpl/ButtonComp/SaveBtn';
import { formatLocaleCols, myFormatMessage } from '@/utils/localeUtils';
import PageHeaderComp from '@/componentsTpl/PageHeaderComp';

const { Search, Group } = Input;

@connect(({ loading }) => ({
  loading,
}))
export default class MainWrap extends Component {

  render() {
    let {
      config = {},
      searchData,
      filterData,
      isLoading = false,

      title,
      headAction,
      headActionOption = {},
      headProps = {},
      renderHead = null,

      list,
      pageInfo,
      table,
      tableProps = {},
      loading = {},

      beforeTable,
      afterTable,

      exportCompProps = {},
      mainCardProps = {},
    } = this.props;

    // 标题和面包屑
    title = title || config.cn;
    let breadcrumbList = config.breadcrumbList;

    //== 国际化处理
    // 表头
    let tbCols = [];
    if (tableProps.isDealLocale) {
      formatLocaleCols(config, tableProps.columns, tbCols);
    } else {
      tbCols = tableProps.columns;
    }

    let fAction;


    if (false === headAction) {
      fAction = null;
    } else {
      fAction = headAction !== true ? headAction : (
        <Group>
          {
            true === headActionOption.search && (
              <span>
              <Search enterButton
                      style={{ width: 200, marginRight: 8 }}
                      placeholder={myFormatMessage('comp.search.placeholder')}
                      onSearch={this.props.handleSearch}
                      defaultValue={searchData.search}
              />
            </span>
            )
          }
          {
            true === headActionOption.add && (
              <SaveBtn type="primary" onClick={this.props.showDetail}>
                {myFormatMessage('crud.add')}
              </SaveBtn>
            )
          }
          {
            (true === headActionOption.export || true === headActionOption.import) && (
              <ExportComp appCode={config.appCode}
                          cn={config.cn}
                          searchData={{
                            fuzzyMatch: searchData.fuzzyMatch,
                            search: searchData.search,
                            filterData: filterData,
                          }}
                          afterImportCb={this.props.fetchList}
                          {...exportCompProps}
              />
            )
          }
        </Group>
      );
    }

    const { effects, models } = loading;
    const { modelName } = config;
    let modelLoading = models[modelName];
    let showHideLoading = !!effects[`${modelName}/showDetail`]
      || !!effects[`${modelName}/hideDetail`]
      || !!effects[`${modelName}/fetchDetail`];
    let tmpLoading = modelLoading && !showHideLoading;
    const loadingList = tmpLoading || isLoading;
    // console.log('list:',list);
    return (
      <div className="main-wrapper">
        {
          isFunction(renderHead) ? renderHead() : (
            <PageHeaderComp
              title={title}
              breadcrumbList={breadcrumbList}
              action={fAction}
              {...headProps}
            />
          )
        }
        <Card className='main-body' bodyStyle={{ padding: 0 }} {...mainCardProps}>
          {beforeTable}
          {
            false !== table && (
              table ? table : (
                <Table
                  loading={loadingList}
                  dataSource={list}
                  pagination={pageInfo}
                  bordered={true}
                  size='small'
                  className='thead-gray'
                  {...tableProps}
                  columns={tbCols}
                />
              )
            )
          }
          {afterTable}
          {
            this.props.children
          }
        </Card>
      </div>
    );
  }
}
