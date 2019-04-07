<template>
  <div class="main_wrap">
    <div class="search-box bg_fff">
      <form>
        <div class="selectWrap font12">
          <div class="column inlineBlock">
            <span class="mr12">收款日期</span>
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
            <span class="enterpriseName">收款单号</span>
            <el-input class="el_box inp" placeholder="请输入收款单号" v-model="searchModel.receiptNumber"></el-input>
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
            <span class="enterpriseName">收款方式</span>
            <el-select class="el_box ml10" v-model="searchModel.receiptType"  clearable filterable placeholder="收款方式">
              <el-option
                v-for="item in receiptTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="enterpriseName">收款人</span>
            <el-input class="el_box inp" placeholder="请输入收款人" v-model="searchModel.receiptUserName"></el-input>
            <button class="serachBtn" type="submit" @click.prevent="searchInfo">搜索</button>
            <button class="serachBtn"  @click.prevent="paymentBegin" v-if="receiptShow">收款</button>
            <button class="serachBtn mr17" @click.prevent="exportData">导出</button>
          </div>
        </div>
      </form>
    </div>
    <div class="table_wrap">
      <div class="table_layout bg_fff">
        <div class="data-statistics">
          <span class="theme-color ml0">收款笔数:{{total}}</span>
          <span class="theme-color">收款金额:{{totalMoney}}</span>
        </div>
        <div class="table_scroll ">
          <table class="table textAlignL">
            <thead>
            <tr>
              <th>序号</th>
              <th>收款单号</th>
              <th>车牌号码</th>
              <th>客户手机</th>
              <th>收款金额</th>
              <th>收款方式</th>
              <th>收款时间</th>
              <th>收款人</th>
              <th>收款门店</th>
              <th v-if="enShow">所属企业</th>
              <th>是否放行</th>
              <th>退款金额</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(receiptInfor,index) in receiptInfors" :key="index">
              <td>{{index+1}}</td>
              <td>{{receiptInfor.receiptNumber}}</td>
              <td>{{receiptInfor.carNumber}}</td>
              <td>{{receiptInfor.customerTel}}</td>
              <td>{{receiptInfor.receiptMoney}}</td>
              <td>{{receiptInfor.receiptType=='0'?'pos自选':(receiptInfor.receiptType=='1'?'现金':(receiptInfor.receiptType=='alipay'?'支付宝':(receiptInfor.receiptType=='wxpay'?'微信':(receiptInfor.receiptType=='jdpay'?'京东Pos刷卡':''))))}}</td>
              <td>{{receiptInfor.receiptTime| dateFormatToSecond}}</td>
              <td>{{receiptInfor.receiptUserName}}</td>
              <td>{{receiptInfor.storeName}}</td>
              <td v-if="enShow">{{receiptInfor.enterpriseName}}</td>
              <td>{{receiptInfor.ifRelease==0?'否':'是'}}</td>
              <td>{{receiptInfor.refundMoney}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" v-if="receiptInfors.length">
          <nt-pagination ref="child" @fetchData="fetchData"></nt-pagination>
        </div>
      </div>
    </div>
    <!--收款遮罩层-->
    <addit :popUp="popUp" @change="change" @relod="relod"></addit>
  </div>
</template>

<script>
  import addit from './components/add-edit.vue'
  export default {
    name: 'receipt-list',
    components: {addit},
    data(){
      return {
        model:{
          startTime:'',
          endTime:'',
          store:'全部门店',
        },
        inject:['reload'],//注入reload方法
        listModel:{
          pageSize:10,//每页行数
          pageNo:1,
          startTime:'',//收款开始日期
          endTime:'',//收款结束日期
          receiptNumber:'',//收款单号
          carNumber:'',//车牌号码
          customerTel:'',//客户手机
          storeId:'',//门店ID
          receiptType:'',//收款类别
          receiptUserName:'',//收款人姓名
        },
        receiptInfors:[],//列表
        enterState:false,//出场时间默认还是重新选择
        searchModel:{
          pageSize:10,//每页行数
          startTime:'',//收款开始日期
          endTime:'',//收款结束日期
          receiptNumber:'',//收款单号
          carNumber:'',//车牌号码
          customerTel:'',//客户手机
          storeId:'',//门店ID
          receiptType:'',//收款类别
          receiptUserName:'',//收款人姓名
        },
        exportModel:{
          pageSize:10,//每页行数
          startTime:'',//收款开始日期
          endTime:'',//收款结束日期
          receiptNumber:'',//收款单号
          carNumber:'',//车牌号码
          customerTel:'',//客户手机
          storeId:'',//门店ID
          receiptType:'',//收款类别
          receiptUserName:'',//收款人姓名
        },
        enShow:false,//所属企业显示状态
        popUp:false,
        receiptShow:false,
        storeLists: [],//搜索-启用门店
        receiptTypes: [
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
    mounted() {
      this.getStoreList();//搜索-门店
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
      if(this.$store.state.roleId=='3'||this.$store.state.roleId=='4'){
        this.receiptShow=true;
      }else{
        this.receiptShow=false;
      }
    },
    computed:{
      total(){
        if(this.receiptInfors){
          return this.receiptInfors.length;
        }
      },
      totalMoney(){
        if(this.receiptInfors){
          var sum=0;
          for(var i=0;i<this.receiptInfors.length;i++){
            sum=this.AppUtils.add(sum,this.receiptInfors[i]['receiptMoney']);
          }
          return sum;
        }
      }
    },
    methods: {
      //导出收款excel
      exportData(){
        this.$axios.post('/financial/receipt/export',this.exportModel,{responseType:'arraybuffer'}).then(res => {
          let fileName = '收款列表.xlsx'
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
      relod(){
        this.$router.push('/collect-money/receipt-list');
      },
      searchInfo() {
        this.$store.state.receiptNumber = this.searchModel.receiptNumber;
        this.$store.state.carNumber = this.searchModel.carNumber;
        this.$store.state.customerTel = this.searchModel.customerTel;
        this.$store.state.receiptType = this.searchModel.receiptType;
        this.$store.state.receiptUserName = this.searchModel.receiptUserName;
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
              //导出部分使用
              for(var key in obj){
                this.exportModel[key]=obj[key]
              }
              this.getReciInfo(obj);
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
            for(var key in obj){
              this.exportModel[key]=obj[key]
            }
            this.getReciInfo(obj);
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
                  for(var key in obj){
                    this.exportModel[key]=obj[key]
                  }
                  this.getReciInfo(obj);
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
                for(var key in obj){
                  this.exportModel[key]=obj[key]
                }
                this.getReciInfo(obj);
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
                for(var key in obj){
                  this.exportModel[key]=obj[key]
                }
                this.getReciInfo(obj);
                this.searchModel.startTime = '';
              } else {
                this.searchModel.endTime = null;
                var obj = {};
                for (var key in this.searchModel) {
                  obj[key] = this.searchModel[key];
                }
                for(var key in obj){
                  this.exportModel[key]=obj[key]
                }
                this.getReciInfo(obj);
                this.searchModel.startTime = '';
              }
        }
      }
      },
      fetchData(args){
        if(args){
          if(args.page){//分页
            this.listModel.pageNo=args.page;//当前页数
            this.listModel.pageSize=args.pageSize;//每页显示多少条
            this.listModel.startTime=args.startTime;
            this.listModel.endTime=args.endTime;
            this.listModel.receiptNumber=args.receiptNumber;
            this.listModel.carNumber=args.carNumber;
            this.listModel.customerTel=args.customerTel;
            this.listModel.storeId=args.storeId;
            this.listModel.receiptType=args.receiptType;
            this.listModel.receiptUserName=args.receiptUserName;
          }
        }
        this.getReciInfo(this.listModel);
      },
      getReciInfo(arg){
        this.$axios.post('/financial/receipt/list',arg).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data) {
            this.receiptInfors=data.value.dataList;
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
      paymentBegin(){
        this.popUp=true
      },
      change(){
        this.popUp=false
      }
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
