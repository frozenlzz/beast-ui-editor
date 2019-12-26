import services from './service';
import { modelName, addChildrenData, deleChildrenData, editChildrenData } from './config';
import createCRUDModel from '/common/helpers/createCRUDModel';
import { findObjectList } from './service';
import { cloneDeep } from 'lodash';
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
  },
  effects: {
    // 查询套餐信息
    *findSkinClassByScheme({ payload }, { call, put }) {
      console.log(11111)
      const response = yield call(findObjectList, payload);
      console.log('response',response)
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
      let newData = cloneDeep(state.initData);
      addChildrenData(newData, index, newObj);
      console.log(newData);
      return { ...state, ...{ initData: newData } };
    },
    /**
     * 修改组件
     * @param {Object} data 新增的组件对象
     * @param {String} index 当前修改元素对应的key值
     * */
    editAttribute(state, { payload }) {
      const { index, data } = payload;
      let newData = cloneDeep(state.initData);
      editChildrenData(newData, index, data);
      return { ...state, ...{ initData: newData } };
    },
    /**
     * 删除模块
     * @param {String} index 需要删除的组件的key值
     * */
    delete(state, { payload }) {
      const { index } = payload;
      let newData = cloneDeep(state.initData);
      deleChildrenData(newData, index);
      return { ...state, ...{ initData: newData } };
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
  },
});
