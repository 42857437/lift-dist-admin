// import { EpolicyInit } from '@/assets/js/epolicyInit';

//显示弹框
const SHOW_MASK_LAYER = 'SHOW_MASK_LAYER';
const HIDE_MASK_LAYER = 'HIDE_MASK_LAYER';
//初始化信息
const AUTH_INIT = 'AUTH_INIT';
//退出登录
const AUTH_SIGN_OUT = "AUTH_SIGN_OUT";
// 初始化门店信息
const UPDATE_STORE_INFO='UPDATE_STORE_INFO';
//获取企业信息
const GET_BUSINESS_INFO='GET_BUSINESS_INFO';



export default {

  [SHOW_MASK_LAYER](state, payload) {
    state.showMaskFlag = true;
  },
  [HIDE_MASK_LAYER](state, payload) {
    state.showMaskFlag = false;
  },
  [AUTH_INIT](state, payload) {
    state.userName = payload.userName;
    state.token = payload.token;
    state.roleId = payload.roleId;
    state.departmentId=payload.departmentId;
    state.companyId=payload.companyId;
    state.storeId=payload.storeId;
    state.loginName=payload.loginName;
  },
  [AUTH_SIGN_OUT](state, payload) {
    state.userName = "";
    state.token = "";
    state.roleId ="";
    state.departmentId='';
    state.companyId='';
    state.storeId='';
    state.loginName=''
  },
  [UPDATE_STORE_INFO](state,payload){
    state.storeInfoLists=payload;
  },
  [GET_BUSINESS_INFO](state,payload){
    state.companyInfo=payload;
  }
};
