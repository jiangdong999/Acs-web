import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

// import '../theme/index.css'
import Element from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import moment from 'vue-moment'

// import lodash from "lodash"
// import VueLodash from "vue-lodash/dist/vue-lodash.min"

import Fingerprint2 from 'fingerprintjs2'

import App from './App'
import router from './router'
import store from './store'
import global_ from '../static/config/global'

import i18n from './lang' // Internationalization
import './icons' // icon
// import './errorLog'// error log
import './permission' // permission control
// import './mock' // simulation data
import mixin from './utils/mixin-css'
import * as filters from './filters' // global filters
import { Message } from 'element-ui'
import JSEncrypt from 'jsencrypt'
Vue.prototype.$JSEncrypt = JSEncrypt
import VueAMap from 'vue-amap'
Vue.use(VueAMap)
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
VueAMap.initAMapApiLoader({
  key: 'ed7c8030f7a854c5100bd19637c69afe',
  plugin: ['Autocomplete', 'PlaceSearch', 'Scale', 'OverView', 'ToolBar', 'MapType', 'PolyEditor', 'CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.12'
})

Vue.mixin(mixin)

Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(moment)
// Vue.use(VueLodash, lodash);
Vue.prototype.GLOBAL = global_
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const fingerprint2 = new Fingerprint2({
  excludeWebGL: true,
  excludePixelRatio: true,
  excludeLanguage: true,
  excludeScreenResolution: true,
  detectScreenOrientation: false
})
Vue.prototype.$fingerprint2 = fingerprint2

Vue.config.productionTip = false

router.onError(function(e) {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = e.message.match(pattern)
  if (isChunkLoadFailed) {
    Message({
      message: '平台版本已更新，3秒后自动为您刷新页面',
      type: 'error',
      duration: 5 * 1000
    })

    setTimeout(() => {
      window.location.reload()
    }, 3000)
  } else {
    Message({
      message: e.message,
      type: 'error',
      duration: 5 * 1000
    })
  }
})
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
