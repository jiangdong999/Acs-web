import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: true })// NProgress Configuration

// permissiom judge function
function hasPermission(permissions, menu) {
  // router不写menu属性则视为白名单
  if (!menu) return true
  return permissions.some(permission => {
    if(permission.menuCode == menu){
      return true
    } else if (permission.children && permission.children.length>0){
      return hasPermission(permission.children, menu)
    }
  })
}

const whiteList = ['/login', '/authredirect']// no redirect whitelist

router.beforeEach((to, from, next) => {

  NProgress.start() // start progress bar
  if (getToken()) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.permissions.length === 0 ) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetPermissions').then(res => { // 拉取user_info
          const permissions = res.data.content.children
          store.dispatch('getCommunity').then(() => {   // 拉取右上角小区列表
            store.dispatch('GenerateRoutes', { permissions }).then((routerMap) => { // 根据roles权限生成可访问的路由表
              if (to.redirectedFrom === '/') {
                let currentRoute = routerMap[0].children[0];
                while(currentRoute.children && currentRoute.children.length>0){
                  currentRoute = currentRoute.children[0]
                }
                next({ ...currentRoute, replace: true }) // 默认主页为排序第一菜单
              } else {
                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              }
            })
          }).catch(() => {
            store.dispatch('FedLogOut').then(() => {
              // Message.error('验证失败，请重新登录')
              NProgress.done()
              next({ path: '/login' })
            })
          })
          
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            // Message.error('验证失败，请重新登录')
            NProgress.done()
            next({ path: '/login' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.permissions, to.meta.menu)) {
          // console.log(to.meta,store.getters.permissions,1);
          next()//
        }else{
          // console.log(to.meta,store.getters.permissions,0);
          next({ path: '/401' })
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }


})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
