import defaultSettings from '../defaultSettings';

export default {
  namespace: 'setting',
  state: {
    ...defaultSettings
  },

  effects: {},
  reducers: {
    setStateByPayload(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
