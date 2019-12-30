import services from './service';
import { modelName, addChildrenData, deleChildrenData, editChildrenData } from './config';
import createCRUDModel from '@/helpers/createCRUDModel';
import { findObjectList } from './service';
import { cloneDeep, isEmpty } from 'lodash';
// 第三个参数为预留自定义操作
export default createCRUDModel(modelName, services, {
  state: {
    initData: [
      {
        name: '账号',
        key: '0001',
        DomType: 'Jhinput',
        position: {
          x: 400,
          y: 120,
        },
        attribute: {
          placeholder: '输入账号',
        },
        style: {
          width: '200px',
          height: '32px',
        },
      },
      {
        name: '密码',
        key: '0002',
        DomType: 'Jhinput',
        position: {
          x: 400,
          y: 180,
        },
        attribute: {
          placeholder: '输入密码',
        },
        style: {
          width: '200px',
          height: '32px',
        },
      },
      {
        name: '登录',
        key: '0003',
        DomType: 'Jhbutton',
        position: {
          x: 400,
          y: 260,
        },
        style: {
          width: '100px',
          height: '32px',
        },
      },
      {
        name: '画布',
        key: '0004',
        DomType: 'div',
        position: {
          x: 0,
          y: 300,
        },
        style: {
          width: '500px',
          height: '200px',
        },
        children: [
          {
            name: '账号',
            key: '0005',
            DomType: 'Jhinput',
            position: {
              x: 50,
              y: 20,
            },
            attribute: {
              placeholder: '输入账号',
            },
            style: {
              width: '200px',
              height: '32px',
            },
          },
          {
            name: '注册',
            key: '0006',
            DomType: 'Jhbutton',
            position: {
              x: 100,
              y: 100,
            },
            style: {
              width: '100px',
              height: '32px',
            },
          },
        ],
      },
    ],
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
     * @param {Object} newObj 新增的组件对象
     * */
    add(state, { payload }) {
      const { index, newObj } = payload;
      let newRevokeList = cloneDeep(state.revokeList);
      let newData = cloneDeep(state.initData);
      newRevokeList.push(cloneDeep(state.initData)); // 当前添加元素之前的数据存入历史记录中
      addChildrenData(newData, index, newObj);
      return {
        ...state, ...{
          initData: newData,
          revokeList: newRevokeList,
          contraryRevokeList: [],
        },
      };
    },

    /**
     * 修改组件
     * @param {Object} data 新增的组件对象
     * @param {String} index 当前修改元素对应的key值
     * */
    editAttribute(state, { payload }) {
      const { index, data } = payload;
      let newRevokeList = cloneDeep(state.revokeList);
      let newData = cloneDeep(state.initData);
      newRevokeList.push(cloneDeep(state.initData)); // 当前添加元素之前的数据存入历史记录中
      editChildrenData(newData, index, data);
      return {
        ...state, ...{
          initData: newData,
          revokeList: newRevokeList,
          contraryRevokeList: [],
        },
      };
    },

    /**
     * 删除模块
     * @param {String} index 需要删除的组件的key值
     * */
    delete(state, { payload }) {
      const { index } = payload;
      let newRevokeList = cloneDeep(state.revokeList);
      let newData = cloneDeep(state.initData);
      newRevokeList.push(cloneDeep(state.initData)); // 当前添加元素之前的数据存入历史记录中
      deleChildrenData(newData, index);
      return {
        ...state, ...{
          initData: newData,
          revokeList: newRevokeList,
          contraryRevokeList: [],
        },
      };
    },

    /**
     * 当前选中模块对应key值
     * @param index
     * */
    keyChange(state, { payload }) {
      const { key } = payload;
      return { ...state, ...{ currentIndex: key } };
    },

    /**
     * 是否弹出项目选择栏
     * @param id
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
  },
});
