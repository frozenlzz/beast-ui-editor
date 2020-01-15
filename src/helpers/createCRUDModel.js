import router from 'umi/router';
import { clone, findIndex, isEmpty, isObject, isString, map, omit, pick, isArray } from 'lodash-es';
import { message } from 'antd';
import { datetime2Date, getRandomKey, isObjectValEqual, setStorage, sleepFunc } from '@/utils/utils';
import { failHandler } from '@/helpers/request';
import { myFormatMessage } from '@/utils/localeUtils';

window.CODE = getRandomKey();

export function dealDataChanged({ modelName }) {
  // console.log('dealDataChanged');
  // 如果是新打开的窗口，改变 localStorage 的 CHANGED_${modelName} 标识为 {}，表示 ${modelName} 的数据发生了改变，使得原窗口可以及时更新相应数据
  setStorage(`CHANGED_${modelName}`, {});
  // ${modelName} 模块的数据有改变，触发 action 'global/addDataChangingModals' ，使得 ObjectBox 组件可以根据 global.dataChangingModels[`${modelName}`] 来判断是否需要刷新数据
  // yield put({
  //   type: 'global/addDataChangingModals',
  //   payload: {
  //     modelName,
  //   },
  // });
  // if (window.IS_OPEN) {
  // } else {
  // }
}

