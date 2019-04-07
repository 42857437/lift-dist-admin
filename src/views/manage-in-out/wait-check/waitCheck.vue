<template>
  <div class="main_wrap">
    <div class="search-box bg_fff">
      <form>
        <div class="selectWrap font12">
          <div class="column inline-Block">
            <span class="mr12">申请日期</span>
            <el-date-picker
              v-model="model.applyStart"
              type="date"
              format="yyyy-MM-dd"
              placeholder="起始时间"
              class="activity-edit-date date-box"
              @change="enterChange"
            >
            </el-date-picker>
            <i> 至 </i>
            <el-date-picker
              v-model="model.applyEnd"
              type="date"
              format="yyyy-MM-dd"
              placeholder="终止时间"
              class="activity-edit-date date-box">
            </el-date-picker>
          </div>
          <div class="column inline-Block">
            <el-select v-model="carVinType" class="el_box enterpriseName w91" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in carVinTypes"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
            <el-input class="el_box inp" placeholder="请输入车牌号码" v-model="model.carNumber" v-if="carNumShow"></el-input>
            <el-input class="el_box inp" placeholder="请输入VIN码" v-model="model.vin" v-else></el-input>
            <button class="serachBtn" type="submit" @click.prevent="searchInfo">搜索</button>
            <!--<button class="serachBtn" type="button" @click="add" v-if="addShow">新增</button>-->
            <!--<button class="serachBtn" type="button" @click="remoteLift" v-if="addShow">远程抬杆</button>-->
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
              <th>序号</th>
              <th v-if="handleShow">操作</th>
              <th>车牌号码/VIN码</th>
              <th>业务类型</th>
              <th>放行原因</th>
              <th v-if="enShow">所属企业</th>
              <th v-if="storeShow">所属门店</th>
              <th>进场时间</th>
              <th>进场照片</th>
              <th>申请人</th>
              <th>申请时间</th>
              <!--<th>添加人</th>-->
              <!--<th>添加时间</th>-->
              <!--<th>修改人</th>-->
              <!--<th>修改时间</th>-->
            </tr>
            </thead>
            <tbody>
            <tr v-for="(whiteDisInfor,index) in whiteDisInfors" :key="index">
              <td>{{index+1}}</td>
              <!--操作-->
              <td class="redact" v-if="handleShow">
                <!--<span @click="edit(whiteDisInfor.enterId,whiteDisInfor.businessType)">放行</span>-->
                <!--<span @click="redact(whiteDisInfor.enterId)">编辑</span>-->
                <span @click="accept(whiteDisInfor.enterId)">同意</span>
                <span @click="reject(whiteDisInfor.enterId)">驳回</span>
              </td>
              <td>{{whiteDisInfor.carNumber!=''?whiteDisInfor.carNumber:whiteDisInfor.vin}}</td>
              <td>{{whiteDisInfor.businessType=='0'?'行政':(whiteDisInfor.businessType=='1'?'新车销售':(whiteDisInfor.businessType=='2'?'售后':''))}}</td>
              <td>{{whiteDisInfor.outReasonName}}</td>
              <td v-if="enShow">{{whiteDisInfor.enterpriseName}}</td>
              <td v-if="storeShow">{{whiteDisInfor.storeName}}</td>
              <td>{{whiteDisInfor.entryTime | dateFormatToSecond}}</td>
              <td class="watch" @click="previewImg(whiteDisInfor.entryPhoto)">查看</td>
              <td>{{whiteDisInfor.applyUserName}}</td>
              <td>{{whiteDisInfor.applyTime| dateFormatToSecond}}</td>
              <!--<td>{{whiteDisInfor.createUserName}}</td>-->
              <!--<td>{{whiteDisInfor.createTime | dateFormatToSecond}}</td>-->
              <!--<td>{{whiteDisInfor.updateUserName}}</td>-->
              <!--<td>{{whiteDisInfor.updateTime | dateFormatToSecond}}</td>-->
            </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" v-if="whiteDisInfors.length">
          <nt-pagination ref="child" @fetchData="fetchData"></nt-pagination>
        </div>
        <transition name="fade">
          <nt-preview-image ref="preview"></nt-preview-image>
        </transition>
      </div>
    </div>
    <!--新增-编辑遮罩层-->
    <addit :popUp="popUp" @changeAddEdit="changeAddEdit" :title="title" @relod="relod" ref="waitAddEdit" :enterId="enterId"></addit>
    <!--确认放行遮罩层-->
    <confive :confirmLeave="confirmLeave" @changeConfirm="changeConfirm" :enterId1="enterId1"  @relod="relod" ref="waitLeaveEdit"></confive>
    <!--远程抬杆遮罩层-->
    <remolift :remoteliftShow="remoteliftShow" @changeRemote="changeRemote" @relod="relod"  @showCar="showCar"></remolift>
    <carview :carShow="carShow" @closeCar="closeCar"></carview>
    <reconfirm :reconfirmShow="reconfirmShow" @hideReconfirm="hideReconfirm" @relod="relod" :title="title" :acceptEnterId="acceptEnterId"></reconfirm>
    <rejectconfirm :rejectConfirmShow="rejectConfirmShow" @hideRejectReconfirm="hideRejectReconfirm" @relod="relod" :title="title" :rejectEnterId="rejectEnterId"></rejectconfirm>
  </div>
