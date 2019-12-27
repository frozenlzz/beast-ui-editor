import { isArray, isEmpty, isFunction, isObject, omitBy } from 'lodash';
import React from 'react';
import { getRandomKey } from '@/utils/utils';
import { abortFetch, newAbortCtrl } from '@/helpers/request';
import { message, Modal } from 'antd';
import { connect } from 'dva';
import { formatMsgByCn, myFormatMessage } from '@/utils/localeUtils';

const __initSearchData = (props) => {
  let sData = {
    current: 1,
    size: 40,
  };
  if (props.searchData && props.searchData.search) {
    sData = {
      ...sData,
      search: props.searchData.search,
    };
  }
  return sData;
};
const __initFilterData = (props) => ({});

/**
 *
 * @param opt Object 配置项；{
 *   modelName, // 应用模型的名称，同时也是该应用在全局 state 中的 key
 *   config,
 *   fetchInMount,
 *   initSearchData,
 *   initFilterData,
 * }
 * @returns {(function(*): WithList)|null}
 */
export const createList = (opt = {}) => {
  // console.log(opt);
  const { config } = opt;
  const modelName = opt.modelName ? opt.modelName : (
    config ? config.modelName : ''
  );
  if (isEmpty(modelName)) {
    console.error('modelName is required in createList ');
    return null;
  }

  const fetchInMount = false !== opt.fetchInMount;

  const initSearchData = (props) => {
    const data = __initSearchData(props);
    return isFunction(opt.initSearchData) ? opt.initSearchData(props, data) : data;
  };
  const initFilterData = (props) => {
    const data = __initFilterData(props);
    return isFunction(opt.initFilterData) ? opt.initFilterData(props, data) : data;
  };

  return (Comp) => {
    class WithList extends React.Component {
      constructor(props) {
        super(props);

        this.state = {};
        this.searchData = initSearchData(props); // 列表搜索条件数据
        this.filterData = initFilterData(props); // 过滤条件数据，用于导出

        this.abortCtrls = {};
        // this.abortCtrls.list = newAbortCtrl();
        // this.abortCtrls.delete = newAbortCtrl();
        // this.abortCtrls.multiDelete = newAbortCtrl();
        this.compRef = null;
      }

      /**
       * 设置搜索条件数据 searchData
       * @param newSearchData Object 新的搜索条件
       * @param isWholeObject Boolean 是否重新设置整个 searchData 对象，默认 false
       *                      true: 以 newSearchData 重新设置 searchData ;
       *                      false: 保留原有数据，只做字段替换;
       * @param needRerender Boolean 是否需要强制重新渲染，默认 false
       */
      setSearchData(newSearchData, isWholeObject = false, needRerender = false) {
        if (isObject(newSearchData)) {
          if (isWholeObject) {
            this.searchData = { ...newSearchData };
          } else {
            this.searchData = { ...this.searchData, ...newSearchData };
          }

          this.searchData = omitBy(this.searchData, (sItem) => ('undefined' === typeof sItem || null === sItem || '' === sItem));

          if (needRerender) {
            this.setState({ randomKey: getRandomKey() });
          }
        }
      }

      /**
       * 设置过滤数据 filterData
       * @param newFilterData Object 新的过滤条件 filterData
       * @param isWholeObject Boolean 是否重新设置整个 searchData 对象，默认 false
       *                      true: 以 newSearchData 重新设置 searchData ;
       *                      false: 保留原有数据，只做字段替换;
       * @param needRerender Boolean 是否需要强制重新渲染，默认 false
       */
      setFilterData(newFilterData, isWholeObject = false, needRerender = false) {
        if (isObject(newFilterData)) {
          if (isWholeObject) {
            this.filterData = { ...newFilterData };
          } else {
            this.filterData = { ...this.filterData, ...newFilterData };
          }
          if (needRerender) {
            this.setState({ randomKey: getRandomKey() });
          }
        }
      }

      componentDidMount() {
        fetchInMount && (this.fetchList());
        // console.log('>>> this.compRef', this.compRef);
        // console.log('this.compRef.componentDidMount', this.compRef.componentDidMount);
      }

      componentDidUpdate(prevProps, prevState, snapshot) {
        // 如果是登录过期之后，在弹框登录成功，则从新请求列表数据
        if (prevProps.loginTimeout && false === this.props.loginTimeout && this.compRef) {
          if (isFunction(this.compRef.fetchList)) {
            this.compRef.fetchList();
          } else if (isFunction(this.compRef.componentDidMount)) {
            this.compRef.componentDidMount();
          } else {
            this.fetchList();
          }
        }
      }

      componentWillUnmount() {
        if (!isEmpty(this.abortCtrls)) {
          for (let k in this.abortCtrls) {
            abortFetch(this.abortCtrls[k]);
          }
        }
      }

      fetchList(payload = {}) {
        this.abortCtrls.list = newAbortCtrl();
        // console.log('this.searchData',this.searchData);
        return this.props.dispatch({
          type: `${modelName}/fetchList`,
          payload: {
            signal: this.abortCtrls.list.signal,
            ...this.searchData,
            ...payload,
          },
        });
      }

      handleChangePnSize(page, pageSize) {
        this.searchData.current = page;
        this.searchData.size = pageSize;
        this.fetchList();
      }

      handleSearch(value) {
        this.searchData.search = value;
        this.fetchList();
      }

      deleteRecord(record, params = {}) {
        if (record.id > 0) {
          this.abortCtrls.delete = newAbortCtrl();
          this.props.dispatch({
            type: `${modelName}/deleteDetail`,
            payload: {
              id: record.id,
              signal: this.abortCtrls.delete.signal,
              ...params,
            },
          });
        }
      }

      multiDeleteRecord(selectedRowKeys) {
        if (isArray(selectedRowKeys) && selectedRowKeys.length > 0) {
          const $this = this;
          Modal.confirm({
            title: myFormatMessage('crud.tip.delete.selected'),
            centered: true,
            onOk() {
              $this.abortCtrls.multiDelete = newAbortCtrl();
              $this.props.dispatch({
                type: `${modelName}/multiDelete`,
                payload: {
                  ids: selectedRowKeys,
                  signal: $this.abortCtrls.multiDelete.signal,
                },
              });
            },
          });
        } else {
          message.warning(myFormatMessage('crud.tip.no-select'));
        }
      }

      showDetail(eOrRecord) {
        let record = {};
        if (!isEmpty(eOrRecord) && eOrRecord.id) {
          record = eOrRecord;
        }
        const { dispatch, match } = this.props;
        dispatch({
          type: `${modelName}/showDetail`,
          payload: {
            record,
            isPage: !isEmpty(match),
          },
        });
      }

      render() {
        const { page = {} } = this.props;
        const pageInfo = {
          current: page.current,
          total: page.total,
          pageSize: page.size,
          showTotal: (total) => (myFormatMessage('comp.page.showTotal', { total })),
          showSizeChanger: true,
          onChange: this.handleChangePnSize.bind(this),
          onShowSizeChange: this.handleChangePnSize.bind(this),
          size: 'default',
          // hideOnSinglePage: true,
        };
        return (
          <Comp
            {...this.props}
            ref={(ref) => {
              this.compRef = ref;
            }}
            listRef={this}
            config={config}
            searchData={this.searchData}
            filterData={this.filterData}
            setSearchData={this.setSearchData.bind(this)}
            setFilterData={this.setFilterData.bind(this)}
            fetchList={this.fetchList.bind(this)}
            pageInfo={pageInfo}
            handleSearch={this.handleSearch.bind(this)}
            deleteRecord={this.deleteRecord.bind(this)}
            multiDeleteRecord={this.multiDeleteRecord.bind(this)}
            showDetail={this.showDetail.bind(this)}
          />
        );
      }
    }

    WithList.displayName = `WithList(${Comp.displayName || Comp.name})`;

    return connect((state) => {
      const { loading, global: { loginTimeout } } = state;
      const model = state[modelName] || {};
      const { searchData, list, page } = model;
      return {
        loading,
        loginTimeout,
        searchData,
        list,
        page,
      };
    })(WithList);
  };
};
