import {
  getUserInfo
} from '@/api/login'
import {
  logout,
  loginByUsername,
  loginByPassword,
  getPermission
} from '@/api/loginv1'
import {
  getToken,
  setToken,
  removeToken,
  setFingerprint,
  setSensitive,
  removeSensitive,
  getHavePhone,
  setHavePhone,
  setUserName,
  getUserName,
  getSensitive
} from '@/utils/auth'
import {
  Message
} from 'element-ui'
let dev = process.env.ENV_CONFIG == 'dev';
let prod = process.env.ENV_CONFIG == 'prod';
let test = process.env.ENV_CONFIG == 'test';
const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    havePhone: getHavePhone(),
    userName: getUserName(),
    sensitive: getSensitive(),
    accountType: '',
    name: '',
    avatar: '',
    introduction: '',
    fingerprint: '',
    roles: [],
    permissions: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_FINGERPRINT: (state, fingerprint) => {
      state.fingerprint = fingerprint;
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
    },
    SET_SENSITIVE: (state, sensitive) => {
      state.sensitive = sensitive;
    },
    SET_HAVE_PHONE: (state, havePhone) => {
      state.havePhone = havePhone;
    },
    SET_USER_NAME: (state, userName) => {
      state.userName = userName;
    },
    SET_USER_ACCOUNTTYPE: (state, accountType) => {
      state.accountType = accountType;
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({
      commit,
      dispatch
    }, userInfo) {
      let _this = this;
      const username = userInfo.username.trim()

      let encryptor = new JSEncrypt()
      let publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDe8xwhyKpAt1uZikf+ZpACoacm9jLujM43QLS2rgBkbNwVzxFNpLRzmRoJGU1hUaRhyj3yUH7SIKzhRl4wmgjZE0Qj9/y4upuENJCJOBygiFlksOwthXMpVRvgJwD3Xfnk0P4nz15UEuvYayqvF0aNWux8EA4/tnlW9TRAVaZlrQIDAQAB'
      encryptor.setPublicKey(publicKey)
      // console.log(encryptor.encrypt(username));
      let phone = (!test) ? username : encryptor.encrypt(username),
        smsCode = (!test) ? userInfo.password : encryptor.encrypt(userInfo.password),
        loginType = (!test) ? userInfo.loginType : encryptor.encrypt(userInfo.loginType)
      
      return new Promise((resolve, reject) => {
        if (loginType == 1) {
          loginByPassword({
            account:phone,
            password:smsCode,
            loginType,
            productSign: 'community',
          }).then(response => {
            const data = response.data.content,
              user = data.userDetail.user
            commit('SET_TOKEN', data.token)
            setToken(data.token);
            // commit("SET_HAVE_PHONE", data.havePhone);
            // setHavePhone(data.havePhone)
            commit("SET_USER_NAME", user.username);
            setUserName(user.userName)
            commit('SET_SENSITIVE', data.userDetail.authorities.sensitive)
            setSensitive(data.userDetail.authorities.sensitive)
            commit('SET_USER_ACCOUNTTYPE', data.userDetail.authorities.accountType)
            // dispatch('GetUserInfo')
            resolve()
          }).catch(error => {
            reject(error)
          })
        } else {
          loginByUsername({
            phone,
            smsCode,
            loginType,
            productSign: 'community',
          }).then(response => {
            const data = response.data.content,
              user = data.userDetail.user
            commit('SET_TOKEN', data.token)
            setToken(data.token);
            // commit("SET_HAVE_PHONE", data.havePhone);
            // setHavePhone(data.havePhone)
            commit("SET_USER_NAME", user.username);
            setUserName(user.userName)
            commit('SET_SENSITIVE', data.userDetail.authorities.sensitive)
            setSensitive(data.userDetail.authorities.sensitive)
            commit('SET_USER_ACCOUNTTYPE', data.userDetail.authorities.accountType)
            // dispatch('GetUserInfo')
            resolve()
          }).catch(error => {
            reject(error)
          })
        }
        
      })
    },

    // 获取用户信息 是否脱敏
    GetUserInfo({
      commit
    }) {
      getUserInfo().then(response => {
        commit('SET_SENSITIVE', response.data.data.sensitive)
        commit('SET_USER_ACCOUNTTYPE', response.data.data.accountType)
        setSensitive(response.data.data.sensitive)
      }).catch(error => {})
    },
    GetPermissions({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getPermission().then(response => {
          const data = response.data.content
          if (data.children.length === 0) {
            Message({
              message: '帐号没有菜单权限',
              type: 'error',
              duration: 5 * 1000
            });
            reject()
          } else {
            // commit('SET_ROLES', data.data.role)
            commit('SET_PERMISSIONS', data.children)
            resolve(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    SaveFingerprint({
      commit
    }, fingerprint) {
      if (fingerprint) {
        commit("SET_FINGERPRINT", fingerprint);
        setFingerprint(fingerprint);
      }
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          removeSensitive()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({
      commit
    }, message) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({
      commit
    }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
