export const state = () => ({
  list: ['a', 'b']
})

export const mutations = {
  add(state, text) {
    state.list.push(text)
  }
}

export const actions = {
  add: ({commit}, text) => {
    commit('add', text)
  }
}

