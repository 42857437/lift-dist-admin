<template>
  <div class="main_wrap">
    <div class="search-box bg_fff">
      <form>
        <div class="selectWrap font12">
          <div class="column inlineBlock">
            <span class="mr12">出场日期</span>
            <el-date-picker
              v-model="searchModel.outStart"
              type="date"
              format="yyyy-MM-dd"
              placeholder="起始时间"
              class="activity-edit-date date-box"
              @change="enterChange"
            >
            </el-date-picker>
            <i> 至 </i>
            <el-date-picker
              v-model="searchModel.outEnd"
              type="date"
              format="yyyy-MM-dd"
              placeholder="终止时间"
              class="activity-edit-date date-box">
            </el-date-picker>
            <span class="enterpriseName">车牌号码</span>
            <el-input class="el_box inp" placeholder="请输入车牌号码" v-model="searchModel.carNumber"></el-input>
          </div>
          <div class="column inlineBlock">
            <span class="enterpriseName">门店</span>
            <el-select class="el_box ml10" v-model="searchModel.outStoreId" clearable filterable placeholder="请选择门店名称">
              <el-option
                v-for="item in storeLists"
                :key="item.id"
                :label="item.storeName"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="enterpriseName">部门</span>
            <el-select class="el_box ml10" v-model="searchModel.outDepartmentId" clearable filterable  placeholder="请输入部门名称">
              <el-option
                v-for="item in departLists"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="enterpriseName" style="display: none">放行人</span>
            <el-input class="el_box inp" placeholder="请输入放行人" v-model="searchModel.outUserName" style="display: none"></el-input>
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
              <th>序号</th>
              <th>车牌号码</th>
              <th>出场时间</th>
              <th>出场摄像头</th>
              <th>出场照片</th>
              <th>放行门店</th>
              <th v-if="enShow">所属企业</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(whiteListInfor,index) in whiteListInfors" :key="index">
              <td>{{index+1}}</td>
              <td>{{whiteListInfor.carNumber}}</td>
              <td>{{whiteListInfor.outTime| dateFormatToSecond}}</td>
              <td>{{whiteListInfor.cameraName}}</td>
              <td class="watch" @click="previewImg(whiteListInfor.outPhoto)">查看</td>
              <td>{{whiteListInfor.outStoreName}}</td>
              <td v-if="enShow">{{whiteListInfor.enterpriseName}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" v-if="whiteListInfors.length">
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
    name: 'wait-list-car-out',
    components: {},
    data(){
      return {
        enShow:false,//所属企业显示状态
        whiteListInfors:[],//列表数据
        enterState:false,//出场时间默认还是重新选择
        searchModel:{
          outStart:'',//出场时间范围（开始）
          outEnd:'',//出场时间范围（结束）
          carNumber:'',//车牌号
          outStoreId:'',//放行门店ID
          outDepartmentId:'',//放行部门ID
          outUserName:'',//放行人
          pageSize:10,//每页行数
          pageNo:1,
          menuId:305,//菜单ID (305 白名单出场 306无牌出场 307 异常出场）
        },
        storeLists: [],//搜索-门店
        departLists: [],//搜索-部门
      }
    },
    mounted() {
      this.getStoreList();//搜索部分门店
      this.getDepartList();//搜索部分部门
      this.fetchData();//初始获取信息
      // var today=new Date();
      // this.model.outStart=this.AppUtils.formatDate(today);
      if(this.$store.state.roleId==1){
        this.enShow=true;
      }else{
        this.enShow=false;
      }
    },
    methods: {
      enterChange(){
        this.enterState=true;
      },
      //搜索
      searchInfo(){
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
              this.getWhiteInfo(obj);
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
            this.getWhiteInfo(obj);
            this.searchModel.outStart='';
          }
        }else{*/
          if(this.searchModel.outStart){
            if(Object.prototype.toString.call(this.searchModel.outStart)=="[object Date]"){
              var start= this.searchModel.outStart.getTime();
              this.searchModel.outStart=start;
            }
            if(this.searchModel.outEnd){
              if(Object.prototype.toString.call(this.searchModel.outEnd)=="[object Date]") {
                var entryEndStam= this.searchModel.outEnd.getTime();
                this.searchModel.outEnd=entryEndStam;//出来两天的数据
              }
              if(this.searchModel.outStart<=this.searchModel.outEnd){
                var obj={};
                for(var key in this.searchModel){
                  obj[key]=this.searchModel[key];
                }
                if(obj['outEnd']){
                  obj['outEnd']=obj['outEnd']+86400000;//出来两天的数据
                }
                delete obj['pageNo'];
                this.getWhiteInfo(obj);
              }else{
                this.AppUtils.alert('出场日期终止时间不应早于起始时间')
              }
            }else {
              this.searchModel.outEnd=null;
              var obj={};
              for(var key in this.searchModel){
                obj[key]=this.searchModel[key];
              }
              delete obj['pageNo'];
              this.getWhiteInfo(obj);
            }
          }else{
            this.searchModel.outStart=null;
            if(this.searchModel.outEnd){
              if(Object.prototype.toString.call(this.searchModel.outEnd)=="[object Date]") {
                var entryEndStam= this.searchModel.outEnd.getTime();
                this.searchModel.outEnd=entryEndStam;//出来两天的数据
              }
              var obj={};
              for(var key in this.searchModel){
                obj[key]=this.searchModel[key];
              }
              if(obj['outEnd']){
                obj['outEnd']=obj['outEnd']+86400000;//出来两天的数据
              }
              delete obj['pageNo'];
              this.getWhiteInfo(obj);
            }else {
              this.searchModel.outEnd=null;
              var obj={};
              for(var key in this.searchModel){
                obj[key]=this.searchModel[key];
              }
              delete obj['pageNo'];
              this.getWhiteInfo(obj);
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
      fetchData(args){
        if(args){
          if(args.page){//分页
            this.searchModel.pageNo=args.page;//当前页数
            this.searchModel.pageSize=args.pageSize;//每页显示多少条
          }
        }
        this.getWhiteInfo(this.searchModel);
      },
      getWhiteInfo(arg){
        this.$axios.post('/record/out/list',arg).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data) {
            this.whiteListInfors=data.value.dataList;
          }
          //初始化分页
          //initPage 参数：总条数 当前页数 每页多少条
          if(data.value.dataList.length){
            this.$nextTick(()=>{
              this.$refs.child.initPage(data.value.totalNum,this.searchModel.pageNo,this.searchModel.pageSize)
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
</style>
