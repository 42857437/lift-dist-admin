<template>
  <div class="main_wrap">
    <div class="search-box bg_fff">
      <form>
        <div class="selectWrap font12">
          <div class="column inlineBlock">
            <span class="mr12">出场日期</span>
            <el-date-picker
              v-model="model.outStart"
              type="date"
              format="yyyy-MM-dd"
              placeholder="起始时间"
              class="activity-edit-date date-box"
              @change="enterChange"
            >
            </el-date-picker>
            <i> 至 </i>
            <el-date-picker
              v-model="model.outEnd"
              type="date"
              format="yyyy-MM-dd"
              placeholder="终止时间"
              class="activity-edit-date date-box">
            </el-date-picker>
            <span class="enterpriseName">门店</span>
            <el-select class="el_box ml10" v-model="model.outStoreId" clearable filterable placeholder="请选择门店名称">
              <el-option
                v-for="item in storeLists"
                :key="item.id"
                :label="item.storeName"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="enterpriseName">部门</span>
            <el-select class="el_box ml10" v-model="model.outDepartmentId"  clearable filterable placeholder="请输入部门名称">
              <el-option
                v-for="item in departLists"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="enterpriseName">确认放行人</span>
            <el-input class="el_box inp" placeholder="请输入确认放行人" v-model="model.outUserName"></el-input>
            <button class="serachBtn mr17" type="submit" @click.prevent="searchInfo">搜索</button>
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
              <th>VIN码</th>
              <th>出场时间</th>
              <th>出场照片</th>
              <th>确认放行人</th>
              <th>放行部门</th>
              <th>放行门店</th>
              <th v-if="enShow">所属企业</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(unlicensedInfor,index) in unlicensedInfors" :key="index">
              <td>{{index+1}}</td>
              <td>{{unlicensedInfor.vin}}</td>
              <td>{{unlicensedInfor.outTime| dateFormatToSecond}}</td>
              <td class="watch" @click="previewImg(unlicensedInfor.outPhoto)">查看</td>
              <td>{{unlicensedInfor.outUserName}}</td>
              <td>{{unlicensedInfor.outDepartmentName}}</td>
              <td>{{unlicensedInfor.outStoreName}}</td>
              <td v-if="enShow">{{unlicensedInfor.enterpriseName}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" v-if="unlicensedInfors.length">
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
    name: 'unlicensed-car-out',
    components: {},
    data(){
      return {
        model:{
          outStart:'',//出场时间范围（开始）
          outEnd:'',//出场时间范围（结束）
          outStoreId:'',//放行门店ID
          outDepartmentId:'',//放行部门ID
          outUserName:'',//放行人
          pageSize:10,//每页行数
          pageNo:1,
          menuId:306,//菜单ID (305 白名单出场 306无牌出场 307 异常出场）
        },
        enShow:false,//所属企业显示状态
        enterState:false,//出场时间默认还是重新选择
        unlicensedInfors:[],//列表数据
        storeLists: [],//搜索-门店
        departLists: [],//搜索-部门
      }
    },
    mounted() {
      this.fetchData();//初始获取信息
      this.getStoreList();//搜索部分门店
      this.getDepartList();//搜索部分部门
      // var today=new Date();
      // this.model.outStart=this.AppUtils.formatDate(today);
      if(this.$store.state.roleId==1){
        this.enShow=true;
      }else{
        this.enShow=false;
      }
    },
    methods: {
      searchInfo() {
        /*if(!this.enterState){
          var stamp=Date.parse(new Date(this.model.outStart+' 00:00:00'));
          this.searchModel.outStart=stamp;
          if(this.model.outEnd){
            var entryEndStam=this.model.outEnd.getTime();
            this.searchModel.outEnd=entryEndStam+86400000;//出来两天的数据
            if(this.searchModel.outStart<=entryEndStam){
              var obj={};
              for(var key in this.searchModel){
                obj[key]=this.searchModel[key];
              }
              this.getUnliInfo(obj);
              this.searchModel.outStart='';
            }else{
              this.AppUtils.alert('出场日期终止时间不应早于起始时间')
            }
          }else {
            this.searchModel.outEnd=null;
            var obj={};
            for(var key in this.searchModel){
              obj[key]=this.searchModel[key];
            }
            this.getUnliInfo(obj);
            this.searchModel.outStart='';
          }
        }else{*/
          if(this.model.outStart){
            if(Object.prototype.toString.call(this.model.outStart)=="[object Date]"){
              var start= this.model.outStart.getTime();
              this.model.outStart=start;
            }
            if(this.model.outEnd){
              if(Object.prototype.toString.call(this.model.outEnd)=="[object Date]") {
                var entryEndStam= this.model.outEnd.getTime();
                this.model.outEnd=entryEndStam;//出来两天的数据
              }
              if(this.model.outStart<=this.model.outEnd){
                var obj={};
                for(var key in this.model){
                  obj[key]=this.model[key];
                }
                if(obj['outEnd']){
                  obj['outEnd']=obj['outEnd']+86400000;//出来两天的数据
                }
                delete obj['pageNo'];
                this.getUnliInfo(obj);
              }else{
                this.AppUtils.alert('出场日期终止时间不应早于起始时间')
              }
            }else {
              this.model.outEnd=null;
              var obj={};
              for(var key in this.model){
                obj[key]=this.model[key];
              }
              delete obj['pageNo'];
              this.getUnliInfo(obj);
            }
          }else{
            this.model.outStart=null;
            if(this.model.outEnd){
              if(Object.prototype.toString.call(this.model.outEnd)=="[object Date]") {
                var entryEndStam= this.model.outEnd.getTime();
                this.model.outEnd=entryEndStam;//出来两天的数据
              }
              var obj={};
              for(var key in this.model){
                obj[key]=this.model[key];
              }
              if(obj['outEnd']){
                obj['outEnd']=obj['outEnd']+86400000;//出来两天的数据
              }
              delete obj['pageNo'];
              this.getUnliInfo(obj);
            }else {
              this.model.outEnd=null;
              var obj={};
              for(var key in this.model){
                obj[key]=this.model[key];
              }
              delete obj['pageNo'];
              this.getUnliInfo(obj);
            }
          }
        // }
      },
        //查看图片
      previewImg(url) {
        // this.previewImgUrl = url;
        this.$refs.preview.showPreviewImg(url);
      },
      //搜索-部门列表
      getDepartList(){
        this.$axios.get('/permission/department/all/1').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data.value){
            this.departLists= data.value;
            this.departLists.unshift({id:'',name:'全部部门'})
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
        this.getUnliInfo(this.model);
      },
      getUnliInfo(arg){
        this.$axios.post('/record/out/list',arg).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data) {
            this.unlicensedInfors=data.value.dataList;
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
  @import '../../../assets/css/base.css';
  .inp{
    width: 192px;
    margin-left: 10px;
  }
  .column i{
    margin-left: 10px;
    margin-right: 10px;
  }
</style>
