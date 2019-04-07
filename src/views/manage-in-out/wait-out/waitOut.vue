<template>
  <div class="main_wrap">
    <div class="search-box bg_fff">
      <form>
        <div class="selectWrap font12">
          <div class="column inlineBlock">
            <span class="mr12">放行日期</span>
            <el-date-picker
              v-model="model.confirmStart"
              type="date"
              format="yyyy-MM-dd"
              placeholder="起始时间"
              class="activity-edit-date date-box"
              @change="enterChange"
            >
            </el-date-picker>
            <i> 至 </i>
            <el-date-picker
              v-model="model.confirmEnd"
              type="date"
              format="yyyy-MM-dd"
              placeholder="终止时间"
              class="activity-edit-date date-box">
            </el-date-picker>
            <el-select v-model="carVinType" class="el_box enterpriseName w91" clearable filterable placeholder="请选择" style="margin-left: 10px">
              <el-option
                v-for="item in carVinTypes"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
            <el-input class="el_box inp" placeholder="请输入车牌号码" v-model="model.carNumber" v-if="carNumShow"></el-input>
            <el-input class="el_box inp" placeholder="请输入VIN码" v-model="model.vin" v-else></el-input>
            <span class="enterpriseName">业务类型</span>
            <el-select class="el_box ml10 mr17" v-model="model.businessType" clearable filterable  placeholder="请选择业务类型">
              <el-option
                v-for="item in businessTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="column inlineBlock">
            <span class="status">企业</span>
            <el-select v-model="model.enterpriseId" class="el_box ml10" clearable filterable placeholder="请选择企业">
              <el-option
                v-for="item in companyOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="enterpriseName">门店</span>
            <el-select class="el_box ml10" v-model="model.outStoreId" clearable filterable  placeholder="请选择门店名称">
              <el-option
                v-for="item in storeLists"
                :key="item.id"
                :label="item.storeName"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="enterpriseName">部门</span>
            <el-select class="el_box ml10" v-model="model.outDepartmentId"  clearable filterable  placeholder="请输入部门名称">
              <el-option
                v-for="item in departLists"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="enterpriseName">申请人</span>
            <el-input class="el_box inp" placeholder="请输入申请人" v-model="model.applyUserName"></el-input>
            <button class="serachBtn mr17" type="submit" @click.prevent="searchInfo">搜索</button>
          </div>
        </div>
      </form>
    </div>
    <div class="table_wrap" style="overflow: hidden">
      <div class="table_layout bg_fff">
        <div class="table_scroll ">
          <table class="table textAlignL">
            <thead>
            <tr>
              <th>序号</th>
              <th v-if="cancelShow">操作</th>
              <th>车牌号码/VIN码</th>
              <th>业务类型</th>
              <!--<th>所属门店</th>-->
              <th v-if="enShow">所属企业</th>
              <th>放行原因</th>
              <th>申请人</th>
              <th>审核人</th>
              <th>审核时间</th>
              <!--<th>放行人</th>-->
              <th>放行部门</th>
              <th>放行门店</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(waitOutInfor,index) in waitOutInfors" :key="index">
              <td>{{index+1}}</td>
              <td class="redact" v-if="cancelShow">
                <span @click="confirmOut(waitOutInfor.enterId,waitOutInfor.carNumber,waitOutInfor.vin,waitOutInfor.businessType,waitOutInfor.outReason)">确认出场</span>
                <span @click.prevent="doPrint(waitOutInfor.enterId)" v-if="actShow">打印</span>
                <span @click="cancelLift(waitOutInfor.enterId)" v-if="actShow">取消放行</span>
              </td>
              <td>{{waitOutInfor.carNumber!=''?waitOutInfor.carNumber:waitOutInfor.vin}}</td>
              <td>{{waitOutInfor.businessType=='0'?'行政':(waitOutInfor.businessType=='1'?'新车销售':(waitOutInfor.businessType=='2'?'售后':''))}}</td>
              <!--<td>{{waitOutInfor.storeName}}</td>-->
              <td v-if="enShow">{{waitOutInfor.enterpriseName}}</td>
              <td>{{waitOutInfor.outReasonName}}</td>
              <td>{{waitOutInfor.applyUserName}}</td>
              <td>{{waitOutInfor.outUserName}}</td>
              <td>{{waitOutInfor.confirmTime | dateFormatToSecond}}</td>
              <!--<td>{{waitOutInfor.outUserName}}</td>-->
              <td>{{waitOutInfor.outDepartmentName}}</td>
              <td>{{waitOutInfor.outStoreName}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" v-if="waitOutInfors.length">
          <nt-pagination ref="child" @fetchData="fetchData"></nt-pagination>
        </div>
      </div>
    </div>
    <!--确认放行遮罩层-->
    <confive :confirmLeave="confirmLeave" @changeConfirm="changeConfirm" :enterId1="enterId1" :outUserid='outUserid' @relod="relod" ref="waitLeaveEdit"></confive>
    <print ref="print" :printShow="printShow" @printClose="printClose" @again="again"></print>
    <reconfirm :reconfirmShow="reconfirmShow" @hideReconfirm="hideReconfirm" @relod="relod" :title="title" :obj="obj"></reconfirm>
    <!--<button v-print="'#printTest'">打印</button>-->
  </div>
</template>

<script>
  import confive from './components/confirm-leave.vue'
  import print from './components/print.vue'
  import reconfirm from './components/reconfirm.vue'
  export default {
    name: 'wait-out-car',
    components: {},
    inject:['reload'],//注入reload方法
    components: {
      confive,
      print,
      reconfirm
    },
    watch:{
      carVinType(newVal,oldVal){
        if(newVal==1){
          this.carNumShow=true;
          this.model.vin='';
          this.model.carNumber='';
        }else if(newVal==2){
          this.carNumShow=false;
          this.model.vin='';
          this.model.carNumber='';
        }
      },
    },
    data(){
      return {
        carVinTypes:[
          {
            id:1,
            value:"车牌号码",
          },
          {
            id:2,
            value:"VIN码",
          },
        ],
        reconfirmShow:false,//确认出场二次确认
        carNumShow:true,//搜索汽车号码还是vin码
        title:'',//确认出场或者取消放行
        obj:{},//确认出场所传参数
        carVinType:1,
        model:{
          confirmStart:'',//确认放行时间范围（开始）
          confirmEnd:'',//确认放行时间范围（结束）
          carNumber:'',//车牌号
          businessType:'',//业务类型
          outStoreId:'',//放行门店ID
          outDepartmentId:'',//放行部门ID
          enterpriseId:'',//企业id
          applyUserName:'',//申请人
          pageNo:1,
          pageSize:10,//每页行数
          vin:'',//vin码
          menuId:304,//菜单ID (302 待申请放行303 待审核放行 304待出场）
        },
        enterId1:'',
        outUserid:'',
        printShow:false,
        actShow:true,//roleId等于9，只显示确认出场
        cancelShow:false,//操作-取消放行
        enterState:false,//放行时间默认还是重新选择
        enShow:false,//所属企业显示状态
        confirmLeave:false,
        companyOptions:[],//企业列表
        storeLists: [],//搜索--启用门店
        departLists: [],//搜索--启用部门
        waitOutInfors:[],//待出场车辆列表
        businessTypes:[
          {
            id:'',
            name:'全部业务类型'
          },
          {
            id:0,
            name:'行政'
          },
          {
            id:1,
            name:'新车销售'
          },
          {
            id:2,
            name:'售后'
          }
        ],
      }
    },
    mounted() {
      this.getStoreList();//搜索部分门店
      this.getDepartList();//搜索部分部门
      this.getBusinessList();//搜索部分企业
      this.fetchData();//初始获取信息
      // var today=new Date();
      // this.model.confirmStart=this.AppUtils.formatDate(today);
      if(this.$store.state.roleId==1){
        this.enShow=true;
      }else{
        this.enShow=false;
      }
      if(this.$store.state.roleId==3||this.$store.state.roleId==4||this.$store.state.roleId==6||this.$store.state.roleId==7||this.$store.state.roleId==8||this.$store.state.roleId==10||this.$store.state.roleId==11||this.$store.state.roleId==12){
        this.cancelShow=true;
        this.actShow=true;
      }
      if(this.$store.state.roleId==9){
        this.cancelShow=true;
        this.actShow=false;
      }
    },
    methods: {
      //请求搜索部分企业列表
      getBusinessList(){
        this.$axios.get('/system/enterprise/all/1').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
            this.companyOptions= data.value;
            this.companyOptions.unshift({id:'',name:'全部企业'})
          }
        })
      },
      doPrint(id){
        this.printShow=true;
        this.$refs.print.getPrintInfo(id);
      },
      printClose(){
        this.printShow=false;
      },
      //确认出场
      confirmOut(enterId,carNumber,vin,businessType,outReason){
        this.reconfirmShow=true;
        this.title="确认车辆已出场？";
        var obj={
          enterId,
          carNumber,
          vin,
          businessType,
          outReason
        }
        this.obj=obj;
      },
      hideReconfirm(){
        this.reconfirmShow=false;
      },
      changeConfirm(){
        this.confirmLeave=false
      },
      relod(){
        this.$message.success('操作成功');
        this.reload();
      },
      again(){
        this.reload();
      },
      cancelLift(enterId){
        this.confirmLeave=true;
        this.enterId1=enterId+'';
      },
      enterChange(){
        this.enterState=true;
      },
      //搜索
      searchInfo(){
        /*if(!this.enterState){
          var stamp=Date.parse(new Date(this.model.confirmStart+' 00:00:00'));
          this.searchModel.confirmStart=stamp;
          this.$store.state.confirmStart=stamp;
          if(this.model.confirmEnd){
            var entryEndStam=this.model.confirmEnd.getTime();
            this.$store.state.confirmEnd=entryEndStam+86400000;
            this.searchModel.confirmEnd=entryEndStam+86400000;//出来两天的数据
            if(this.searchModel.confirmStart<=entryEndStam){
              var obj={};
              for(var key in this.searchModel){
                obj[key]=this.searchModel[key];
              }
              this.getWaitOutInfo(obj);
              this.searchModel.confirmStart='';
            }else{
              this.AppUtils.alert('放行日期终止时间不应早于起始时间')
            }
          }else {
            this.searchModel.confirmEnd=null;
            var obj={};
            for(var key in this.searchModel){
              obj[key]=this.searchModel[key];
            }
            this.getWaitOutInfo(obj);
            this.searchModel.confirmStart='';
          }
        }else{*/
          if(this.model.confirmStart){
            if(Object.prototype.toString.call(this.model.confirmStart)=="[object Date]"){
              var start= this.model.confirmStart.getTime();
              this.model.confirmStart=start;
            }
            if(this.model.confirmEnd){
              if(Object.prototype.toString.call(this.model.confirmEnd)=="[object Date]") {
                var entryEndStam= this.model.confirmEnd.getTime();
                this.model.confirmEnd=entryEndStam;//出来两天的数据
              }
              if(this.model.confirmStart<=this.model.confirmEnd){
                var obj={};
                for(var key in this.model){
                  obj[key]=this.model[key];
                }
                if(obj['confirmEnd']){
                  obj['confirmEnd']=obj['confirmEnd']+86400000;//出来两天的数据
                }
                delete obj['pageNo'];
                this.getWaitOutInfo(obj);
              }else{
                this.AppUtils.alert('放行日期终止时间不应早于起始时间')
              }
            }else {
              this.model.confirmEnd=null;
              var obj={};
              for(var key in this.model){
                obj[key]=this.model[key];
              }
              delete obj['pageNo'];
              this.getWaitOutInfo(obj);
            }
          }else{
            this.model.confirmStart=null;
            if(this.model.confirmEnd){
              if(Object.prototype.toString.call(this.model.confirmEnd)=="[object Date]") {
                var entryEndStam= this.model.confirmEnd.getTime();
                this.model.confirmEnd=entryEndStam;//出来两天的数据
              }
              var obj={};
              for(var key in this.model){
                obj[key]=this.model[key];
              }
              if(obj['confirmEnd']){
                obj['confirmEnd']=obj['confirmEnd']+86400000;//出来两天的数据
              }
              delete obj['pageNo'];
              this.getWaitOutInfo(obj);
            }else {
              this.model.confirmEnd=null;
              var obj={};
              for(var key in this.model){
                obj[key]=this.model[key];
              }
              delete obj['pageNo'];
              this.getWaitOutInfo(obj);
            }
          }
        // }
      },
      //获取搜索门店
      getStoreList(){
        this.$axios.get('/system/store/all/1').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
            this.storeLists= data.value;
            this.storeLists.unshift({id:'',storeName:'全部门店'});
          }
        })
      },
      //搜索-部门列表
      getDepartList(){
        this.$axios.get('/permission/department/all/1').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data.value){
            this.departLists= data.value;
            this.departLists.unshift({id:'',name:'全部部门'});
          }
        })
      },
      fetchData(args){
        if(args){
          if(args.page){//分页
            this.model.pageNo=args.page;//当前页数
            this.model.pageSize=args.pageSize;//每页显示多少条
          }
        }
        this.getWaitOutInfo(this.model);
      },
      getWaitOutInfo(arg){
        this.$axios.post('/record/entry/list',arg).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data) {
            this.waitOutInfors=data.value.dataList;
          }
          //初始化分页
          //initPage 参数：总条数 当前页数 每页多少条
          if(data.value.dataList.length){
            this.$nextTick(()=>{
              this.$refs.child.initPage(data.value.totalNum,this.model.pageNo,this.model.pageSize)
            })
          }
        })
      }
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
  .redact span{
    margin-left: 0px!important;
    width: 32%;
    text-align: center;
    color: #FF615B;
  }

</style>
