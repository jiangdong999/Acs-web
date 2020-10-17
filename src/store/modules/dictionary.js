import { deviceTypeList } from "@/api/dictionary";

const devTypeList = {
  state: {
    doorTypeList: [],
  },
  mutations: {
    // SET_DEVICETYPELIST: (state, list) => {
    //   console.log('afa',list)
    //   state.doorTypeList = list
    // },
  },
  actions: {
    getDeviceTypeList({ dispatch, state }) {
      return new Promise((resolve, reject) => {
        deviceTypeList({item: 'doorType'}).then(function (response) {
          if (response && response.data) {
            let list = response.data.dataList
            state.doorTypeList = list
            // commit('SET_DEVICETYPELIST', list)
            resolve()
          }
        }).catch(function (a) {
          reject()
        })
      })
    }
  }
}

export default devTypeList