</template>

<script>
  import addit from './components/add-edit.vue'
  import confive from './components/confirm-leave.vue'
  import remolift from './components/remote-lift.vue'
  import carview from './components/carView.vue'
  import reconfirm from './components/reconfirm.vue'
  import rejectconfirm from './components/rejectConfirm.vue'
  export default {
    name: 'waitConfirmedOut',
    components: {
      addit,
      confive,
      remolift,
      carview,
      reconfirm,
      rejectconfirm
    },
    inject:['reload'],//注入reload方法
    data(){
      return {
        carVinType:1,
        rejectConfirmShow:false,
        rejectEnterId:'',
        reconfirmShow:false,//同意二次确认
        model:{
          applyStart:'',//申请时间范围（开始）
          applyEnd:'',//申请时间范围（结束）
          carNumber:'',//车牌号码
          pageSize:10,//每页行数
          pageNo:1,
          vin:'',
          menuId:303,//菜单ID (302 待申请放行303 待审核放行 304待出场）
        },
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
        title:'',//同意或者驳回
        carNumShow:true,//搜索汽车号码还是vin码
        carNumVin:'',//有carNumber就显示carNumber，有vin就显示vin
        storeShow:false,//所属门店显示
        handleShow:false,//只有放行人才能进行操作
        enShow:false,//所属企业显示状态
        carShow:false,
        enterState:false,//进场时间默认还是重新选择
        enterId:'',
        enterId1:'',
        acceptEnterId:'',//操作--同意传的enterId
        title:'',
        addShow:false,//新增远程抬杆显示
        remoteliftShow:false,
        confirmLeave:false,
        popUp:false,
        whiteDisInfors:[],//列表
      }
    },
    watch:{
      carVinType(newVal,oldVal){
        if(newVal==1){
          this.carNumShow=true;
          this.model.vin='';
          this.model.carNumber='';
        }else if(newVal==2){
          this.carNumShow=false;
          this.model.carNumber='';
          this.model.vin='';
        }
      },
    },
    mounted() {
      // var today=new Date();
      // this.searchModel.applyStart=this.AppUtils.formatDate(today);
      var roleId=this.$store.state.roleId;
      if(roleId==1){
        this.enShow=true;
        this.storeShow=true;
      }else{
        this.enShow=false;
      }
      if(roleId==2){
        this.storeShow=true;
        this.enShow=false;
      }
      if(roleId==3||roleId==4||roleId==5){
        this.storeShow=false;
        this.enShow=false;
      }
      if(roleId=='3'||roleId=='4'||roleId=='6'||roleId=='7'||roleId=='8'||roleId=='10'||roleId=='11'||roleId=='12'){
        this.handleShow=true;
      }
      this.fetchData();//初始获取信息
    },
    methods: {
      hideRejectReconfirm(){
        this.rejectConfirmShow=false;
      },
      hideReconfirm(){
        this.reconfirmShow=false;
      },
      closeCar(){
        this.carShow=false;
      },
      showCar(){
        this.carShow=true;
      },
      enterChange(){
        this.enterState=true;
      },
      searchInfo(){
        /*if(!this.enterState){
          var stamp=Date.parse(new Date(this.searchModel.applyStart+' 00:00:00'));
          this.model.applyStart=stamp;
          this.$store.state.applyStart=stamp;
          if(this.searchModel.applyEnd){
            var applyEndStam=this.searchModel.applyEnd.getTime();
            this.$store.state.applyEnd=applyEndStam+86400000;
            this.model.applyEnd=applyEndStam+86400000;//出来两天的数据
            if(this.model.applyStart<=applyEndStam){
              var obj={};
              for(var key in this.model){
                obj[key]=this.model[key];
              }
              delete obj['pageNo'];
              this.getDisInfo(obj);
              this.model.applyStart='';
            }else{
              this.AppUtils.alert('申请日期终止时间不应早于起始时间')
            }
          }else {
            this.model.applyEnd=null;
            var obj={};
            for(var key in this.model){
              obj[key]=this.model[key];
            }
            delete obj['pageNo'];
            this.getDisInfo(obj);
            this.model.applyStart='';
          }
         }else{*/
          if(this.model.applyStart) {
            if(Object.prototype.toString.call(this.model.applyStart)=="[object Date]"){
              var applyStart = this.model.applyStart.getTime();
              this.model.applyStart = applyStart;
            }
            if(this.model.applyEnd) {
              if(Object.prototype.toString.call(this.model.applyEnd)=="[object Date]") {
                var applyEndStam = this.model.applyEnd.getTime();
                this.model.applyEnd = applyEndStam;//出来两天的数据
              }
              if (this.model.applyStart <= this.model.applyEnd) {
                var obj = {};
                for (var key in this.model) {
                  obj[key] = this.model[key];
                }
                if(obj['applyEnd']){
                  obj['applyEnd']=obj['applyEnd']+86400000;//出来两天的数据
                }
                delete obj['pageNo'];
                this.getDisInfo(obj);
              } else {
                this.AppUtils.alert('申请日期终止时间不应早于起始时间')
              }
            } else {
              this.model.applyEnd = null;
              var obj = {};
              for (var key in this.model) {
                obj[key] = this.model[key];
              }
              delete obj['pageNo'];
              this.getDisInfo(obj);
            }
          }else{
            this.model.applyStart =null;
            if (this.model.applyEnd) {
              if(Object.prototype.toString.call(this.model.applyEnd)=="[object Date]") {
                var applyEndStam = this.model.applyEnd.getTime();
                this.model.applyEnd = applyEndStam;//出来两天的数据
              }
              var obj = {};
              for (var key in this.model) {
                obj[key] = this.model[key];
              }
              if(obj['applyEnd']){
                obj['applyEnd']=obj['applyEnd']+86400000;//出来两天的数据
              }
              delete obj['pageNo'];
              this.getDisInfo(obj);
            } else {
              this.model.applyEnd = null;
              var obj = {};
              for (var key in this.model) {
                obj[key] = this.model[key];
              }
              delete obj['pageNo'];
              this.getDisInfo(obj);
            }
          }
        // }
      },
      //查看图片
      previewImg(url) {
        // this.previewImgUrl = url;
        this.$refs.preview.showPreviewImg(url);
      },
      accept(arg){
        this.reconfirmShow=true;
        this.title='确认放行';
        this.acceptEnterId=arg+'';
      },
      reject(arg){
        this.rejectConfirmShow=true;
        this.title='确认驳回放行申请？';
        this.rejectEnterId=arg+'';
      },
      relod(){
        this.$message.success('保存成功');
        this.reload();
      },
      // 新增
      add(){
        this.popUp = true
        this.title = '新增'
      },
      redact(arg){
        console.log(arg);
        this.popUp = true;
        this.title = '编辑';
        if(arg){
          this.enterId=arg+'';
        }
        this.$refs.waitAddEdit.getDetail(this.enterId);
      },
      //放行
      edit(arg,arg1){
        this.confirmLeave=true;
        if(arg){
          this.enterId1=arg+'';
        }
        this.$refs.waitLeaveEdit.getbusinessType(arg1);
      },
      remoteLift(){
        this.remoteliftShow=true
      },
      changeAddEdit(){
        this.popUp = false
      },
      changeConfirm(){
        this.confirmLeave=false
      },
      changeRemote(){
        this.remoteliftShow=false
      },
      fetchData(args){
        if(args){
          if(args.page){//分页
            this.model.pageNo=args.page;//当前页数
            this.model.pageSize=args.pageSize;//每页显示多少条
          }
        }
        this.getDisInfo(this.model);
      },
      getDisInfo(arg){
        this.$axios.post('/record/entry/list',arg).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data) {
            this.whiteDisInfors=data.value.dataList;
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
  .redact span{
    margin-left: 0px!important;
    width: 50%;
    text-align: center;
    color: #FF615B;
  }
</style>
