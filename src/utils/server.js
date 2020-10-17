import axios from 'axios'
import {
  Message,
  MessageBox
} from 'element-ui'
import store from '@/store'
import router from '@/router'
import {
  getToken,
  getFingerprint
} from '@/utils/auth'
console.log(process.env);
import {
  rsaEncrypt,
  rsaDecrypt
} from '@/utils/crypto';

// create an axios instance
const service = axios.create({
  // baseURL: 'devApi/new', //跨域重写
  timeout: 60000 // request timeout
});

function uuid() {
  var withLine = true; //带不带横线
  var len = 36; //长度为36
  var radix = 16; //16进制
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [],
    i;
  radix = radix || chars.length;
  if (withLine) {
    var r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (i = 0; i < len; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  } else {
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | Math.random() * radix];
    }
  }
  let uuidstr = uuid.join('');
  uuidstr = "web-" + uuidstr
  return uuidstr
}

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    config.headers['token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  config.headers['X-Fingerprint'] = getFingerprint();
  config.headers['Content-Type'] = 'application/json; charset=UTF-8'
  config.url = config.url + '?t=' + Date.now();
  let version = store.getters.version ? store.getters.version : ''

  if (!config.data) {
    config.data = {} //当接口不传参时设置为空对象，避免无法赋值属性 给 underfined
  }

  config.data.version = version
  config.data.requestId = uuid()
  config.data.applyTime = Date.now()
  config.data.appSign = 'manager'
  //加密
  // let excel = /excel/
  // if (!excel.test(config.url)) { //加密非excel接口
  //   let data = JSON.stringify(config.data)

  //   config.data = {
  //     params: ''
  //   }
  //   config.data.params = rsaEncrypt(data)

  // }
  return config
}, error => {
  // Do something with request error
  // console.log(error) // for debug
  Promise.reject(error)
});

// respone interceptor
let whiteListCode = [160001, 160002]
service.interceptors.response.use(
  response => {
    // console.log(response);
    // let excel = /excel/,res
    // if (!excel.test(response.config.url)) { //解密非excel接口
    //   res = response.data.params;
    //   res = decodeURIComponent(rsaDecrypt(res)) 
    //   res = JSON.parse(res)
    //   response.data = res   //解密后赋值给response.data
    // } else {
    //   res = response.data
    // }
    // console.log(res,response.config.url);
    

    let res = response.data
    if (res.status !== 0) {
      Message({
        message: res.message,
        type: 'error',
        duration: 3 * 1000
      })
    }
    // if (res && res.code !== 1) {
    //   // 处于白名单的code不进行toast提示
    //   if(whiteListCode.indexOf(res.code) == -1){
    //     Message({
    //       message: res.message,
    //       type: 'error',
    //       duration: 5 * 1000
    //     });
    //   }
    // status: 700 无效令牌
    if (res.status === 700) {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
      })
    }
    // }

    return response;

  },
  /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */

  error => {
    // console.log(error, error.response, error.message+'\n'+error.code)
    if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout') != -1) {
      Message({
        message: '请求超时',
        type: 'error',
        duration: 2000,
        showClose: true,
      });

      return Promise.reject(error);
    }

    if (error.message.indexOf('终止请求') != -1) {
      return;
    }

    let response = error.response
    let message;
    if (response) {
      switch (response.status) {
        case 401:
          // MessageBox.confirm('帐号已在别处登录，请重新登录', '信息', {
          MessageBox.confirm('您的登录已过期，请重新登录', '信息', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {
            store.dispatch('FedLogOut').then(() => {
              location.reload(); // 为了重新实例化vue-router对象 避免bug
            });
          })
          break;
        case 500 || 502:
          message = "服务器发生异常，请稍后重试";
          Message({
            message: message,
            type: 'error',
            duration: 2000,
            showClose: true,
          });
          break;
        case 504:
          message = "网络异常，请稍后重试";
          Message({
            message: message,
            type: 'error',
            duration: 2000,
            showClose: true,
          });
          break;
        case 404:
          message = "接口异常，请稍后重试";
          Message({
            message: message,
            type: 'error',
            duration: 2000,
            showClose: true,
          });
          break;
        default:
          message = error.message;
          Message({
            message: message || '未知错误',
            type: 'error',
            duration: 2000,
            showClose: true,
          });
      }
    } else {
      Message({
        message: '网络错误',
        type: 'error',
        duration: 2000,
        showClose: true,
      });
      console.log(error);
      localStorage.setItem('errorBackup', '错误码：' + error.code + '错误信息：' + error.message)
    }

    return Promise.reject(error)
  })

export default service
