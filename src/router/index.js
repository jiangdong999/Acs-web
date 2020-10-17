import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import roles from "@/utils/role";
/* Layout */
import Layout from '../views/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)


/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: _import('login/index'), hidden: true},
  {path: '/authredirect', component: _import('login/authredirect'), hidden: true},
  {path: '/404', component: _import('errorPage/404'), hidden: true},
  {path: '/401', component: _import('errorPage/401'), hidden: true },
  {path: '*', redirect:'/404', hidden: true},
  {
    path: '/',
    component: Layout,
    // redirect: 'community/index',   //将默认的首页地址跳转至小区管理首页
    redirect: to => {
      if (store.getters.permission_routers.length > 0) {
        let currentRoute = store.getters.permission_routers[0].children[0];
        // while(currentRoute.children && currentRoute.children.length>0){
        //   currentRoute = currentRoute.children[0]
        // }
        return { ...currentRoute, replace: true }
      }else{
        return { path: 'login/index' }
      }
    },
    hidden: true,
    // children: [{
    //   path: 'dashboard',
    //   component: _import('dashboard/index'),
    //   name: 'dashboard',
    //   meta: {title: 'dashboard', icon: 'dashboard', noCache: true}
    // }]
  },
  // 静态首页
  {
    path: '/first',
    component: Layout,
    meta: {
      title: 'first', icon: 'home', noCache: true,
      menu: 'first:*',
      roles: [roles.DEMO]
    },
    children: [{
      path: 'index',
      name: 'first',
      component: _import('first/index'),
      meta: {
        menu: 'first:index',
        title: 'first', icon: 'home', noCache: true,
        roles: [roles.DEMO]
      }
    }]
  },
  // 物业管理
  {
    path: '/property',
    component: Layout,
    meta: {
      title: 'property', icon: 'wuyeguanli', noCache: true,
      menu: 'property:*',
      roles: [roles.PROPERTY, roles.OPEN, roles.DEMO]
    },
    children: [{
      path: 'index',
      name: 'property',
      component: _import('property/index'),
      meta: {
        hideCommunityFilter: true,
        menu: 'property:index',
        title: 'property', icon: 'wuyeguanli', noCache: true,
        roles: [roles.PROPERTY, roles.OPEN, roles.DEMO]
      }
    }]
  },
  // 警报管理
  {
    path: '/alarm',
    component: Layout,
    meta: {
      menu: 'alarm:*',
      title: 'alarms',
      icon: 'jinggao1',
      noCache: true,
      roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
    },
    children: [{
      path: 'alarm',
      name: 'alarm',
      component: _import('message/alarm'),
      meta: {
        hideCommunityFilter: true,
        menu: 'message:alarm',
        title: 'alarm', icon: 'gaojingxiaoxi', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    }, {
      path: 'alarmDoor',
      name: 'alarmDoor',
      component: _import('message/alarmDoor'),
      meta: {
        hideCommunityFilter: true,
        menu: 'message:door',
        title: 'alarmDoor', icon: 'menchangkaigaojing', noCache: true,
        roles: [roles.ADMIN, roles.SJF]
      }
    }]
  },
  // 出入记录
  {
    path: '/record',
    component: Layout,
    meta: {
      menu: 'record:*',
      title: 'record', icon: 'churu', noCache: true,
      roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
    },
    children: [{
      path: 'opening',
      name: 'opening',
      component: _import('record/opening'),
      meta: {
        hideCommunityFilter: true,
        menu: 'record:opening',
        title: 'opening', icon: 'kaimenjilu', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    }, {
      path: 'visiting',
      name: 'visiting',
      component: _import('record/visiting'),
      meta: {
        hideCommunityFilter: true,
        menu: 'record:visiting',
        title: 'visiting', icon: 'laifangjilu', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    }]
  },
  // 设备管理
  {
    path: '/equipment',
    component: Layout,
    meta: {
      menu: 'equipment:*',
      title: 'equipment', icon: 'menjin', noCache: true,
      roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.SJF]
    },
    children: [{
      path: 'device',
      name: 'deviceList',
      component: _import('device/index'),
      meta: {
        hideCommunityFilter: true,
        keepAlive: true,
        menu: 'device:*',
        title: 'device', icon: 'menjinjiguanli', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.SJF]
      }
    },{//烟感设备管理
      path: 'smokeSensor',
      name: 'smokeSensor',
      component: _import('smokeSensor/index'),
      meta: {
        hideCommunityFilter: true,
        keepAlive: true,
        menu: 'smokeSensor:*',
        title: 'smokeSensor', icon: 'menjinjiguanli', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.SJF]
      }
    },{
      path: 'smokeSensor/alarmRecord',
      name: 'alarmRecord',
      component: _import('smokeSensor/alarmRecord'),
      meta: {
        hideCommunityFilter: true,
        title: '警情记录', icon: 'menjinjiguanli', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.SJF]
      }
    },{
      path: 'device_simple',
      name: 'deviceList_simple',
      component: _import('deviceSimple/index'),
      meta: {
        hideCommunityFilter: true,
        keepAlive: true,
        menu: 'device:simple',
        title: 'device', icon: 'menjinjiguanli', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.SJF]
      }
    },{
      path: 'device/setting',
      name: 'deviceSetting',
      component: _import('device/setting'),
      meta: {
        hideCommunityFilter: true,
        title: '门禁机管理', icon: 'menjinjiguanli', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.SJF]
      }
    }]
  },
  // 车辆管理 
  {
    path: '/vehicle',
    component: Layout,
    meta: {
      menu: 'vehicle:*',
      title: 'vehicle', icon: 'car', noCache: true,
      roles: [roles.ADMIN]
    },
    children: [{
      path: 'parkingSpace',
      name: 'parkingSpace',
      component: _import('vehicle/parkingSpace'),
      meta: {
        hideCommunityFilter: true,
        menu: 'vehicle:parkingSpace',
        title: 'parkingSpace', icon: 'tingcheweixinxi', noCache: true,
        roles: [roles.ADMIN]
      }
    }, {
      path: 'record',
      name: 'carsRecord',
      component: _import('vehicle/record'),
      meta: {
        hideCommunityFilter: true,
        menu: 'vehicle:carsRecord',
        title: 'carsRecord', icon: 'cheliangchurujilu', noCache: true,
        roles: [roles.ADMIN]
      }
    }, {
      path: 'recordDetails',
      name: 'recordDetails',
      component: _import('vehicle/recordDetails'),
      hidden: true,
      meta: {
        hideCommunityFilter: true,
        title: 'recordDetails', icon: 'icon_record', noCache: true,
        hideTag: true,
        roles: [roles.ADMIN]
      }
    }]
  },
  // 小区服务
  {
    path: '/cservice',
    component: Layout,
    meta: {
      menu: 'cservice:*',
      title: 'cservice', icon: 'gonggao', noCache: true,
      roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO, roles.SJF]
    },
    children: [{
      path: 'device',
      name: 'noticeDevice',
      component: _import('notice/device'),
      meta: {
        menu: 'notice:noticeDevice',
        title: 'noticeDevice', icon: 'menjinjigonggao', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO, roles.SJF]
      }
    }, {
      path: 'client',
      name: 'noticeClient',
      component: _import('notice/client'),
      meta: {
        menu: 'notice:noticeClient',
        title: 'noticeClient', icon: 'kehuduangonggao', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    }, {
      path: 'clientNotice',
      name: 'clientNotice',
      component: _import('notice/clientNotice'),
      meta: {
        menu: 'clientNotice:*',
        title: 'clientNotice', icon: 'kehuduangonggao', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    }]
  },
  // 业务管理
  {
    path: '/business',
    component: Layout,
    meta: {
      menu: 'business:*',
      title: 'business',
      icon: 'yewu1',
      noCache: true,
      roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
    },
    children: [{
      path: 'card',
      name: 'card',
      component: _import('card/index'),
      meta: {
        menu: 'card:*',
        title: 'card', icon: 'menjinkaguanli', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.OTHER, roles.SJF]
      }
    }, {
      path: 'authorize',
      name: 'authorizeMessage',
      component: _import('message/authorize'),
      meta: {
        menu: 'message:authorize',
        title: 'authorizeMessage', icon: 'zhuhushenqingguanli', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    },{
      path: '/business/cell',
      // name: 'rooms',
      component: _import('cell/index'),
      // hidden: true,
      redirect: 'area',
      meta: {
        menu: 'room:*',
        title: 'room', icon: 'yewubanlidating', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.SJF]
      },
      children: [
      {
        path: 'area',
        component: _import('cell/components/areaView'),
        // hidden: true,
        name: 'area',
        meta: {
          hideHeader: false,
          title: '住户登记',  noCache: true,
          roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.SJF]
        }
      }, {
        path: 'floor',
        component: _import('cell/components/floorView'),
        hidden: true,
        name: 'floor',
        meta: {
          title: '楼层列表', icon: 'yewubanlidating', noCache: true,
          roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.SJF]
        }
      }, {
        path: 'details',
        component: _import('cell/components/roomView'),
        hidden: true,
        name: 'details',
        meta: {
          hideHeader: true,
          title: '房屋详情', icon: 'yewubanlidating', noCache: true,
          roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.SJF]
        }
      },{
        path: 'roomNodes',
        name: 'roomNodes',
        component: _import('room/roomNodes'),
        hidden: true,
        meta: {
          hideHeader: true,
          menu: 'room:roomNodes',
          title: '房屋列表', icon: 'zhuhushenqingguanli', noCache: true,
          roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
        }
      }, {
        path: 'office',
        name: 'office',
        component: _import('room/office'),
        hidden: true,
        meta: {
          hideCommunityFilter: true,
          hideHeader:true,
          title: '物业管理处', icon: 'juzhuxinxi', noCache: false,
          roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO]
        }
      }]
    }, {
      path: 'household',
      name: 'household',
      component: _import('household/index'),
      meta: {
        hideCommunityFilter: true,
        // keepAlive: true,
        menu: 'household:index',
        title: 'household', icon: 'juzhuxinxi', noCache: false,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO]
      }
    }, {
      path: 'addHousehold',
      name: 'addHousehold',
      hidden: true,
      component: _import('household/form'),
      meta: {
        hideCommunityFilter: true,
        // menu: 'household:add',
        title: '新增住户', icon: 'juzhuxinxi', noCache: false,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO]
      }
    }, {
      path: 'householdDetails',
      name: 'householdDetails',
      hidden: true,
      component: _import('household/details'),
      meta: {
        hideCommunityFilter: true,
        // menu: 'household:edit',
        title: '住户详情', icon: 'juzhuxinxi', noCache: false,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO]
      }
    }, {
      path: 'editHousehold',
      name: 'editHousehold',
      hidden: true,
      component: _import('household/edit'),
      meta: {
        hideCommunityFilter: true,
        // menu: 'household:edit',
        title: '编辑住户', icon: 'juzhuxinxi', noCache: false,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO]
      }
    }, {
      path: 'index',
      name: 'roomCardList',
      component: _import('roomCard/index'),
      meta: {
        menu: 'houseCard:index',
        title: 'roomCardList', icon: 'quanxianshenqingkaguanli', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO, roles.SJF]
      }
    }]
  },
  // 权限管理
  // {
  //   path: '/authority',
  //   component: Layout,
  //   meta: {
  //     menu: 'authority:*',
  //     title: 'authority',
  //     icon: 'jigouguanli',
  //     noCache: true,
  //     roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
  //   },
  //   children: [{
  //     path: 'org',
  //     name: 'org',
  //     component: _import('authority/org'),
  //     meta: {
  //       hideCommunityFilter: true,
  //       menu: 'org:read',
  //       title: 'org',
  //       icon: 'jigouguanli',
  //       noCache: true,
  //       roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
  //     }
  //   }, {
  //     path: '_org',
  //     name: '_org',
  //     component: _import('authority/components/orgDetails'),
  //   meta: {
  //       hideCommunityFilter: true,
  //       menu: 'org2:read',
  //       title: 'org',
  //       icon: 'caozuojilu',
  //     noCache: true,
  //     roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
  //     }
  //   }, {
  //     path: 'org/orgDetails',
  //     name: 'orgDetails',
  //     hidden: true,
  //     component: _import('authority/components/orgDetails'),
  //     meta: {
  //       hideCommunityFilter: true,
  //       title: '机构详情',
  //       icon: 'caozuojilu',
  //       noCache: true,
  //       roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
  //     }
  //   }, {
  //     path: 'role',
  //     name: 'role',
  //     component: _import('authority/role'),
  //     meta: {
  //       hideCommunityFilter: true,
  //       menu: 'role:read',
  //       title: 'role',
  //       icon: 'caozuojilu',
  //       noCache: true,
  //       roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
  //     }
  //   }, {
  //     path: 'role/create',
  //     name: 'roleCreate',
  //     component: _import('authority/components/roleCreate'),
  //     meta: {
  //       hideCommunityFilter: true,
  //       title: '新增角色',
  //       icon: 'caozuojilu',
  //       noCache: true,
  //       roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
  //     }
  //   }, {
  //     path: 'role/details',
  //     name: 'roleDetails',
  //     component: _import('authority/components/roleDetails'),
  //     meta: {
  //       hideCommunityFilter: true,
  //       title: '角色详情',
  //       icon: 'caozuojilu',
  //       noCache: true,
  //       roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
  //     }
  //   }, {
  //     path: 'operator',
  //     name: 'operator',
  //     component: _import('authority/operator'),
  //     meta: {
  //       hideCommunityFilter: true,
  //       menu: 'operator:read',
  //       title: 'operator',
  //       icon: 'caozuojilu',
  //       noCache: true,
  //       roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
  //     }
  //   }, {
  //     path: 'operator/operatorDetails',
  //     name: 'operatorDetails',
  //     component: _import('authority/components/operatorDetails'),
  //     meta: {
  //       hideCommunityFilter: true,
  //       title: '操作人员详情',
  //       icon: 'caozuojilu',
  //       noCache: true,
  //       roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
  //     }
  //   }]
  // },
  //人脸管理
  {
    path: '/facial',
    component: Layout,
    meta: {
      menu: 'facial:*',
      title: 'facial',
      icon: 'face',
      noCache: true,
      roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
    },
    children: [{
      path: 'dynamic',
      name: 'dynamic',
      component: _import('facial/dynamic'),
      meta: {
        // 动态人脸库
        menu: 'facial:dynamic',
        title: 'facialDynamic',
        icon: 'renlianguanli',
        noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    }, {
      path: 'snapFace',
      name: 'snapFaceIndex',
      component: _import('snapFace/index'),
      meta: {
        hideCommunityFilter: true,
        menu: 'snapFace:index',
        title: 'snapFace',
        icon: 'renlianguanli',
        noCache: false,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    }, {
      path: 'personCard',
      name: 'personCardIndex',
      component: _import('personCard/index'),
      meta: {
        hideCommunityFilter: true,
        menu: 'personCard:index',
        title: 'personCard',
        icon: 'renlianguanli',
        noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    }, {
      path: 'personCard/detail',
      name: 'personCardDetail',
      component: _import('personCard/detail'),
      meta: {
        hideCommunityFilter: true,
        title: '人卡核验详情',
        icon: 'renlianguanli',
        noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    }, {
      path: 'blackList',
      name: 'blackList',
      component: _import('blackList/index'),
      meta: {
        hideCommunityFilter: true,
        menu: 'blackList:*',
        title: 'blackList',
        icon: 'heimingdan',
        noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    }, {
      path: 'strangers',
      name: 'strangers',
      component: _import('strangers/face'),
      meta: {
        // 陌生人脸
        menu: 'strangers:face',
        title: 'strangersFace',
        icon: 'moshengrenguanli',
        noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    }]
  },
  // 小区管理
  {
    path: '/village',
    component: Layout,
    meta: {
      menu: 'village:*',
      title: 'village',
      icon: 'Community',
      noCache: true,
      roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
    },
    children: [
      {
      path: 'worker',
      name: 'worker',
      component: _import('personnel/worker'),
      meta: {
        menu: 'personnel:worker',
        keepAlive: true,
        title: 'worker',
        icon: 'gongzuorenyuandengji',
        // tree: { show: true, treeName: 'communityNodeTree' },
        noCache: false,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.OTHER, roles.SJF]
      }
    }, 
    {
      path: 'addworkerstaff',
      name: 'addworkerstaff',
      hidden: true,
      component: _import('personnel/addworkerstaff'),
      meta: {
        hideCommunityFilter: true,
        title: '新增工作人员', noCache: false,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO]
      }
    }, 
    {
      path: 'editworkerstaff',
      name: 'editworkerstaff',
      hidden: true,
      component: _import('personnel/editworkerstaff'),
      meta: {
        hideCommunityFilter: true,
        title: '编辑', noCache: false,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO]
      }
    },
    {
      path: 'workerEdit',
      name: 'workerEdit',
      hidden: true,
      component: _import('personnel/edit'),
      meta: {
        hideCommunityFilter: true,
        // menu: 'worker:edit',
        title: '编辑工作人员',
        icon: 'icon_citizen',
        // tree: { show: true, treeName: 'communityNodeTree' },
        hideTag: true,
        noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.OTHER, roles.SJF]
      }
    },{
      path: 'deploy',
      name: 'communityDeploy',
      component: _import('community/deploy'),
      meta: {
        hideCommunityFilter: true,
        menu: 'community:deploy',
        title: 'communityDeploy', icon: 'xiaoqupeizhiguanli', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.OTHER, roles.SJF]
      }
    }, {
      path: 'index',
      name: 'community',
      component: _import('community/index'),
      meta: {
        hideCommunityFilter: true,
        menu: 'community:index',
        title: 'communityIndex', icon: 'shequguanli', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.OTHER, roles.SJF]
      }
    },{
      path: 'communityUser',
      name: 'communityUser',
      component: _import('community/account'),
      meta: {
        menu: 'communityUser:*',
        title: 'communityUser', icon: 'shequguanli', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.OTHER, roles.SJF]
      }
    },
    {
      path: 'devconfig',
      name: 'aa',
      component: _import('community/deviceConfig'),
      meta: {
        hideCommunityFilter: true,
        keepAlive: true,
        menu: 'deviceSetting:*',
        title: '设备配置',
        icon: 'renlianguanli',
        noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.OTHER, roles.SJF]
      }
    },
    {
      path: 'devconfig/setting',
      name: 'setting',
      component: _import('community/configDetail'),
      meta: {
        hideCommunityFilter: true,
        title: '配置',
        icon: 'renlianguanli',
        noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    },
    {
      path: 'basicSetting',
      name: 'basicSetting',
      component: _import('community/basicSetting/index'),
      meta: {
        hideCommunityFilter: true,
        menu: 'baseSetting:*',
        title: 'basicSetting', icon: 'shequguanli', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.OTHER, roles.SJF]
      }
    },
    {
      path: 'devconfig/detail',
      name: 'settingDetail',
      component: _import('community/settingDetail'),
      meta: {
        hideCommunityFilter: true,
        title: '配置详情',
        icon: 'renlianguanli',
        noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    }]
  },
  //验证码管理
  {
    path: '/sms',
    component: Layout,
    alwaysShow: true,
    meta: {
      menu: 'sms:*',
      title: 'sms',
      icon: 'duanxin1',
      noCache: true,
      roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
    },
    children: [{
      path: 'index',
      name: 'smsIndex',
      component: _import('sms/index'),
      meta: {
        // 动态人脸库
        hideCommunityFilter: true,
        menu: 'sms:index',
        title: 'smsIndex',
        icon: 'duanxin1',
        noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    }]
  },
  // 权限管理
  {
    path: '/logging',
    component: Layout,
    alwaysShow: true,
    meta: {
      menu: 'logging:*',
      title: 'logging',
      icon: 'caozuojilu',
      noCache: true,
      roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
    },
    children: [{
      path: 'logging',
      name: 'logging',
      component: _import('logging/index'),
      meta: {
        hideCommunityFilter: true,
        menu: 'logging:index',
        title: 'logging',
        icon: 'caozuojilu1',
        noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    }]
  },
  //报修管理
  {
    path: '/repair',
    component: Layout,
    meta: {
      menu: 'repair:*',
      title: 'repair', icon: 'caozuojilu', noCache: true,
      roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.SJF]
    },
    children: [{
      path: 'repairManage',
      name: 'repairManage',
      component: _import('repairManage/record'),
      meta: {
        hideCommunityFilter: true,
        menu: 'repairLog:read',
        title: 'repairLog', icon: 'operating', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.SJF]
      }
    }, {
      path: '/repairManage/details',
      name: 'repairManageDetail',
      component: _import('repairManage/details'),
      meta: {
        hideCommunityFilter: true,
        title: '报修详情',
        icon: 'renlianguanli',
        noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    },
  ]},
  //疫情管理
  {
    path: '/epidemic',
    component: Layout,
    meta: {
      menu: 'epidemic:*',
      title: 'record', icon: 'virus', noCache: true,
      roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
    },
    children: [{
      path: 'healthData',
      name: 'healthData',
      component: _import('epidemicManage/healthData/index'),
      meta: {
        menu: 'epidemic:healthData',
        title: 'opening', icon: 'kaimenjilu', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    }, {
      path: 'infoSearch',      
      name: 'infoSearch',
      component: _import('epidemicManage/infoSearch/index'),
      meta: {
        menu: 'epidemic:infoQuery',
        title: 'visiting', icon: 'laifangjilu', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    },{
      path: 'verificationRecord',
      name: 'verificationRecord',
      component: _import('epidemicManage/verificationRecord/index'),
      meta: {
        menu: 'epidemic:checkLog',
        keepAlive: true,
        title: 'visiting', icon: 'laifangjilu', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    },{
      path: 'capacityWarning',
      name: 'capacityWarning',
      component: _import('epidemicManage/capacityWarning/index'),
      meta: {
        menu: 'epidemic:smartWarn',
        title: 'visiting', icon: 'laifangjilu', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    },{
      path: 'monitorAlarm',
      name: 'monitorAlarm',
      component: _import('epidemicManage/monitorAlarm/index'),
      meta: {
        menu: 'epidemic:monitor',
        title: 'visiting', icon: 'laifangjilu', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    },{
      path: 'dividePerson',
      name: 'dividePerson',
      component: _import('epidemicManage/dividePersonManage/index'),
      meta: {
        menu: 'epidemic:isolationPerson',
        title: 'visiting', icon: 'laifangjilu', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    },{
        path: 'index',
        name: 'invitationManage',
        component: _import('invitationManage/index'),
        meta: {
          hideCommunityFilter: false,
          menu: 'visitorLog:index',
          title: '访客记录', icon: 'renshishuju', noCache: true,
          roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.SJF]
        }
      },{
        path: 'details',
        name: 'invitationDetails',
        component: _import('invitationManage/details'),
        meta: {
          hideCommunityFilter: true,
          title: '访客详情', icon: 'caozuojilu', noCache: true,
          roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.SJF]
        }  
    },{
      path: 'healthRecord',
      name: '健康宝记录',
      component: _import('epidemicManage/healthRecord/index'),
      meta: {
        menu: 'epidemic:jkb',
        title: 'healthRecord', icon: 'laifangjilu', noCache: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    },]
  },
  //账号管理
  {
    path:'/accout',
    component:Layout,
    meta: {
      menu: 'system:*',
      title: '账号管理',
      icon: 'zhanghao',    
      noCache: true,
      roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
    },
    children:[{
      path: 'list',
      name: 'list',
      component: _import('accout/list'),
      meta: {
        hideCommunityFilter: true,
        menu: 'system:account',
        title: '账号列表', 
        icon: '', 
        noCache: false,
        keepAlive: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    },{
      path: 'role',
      name: 'role',
      component: _import('accout/role'),
      meta: {
        hideCommunityFilter: true,
        menu: 'system:role',
        title: '角色管理', 
        icon: '', 
        noCache: false,
        keepAlive: true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    },
    {
      path: 'list/listAdd',
      name: 'listAdd',
      component: _import('accout/components/listAdd'),
      meta: {
        hideCommunityFilter: true,
        title: '新增账号',
        icon: '',
        noCache: false,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    },{
      path: 'list/listDetails',
      name: 'listDetails',
      component: _import('accout/components/listDetails'),
      meta: {
        hideCommunityFilter: true,
        title: '账号详情',
        icon: '',
        noCache: false,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    },{
      path: 'role/roleAdd',
      name: 'roleAdd',
      component: _import('accout/components/roleAdd'),
      meta: {
        hideCommunityFilter: true,
        title: '新增角色',
        icon: '',
        noCache: false,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    },{
      path: 'role/roleAccout',
      name: 'roleAccout',
      component: _import('accout/components/roleAccout'),
      meta: {
        hideCommunityFilter: true,
        title: '账号详情',
        icon: '',
        noCache: false,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    },{
      path: 'role/roleDetails',
      name: 'roleDetails',
      component: _import('accout/components/roleDetails'),
      meta: {
        hideCommunityFilter: true,
        title: '角色详情',
        icon: '',
        noCache: false,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.DEMO]
      }
    }]
  },
  //核酸检测
  {
    path: '/health',
    component: Layout,
    meta: {
      menu: 'health:*',
      title: 'health', icon: 'DNA', noCache: true,
      roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.SJF]
    },
    children: [{
      path: 'healthIndex',
      name: 'healthIndex',
      component: _import('health/index'),
      meta: {
        hideCommunityFilter: true,//开启可控头部显示的小区keepAlive: true,
        noCache: false,//true显示  false不显示
        menu: 'health:index',
        title: '核酸检测记录', icon: 'DNA', noCache: true,
        keepAlive:true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.SJF]
      },
    }]
  },
  //签到列表
  {
    path: '/signIn',
    component: Layout,
    meta: {
      menu: 'check:*',
      title: 'signIn', icon: 'bianzu', noCache: true,
      roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.SJF]
    },
    children: [{
      path: 'signInIndex',
      name: 'signInIndex',
      component: _import('signIn/index'),
      meta: {
        hideCommunityFilter: true,//开启可控头部显示的小区keepAlive: true,
        noCache: false,//true显示  false不显示
        menu: 'check:index',
        title: '签到列表', icon: 'signin',
        keepAlive:true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.SJF]
      },
    }]
  },
  //场地签到
  //签到列表
  {
    path: '/siteCheck',
    component: Layout,
    meta: {
      menu: 'siteCheck:*',
      title: 'siteCheck', icon: 'bianzu', noCache: true,
      roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.SJF]
    },
    children: [{
      path: 'siteCheckIndex',
      name: 'siteCheckIndex',
      component: _import('siteCheck/index'),
      meta: {
        hideCommunityFilter: true,//开启可控头部显示的小区keepAlive: true,
        noCache: false,//true显示  false不显示
        menu: 'siteCheck:index',
        title: '场地签到', icon: 'signin',
        keepAlive:true,
        roles: [roles.PROPERTY, roles.COMMUNITY, roles.OPEN, roles.DEMO, roles.SJF]
      },
    }]
  },
]


export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  // routes: constantRouterMap
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {path: '*', redirect: '/404', hidden: true}
]
