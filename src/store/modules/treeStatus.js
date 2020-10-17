const tree = {
  state: {
    tree: {
      show: false,
      treeName: 'allNode'
    },
    node: null
  },
  mutations: {
    SET_TREE: (state, tree) => {
      state.tree = tree
    },
    SET_NODE: (state, node) => {
      state.node = node
    }
  },
  actions: {
    saveTree({ commit }, tree) {
      commit('SET_TREE', tree)
    },
    setNode({ commit }, node) {
      commit('SET_NODE', node)
    }
  }
}

export default tree