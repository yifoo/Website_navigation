

export default ({ app, store }) => {
  app.router.beforeEach((to, from, next) => {
    let isClient = process.browser
    if (isClient) {
      if (to.path === "/user-center" && !store.state.userInfo.userName) {
        next('/login')
      }
    }
    next()
  })
}
