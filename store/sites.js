export const state = () => ({
  editState: false,
  sortList: [],
  subSortList: [],
  siteList: [],
  isUpdateAll: false,
})

export const mutations = {
  setEdit(state, edit) {
    state.editState = edit
  },
  setSortList(state, sortList) {
    state.sortList = sortList
  },
  setSubSortList(state, subSortList) {
    state.subSortList = subSortList
  },
  setSiteList(state, siteList) {
    state.siteList = siteList || []
  },
  setIsUpdateAll(state, isUpdateAll) {
    state.isUpdateAll = isUpdateAll
  },
}

export const actions = {
  updateSites: ({
    commit
  }, siteList) => {
    commit('setSites', siteList)
  }
}

