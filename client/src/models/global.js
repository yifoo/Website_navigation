export default {
  namespace: 'global',
  state: {
    isLight: false,
    isMobile: false,
  },
  reducers: {
    setIsMobile(state, { payload }) {
      return {
        ...state,
        isMobile: payload,
      };
    },
    setIsLight(state, { payload }) {
      return {
        ...state,
        isLight: payload,
      };
    },
  },
  effects: {},
};
