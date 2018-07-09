const getters = {
  token: state => state.app.token,
  openId: state => state.app.openId,
  nickname: state => state.app.userInfo.nickname,
  userId: state => state.app.userInfo.userId,
  companyId: state => state.app.userInfo.companyId,
  companyName: state => state.app.userInfo.companyName,
  headerImg: state => state.app.userInfo.headerImg,
  fileUrl: state => state.app.userInfo.fileUrl,
}
export default getters
