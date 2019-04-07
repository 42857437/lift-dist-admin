import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutation';
import actions from './action';

Vue.use(Vuex);

const state = {
  token: '',
  loginName:'',
  userName:'',
  roleId:'',
  departmentId:'',
  companyId:'',
  storeId:'',
  isLoading: false,//加载动画状态
  companyInfo:{},
  pageSize:'',
  entryStart:'',//进场时间范围（开始）
  entryEnd:'',//进场时间范围（结束）
  confirmStart:'',//确认放行时间范围（开始）
  confirmEnd:'',//确认放行时间范围（结束）
  outStart:'',//出场时间范围（开始）
  outEnd:'',//出场时间范围（结束）
  businessType:'',//业务类型
  carNumber:'',//车牌号码
  outStoreId:'',//放行门店ID
  outDepartmentId:'',//放行部门ID
  outUserName:'',//放心人姓名
  startTime:'',//收款开始日期
  endTime:'',//收款结束日期
  receiptNumber:'',//收款单号
  customerTel:'',//客户手机
  receiptType:'',//收款类别
  receiptUserName:'',//收款人姓名
  enterpriseId:'',//企业id
  outReason:'',
  liftingReason:'',
  isTime:'',
  isOutReason:'',
  isLiftingReason:'',
  refundNumber:'',//退款单号
  refundType:'',
  refundUserName:'',
  isCarNumber:'',//车牌号是否被勾选 1代表勾选
  isOutUser:'',//放行人是否勾选 1代表勾选
  isOutDepartment:'',//放行部门是否被勾选 1代表勾选
  isBusinessType:'',//是否勾选业务类型1代表勾选
  menuId:'',//菜单id
  vin:'',//vin码
  applyStart:'',//申请放行时间开始
  applyEnd:'',//申请放行时间结束
  dnp:'',//为'1'时查看未出场
  applyUserName:'',//申请放行人
};

export default new Vuex.Store({
  state,
  actions,
  mutations
});
