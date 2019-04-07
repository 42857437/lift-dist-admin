<template>
  <div class="main_wrap">
    <div class="search-box bg_fff">
      <form>
        <div class="selectWrap font12">
          <div class="column inlineBlock">
            <span class="mr12">进场日期:</span>
            <el-date-picker
              v-model="model.entryStart"
              type="date"
              format="yyyy-MM-dd"
              placeholder="起始时间"
              class="activity-edit-date date-box">
            </el-date-picker>
            <i> 至 </i>
            <el-date-picker
              v-model="model.entryEnd"
              type="date"
              format="yyyy-MM-dd"
              placeholder="终止时间"
              class="activity-edit-date date-box">
            </el-date-picker>
            <span class="mr12">出场日期:</span>
            <el-date-picker
              v-model="model.outStart"
              type="date"
              format="yyyy-MM-dd"
              placeholder="起始时间"
              class="activity-edit-date date-box">
            </el-date-picker>
            <i> 至 </i>
            <el-date-picker
              v-model="model.outEnd"
              type="date"
              format="yyyy-MM-dd"
              placeholder="终止时间"
              class="activity-edit-date date-box">
            </el-date-picker>
          </div>
          <div class="column inlineBlock">
            <span class="enterpriseName">企业:</span>
            <el-select class="el_box ml10" v-model="model.companySel"  placeholder="请选择企业">
              <el-option
                v-for="item in companySearchLists"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="enterpriseName">门店:</span>
            <el-select class="el_box ml10" v-model="model.store"  placeholder="请选择门店名称">
              <el-option
                v-for="item in storeLists"
                :key="item.id"
                :label="item.storeName"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="enterpriseName">业务类型</span>
            <el-select class="el_box ml10" v-model="model.businessType"  placeholder="请选择业务类型" @visible-change="getOutreasons">
              <el-option
                v-for="item in businessTypes"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
            <span class="enterpriseName">放行类型:</span>
            <el-select class="el_box ml10" v-model="model.outReason" placeholder="请选择放行类型">
              <el-option
                v-for="item in outReasonLists"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="enterpriseName">抬杆原因:</span>
            <el-select class="el_box ml10" v-model="model.liftingReason" placeholder="请选择抬杆类型">
              <el-option
                v-for="item in liftingReasons"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="column inlineBlock">
            <span class="enterpriseName">是否显示:</span>
            <span class="pr">
              <label class="checkBox">
                <input type="checkbox"v-model="showOptions.isTime">
                <span></span>日期
              </label>
            </span>
            <span class="pr">
              <label class="checkBox">
                <input type="checkbox"v-model="showOptions.isBusinessType">
                <span></span>业务类型
              </label>
            </span>
            <span class="pr">
               <label class="checkBox">
                <input type="checkbox"v-model="showOptions.isOutReason" :disabled="!showOptions.isBusinessType">
                <span></span>放行类型
               </label>
            </span>
            <span class="pr">
               <label class="checkBox">
                <input type="checkbox"v-model="showOptions.isLiftingReason">
                <span></span>抬杆原因
               </label>
            </span>
            <button class="serachBtn" type="submit" @click.prevent="searchInfo">搜索</button>
          </div>
          </div>
      </form>
    </div>
    <div class="table_wrap">
      <div class="table_layout bg_fff">
        <div class="table_scroll ">
          <table class="table textAlignL">
            <thead>
            <tr>
              <th v-if="showDate">日期</th>
              <th>企业</th>
              <th>门店</th>
              <th v-if="businessTypeShow">业务类型</th>
              <th v-if="leaveTypeShow">放行类型</th>
              <th v-if="leaveReasonShow">抬杆原因</th>
              <th>入场台次</th>
              <th>出场台次</th>
              <th>平均在店时间</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(isOutData,index) in isOutDatas" :key="index">
              <td v-if="showDate">{{isOutData.desc1}}</td>
              <td>{{isOutData.desc2}}</td>
              <td>{{isOutData.desc3}}</td>
              <td v-if="businessTypeShow">{{isOutData.desc11=='0'?'行政':(isOutData.desc11=='1'?'新车销售':(isOutData.desc11=='2'?'售后':''))}}</td>
              <td v-if="leaveTypeShow">{{isOutData.desc4=='0'?'结算放行':(isOutData.desc4=='1'?'担保放行':(isOutData.desc4=='2'?'行政':(isOutData.desc4=='3'?'访客':'')))}}</td>
              <td v-if="leaveReasonShow">{{isOutData.desc5=='0'?'正常出场':(isOutData.desc5=='1'?'系统故障':(isOutData.desc5=='2'?'异常出场':(isOutData.desc5=='3'?'无牌出场':'')))}}</td>
              <td>{{isOutData.desc6}}</td>
              <td>{{isOutData.desc7}}</td>
              <td>{{isOutData.desc8 | averageTimeShow}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" v-if="isOutDatas.length">
          <nt-pagination ref="child" @fetchData="fetchData"></nt-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'in-out-data',
    components: {},
    data(){
      return {
        showOptions:{
          isTime:true,
          isOutReason:false,
          isLiftingReason:false,
          isBusinessType:false
        },
        model:{
          entryStart:'',//进场时间范围（开始）
          entryEnd:'',//进场时间范围（结束）
          outStart:'',//出场时间范围（开始）
          outEnd:'',//出场时间范围（开始
          store:'全部门店',
          companySel:'全部企业',
          outReason:'全部放行类型',
          liftingReason:'全部抬杆原因',
          businessType:'全部业务类型',
        },
        listModel: {
          pageSize:10,//每页行数
          pageNo:1,
          entryStart:'',//进场时间范围（开始）
          entryEnd:'',//进场时间范围（结束
          outStart:'',//出场时间范围（开始）
          outEnd:'',//出场时间范围（开始）
          enterpriseId:'',//企业ID
          storeId:'',//门店id
          outReason:'',//放行类型
          liftingReason:'',//出场抬杆原因
          isTime:1,//时间是否被勾选 1代表勾选
          isOutReason:0,//放行类型勾选 1代表勾选
          isLiftingReason:0,//抬杆原因是否被勾选 1代表勾选
          isBusinessType:0,//业务类型是否被勾选 1代表勾选
          businessType:'',//业务类型
        },
        searchModel: {
          pageSize:10,//每页行数
          entryStart:'',//进场时间范围（开始）
          entryEnd:'',//进场时间范围（结束）
          outStart:'',//出场时间范围（开始）
          outEnd:'',//出场时间范围（开始）
          enterpriseId:'',//企业ID
          storeId:'',//门店id
          outReason:'',//放行类型
          liftingReason:'',//出场抬杆原因
          isTime:'',//时间是否被勾选 1代表勾选
          isOutReason:'',//放行类型勾选 1代表勾选
          isLiftingReason:'',//抬杆原因是否被勾选 1代表勾选
          isBusinessType:'',//业务类型是否被勾选 1代表勾选
          businessType:'',//业务类型
        },
        isOutDatas:[],//列表
        storeLists: [],//搜索-门店
        companySearchLists:[],//搜索-企业
        showDate:true,//时间显示
        leaveTypeShow:false,//放行类型
        leaveReasonShow:false,//抬杆原因
        businessTypeShow:false,//业务类型
        businessTypes:[
          {
            value:'',
            text:'全部业务类型'
          },
          {
            value:0,
            text:'行政'
          },
          {
            value:1,
            text:'新车销售'
          },
          {
            value:2,
            text:'售后'
          }
        ],
        outReasonLists:[],
        liftingReasons:[
          {
            value:0,
            text:'正常出场'
          },
          {
            value:1,
            text:'系统故障'
          },
          {
            value:2,
            text:'异常出场'
          },
          {
            value:3,
            text:'无牌出场'
          },
        ],
      }
    },
    watch:{
      'showOptions.isBusinessType': {
        handler: function() {
          if(!this.showOptions.isBusinessType){
            this.showOptions.isOutReason=false;
          }
        },
      }
    },
    mounted() {
      this.getBusinessList();//搜索-企业
      this.getStoreList();//搜索-门店
      this.fetchData();//初始获取信息
    },
    computed:{
    /* showDate(){
      if(this.showOptions.isTime){
        return true
      }else{
        return false
      }
    }leaveTypeShow(){
     if(this.showOptions.isOutReason){
       return true
     }else{
       return false
     }
   },
   leaveReasonShow(){
     if(this.showOptions.isLiftingReason){
       return true
     }else{
       return false
     }
   }*/
    },
    methods: {
      //获取放行原因
      getOutreasons(arg){
        //arg为false,下拉框隐藏
        if(!arg){
          if(this.model.businessType!==''){
            this.$axios.get('/record/reason/list/'+this.model.businessType).then(res=>{
              let data = this.AppUtils.checkResponse(res);
              if(data) {
                this.model.outReason='';
                this.outReasonLists=data.value;
              }
            })
          }else{
            this.model.outReason='全部放行类型'
            this.outReasonLists=[];
          }
        }
        if(this.model.businessType=='全部业务类型'){
           this.model.businessType='';
        }
      },
      searchInfo(){
        this.searchModel.enterpriseId=this.model.companySel;
        if(this.searchModel.enterpriseId=='全部企业'){
          this.searchModel.enterpriseId='';
        }
        this.$store.state.enterpriseId=this.searchModel.enterpriseId;
        this.searchModel.storeId=this.model.store;
        if(this.searchModel.storeId=='全部门店'){
          this.searchModel.storeId='';
        }
        this.$store.state.storeId=this.searchModel.storeId;
        this.searchModel.outReason=this.model.outReason;
        if(this.searchModel.outReason=='全部放行类型'){
          this.searchModel.outReason='';
        }
        this.$store.state.outReason=this.searchModel.outReason;
        this.searchModel.liftingReason=this.model.liftingReason;
        if(this.searchModel.liftingReason=='全部抬杆原因'){
          this.searchModel.liftingReason='';
        }
        this.$store.state.liftingReason=this.searchModel.liftingReason;
        this.searchModel.businessType=this.model.businessType;
        if(this.searchModel.businessType=='全部业务类型'){
          this.searchModel.businessType='';
        }
        this.$store.state.businessType=this.searchModel.businessType;
        if(this.showOptions.isTime){
          this.searchModel.isTime=1;
          this.showDate=true;
        }else{
          this.searchModel.isTime=0;
          this.showDate=false;
        }
        this.$store.state.isTime=this.searchModel.isTime;
        if(this.showOptions.isOutReason){
          this.searchModel.isOutReason=1;
          this.leaveTypeShow=true;
        }else{
          this.searchModel.isOutReason=0;
          this.leaveTypeShow=false;
        }
        this.$store.state.isOutReason=this.searchModel.isOutReason;
        if(this.showOptions.isLiftingReason){
          this.searchModel.isLiftingReason=1;
          this.leaveReasonShow=true;
        }else{
          this.searchModel.isLiftingReason=0;
          this.leaveReasonShow=false;
        }
        this.$store.state.isLiftingReason=this.searchModel.isLiftingReason;

        if(this.showOptions.isBusinessType){
          this.searchModel.isBusinessType=1;
          this.businessTypeShow=true;
        }else{
          this.searchModel.isBusinessType=0;
          this.businessTypeShow=false;
        }
        this.$store.state.isBusinessType=this.searchModel.isBusinessType;
        if(this.model.entryStart){
          var stamp=this.model.entryStart.getTime();
          this.$store.state.entryStart=stamp;
          this.searchModel.entryStart=stamp;
          ///
          //出场日期填写情况开始
          if(this.model.outStart){
            var cStart=this.model.outStart.getTime();
            this.$store.state.outStart=cStart;
            this.searchModel.outStart=cStart;
            if(this.model.outEnd){
              var cEnd=this.model.outEnd.getTime();
              if(this.searchModel.outStart<=cEnd){
                this.$store.state.outEnd=cEnd+86400000;//出来两天的数据;
                this.searchModel.outEnd=cEnd+86400000;//出来两天的数据;
              }else{
                this.AppUtils.alert('出场日期终止时间不应早于起始时间')
              }
            }else{
              this.searchModel.outEnd=null;
            }
          }else{
            this.searchModel.outStart=null;
            if(this.model.outEnd){
              var cEnd=this.model.outEnd.getTime();
              this.$store.state.outEnd=cEnd+86400000;//出来两天的数据;
              this.searchModel.outEnd=cEnd+86400000;//出来两天的数据
            }else{
              this.searchModel.outEnd=null;
            }
          }
          //出场日期填写情况结束
          ///
          if(this.model.entryEnd){
            var entryEndStam=this.model.entryEnd.getTime();
            this.$store.state.entryEnd=entryEndStam+86400000;//出来两天的数据
            this.searchModel.entryEnd=entryEndStam+86400000;//出来两天的数据
            if(this.searchModel.entryStart<=entryEndStam){
              var obj={};
              for(var key in this.searchModel){
                obj[key]=this.searchModel[key];
              }
              this.getInOutInfo(obj);
              this.searchModel.entryStart='';
            }else{
              this.AppUtils.alert('进场日期终止时间不应早于起始时间')
            }
          }else {
            this.searchModel.entryEnd=null;
            var obj={};
            for(var key in this.searchModel){
              obj[key]=this.searchModel[key];
            }
            this.getInOutInfo(obj);
            this.searchModel.entryStart='';
          }
          //
        }else{
          this.searchModel.entryStart=null;
          ///
          //出场日期填写情况开始
          if(this.model.outStart){
            var cStart=this.model.outStart.getTime();
            this.$store.state.outStart=cStart;
            this.searchModel.outStart=cStart;
            if(this.model.outEnd){
              var cEnd=this.model.outEnd.getTime();
              if(this.searchModel.outStart<=cEnd){
                this.$store.state.outEnd=cEnd+86400000;//出来两天的数据;
                this.searchModel.outEnd=cEnd+86400000;//出来两天的数据;
              }else{
                this.AppUtils.alert('出场日期终止时间不应早于起始时间')
              }
            }else{
              this.searchModel.outEnd=null;
            }
          }else{
            this.searchModel.outStart=null;
            if(this.model.outEnd){
              var cEnd=this.model.outEnd.getTime();
              this.$store.state.outEnd=cEnd+86400000;//出来两天的数据;
              this.searchModel.outEnd=cEnd+86400000;//出来两天的数据
            }else{
              this.searchModel.outEnd=null;
            }
          }
          //出场日期填写情况结束
          if(this.model.entryEnd){
            var entryEndStam=this.model.entryEnd.getTime();
            this.$store.state.entryEnd=entryEndStam+86400000;//出来两天的数据
            this.searchModel.entryEnd=entryEndStam+86400000;//出来两天的数据
            var obj={};
            for(var key in this.searchModel){
              obj[key]=this.searchModel[key];
            }
            this.getInOutInfo(obj);
            this.searchModel.entryStart='';
          }else {
            this.searchModel.entryEnd=null;
            var obj={};
            for(var key in this.searchModel){
              obj[key]=this.searchModel[key];
            }
            this.getInOutInfo(obj);
            this.searchModel.entryStart='';
          }
        }
      },
      fetchData(args){
        if(args){
          if(args.page){//分页
            this.listModel.pageNo=args.page;//当前页数
            this.listModel.pageSize=args.pageSize;//每页显示多少条
            this.listModel.entryStart=args.entryStart;
            this.listModel.entryEnd=args.entryEnd;
            this.listModel.outStart=args.outStart;
            this.listModel.outEnd=args.outEnd;
            this.listModel.enterpriseId=args.enterpriseId;
            this.listModel.storeId=args.storeId;
            this.listModel.outReason=args.outReason;
            this.listModel.liftingReason=args.liftingReason;
            this.listModel.isTime=args.isTime;
            this.listModel.isOutReason=args.isOutReason;
            this.listModel.isLiftingReason=args.isLiftingReason;
            this.listModel.businessType=args.businessType;
            this.listModel.isBusinessType=args.isBusinessType;
          }
        }
        this.getInOutInfo(this.listModel);
      },
      getInOutInfo(arg){
        this.$axios.post('/report/entry/out',arg).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data) {
            this.isOutDatas=data.value.dataList;
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
      //搜索--企业
      getBusinessList(){
        this.$axios.get('/system/enterprise/all/1').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
            this.companySearchLists = data.value;
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
  }
  .column i{
    margin-left: 10px;
    margin-right: 10px;
  }
</style>
