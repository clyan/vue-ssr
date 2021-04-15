import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './router';
import { createStore } from './store/index';
import { sync } from 'vuex-router-sync'
Vue.config.productionTip = false
export function createApp(){
  const router = createRouter();
  const store = createStore();
    // 同步路由状态(route state)到 store
  sync(store, router)
  const app =new Vue({
    router,
    store,
    beforeCreate(){
        // 页面请求时会触发
        console.log('beforeCreate')
    },
    created(){
        console.log('created')
    },
    beforeMount(){
        // 不运行
        console.log('beforeMount')
    },
    render: h => h(App),
  })
  return  { app, router, store  }
}
