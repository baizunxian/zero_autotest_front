import {Module} from 'vuex';
import {useLookupApi} from "/@/api/useSystemApi/lookup";

const lookupInfoModule: Module = {
  namespaced: true,
  state: {
    lookup: {},
  },
  mutations: {
    // 设置数据字典
    getLookup(state, data: any) {
      state.lookup = data;
    },
  },
  actions: {
    // 设置数据字典
    async setLookup({commit}) {
      useLookupApi().getAllLookup()
        .then((res: any) => {
          commit('getLookup', res.data);
        })
    },
  },
};

export default lookupInfoModule;
