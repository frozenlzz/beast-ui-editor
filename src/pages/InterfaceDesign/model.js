import services from './service';
import { modelName, addChildrenData, deleteChildrenData, editChildrenData } from './config';
import createCRUDModel from '@/helpers/createCRUDModel';
import { findObjectList } from './service';
import { cloneDeep, isEmpty } from 'lodash-es';
// 第三个参数为预留自定义操作
export default createCRUDModel(modelName, services, {
  state: {
    initData: [{
      'name': '画布',
      'DomType': 'div',
      'attribute': {},
      'style': {
        'width': '1000px',
        'height': '300px',
        'alignItems': 'flex-start',
        'flexDirection': 'row',
        'justifyContent': 'flex-start',
        'background': '#fff',
      },
      'children': [{
        'name': '按钮1',
        'DomType': 'ButtonComp',
        'attribute': {
          'type': 'primary',
          'text': '按钮1',
          'size': 'default'
        },
        'style': { 'width': '200px' },
        'position': { 'x': 33, 'y': 17 },
        'key': 'rVtjAMduM8CsSvqd',
      }, {
        'name': '按钮2',
        'DomType': 'ButtonComp',
        'attribute': {
          'type': 'danger',
          'text': '按钮2',
          'ghost': true
        },
        'style': { 'width': '200px' },
        'position': { 'x': 333, 'y': 17 },
        'key': 'rVtjAMduM8CsSvqY',
      }],
      'position': { 'x': '299', 'y': '100' },
      'key': 'hZJ5fo1VggUhQs1R',
    }, {
      'name': '结束页面',
      'DomType': 'Result',
      'key': 'rVtjAMduM8CsSvqfe',
      'position': { 'x': 118, 'y': 400 },
      'attribute': {
        'type': 'info',
        'title': '提交成功',
        'description': '提交结果页用于反馈一系列操作任务的处理结果，如果仅是简单操作，使用 Message 全局提示反馈即可。本文字区域可以展示简单的补充说明，如果有类似展示“单据”的需求，下面这个灰色区域可以呈现比较复杂的内容。',
        'actions': {
          $$_type: 'jsx',
          $$_body :[
            {
              $$_type: "component",
              $$_body: {
                'name': '按钮1',
                'DomType': 'ButtonComp',
                'attribute': {
                  'type': 'primary',
                  'text': '确定',
                },
                'style': { 'width': '100px' },
                'key': 'rVtjAMduM8Cs90mY',
              }
            },{
              $$_type: "component",
              $$_body: {
                'name': '按钮2',
                'DomType': 'ButtonComp',
                'attribute': {
                  'type': 'danger',
                  'text': '取消',
                },
                'style': { 'width': '100px', },
                'key': 'rVtjAMduM8Cs90mfY',
              }
            },
          ],
        },
      },
      'style': {
        'width': 'auto',
      },
    }],

    currentIndex: -1, // 当前选中元素组件key值
    objectVisible: false, // 项目选择左侧栏栏目是否弹出(true)
    revokeList: [], // 存储操作数据，用于撤销时使用
    contraryRevokeList: [], // 撤销后，将上一个数据存储，用于反撤销时使用
  },
  effects: {
    // 查询套餐信息
    * findSkinClassByScheme({ payload }, { call, put }) {
      console.log(11111);
      const response = yield call(findObjectList, payload);
      console.log('response', response);
      // if (isObject(response) && (1 === response.status || 200 === response.status)) {
      //   let newData = response.data.subList;
      //   yield put({
      //     type: `schemeList`,
      //     payload: {
      //       schemeList: newData,
      //     },
      //   });
      // } else {
      //   failHandler(response);
      // }
      return response;
    },
  },
  reducers: {
    /**
     * 增加模块
     * @param {string} index 画布对应的key值，顶层画布为-1
     * @param state
     * */
    add(state, { payload }) {
      const { index, newObj } = payload;
      let newData = cloneDeep(state.initData);
      const newList = RevokeListChange(state);
      addChildrenData(newData, index, newObj);
      return {
        ...state, ...{
          initData: newData,
        },
        ...newList,
      };
    },

    /**
     * 修改组件
     * @param {Object} data 新增的组件对象
     * @param state
     * */
    editAttribute(state, { payload }) {
      const { index, data } = payload;
      let newData = cloneDeep(state.initData);
      const newList = RevokeListChange(state);
      editChildrenData(newData, index, data);
      return {
        ...state, ...{
          initData: newData,
        },
        ...newList,
      };
    },

    /**
     * 删除模块
     * @param {String} index 需要删除的组件的key值
     * @param state
     * */
    delete(state, { payload }) {
      const { index } = payload;
      let newData = cloneDeep(state.initData);
      const newList = RevokeListChange(state);
      deleteChildrenData(newData, index);
      return {
        ...state, ...{
          initData: newData,
        },
        ...newList,
      };
    },

    /**
     * 当前选中模块对应key值
     * @param index
     * @param state
     * */
    keyChange(state, { payload }) {
      const { key } = payload;
      return { ...state, ...{ currentIndex: key } };
    },

    /**
     * 是否弹出项目选择栏
     * @param id
     * @param state
     * */
    objectVisibleChange(state, { payload }) {
      const { visible } = payload;
      return { ...state, ...{ objectVisible: visible } };
    },

    /**
     * 撤回上一步操作
     * */
    revokeListChange(state, { payload }) {
      const initData = cloneDeep(state.initData); // 当前的list
      let newRevokeList = cloneDeep(state.revokeList);
      let newContraryRevokeList = cloneDeep(state.contraryRevokeList);
      if (!isEmpty(newRevokeList)) {
        const newData = newRevokeList[newRevokeList.length - 1];
        newRevokeList.pop();
        newContraryRevokeList.push(initData);
        return {
          ...state, ...{
            initData: newData,
            revokeList: newRevokeList,
            contraryRevokeList: newContraryRevokeList,
          },
        };
      }
    },

    /**
     * 反撤回上一步操作
     * */
    contraryRevokeListChange(state, { payload }) {
      const initData = cloneDeep(state.initData); // 当前的list
      let newRevokeList = cloneDeep(state.revokeList);
      let newContraryRevokeList = cloneDeep(state.contraryRevokeList);
      if (!isEmpty(newContraryRevokeList)) {
        const newData = newContraryRevokeList[newContraryRevokeList.length - 1];
        newContraryRevokeList.pop();
        newRevokeList.push(initData);
        return {
          ...state, ...{
            initData: newData,
            revokeList: newRevokeList,
            contraryRevokeList: newContraryRevokeList,
          },
        };
      }
    },

    /**
     * 修改initData
     * @param state
     * @param payload
     * */
    initDataChange(state, { payload }) {
      if (payload.initData) {
        const { initData } = payload;
        const newList = RevokeListChange(state);
        return {
          ...state,
          ...{
            initData: initData,
          },
          ...newList,
        };
      }
    },
  },
});

// 每次改变页面数据内容时，记录的上一次操作历史
function RevokeListChange(state) {
  let newRevokeList = cloneDeep(state.revokeList);
  newRevokeList.push(cloneDeep(state.initData)); // 当前添加元素之前的数据存入历史记录中
  return {
    revokeList: newRevokeList,
    contraryRevokeList: [],
  };
}
