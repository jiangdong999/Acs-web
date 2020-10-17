import { asyncRouterMap, constantRouterMap } from '@/router'
import roles from "@/utils/role";


/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

function hasRoute(menu, routerMap) {
  if(menu.parentId == 1 && menu.children==0){
    // 若一级菜单下没有二级菜单 
    return null
  }
  if (menu && menu.menuCode) {

    let permission = menu.menuCode;
    let targetRoute = null;
    routerMap.forEach(route => {
      if (route.meta && route.meta.menu) {
        if (route.meta.menu.indexOf(permission) != -1) {
          route.meta.title = menu.menuName
          targetRoute = route
        }
      }
    });

    return targetRoute;
  } else {
    return null;
  }
}

function filterRouters(menus, routerMap) {

  let userRouterMap = [];
  menus.forEach(menu => {
    let targetRoute = hasRoute(menu, routerMap);
    if (targetRoute && targetRoute !== {}) {
      if (menu.children && menu.children.length && targetRoute.children) {
        let children = filterRouters(menu.children, targetRoute.children)
        if (children && children.length > 0) {
          targetRoute.children = children;
        }
      }

      userRouterMap.push(targetRoute)
    }
  })

  return userRouterMap
}

const permission = {
  state: {
    routers: [],
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = routers
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const allMenus = data.permissions
        let accessedRouters = filterRouters(allMenus, constantRouterMap)
        commit('SET_ROUTERS', accessedRouters)
        resolve(accessedRouters)
      })
    }
  }
}

export default permission
