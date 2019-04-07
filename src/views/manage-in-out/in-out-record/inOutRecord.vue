<template>
  <div class="main_wrap">
    <div class="search-box bg_fff">
      <form>
        <div class="selectWrap font12">
          <div class="column inlineBlock">
            <span class="mr12">进场日期</span>
            <el-date-picker
              v-model="model.entryStart"
              type="date"
              format="yyyy-MM-dd"
              placeholder="起始时间"
              class="activity-edit-date date-box"
              @change="enterChange"
            >
            </el-date-picker>
            <i> 至 </i>
            <el-date-picker
              v-model="model.entryEnd"
              type="date"
              format="yyyy-MM-dd"
              placeholder="终止时间"
              class="activity-edit-date date-box">
            </el-date-picker>
            <span class="mr12">放行日期</span>
            <el-date-picker
              v-model="model.confirmStart"
              type="date"
              format="yyyy-MM-dd"
              placeholder="起始时间"
              class="activity-edit-date date-box">
            </el-date-picker>
            <i> 至 </i>
            <el-date-picker
              v-model="model.confirmEnd"
              type="date"
              format="yyyy-MM-dd"
              placeholder="终止时间"
              class="activity-edit-date date-box">
            </el-date-picker>
            <span class="mr12">出场日期</span>
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
            <el-checkbox v-model="checked">仅看未出场</el-checkbox>
          </div>
          <div class="column inlineBlock">
            <span class="enterpriseName">业务类型</span>
            <el-select class="el_box ml10" v-model="model.businessType" clearable filterable  placeholder="请选择业务类型">
              <el-option
                v-for="item in businessTypes"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
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
            <el-select class="el_box ml10" v-model="model.outDepartmentId" clearable filterable placeholder="请输入部门名称">
              <el-option
                v-for="item in departLists"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="enterpriseName">申请放行人</span>
            <el-input class="el_box inp" placeholder="请输入申请放行人" v-model="model.applyUserName"></el-input>
            <button class="serachBtn mr17" type="submit" @click.prevent="searchInfo">搜索</button>
            <button class="serachBtn mr17 ml0" @click.prevent="exportData">导出</button>
          </div>
        </div>
      </form>
    </div>
    <div class="table_wrap">
      <div class="table_layout bg_fff">
        <div class="table_scroll">
          <table class="table textAlignL">
            <thead>
            <tr>
              <th>序号</th>
              <th>车牌号码/VIN码</th>
              <th>停留时长</th>
              <th>进场时间</th>
              <th>放行时间</th>
              <th>出场时间</th>
              <th>申请放行人</th>
              <th>审核放行人</th>
              <th>确认放行人</th>
              <th>放行部门</th>
              <th>放行门店</th>
              <th v-if="enShow">所属企业</th>
              <th>进场摄像头</th>
              <th>进场照片</th>
              <th>出场摄像头</th>
              <th>出场照片</th>
              <th>业务类型</th>
              <th>放行原因</th>
              <th>出场抬杆类型</th>
              <th>出场抬杆原因</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(inOutInfor,index) in inOutInfors" :key="index">
              <td>{{index+1}}</td>
              <td>{{inOutInfor.carNumber!=''?inOutInfor.carNumber:inOutInfor.vin}}</td>
              <td>{{inOutInfor.residenceTime | formatTimeShow}}</td>
              <td>{{inOutInfor.entryTime | dateFormatToSecond}}</td>
              <td>{{inOutInfor.confirmTime | dateFormatToSecond}}</td>
              <td>{{inOutInfor.outTime | dateFormatToSecond}}</td>
              <td>{{inOutInfor.applyUserName}}</td>
              <td>{{inOutInfor.confirmUserName}}</td>
              <td>{{inOutInfor.outUserName}}</td>
              <td>{{inOutInfor.outDepartmentName}}</td>
              <td>{{inOutInfor.outStoreName}}</td>
              <td v-if="enShow">{{inOutInfor.enterpriseName}}</td>
              <td>{{inOutInfor.entryCameraName}}</td>
              <td class="watch" @click="previewImg(inOutInfor.entryPhoto)">查看</td>
              <td>{{inOutInfor.outCameraName}}</td>
              <td class="watch" @click="previewImg(inOutInfor.outPhoto)">查看</td>
              <td>{{inOutInfor.businessType=='0'?'行政':(inOutInfor.businessType=='1'?'新车销售':(inOutInfor.businessType=='2'?'售后':''))}}</td>
              <td>{{inOutInfor.outReasonName}}</td>
              <td>{{inOutInfor.liftingType=='0'?'自动抬杆':(inOutInfor.liftingType=='1'?'远程抬杆':'')}}</td>
              <td>{{inOutInfor.liftingReason=='0'?'正常出场':(inOutInfor.liftingReason=='1'?'系统故障':(inOutInfor.liftingReason=='2'?'异常出场':(inOutInfor.liftingReason=='3'?'无牌出场':'')))}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" v-if="inOutInfors.length">
          <nt-pagination ref="child" @fetchData="fetchData"></nt-pagination>
        </div>
        <transition name="fade">
          <nt-preview-image ref="preview"></nt-preview-image>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'in-out-record',
    components: {},
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
        carNumShow:true,//搜索汽车号码还是vin码
        carVinType:1,
        model:{
          entryStart:'',//进场时间范围（开始）
          entryEnd:'',//进场时间范围（结束）
          confirmStart:'',//确认放行时间范围（开始）
          confirmEnd:'',//确认放行时间范围（结束）
          outStart:'',//出场时间范围（开始）
          outEnd:'',//出场时间范围（结束）
          businessType:'',//业务类型
          dnp:'',//为'1'时查看未出场
          carNumber:'',//车牌号码
          outStoreId:'',//放行门店ID
          outDepartmentId:'',//放行部门ID
          applyUserName:'',//申请放行人姓名
          vin:'',
          pageSize:10,//每页行数
          pageNo:1,
        },
        checked:false,//是否选中仅看未出场
        enShow:false,//所属企业显示状态
        inOutInfors:[],//列表数据
        enterState:false,//进场时间默认还是重新选择
        exportModel:{
          entryStart:'',//进场时间范围（开始）
          entryEnd:'',//进场时间范围（结束）
          confirmStart:'',//确认放行时间范围（开始）
          confirmEnd:'',//确认放行时间范围（结束）
          outStart:'',//出场时间范围（开始）
          outEnd:'',//出场时间范围（结束）
          businessType:'',//业务类型
          carNumber:'',//车牌号码
          vin:'',
          outStoreId:'',//放行门店ID
          outDepartmentId:'',//放行部门ID
          applyUserName:'',//申请放心人姓名
          pageSize:10,//每页行数
          dnp:'',//为'1'时查看未出场
        },
        storeLists: [],//搜索-门店
        departLists: [],//搜索--部门
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
      }
    },
    watch:{
      checked(newVal,oldVal){
        if(newVal){
          this.model.dnp='1';//仅查看未出场
        }else{
          this.model.dnp='';
        }
      },
      carVinType(newVal,oldVal){
        if(newVal==1){
          this.carNumShow=true;
          this.model.carNumber='';
          this.model.vin='';
        }else if(newVal==2){
          this.carNumShow=false;
          this.model.carNumber='';
          this.model.vin='';
        }
      },
    },
    mounted() {
      this.getStoreList();//搜索-门店
      this.getDepartList();//搜索-部门
      this.fetchData();//初始获取信息
      // var today=new Date();
      // this.model.entryStart=this.AppUtils.formatDate(today);
      if(this.$store.state.roleId==1){
        this.enShow=true;
      }else{
        this.enShow=false;
      }
    },
    methods: {
      exportData(){
        this.$axios.post('/record/entry/out/export',this.exportModel,{responseType:'arraybuffer'}).then(res => {
          let fileName = '进出场记录列表.xlsx'
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
      searchInfo(){
        /*if(!this.enterState){
          //进场时间
          var start=Date.parse(new Date(this.model.entryStart+' 00:00:00'));;
          this.$store.state.entryStart=start;
          this.searchModel.entryStart=start;
          //放行日期填写情况开始
          if(this.model.confirmStart){
            var cStart=this.model.confirmStart.getTime();
            this.$store.state.confirmStart=cStart;
            this.searchModel.confirmStart=cStart;
            if(this.model.confirmEnd){
              var cEnd=this.model.confirmEnd.getTime();
              if(this.searchModel.confirmStart<=cEnd){
                this.$store.state.confirmEnd=cEnd+86400000;
                this.searchModel.confirmEnd=cEnd+86400000;//出来两天的数据;
              }else{
                this.AppUtils.alert('放行日期终止时间不应早于起始时间')
              }
            }else{
              this.searchModel.confirmEnd=null;
            }
          }else{
            this.searchModel.confirmStart=null;
            if(this.model.confirmEnd){
              var cEnd=this.model.confirmEnd.getTime();
              this.$store.state.confirmEnd=cEnd+86400000;
              this.searchModel.confirmEnd=cEnd+86400000;//出来两天的数据
            }else{
              this.searchModel.confirmEnd=null;
            }
          }
          //放行日期填写情况结束
          //出场日期填写情况开始
          if(this.model.outStart){
            var cStart=this.model.outStart.getTime();
            this.searchModel.outStart=cStart;
            this.$store.state.outStart=cStart;
            if(this.model.outEnd){
              var cEnd=this.model.outEnd.getTime();
              if(this.searchModel.outStart<=cEnd){
                this.$store.state.outEnd=cEnd+86400000;
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
              this.$store.state.outEnd=cEnd+86400000;
              this.searchModel.outEnd=cEnd+86400000;//出来两天的数据
            }else{
              this.searchModel.outEnd=null;
            }
          }
          //出场日期填写情况结束
          if(this.model.entryEnd){
            var entryEndStam=this.model.entryEnd.getTime();
            this.$store.state.entryEnd=entryEndStam+86400000;
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
        }else{*/
          if(this.model.entryStart){
            if(Object.prototype.toString.call(this.model.entryStart)=="[object Date]"){
              var start= this.model.entryStart.getTime();
              this.model.entryStart=start;
            }
                //放行日期填写情况开始
                 if(this.model.confirmStart){
                   if(Object.prototype.toString.call(this.model.confirmStart)=="[object Date]"){
                     var cStart= this.model.confirmStart.getTime();
                     this.model.confirmStart=cStart;
                   }
                    if(this.model.confirmEnd){
                      if(Object.prototype.toString.call(this.model.confirmEnd)=="[object Date]") {
                        var cEnd= this.model.confirmEnd.getTime();
                        this.model.confirmEnd=cEnd;//出来两天的数据
                      }
                      if(this.model.confirmStart<=this.model.confirmEnd){
                      }else{
                        this.AppUtils.alert('放行日期终止时间不应早于起始时间')
                      }
                    }else{
                      this.model.confirmEnd=null;
                    }
                 }else{
                   this.model.confirmStart=null;
                   if(this.model.confirmEnd){
                     if(Object.prototype.toString.call(this.model.confirmEnd)=="[object Date]") {
                       var cEnd= this.model.confirmEnd.getTime();
                       this.model.confirmEnd=cEnd;//出来两天的数据
                     }
                   }else{
                     this.model.confirmEnd=null;
                   }
                 }
                //放行日期填写情况结束
                //出场日期填写情况开始
                if(this.model.outStart){
                  if(Object.prototype.toString.call(this.model.outStart)=="[object Date]"){
                    var  cStart= this.model.outStart.getTime();
                    this.model.outStart=cStart;
                  }
                  if(this.model.outEnd){
                    // var cEnd=this.model.outEnd.getTime();
                    if(Object.prototype.toString.call(this.model.outEnd)=="[object Date]") {
                      var cEnd= this.model.outEnd.getTime();
                      this.model.outEnd=cEnd;//出来两天的数据
                    }
                    if(this.model.outStart<=this.model.outEnd){
                    }else{
                      this.AppUtils.alert('出场日期终止时间不应早于起始时间')
                    }
                  }else{
                    this.model.outEnd=null;
                  }
                }else{
                  this.model.outStart=null;
                  if(this.model.outEnd){
                    if(Object.prototype.toString.call(this.model.outEnd)=="[object Date]") {
                      var cEnd= this.model.outEnd.getTime();
                      this.model.outEnd=cEnd;//出来两天的数据
                    }
                  }else{
                    this.model.outEnd=null;
                  }
                }
                //出场日期填写情况结束
                if(this.model.entryEnd){
                  if(Object.prototype.toString.call(this.model.entryEnd)=="[object Date]") {
                    var entryEndStam= this.model.entryEnd.getTime();
                    this.model.entryEnd=entryEndStam;//出来两天的数据
                  }
                  if(this.model.entryStart<=this.model.entryEnd){
                    var obj={};
                    for(var key in this.model){
                      obj[key]=this.model[key];
                    }
                    delete obj['pageNo'];
                    //导出部分使用
                    if(obj['confirmEnd']){
                      obj['confirmEnd']=obj['confirmEnd']+86400000;//出来两天的数据
                    }
                    if(obj['outEnd']){
                      obj['outEnd']=obj['outEnd']+86400000;//出来两天的数据
                    }
                    if(obj['entryEnd']){
                      obj['entryEnd']=obj['entryEnd']+86400000;//出来两天的数据
                    }
                    for(var key in obj){
                      this.exportModel[key]=obj[key]
                    }
                    this.getInOutInfo(obj);
                  }else{
                    this.AppUtils.alert('进场日期终止时间不应早于起始时间')
                  }
                }else {
                 this.model.entryEnd=null;
                  var obj={};
                  for(var key in this.model){
                    obj[key]=this.model[key];
                  }
                  if(obj['confirmEnd']){
                    obj['confirmEnd']=obj['confirmEnd']+86400000;//出来两天的数据
                  }
                  if(obj['outEnd']){
                    obj['outEnd']=obj['outEnd']+86400000;//出来两天的数据
                  }
                  if(obj['entryEnd']){
                    obj['entryEnd']=obj['entryEnd']+86400000;//出来两天的数据
                  }
                  delete obj['pageNo'];
                  //导出部分使用
                  for(var key in obj){
                    this.exportModel[key]=obj[key]
                  }
                  this.getInOutInfo(obj);
                }
              }else{
                  //进场时间
                  this.model.entryStart=null;
                  //放行日期填写情况开始
                  if(this.model.confirmStart){
                    if(Object.prototype.toString.call(this.model.confirmStart)=="[object Date]"){
                      var cStart= this.model.confirmStart.getTime();
                      this.model.confirmStart=cStart;
                    }
                    if(this.model.confirmEnd){
                      if(Object.prototype.toString.call(this.model.confirmEnd)=="[object Date]") {
                        var cEnd= this.model.confirmEnd.getTime();
                        this.model.confirmEnd=cEnd;//出来两天的数据
                      }
                      if(this.model.confirmStart<=this.model.confirmEnd){
                      }else{
                        this.AppUtils.alert('放行日期终止时间不应早于起始时间')
                      }
                    }else{
                      this.model.confirmEnd=null;
                    }
                  }else{
                    this.model.confirmStart=null;
                    if(this.model.confirmEnd){
                      if(Object.prototype.toString.call(this.model.confirmEnd)=="[object Date]") {
                        var cEnd= this.model.confirmEnd.getTime();
                        this.model.confirmEnd=cEnd;//出来两天的数据
                      }
                    }else{
                      this.model.confirmEnd=null;
                    }
                  }
                  //放行日期填写情况结束
                  //出场日期填写情况开始
                  if(this.model.outStart){
                    if(Object.prototype.toString.call(this.model.outStart)=="[object Date]"){
                      var  cStart= this.model.outStart.getTime();
                      this.model.outStart=cStart;
                    }
                    if(this.model.outEnd){
                      // var cEnd=this.model.outEnd.getTime();
                      if(Object.prototype.toString.call(this.model.outEnd)=="[object Date]") {
                        var cEnd= this.model.outEnd.getTime();
                        this.model.outEnd=cEnd;//出来两天的数据
                      }
                      if(this.model.outStart<=this.model.outEnd){
                      }else{
                        this.AppUtils.alert('出场日期终止时间不应早于起始时间')
                      }
                    }else{
                      this.model.outEnd=null;
                    }
                  }else{
                    this.model.outStart=null;
                    if(this.model.outEnd){
                      if(Object.prototype.toString.call(this.model.outEnd)=="[object Date]") {
                        var cEnd= this.model.outEnd.getTime();
                        this.model.outEnd=cEnd;//出来两天的数据
                      }
                    }else{
                      this.model.outEnd=null;
                    }
                  }
                  //出场日期填写情况结束
                  if(this.model.entryEnd){
                    if(Object.prototype.toString.call(this.model.entryEnd)=="[object Date]") {
                      var entryEndStam= this.model.entryEnd.getTime();
                      this.model.entryEnd=entryEndStam;//出来两天的数据
                    }
                    var obj={};
                    for(var key in this.model) {
                      obj[key] = this.model[key];
                    }
                    if(obj['confirmEnd']){
                      obj['confirmEnd']=obj['confirmEnd']+86400000;//出来两天的数据
                    }
                    if(obj['outEnd']){
                      obj['outEnd']=obj['outEnd']+86400000;//出来两天的数据
                    }
                    if(obj['entryEnd']){
                      obj['entryEnd']=obj['entryEnd']+86400000;//出来两天的数据
                    }
                    delete obj['pageNo'];
                    //导出部分使用
                    for(var key in obj){
                      this.exportModel[key]=obj[key]
                    }
                    this.getInOutInfo(obj);
                  }else {
                    this.model.entryEnd=null;
                    var obj={};
                    for(var key in this.model){
                      obj[key]=this.model[key];
                    }
                    if(obj['confirmEnd']){
                      obj['confirmEnd']=obj['confirmEnd']+86400000;//出来两天的数据
                    }
                    if(obj['outEnd']){
                      obj['outEnd']=obj['outEnd']+86400000;//出来两天的数据
                    }
                    if(obj['entryEnd']){
                      obj['entryEnd']=obj['entryEnd']+86400000;//出来两天的数据
                    }
                    //导出部分使用
                    for(var key in obj){
                      this.exportModel[key]=obj[key]
                    }
                    delete obj['pageNo'];
                    this.getInOutInfo(obj);
                  }
              }
          // }
      },
      //查看图片
      previewImg(url) {
        // this.previewImgUrl = url;
        this.$refs.preview.showPreviewImg(url);
      },
      enterChange(){
        this.enterState=true;
      },
      fetchData(args){
        if(args){
          if(args.page){//分页
            this.model.pageNo=args.page;//当前页数
            this.model.pageSize=args.pageSize;//每页显示多少条
          }
        }
        this.getInOutInfo(this.model);
      },
      getInOutInfo(arg){
        this.$axios.post('/record/entry/out/list',arg).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data) {
            this.inOutInfors=data.value.dataList;
          }
          //初始化分页
          //initPage 参数：总条数 当前页数 每页多少条
          if(data.value.dataList.length){
            this.$nextTick(()=>{
              this.$refs.child.initPage(data.value.totalNum,this.model.pageNo,this.model.pageSize)
            })
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
