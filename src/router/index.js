import Vue from 'vue'
import Router from 'vue-router'
import staticRoutes from './staticRoutes'
import $store from '../vuex/store'

Vue.use(Router)

export const router = new Router({
  routes: staticRoutes
})

//根据权限跳转到401或404页面
router.beforeEach( (to,from,next) => {
  let token = localStorage.getItem('token');
  if(!to.name){
    next('/404');
  }else{
    next();
  }
  // else
  // {
  //   if(token){
  //     if(to.path == '/login'){
  //       next('/manage');
  //     }else{
  //       next();
  //     }
  //   }else{
  //     if(to.path == '/login'){
  //       next();
  //     }else{
  //       next('/login');
  //     }
  //   }
  // }
  // next();
})
