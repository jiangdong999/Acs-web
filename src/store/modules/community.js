import { querySystemSetting } from "@/api/community";
import { getCommunityv1 } from "@/api/communityv1";
import { Message } from 'element-ui'
import systemLogo from "@/assets/image/logo1.png";

const communities = {
  state: {
    communityList: [],
    community: {
    },
    system:{
      systemUrl:'',
      systemName:''
    }
  },
  mutations: {
    SET_COMMUNITYLIST: (state, list) => {
      state.communityList = list
    },
    SET_COMMUNITY: (state, community) => {
      state.community = community
    },
    SET_COMMUNITY_CONFIG: (state, {systemName, systemUrl}) => {
      state.system.systemName = systemName || '智慧社区物业管理子系统'
      state.system.systemUrl = systemUrl || systemLogo

      document.title = state.system.systemName
    }
  },
  actions: {
    getCommunity({ dispatch, state }) {
      return new Promise((resolve, reject) => {
        getCommunityv1().then(function (response) {
          if (response && response.data) {
            let communityList = response.data.content || [];
            if (communityList.length >= 1) {
              // if (communityList.length > 1){
              //   let all = {
              //     communityId: -1,
              //     communityName: "全部",
              //     propertyId: -1
              //   }
              //   communityList.unshift(all)
              // }
              let community = state.community.communityId ? state.community : communityList[0]
              dispatch('addCommunity', {communityList, community})
            }
            resolve()
          }
        }).catch(function (a) {
          reject()
        });
      })
    },
    addCommunity({ commit }, { communityList, community}) {
      commit('SET_COMMUNITYLIST', communityList)
      commit('SET_COMMUNITY', community)
    },
    getCommunityConfig({ commit }, communityId) {
      return new Promise((resolve, reject) => {
        querySystemSetting({
          communityId: communityId
        }).then(function (response) {
          if (response.data && response.data.code == 1) {
            resolve()
            commit('SET_COMMUNITY_CONFIG', response.data.data)
          }
        }).catch(function (a) {
          console.error(a);
        })
      })
    }
  }
}

export default communities