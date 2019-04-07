import axios from 'axios';
export default {
  // 获取消费门店信息
  fetchStoreInfo({commit, state}) {

    return new Promise((resolve, reject) => {
      if(state.storeInfoLists.length){
        resolve();
      }else{
        axios.get("/admin/member/store/listbyuser").then(res=>{
          // let data =this.AppUtils.checkResponse(res);
          let data =JSON.parse(res.data);
          if(10000 === data.code){
            commit("UPDATE_STORE_INFO",data.value);
            resolve(data);
          }
        }).catch(err => {
          reject(err);
        })
      }

    });

  },
  showMaskLayer({commit, state}, res) {
    commit('SHOW_MASK_LAYER', {
      res
    });

  },
  hideMaskLayer({commit, state}, res) {
    commit('HIDE_MASK_LAYER', {
      res
    });
  },
  updateToken({commit, state}, res) {
    commit('UPDATE_TOKEN', {
      res
    });
  },
};