export default (modelName, service, customModel = {}) => {
  const { deleteDetail, fetchDetail, fetchList, saveDetail, multiDel } = service;
  const initPage = {
    total: 0, // 总记录数
    size: 40, // 每页显示的记录数
    current: 1, // 当前页
    pages: 0, // 总页数
  };
  return {
    namespace: modelName,

    state: {
      searchData: {},
      list: [],
      page: {
        ...initPage,
      },
      detail: {},
      isShowDetail: false,
      ...customModel.state,
    },

    effects: {
      * fetchList({ payload }, { call, put, select }) {
        // console.log('ljljljlj:',111111);
        const selectData = yield select(state => state[modelName]['searchData']);
        let fPayload;
        if (selectData && payload) {
          fPayload = { ...payload };
          // 如果搜索条件有变化，则从第一页开始查
          if (('undefined' !== typeof payload.search)
            || ('undefined' !== typeof selectData.formData && 'undefined' !== typeof payload.formData
              && !isObjectValEqual(selectData.formData, payload.formData))
            || !isObjectValEqual(omit(selectData, ['current', 'size', 'signal', 'startIndex', 'maxResults']),
              omit(payload, ['current', 'size', 'signal', 'startIndex', 'maxResults']))
          ) {
            fPayload.current = 1;
          }
        } else if (selectData) {
          fPayload = { ...selectData };
        } else if (payload) {
          fPayload = { ...payload };
        }
        let current = fPayload.current;
        if (fPayload.current) {
          fPayload.startIndex = (fPayload.size * (fPayload.current - 1)) || 0;
          fPayload.maxResults = fPayload.size || 20;
          delete fPayload.current;
          delete fPayload.size;
        }

        // 如果不需要分页 noPageInfo === true，则去掉 startIndex 和 maxResults 的参数
        if(true === fPayload.noPageInfo) {
          delete fPayload.startIndex;
          delete fPayload.maxResults;
          delete fPayload.noPageInfo;
        }

        // console.log('fPayload', fPayload)
        const response = yield call(fetchList, fPayload);
        const newPayload = {
          list: [],
          page: { ...initPage },
          searchData: fPayload,
        };

        if (isObject(response) && 200 === response.status) {
          if (isArray(response.data)) {
            newPayload.list = response.data;
            newPayload.page = {};
          } else {
            let list, page,tmpPage;
            //嵌套两个data,够奇葩
            if (response.data.hasOwnProperty('results')||response.data.hasOwnProperty('data')) {
              if(response.data.hasOwnProperty('results')){
                list = response.data.results;
                tmpPage = response.data;
              }else{
                if(response.data.hasOwnProperty('data')&&response.data.data.hasOwnProperty('results')){
                  list = response.data.data.results;
                  tmpPage = response.data.data;
                }
              }
              // console.log('tmpPage:',tmpPage);
              page = {
                total: tmpPage.resultCount,
                size: tmpPage.maxResults,
                current: current,
              };
            } else {
              // console.log('1111.');
              list = response.data.records;
              page = pick(response.data, ['total', 'size', 'current', 'pages']);
            }
            // console.log('response.data:',list);
            newPayload.list = list;
            newPayload.page = page;
          }

        }
        yield put({
          type: 'list',
          payload: newPayload,
        });
        return response;
      },
      * fetchDetail({ payload }, { call, put, select }) {
        const curDetail = yield select(state => state[modelName]['detail']);
        // 如果 当前详情对象 不是 即将请求的详情对象，则先清空 当前详情对象数据
        if (!(payload.id > 0) || curDetail.id !== payload.id) {
          yield put({
            type: 'detail',
            payload: {
              detail: {},
            },
          });
        }
        if (!(payload.id > 0)) return {
          status: 200,
          data: {},
        };
        const response = yield call(fetchDetail, payload);
        const newPayload = {
          detail: {},
        };
        if (isObject(response) && 200 === response.status) {
          if (response.data) {
            newPayload.detail = response.data;
          } else {
            message.warning(myFormatMessage('crud.tip.no-found'));
          }
        }
        yield put({
          type: 'detail',
          payload: newPayload,
        });
        return response;
      },
      * saveDetail({ payload }, { call, put, select }) {
        const response = yield call(saveDetail, payload);
        if (isObject(response)) {
          if (200 === response.status) {
            message.success(myFormatMessage('crud.tip.save.suc'), 2);
            // console.log('xxxx')
            yield dealDataChanged({
              modelName,
              // put,
            });

            // 如果是编辑，则更新列表的数据
            const newDetail = response.data;
            if (newDetail && newDetail.id > 0) {
              yield put({
                type: 'detail',
                payload: {
                  detail: newDetail,
                },
              });
            }

            if (payload.id > 0 && newDetail && newDetail.id > 0) {
              const curList = yield select(state => state[modelName]['list']);
              const ind = findIndex(curList, { id: newDetail.id });
              if (-1 !== ind) {
                const newList = clone(curList);
                newList.splice(ind, 1, newDetail);
                yield put({
                  type: 'list',
                  payload: {
                    list: newList,
                  },
                });
              }
            } else {
              // 直接重新请求列表数据
              yield put({
                type: 'fetchList',
              });
            }
          } else {
            failHandler(response);
          }
        }
        return response;
      },
      * deleteDetail({ payload }, { call, put }) {
        const response = yield call(deleteDetail, payload);
        if (isObject(response)) {
          if (200 === response.status) {
            message.success(`${myFormatMessage('crud.tip.delete.num')}：1`, 2);
            // 如果是新打开的窗口，改变 localStorage 的 CHANGED_${modelName} 标识，表示 ${modelName} 的数据发生了改变，使得原窗口可以及时更新相应数据
            yield dealDataChanged({
              modelName,
              // put,
            });

            yield put({
              type: 'fetchList',
            });
          } else {
            failHandler(response);
          }
        }
        return response;
      },
      * multiDelete({ payload }, { call, put }) {
        const response = yield call(multiDel, payload);
        if (isObject(response)) {
          if (200 === response.status) {
            message.success(isString(response.data) ? response.data : `${myFormatMessage('crud.tip.delete.num')}：${payload.ids ? payload.ids.length : 0}`, 2);

            yield dealDataChanged({
              modelName,
              // put,
            });

            yield put({
              type: 'fetchList',
            });
          } else {
            failHandler(response);
          }
        }
        return response;
      },
      /**
       * 在列表更新某些字段
       * @param payload
       * @param call
       * @param put
       * @param select
       * @returns {IterableIterator<*>}
       */
      // * updateFieldsInList({ payload }, { call, put, select }) {
      //   const response = yield call(toggleState, payload);
      //   if (isObject(response)) {
      //     if (200 === response.status) {
      //       message.success('操作成功');
      //       const curList = yield select(state => state[modelName]['list']);
      //       const ind = findIndex(curList, { id: payload.id });
      //       if (-1 !== ind) {
      //         const newList = clone(curList);
      //         newList.splice(ind, 1, {...curList[ind], ...payload});
      //         yield put({
      //           type: 'list',
      //           payload: {
      //             list: newList,
      //           },
      //         });
      //       } else {
      //         // 直接重新请求列表数据
      //         yield put({
      //           type: 'fetchList',
      //         });
      //       }
      //     } else {
      //       failHandler(response);
      //     }
      //   }
      //   return response;
      // },
      /**
       * 显示详情页
       * @param state
       * @param payload
       * @param call
       * @param put
       * @returns {{isShowDetail: boolean}}
       */* showDetail({ payload }, { call, put }) {
        const { record, isPage } = payload;
        if (isPage) {
          let path = '';
          if (isEmpty(record) || !record.id) {
            path = `/${modelName}/detail`;
          } else {
            path = `/${modelName}/detail/${record.id}`;
          }
          yield call(router.push, path);
        }
        yield put({
          type: 'isShowDetail',
          payload: {
            isShowDetail: true,
          },
        });
      },
      * hideDetail({ payload }, { call, put }) {
        const { isPage } = payload;
        yield put({
          type: 'isShowDetail',
          payload: {
            isShowDetail: false,
          },
        });
        if (isPage) {
          if (false !== payload.animated) {
            yield call(sleepFunc, 200);
          }
          yield call(router.replace, `/${modelName}`);
        }
      },

      ...customModel.effects,
    },

    reducers: {
      isShowDetail(state, { payload }) {
        return {
          ...state,
          ...payload,
        };
      },
      list(state, { payload }) {
        const { list, page = initPage } = payload;
        const preNo = (page.current - 1) * page.size;
        const dateFields = [];
        if (list && list.length > 0) {
          const obj = list[0];
          for (const k in obj) {
            if (obj.hasOwnProperty(k) && -1 !== `${k}`.indexOf('Date')) {
              dateFields.push(k);
            }
          }
        }

        return {
          ...state,
          ...payload,
          list: map(list, (val, key) => {
            const obj = {
              key: val.id || val.key || getRandomKey(),
              no: key + 1 + (isNaN(preNo) ? 0 : preNo),
              ...val,
            };
            dateFields.forEach(v => {
              obj[v] = datetime2Date(val[v]);
            });
            return obj;
          }),
        };
      },
      detail(state, { payload }) {
        return {
          ...state,
          ...payload,
        };
      },
      ...customModel.reducers,
    },
    subscriptions: {
      setup({ dispatch, history }) {
        // history.listen(route => {
        //   // 如果当前匹配应用模型的详情路由，则显示详情浮层
        //   if (-1 !== route.pathname.indexOf(`/${modelName}/detail`)) {
        //     dispatch({
        //       type: `isShowDetail`,
        //       payload: {
        //         isShowDetail: true,
        //       },
        //     });
        //   }
        // });
      },
      ...customModel.subscriptions,
    },
  };
};
