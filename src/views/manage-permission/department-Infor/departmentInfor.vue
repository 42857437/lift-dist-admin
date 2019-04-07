<template>
  <div class="main_wrap">
    <div class="search-box bg_fff">
      <form>
        <div class="selectWrap">
          <div class="column inlineBlock">
            <span class="enterpriseName">部门名称</span>
            <el-select class="el_box ml10" v-model="model.name" clearable filterable placeholder="请输入部门名称" @focus="getDepartList">
              <el-option
                v-for="item in departLists"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <span class="status">门店</span>
            <el-select v-model="model.storeId" class="el_box ml10" clearable filterable placeholder="请选择门店" @focus="getStoreList">
              <el-option
                v-for="item in storeOptions"
                :key="item.id"
                :label="item.storeName"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="status">状态</span>
            <el-select v-model="model.state" class="el_box ml10" clearable filterable placeholder="请选择状态">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
            <button class="serachBtn" type="submit" @click.prevent="searchInfo">搜索</button>
            <button class="serachBtn mr17" type="button" @click="add">新增</button>
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
              <th>操作</th>
              <th>部门名称</th>
              <th>状态</th>
              <th v-if="enShow">所属企业</th>
              <th>所属门店</th>
              <th>添加人</th>
              <th>添加时间</th>
              <th>修改人</th>
              <th>修改时间</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(departInfo,index) in departInfos" :key="index">
              <td>{{index+1}}</td>
              <!--操作-->
              <td class="redact" @click="redact(departInfo.id)">
                编辑
              </td>
              <td>{{departInfo.name}}</td>
              <td>{{departInfo.state?'启用':'停用'}}</td>
              <td v-if="enShow">{{departInfo.enterpriseName}}</td>
              <td>{{departInfo.storeName}}</td>
              <td>{{departInfo.createUserName}}</td>
              <td>{{departInfo.createTime | dateFormatToSecond}}</td>
              <td>{{departInfo.updateUserName}}</td>
              <td>{{departInfo.updateTime | dateFormatToSecond}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination"  v-if="departInfos.length">
          <nt-pagination ref="child" @fetchData="fetchData"></nt-pagination>
        </div>
      </div>
    </div>
    <!--新增-编辑遮罩层-->
    <addit :popUp="popUp" @change="change" :title="title" @relod="relod" ref="departEdit" :storeOptions1="storeOptions1" :departId="departId"></addit>
  </div>
</template>

<script>
  import addit from './components/add-edit.vue'
  export default {
    name: 'departmentInfor',
    inject:['reload'],//注入reload方法
    components: {
      addit
    },
    data() {
      return {
        model:{
          name:'',//部门名称
          state:'',
          storeId:'',//门店id
          pageNo:1,
          pageSize:10,//每页条数
        },
        enShow:false,//所属企业显示状态
        departInfos:[],//部门信息列表
        departId:'',//部门id
        cameraType:'',
        liftType:'',
        title:'',
        popUp:false,
        departLists: [],//搜索--部门名称
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
        storeOptions:[],//搜索-门店
        storeOptions1:[],//'启用门店'
      }
    },
    mounted() {
      this.fetchData();//获取部门信息列表
      this.getStoreList();//获取搜索--门店列表
      this.getStoreList1();//'启用'门店
      if(this.$store.state.roleId==1){
        this.enShow=true;
      }else{
        this.enShow=false;
      }
    },
    methods: {
      searchInfo(){
        this.model.pageNo=1;
        var obj={};
        for(var key in this.model){
          obj[key]=this.model[key];
        }
        delete obj['pageNo']
        this.getDepartInfo(obj);
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
          this.departId=arg+'';
        }
        this.$refs.departEdit.getDetail(this.departId);
      },
      change(){
        this.popUp = false
      },
      //搜索-部门列表
      getDepartList(){
        this.$axios.get('/permission/department/all/0').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data.value){
            this.departLists= data.value;
          }
        })
      },
      //搜索-门店列表
      getStoreList(){
        this.$axios.get('/system/store/all/1').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data.value){
            this.storeOptions= data.value;
            this.storeOptions.unshift({'id':'','storeName':'全部门店'});
          }
        })
      },
      //'启用'门店
      getStoreList1(){
        this.$axios.get('/system/store/all/1').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data.value){
            this.storeOptions1= data.value;
          }
        })
      },
      //获取摄像头列表
      fetchData(args){
        if(args){
          if(args.page){//分页
            this.model.pageNo=args.page;//当前页数
            this.model.pageSize=args.pageSize;//每页显示多少条
          }
        }
        this.getDepartInfo(this.model);
      },
      getDepartInfo(arg){
        this.$axios.post('/permission/department/list',arg).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
            this.departInfos=data.value.dataList;
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
</style>
