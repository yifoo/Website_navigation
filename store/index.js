// 开发环境启动严格模式
export const state = () => ({
  userInfo: {},
  type: "pc",
  showFeedBack: false,
  searchList: [],
});
export const mutations = {
  setUserInfo(state, info) {
    if (process.browser) {
      if (info.userName) {
        document.querySelector("title").textContent =
          info.userName + "-个人导航";
      } else {
        document.querySelector("title").textContent = "风行导航";
      }
    }
    state.userInfo = info;
  },
  setType(state, type) {
    state.type = type;
  },
  setShowFeedBack(state, bool) {
    state.showFeedBack = bool;
  },
  setSearch(state, data) {
    state.searchList = data;
  },
};
export const actions = {
  async nuxtServerInit({ commit }, { $axios }) {
    var { status, data } = await $axios.get("/com/all");
    if (status === 200 && data.code === "01") {
      commit("sites/setSiteList", data.respData.siteList || []);
      commit("setSearch", data.respData.searchList || []);
    }
  },
};
