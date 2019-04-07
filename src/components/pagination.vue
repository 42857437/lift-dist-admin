<template>
  <div class="page_wrap">
    <el-pagination
      :background="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageInfo.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total, sizes, prev, pager, next"
      :total="pageInfo.total">
    </el-pagination>
  </div>
</template>
<script>
  export default {
    name: "pagination",
    data() {
      return {
        model: {
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
          page: 1,
          pageSize: 10,
          startTime:'',
          endTime:'',
          receiptNumber:'',
          customerTel:'',//客户手机
          receiptType:'',//收款类别
          storeId:'',
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
        },
        pageInfo: {
          total: 0,//总共条数
          currentPage: 1,//当前页
          pageSize: 10//每页显示条数

        }
      };
    },
    methods: {
      handleSizeChange(val) {
        this.model.page=1;
        if(this.$store.state.isBusinessType){
          this.model.isBusinessType=this.$store.state.isBusinessType;
        }else{
          this.model.isBusinessType='';
        }
        if(this.$store.state.applyUserName){
          this.model.applyUserName=this.$store.state.applyUserName;
        }else{
          this.model.applyUserName='';
        }
        if(this.$store.state.dnp){
          this.model.dnp=this.$store.state.dnp;
        }else{
          this.model.dnp='';
        }
        if(this.$store.state.applyStart){
          this.model.applyStart=this.$store.state.applyStart;
        }else{
          this.model.applyStart='';
        }
        if(this.$store.state.applyEnd){
          this.model.applyEnd=this.$store.state.applyEnd;
        }else{
          this.model.applyEnd='';
        }
        this.$store.state.pageSize= val;
        this.model.pageSize = this.$store.state.pageSize ;
        if(this.$store.state.vin){
          this.model.vin=this.$store.state.vin
        }else{
          this.model.vin='';
        }
        if(this.$store.state.menuId){
          this.model.menuId=this.$store.state.menuId
        }else{
          this.model.menuId='';
        }
        if(this.$store.state.isOutDepartment){
          this.model.isOutDepartment=this.$store.state.isOutDepartment
        }else{
          this.model.isOutDepartment='';
        }
        if(this.$store.state.isOutUser){
          this.model.isOutUser=this.$store.state.isOutUser
        }else{
          this.model.isOutUser='';
        }
        if(this.$store.state.isCarNumber){
          this.model.isCarNumber=this.$store.state.isCarNumber
        }else{
          this.model.isCarNumber='';
        }
        if(this.$store.state.refundUserName){
          this.model.refundUserName=this.$store.state.refundUserName
        }else{
          this.model.refundUserName='';
        }
        if(this.$store.state.refundType){
          this.model.refundType=this.$store.state.refundType
        }else{
          this.model.refundType='';
        }
        if(this.$store.state.refundNumber){
          this.model.refundNumber=this.$store.state.refundNumber
        }else{
          this.model.refundNumber='';
        }
        if(this.$store.state.isLiftingReason){
          this.model.isLiftingReason=this.$store.state.isLiftingReason
        }else{
          this.model.isLiftingReason='';
        }
        if(this.$store.state.isOutReason){
          this.model.isOutReason=this.$store.state.isOutReason
        }else{
          this.model.isOutReason='';
        }
        if(this.$store.state.isTime){
          this.model.isTime=this.$store.state.isTime
        }else{
          this.model.isTime='';
        }
        if(this.$store.state.liftingReason){
          this.model.liftingReason=this.$store.state.liftingReason;
        }else{
          this.model.liftingReason='';
        }
        if(this.$store.state.outReason){
          this.model.outReason=this.$store.state.outReason;
        }else{
          this.model.outReason='';
        }
        if(this.$store.state.enterpriseId){
          this.model.enterpriseId=this.$store.state.enterpriseId;
        }else{
          this.model.enterpriseId='';
        }
        if(this.$store.state.receiptUserName){
          this.model.receiptUserName=this.$store.state.receiptUserName;
        }else{
          this.model.receiptUserName='';
        }
        if(this.$store.state.storeId){
          this.model.storeId=this.$store.state.storeId;
        }else{
          this.model.storeId='';
        }
        this.model.receiptType=this.$store.state.receiptType;
        if(this.$store.state.customerTel){
          this.model.customerTel=this.$store.state.customerTel;
        }else{
          this.model.customerTel='';
        }
        if(this.$store.state.receiptNumber){
          this.model.receiptNumber=this.$store.state.receiptNumber;
        }else{
          this.model.receiptNumber='';
        }
        if(this.$store.state.endTime){
          this.model.endTime=this.$store.state.endTime;
        }else{
          this.model.endTime='';
        }
        if(this.$store.state.startTime){
          this.model.startTime=this.$store.state.startTime;
        }else{
          this.model.startTime='';
        }
        if(this.$store.state.entryStart){
          this.model.entryStart=this.$store.state.entryStart;
        }else{
          this.model.entryStart='';
        }
        if(this.$store.state.entryEnd){
          this.model.entryEnd=this.$store.state.entryEnd;
        }else{
          this.model.entryEnd='';
        }
        if(this.$store.state.confirmStart){
          this.model.confirmStart=this.$store.state.confirmStart;
        }else{
          this.model.confirmStart='';
        }
        if(this.$store.state.confirmEnd){
          this.model.confirmEnd=this.$store.state.confirmEnd;
        }else{
          this.model.confirmEnd='';
        }
        if(this.$store.state.outStart){
          this.model.outStart=this.$store.state.outStart;
        }else{
          this.model.outStart='';
        }
        if(this.$store.state.outEnd){
          this.model.outEnd=this.$store.state.outEnd;
        }else{
          this.model.outEnd='';
        }
        if(this.$store.state.businessType!==''){
          this.model.businessType=this.$store.state.businessType;
        }else{
          this.model.businessType='';
        }
        if(this.$store.state.carNumber){
          this.model.carNumber=this.$store.state.carNumber;
        }else{
          this.model.carNumber='';
        }
        if(this.$store.state.outStoreId){
          this.model.outStoreId=this.$store.state.outStoreId;
        }else{
          this.model.outStoreId='';
        }
        if(this.$store.state.outDepartmentId){
          this.model.outDepartmentId=this.$store.state.outDepartmentId;
        }else{
          this.model.outDepartmentId='';
        }
        if(this.$store.state.outUserName){
          this.model.outUserName=this.$store.state.outUserName;
        }else{
          this.model.outUserName='';
        }
        this.switchPage(this.model)
      },
      handleCurrentChange(val) {
        if(this.$store.state.isBusinessType){
          this.model.isBusinessType=this.$store.state.isBusinessType;
        }else{
          this.model.isBusinessType='';
        }
        if(this.$store.state.applyUserName){
          this.model.applyUserName=this.$store.state.applyUserName;
        }else{
          this.model.applyUserName='';
        }
        if(this.$store.state.dnp){
          this.model.dnp=this.$store.state.dnp;
        }else{
          this.model.dnp='';
        }
        if(this.$store.state.applyStart){
          this.model.applyStart=this.$store.state.applyStart;
        }else{
          this.model.applyStart='';
        }
        if(this.$store.state.applyEnd){
          this.model.applyEnd=this.$store.state.applyEnd;
        }else{
          this.model.applyEnd='';
        }
        if(this.$store.state.vin){
          this.model.vin=this.$store.state.vin
        }else{
          this.model.vin='';
        }
        if(this.$store.state.menuId){
          this.model.menuId=this.$store.state.menuId
        }else{
          this.model.menuId='';
        }
        if(this.$store.state.isOutDepartment){
          this.model.isOutDepartment=this.$store.state.isOutDepartment
        }else{
          this.model.isOutDepartment='';
        }
        if(this.$store.state.isOutUser){
          this.model.isOutUser=this.$store.state.isOutUser
        }else{
          this.model.isOutUser='';
        }
        if(this.$store.state.isCarNumber){
          this.model.isCarNumber=this.$store.state.isCarNumber
        }else{
          this.model.isCarNumber='';
        }
        if(this.$store.state.refundUserName){
          this.model.refundUserName=this.$store.state.refundUserName
        }else{
          this.model.refundUserName='';
        }
        if(this.$store.state.refundType){
          this.model.refundType=this.$store.state.refundType
        }else{
          this.model.refundType='';
        }
        if(this.$store.state.refundNumber){
          this.model.refundNumber=this.$store.state.refundNumber
        }else{
          this.model.refundNumber='';
        }
        if(this.$store.state.isLiftingReason){
          this.model.isLiftingReason=this.$store.state.isLiftingReason
        }else{
          this.model.isLiftingReason='';
        }
        if(this.$store.state.isOutReason){
          this.model.isOutReason=this.$store.state.isOutReason
        }else{
          this.model.isOutReason='';
        }
        if(this.$store.state.isTime){
          this.model.isTime=this.$store.state.isTime
        }else{
          this.model.isTime='';
        }
        if(this.$store.state.liftingReason){
          this.model.liftingReason=this.$store.state.liftingReason;
        }else{
          this.model.liftingReason='';
        }
        if(this.$store.state.outReason){
          this.model.outReason=this.$store.state.outReason;
        }else{
          this.model.outReason='';
        }
        if(this.$store.state.enterpriseId){
          this.model.enterpriseId=this.$store.state.enterpriseId;
        }else{
          this.model.enterpriseId='';
        }
        if(this.$store.state.receiptUserName){
          this.model.receiptUserName=this.$store.state.receiptUserName;
        }else{
          this.model.receiptUserName='';
        }
        if(this.$store.state.storeId){
          this.model.storeId=this.$store.state.storeId;
        }else{
          this.model.storeId='';
        }
        this.model.receiptType=this.$store.state.receiptType;
        if(this.$store.state.customerTel){
          this.model.customerTel=this.$store.state.customerTel;
        }else{
          this.model.customerTel='';
        }
        if(this.$store.state.receiptNumber){
          this.model.receiptNumber=this.$store.state.receiptNumber;
        }else{
          this.model.receiptNumber='';
        }
        if(this.$store.state.endTime){
          this.model.endTime=this.$store.state.endTime;
        }else{
          this.model.endTime='';
        }
        if(this.$store.state.startTime){
          this.model.startTime=this.$store.state.startTime;
        }else{
          this.model.startTime='';
        }
        if(this.$store.state.entryStart){
          this.model.entryStart=this.$store.state.entryStart;
        }else{
          this.model.entryStart='';
        }
        if(this.$store.state.entryEnd){
          this.model.entryEnd=this.$store.state.entryEnd;
        }else{
          this.model.entryEnd='';
        }
        if(this.$store.state.confirmStart){
          this.model.confirmStart=this.$store.state.confirmStart;
        }else{
          this.model.confirmStart='';
        }
        if(this.$store.state.confirmEnd){
          this.model.confirmEnd=this.$store.state.confirmEnd;
        }else{
          this.model.confirmEnd='';
        }
        if(this.$store.state.outStart){
          this.model.outStart=this.$store.state.outStart;
        }else{
          this.model.outStart='';
        }
        if(this.$store.state.outEnd){
          this.model.outEnd=this.$store.state.outEnd;
        }else{
          this.model.outEnd='';
        }
        if(this.$store.state.businessType!==''){
          this.model.businessType=this.$store.state.businessType;
        }else{
          this.model.businessType='';
        }
        if(this.$store.state.carNumber){
          this.model.carNumber=this.$store.state.carNumber;
        }else{
          this.model.carNumber='';
        }
        if(this.$store.state.outStoreId){
          this.model.outStoreId=this.$store.state.outStoreId;
        }else{
          this.model.outStoreId='';
        }
        if(this.$store.state.outDepartmentId){
          this.model.outDepartmentId=this.$store.state.outDepartmentId;
        }else{
          this.model.outDepartmentId='';
        }
        if(this.$store.state.outUserName){
          this.model.outUserName=this.$store.state.outUserName;
        }else{
          this.model.outUserName='';
        }
        this.model.page = val;
        if(this.$store.state.pageSize!=''){
          this.model.pageSize=parseFloat(this.$store.state.pageSize);
          this.switchPage(this.model)
        }else{
          this.switchPage(this.model)
        }
      }
      ,
      switchPage(data) {
        this.$emit("fetchData", data)
      },
      initPage(total, currentPage, pageSize) {
        this.pageInfo.total = total;
        this.pageInfo.currentPage = currentPage;
        this.pageInfo.pageSize = pageSize;
      }
    },

  }
</script>

<style scoped lang="scss">
  .page_wrap {
    padding-top: 10px;
    position: relative;

  }

  .el-pagination {
    display: flex;
    font-size: 12px!important;
    justify-content: flex-end;
    font-weight: normal;
    /deep/ .el-pagination__total {
      position: absolute;
      left: 120px;
      top: 3px;
      bottom: 0;
      margin: auto 0;
    }
    /deep/ .el-pagination__sizes {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      margin: auto 0;
    }
  }
</style>
