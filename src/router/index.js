import Vue from 'vue'
import Router from 'vue-router'
import WxLogin from '@/components/WxLogin'
import Home from '@/components/home/Home'
import BindPhone from '@/components/BindPhone'
import BindCompany from '@/components/BindCompany'
import BindDept from '@/components/BindDept'
import BindProject from '@/components/project/BindProject'
import AddProject from '@/components/project/AddProject'
import ProOperList from '@/components/project/ProOperList'
import NoticeList from '@/components/notice/NoticeList'
import NoticeDetail from '@/components/notice/NoticeDetail'

Vue.use(Router)

// resolve => require(['@/components/Second'],resolve) 需要的时候才去下载

export default new Router({
  //mode:"history", // 要使用默认的hash模式打包之后才不会是一片空白
  scrollBehavior(to, from, savedPositon){
    // return 期望到哪个位置
    if(savedPositon){
      return savedPositon
    }else{
      return {x: 0, y: 0}
    }
  }
  ,
  routes: [
    {
      path: '/',
      name: 'WxLogin',
      component: WxLogin
    }
    ,{
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        keepAlive: true
      },
    }
    ,{
      path: '/bindPhone',
      name: 'BindPhone',
      component: BindPhone,
    }
    ,{
      path: '/bindCompany',
      name: 'BindCompany',
      component: BindCompany,
    }
    ,{
      path: '/BindDept',
      name: 'BindDept',
      component: BindDept,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    }
    ,{
      path: '/BindProject',
      name: 'BindProject',
      component: BindProject,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    }
    ,{
      path: '/AddProject',
      name: 'AddProject',
      component: AddProject,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    }
    ,{
      path: '/ProOperList',
      name: 'ProOperList',
      component: ProOperList,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        keepAlive: true
      },
    }
    ,{
      path: '/NoticeList',
      name: 'NoticeList',
      component: NoticeList,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        keepAlive: false
      },
    },
    ,{
      path: '/NoticeDetail',
      name: 'NoticeDetail',
      component: NoticeDetail,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    }
    ,{
      path: '/before/Bid/:proId',
      name: 'Bid',
      component: resolve => require(['@/components/before/Bid'],resolve),
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    }
    ,{
      path: '/before/SignContract/:proId',
      name: 'SignContract',
      component: resolve => require(['@/components/before/SignContract'],resolve),
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    }
    ,{
      path: '/prepare/ManageList/:proId',
      name: 'ManageList',
      component: resolve => require(['@/components/prepare/ManageList'],resolve),
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        keepAlive: true
      },
    }
    ,{
      path: '/base/SelectUser',
      name: 'SelectUser',
      component: resolve => require(['@/components/base/SelectUser'],resolve),
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    }
  ]
})
