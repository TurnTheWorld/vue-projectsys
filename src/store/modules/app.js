const app = {
  state: {
    userInfo:{
      nickname: 'admin',
      headerImg: '',
      userId: '',
      companyId: '',
      companyName: '',
      serverUrl: '',
      fileUrl: '',
    },
    token: '',
    deviceId: '',
    openId: ''
  },
  // 更改 Vuex 的 store 中的状态的唯一方法是提交 mutationVuex 中的 mutation 非常类似于事件：
  // 每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)
  // 这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数：
  mutations: {
    UPDATE_TOKEN(state, token){
      state.token = token;
    },
    UPDATE_USER_INFO(state, userInfo){
      state.userInfo = userInfo
    },
    UPDATE_OPEN_ID(state, openId){
      state.openId = openId
    }
  },
  // Action 提交的是 mutation，而不是直接变更状态。
  // Action 可以包含任意异步操作。
  actions: {
    updateToken({ commit }, token) {
      commit('UPDATE_TOKEN', token)
    },
    updateUserInfo({ commit }, userInfo) {
      commit('UPDATE_USER_INFO', userInfo)
    },
    updateOpenId({ commit }, openId) {
      commit('UPDATE_OPEN_ID', openId)
    },
  }
}

export default app
