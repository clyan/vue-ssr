import { createApp } from './main';


// 这里假定 App.vue 模板中根元素具有 `id="app"`
const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
}
// 需要在挂载 app 之前调用 router.onReady，因为路由器必须要提前解析路由配置中的异步组件，才能正确地调用组件中可能存在的路由钩子
    router.onReady(() => {
    // 添加路由钩子函数，用于处理 asyncData.
    // 在初始路由 resolve 后执行，
    // 以便我们不会二次预取(double-fetch)已有的数据。
    // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to)
        const prevMatched = router.getMatchedComponents(from)
    
        // 我们只关心非预渲染的组件
        // 所以我们对比它们，找出两个匹配列表的差异组件
        let diffed = false
        const activated = matched.filter((c, i) => {
          return diffed || (diffed = (prevMatched[i] !== c))
        })
    
        if (!activated.length) {
          return next()
        }
    
        // 这里如果有加载指示器 (loading indicator)，就触发
        Promise.all(activated.map(c => {
          if (c.asyncData) {
            return c.asyncData({ store, route: to })
          }
        })).then(() => {
          // 停止加载指示器(loading indicator)
          next()
        }).catch(next)
    })

    // 客户端代码，将内容挂载到dom上
  app.$mount('#app')
})