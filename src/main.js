// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App'
import router from './router'
import './assets/css/my-mint.css'
import request from '@/utils/request'
import store from './store'
import VeeValidate from 'vee-validate';
import { Validator } from 'vee-validate';
import VueClipboard from 'vue-clipboard2'
// icon
import './assets/iconfont/iconfont.css'

Vue.config.productionTip = false

Vue.prototype.$request = request
Vue.prototype.$store = store

Vue.use(MintUI)
Vue.use(VueClipboard)

// 预览组件
// import preview from 'vue-photo-preview'
// import 'vue-photo-preview/dist/skin.css'
// Vue.use(preview)

Vue.use(VeeValidate, {
  events: ''
});

Validator.extend('required', {
  getMessage(field, args) {
    return "该项必填"
  },
  validate(value, args){
    return value;
  }
});
//Validator.updateDictionary(dictionary);

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (store.getters.token) {  // 通过vuex state获取当前的token是否存在
      next();
    }
    else {
      if(process.env.NODE_ENV != "development"){
        window.location.href = process.env.WX_INDEX
      }else{
        next({
          path: process.env.WX_INDEX, // 到登录页面
          //query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
          query: {redirect: '/home'}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
        })
      }

    }
  }
  else {
    next();
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
