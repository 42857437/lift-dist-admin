<template>
  <div class="main_wrap">
    <div class="search-box bg_fff">
      <form>
        <div class="selectWrap font12">
          <div class="column inlineBlock">
            <span class="mr12">退款日期</span>
            <el-date-picker
              v-model="model.startTime"
              type="date"
              format="yyyy-MM-dd"
              placeholder="起始时间"
              class="activity-edit-date date-box"
              @change="enterChange"
            >
            </el-date-picker>
            <i> 至 </i>
            <el-date-picker
              v-model="model.endTime"
              type="date"
              format="yyyy-MM-dd"
              placeholder="终止时间"
              class="activity-edit-date date-box">
            </el-date-picker>
            <span class="enterpriseName">退款单号</span>
            <el-input class="el_box inp" placeholder="请输入退款单号" v-model="searchModel.refundNumber"></el-input>
            <span class="enterpriseName marLeft0">车牌号码</span>
            <el-input class="el_box inp" placeholder="请输入车牌号码" v-model="searchModel.carNumber"></el-input>
            <span class="enterpriseName marLeft0">客户手机</span>
            <el-input class="el_box inp" placeholder="请输入客户手机" v-model="searchModel.customerTel"></el-input>
          </div>
          <div class="column inlineBlock">
            <span class="enterpriseName">门店</span>
            <el-select class="el_box ml10" v-model="model.store" clearable filterable placeholder="请选择门店名称">
              <el-option
                v-for="item in storeLists"
                :key="item.id"
                :label="item.storeName"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="enterpriseName">退款方式</span>
            <el-select class="el_box ml10" v-model="searchModel.refundType" clearable filterable placeholder="退款方式">
              <el-option
                v-for="item in refundTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="enterpriseName">退款人</span>
            <el-input class="el_box inp" placeholder="请输入退款人" v-model="searchModel.refundUserName"></el-input>
            <button class="serachBtn" type="submit" @click.prevent="searchInfo">搜索</button>
            <button class="serachBtn mr17" @click.prevent="exportData">导出</button>
          </div>
        </div>
      </form>
    </div>
    <div class="table_wrap">
      <div class="table_layout bg_fff">
        <div class="data-statistics">
          <span class="theme-color ml0">退款笔数:{{total}}</span>
          <span class="theme-color">退款金额:{{totalMoney}}</span>
        </div>
        <div class="table_scroll ">
          <table class="table textAlignL">
            <thead>
            <tr>
              <th>序号</th>
              <th>退款单号</th>
              <th>车牌号码</th>
              <th>客户手机</th>
              <th v-if="enShow">所属企业</th>
              <th>收款金额</th>
              <th>退款金额</th>
              <th>退款方式</th>
              <th>退款人</th>
              <th>退款时间</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(refundInfor,index) in refundInfors" :key="index">
              <td>{{index+1}}</td>
              <td>{{refundInfor.refundNumber}}</td>
              <td>{{refundInfor.carNumber}}</td>
              <td>{{refundInfor.customerTel}}</td>
              <td v-if="enShow">{{refundInfor.enterpriseName}}</td>
              <td>{{refundInfor.receiptMoney}}</td>
              <td>{{refundInfor.refundMoney}}</td>
              <td>{{refundInfor.refundType=='0'?'pos自选':(refundInfor.refundType=='1'?'现金':(refundInfor.refundType=='alipay'?'支付宝':(refundInfor.refundType=='wxpay'?'微信':(refundInfor.refundType=='jdpay'?'京东Pos刷卡':''))))}}</td>
              <td>{{refundInfor.refundUserName}}</td>
              <td>{{refundInfor.refundTime | dateFormatToSecond}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" v-if="refundInfors.length">
          <nt-pagination ref="child" @fetchData="fetchData"></nt-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'refund-list',
    components: {},
    data(){
      return {
        model:{
          startTime:'',
          endTime:'',
          leaveReason:'',
          paymentBack:'',
          store:'全部门店',
          paymentWay:'POS',
          paymentDone:''
        },
        listModel: {
          pageSize:10,//每页行数
          pageNo:1,
          startTime:'',//退款开始日期
          endTime:'',//退款结束日期
          refundNumber:'',//退款单号
          carNumber:'',//车牌号码
          customerTel:'',//客户手机
          storeId:'',//门店id
          refundType:'',//退款款类别
          refundUserName:'',//退款人姓名
        },
        searchModel: {
          pageSize:10,//每页行数
          startTime:'',//退款开始日期
          endTime:'',//退款结束日期
          refundNumber:'',//退款单号
          carNumber:'',//车牌号码
          customerTel:'',//客户手机
          storeId:'',//门店id
          refundType:'',//退款款类别
          refundUserName:'',//退款人姓名
        },
        //导出
        exportModel:{
          pageSize:10,//每页行数
          startTime:'',//退款开始日期
          endTime:'',//退款结束日期
          refundNumber:'',//退款单号
          carNumber:'',//车牌号码
          customerTel:'',//客户手机
          storeId:'',//门店id
          refundType:'',//退款款类别
          refundUserName:'',//退款人姓名
        },
        enShow:false,//所属企业显示状态
        enterState:false,//出场时间默认还是重新选择
        storeLists: [],//搜索-门店
        refundInfors:[],//列表
        refundTypes:[
          {
            id:0,
            name:'POS自选'
          },
          {
            id:1,
            name:'现金'
          },
          {
            id:'alipay',
            name:'支付宝'
          },
          {
            id:'wxpay',
            name:'微信'
          },
          {
            id:'jdpay',
            name:'京东Pos刷卡'
          }
        ],
      }
    },
    computed:{
      total(){
        if(this.refundInfors){
          return this.refundInfors.length;
        }
      },
      totalMoney(){
        if(this.refundInfors){
          var sum=0;
          for(var i=0;i<this.refundInfors.length;i++){
            sum=this.AppUtils.add(sum,this.refundInfors[i]['refundMoney']);
          }
          return sum;
        }
      }
    },
    mounted() {
      this.getStoreList()//搜索-门店
      this.fetchData();//初始获取信息
      var today=new Date();
      this.model.startTime=this.AppUtils.formatDate(today);
      var stamp=Date.parse(new Date(this.model.startTime+' 00:00:00'));
      this.exportModel.startTime=stamp;
      this.listModel.startTime=stamp;
      if(this.$store.state.roleId==1){
        this.enShow=true;
      }else{
        this.enShow=false;
      }
    },
    methods: {
      //导出退款excel
      exportData(){
        this.$axios.post('/financial/refund/export',this.exportModel,{responseType:'arraybuffer'}).then(res => {
          let fileName = '退款列表.xlsx'
          let blob = new Blob([res.data], { type: 'application/x-xlsx'})
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
          }
        });
      },
      enterChange(){
        this.enterState=true;
      },
      searchInfo() {
        this.$store.state.refundNumber = this.searchModel.refundNumber;
        this.$store.state.carNumber = this.searchModel.carNumber;
        this.$store.state.customerTel = this.searchModel.customerTel;
        this.$store.state.refundType = this.searchModel.refundType;
        this.$store.state.refundUserName = this.searchModel.refundUserName;
        this.searchModel.storeId = this.model.store;
        if (this.searchModel.storeId == '全部门店') {
          this.searchModel.storeId = '';
        }
        this.$store.state.storeId = this.searchModel.storeId;
        if(!this.enterState){
          var stamp=Date.parse(new Date(this.model.startTime+' 00:00:00'));
          this.$store.state.startTime = stamp;
          this.searchModel.startTime = stamp;
          if (this.model.endTime) {
            var entryEndStam = this.model.endTime.getTime();
            this.$store.state.endTime = entryEndStam + 86400000;
            this.searchModel.endTime = entryEndStam + 86400000;//出来两天的数据
            if (this.searchModel.startTime <= entryEndStam) {
              var obj = {};
              for (var key in this.searchModel) {
                obj[key] = this.searchModel[key];
              }
              //导出
              for(var key in obj){
                this.exportModel[key]=obj[key]
              }
              this.getRefuInfo(obj);
              this.searchModel.startTime = '';
            } else {
              this.AppUtils.alert('收款日期终止时间不应早于起始时间')
            }
          } else {
            this.searchModel.endTime = null;
            var obj = {};
            for (var key in this.searchModel) {
              obj[key] = this.searchModel[key];
            }
            //导出
            for(var key in obj){
              this.exportModel[key]=obj[key]
            }
            this.getRefuInfo(obj);
            this.searchModel.startTime = '';
          }
        }else{
            if (this.model.startTime) {
              var stamp = this.model.startTime.getTime();
              this.$store.state.startTime = stamp;
              this.searchModel.startTime = stamp;
              if (this.model.endTime) {
                var entryEndStam = this.model.endTime.getTime();
                this.$store.state.endTime = entryEndStam + 86400000;
                this.searchModel.endTime = entryEndStam + 86400000;//出来两天的数据
                if (this.searchModel.startTime <= entryEndStam) {
                  var obj = {};
                  for (var key in this.searchModel) {
                    obj[key] = this.searchModel[key];
                  }
                  //导出
                  for(var key in obj){
                    this.exportModel[key]=obj[key]
                  }
                  this.getRefuInfo(obj);
                  this.searchModel.startTime = '';
                } else {
                  this.AppUtils.alert('退款日期终止时间不应早于起始时间')
                }
              } else {
                this.searchModel.endTime = null;
                var obj = {};
                for (var key in this.searchModel) {
                  obj[key] = this.searchModel[key];
                }
                //导出
                for(var key in obj){
                  this.exportModel[key]=obj[key]
                }
                this.getRefuInfo(obj);
                this.searchModel.startTime = '';
              }
            } else {
              this.searchModel.startTime = null;
              if (this.model.endTime) {
                var entryEndStam = this.model.endTime.getTime();
                this.$store.state.endTime = entryEndStam + 86400000;
                this.searchModel.endTime = entryEndStam + 86400000;//出来两天的数据
                var obj = {};
                for (var key in this.searchModel) {
                  obj[key] = this.searchModel[key];
                }
                //导出
                for(var key in obj){
                  this.exportModel[key]=obj[key]
                }
                this.getRefuInfo(obj);
                this.searchModel.startTime = '';
              } else {
                this.searchModel.endTime = null;
                var obj = {};
                for (var key in this.searchModel) {
                  obj[key] = this.searchModel[key];
                }
                //导出
                for(var key in obj){
                  this.exportModel[key]=obj[key]
                }
                this.getRefuInfo(obj);
                this.searchModel.startTime = '';
              }
          }
        }
      },
      fetchData(args){
        if(args){
          if(args.page){//分页
            this.listModel.pageNo=args.page;//当前页数
            this.listModel.pageSize=args.pageSize;//每页显示多少条startTime
            this.listModel.startTime=args.startTime;
            this.listModel.endTime=args.endTime;
            this.listModel.refundNumber=args.refundNumber;
            this.listModel.carNumber=args.carNumber;
            this.listModel.customerTel=args.customerTel;
            this.listModel.refundType=args.refundType;
            this.listModel.refundUserName=args.refundUserName;
          }
        }
        this.getRefuInfo(this.listModel);
      },
      getRefuInfo(arg){
        this.$axios.post('/financial/refund/list',arg).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data) {
            this.refundInfors=data.value.dataList;
          }
          //初始化分页
          //initPage 参数：总条数 当前页数 每页多少条
          if(data.value.dataList.length){
            this.$nextTick(()=>{
              this.$refs.child.initPage(data.value.totalNum,this.listModel.pageNo,this.listModel.pageSize)
            })
          }
        })
      },
      //获取搜索门店
      getStoreList(){
        this.$axios.get('/system/store/all/1').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
            this.storeLists= data.value;
          }
        })
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../../assets/css/base-doubleLine.css';
  .inp{
    width: 192px;
    margin-left: 10px;
    margin-right: 17px;
  }
  .column i{
    margin-left: 10px;
    margin-right: 10px;
  }
  .table_layout{
    .data-statistics{
      padding-bottom: 10px;
      text-align: left;
      font-size: 12px;
      span{
        margin-right: 20px;
      }
    }
  }
</style>
