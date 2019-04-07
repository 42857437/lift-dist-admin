<template>
  <div class="main_wrap">
    <div class="search-box bg_fff">
      <form>
        <div class="selectWrap">
          <div class="column inlineBlock">
            <span class="enterpriseName">门店</span>
            <el-select class="el_box ml10" v-model="model.storeId" clearable filterable placeholder="请选择门店名称">
              <el-option
                v-for="item in storeLists"
                :key="item.id"
                :label="item.storeName"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="enterpriseName">部门</span>
            <el-select class="el_box ml10" v-model="model.departmentId" clearable filterable placeholder="请输入部门名称">
              <el-option
                v-for="item in departLists"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="enterpriseName">车牌号码</span>
            <el-input class="el_box inp" placeholder="请输入车牌号码" v-model="model.carNumber"></el-input>
            <span class="status">状态</span>
            <el-select v-model="model.whiteState" class="el_box ml10" clearable filterable placeholder="请选择状态">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
            <button :class="[serachBtn,{mr17:!addShow}]" type="submit" @click.prevent="searchInfo">搜索</button>
            <button class="serachBtn mr17" type="button" @click="add" v-if="addShow">新增</button>
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
              <th v-if="addShow">操作</th>
              <th>车牌号码</th>
              <th>状态</th>
              <th>车主姓名</th>
              <th>联系电话</th>
              <th>业务类型</th>
              <th>添加人</th>
              <th>所属部门</th>
              <th>所属门店</th>
              <th v-if="enShow">所属企业</th>
              <th>添加时间</th>
              <th>修改人</th>
              <th>修改时间</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(whiteCarInfor,index) in whiteCarInfors" :key="index">
              <td>{{index+1}}</td>
              <!--操作-->
              <td class="redact" @click="redact(whiteCarInfor.whiteId)" v-if="addShow">
                编辑
              </td>
              <td>{{whiteCarInfor.carNumber}}</td>
              <td>{{whiteCarInfor.whiteState?"启用":"停用"}}</td>
              <td>{{whiteCarInfor.whiteName}}</td>
              <td>{{whiteCarInfor.whiteTel}}</td>
              <td>{{whiteCarInfor.whiteType=='0'?'行政':(whiteCarInfor.whiteType=='1'?'新车销售':'售后')}}</td>
              <td>{{whiteCarInfor.addUserName}}</td>
              <td>{{whiteCarInfor.departmentName}}</td>
              <td>{{whiteCarInfor.storeName}}</td>
              <td v-if="enShow">{{whiteCarInfor.enterpriseName}}</td>
              <td>{{whiteCarInfor.addTime | dateFormatToSecond}}</td>
              <td>{{whiteCarInfor.updateUserName}}</td>
              <td>{{whiteCarInfor.updateTime | dateFormatToSecond}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" v-if="whiteCarInfors.length">
          <nt-pagination ref="child" @fetchData="fetchData"></nt-pagination>
        </div>
      </div>
    </div>
    <!--新增-编辑遮罩层-->
    <addit :popUp="popUp" @change="change" :title="title" @relod="relod" ref="whiteListCarEdit" :whiteId="whiteId"></addit>
  </div>
</template>

<script>
  import addit from './components/add-edit.vue'
  export default {
    name: 'white-list-car',
    components: {
      addit
    },
    inject:['reload'],//注入reload方法
    data() {
      return {
        model:{
          pageSize:10,//每页行数
          pageNo:1,
          storeId:'',//门店id
          departmentId:'',//部门id
          carNumber:'',//车牌号码
          whiteState:'',//状态
        },
        enShow:false,//所属企业显示状态
        serachBtn:'serachBtn',//按钮类名
        whiteId:'',
        mr17:'mr17',
        title:'',
        popUp:false,
        addShow:false,//新增按钮是否显示
        storeLists: [],//搜索-门店
        departLists: [],//搜索--部门
        whiteCarInfors:[],//white-list-car列表
        options:[
          {
            value:'',
            text:'全部状态'
          },
          {
            value:1,
            text:'启用'
          },
          {
            value:0,
            text:'停用'
          }
        ],
      }
    },
    mounted() {
      this.getStoreList();//搜索-门店列表
      this.getDepartList();//搜索-部门列表
      this.fetchData();//初始获取信息
      var roleId=this.$store.state.roleId;
      if(this.$store.state.roleId==1){
        this.enShow=true;
      }else{
        this.enShow=false;
      }
      if(roleId=='3'){
        this.addShow=true;
      }
      this.$store.state.pageSize=10;
    },
    methods: {
      searchInfo() {
        this.model.pageNo=1;
        var obj={};
        for(var key in this.model){
          obj[key]=this.model[key];
        }
        delete obj['pageNo'];
        this.getWhiteInfo(obj);
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
        this.popUp = true;
        this.title = '编辑';
        if(arg){
          this.whiteId=arg+'';
        }
        this.$refs.whiteListCarEdit.getDetail(this.whiteId);
      },
      change(){
        this.popUp = false
      },
      //获取区域列表
      fetchData(args){
        if(args){
          if(args.page){//分页
            this.model.pageNo=args.page;//当前页数
            this.model.pageSize=args.pageSize;//每页显示多少条
          }
        }
        this.getWhiteInfo(this.model);
      },
      getWhiteInfo(arg){
        this.$axios.post('/permission/white/list',arg).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data) {
            this.whiteCarInfors=data.value.dataList;
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
      //获取搜索部分所有门店
      getStoreList(){
        this.$axios.get('/system/store/all/1').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
            this.storeLists= data.value;
            this.storeLists.unshift({'id':'','storeName':'全部门店'})
          }
        })
      },
      //搜索--部门
      getDepartList(){
        this.$axios.get('/permission/department/all/1').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data.value){
            this.departLists= data.value;
            this.departLists.unshift({'id':'','name':'全部部门'});
          }
        })
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../../assets/css/base.css';
  .inp{
    width: 192px;
    margin-left: 10px;
  }
</style>
