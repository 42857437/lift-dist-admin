<template>
  <div class="main_wrap">
    <div class="search-box bg_fff">
      <form>
        <div class="selectWrap">
          <div class="column inlineBlock">
            <span class="enterpriseName">门店</span>
            <el-select class="el_box ml10" v-model="listModel.storeName" clearable filterable placeholder="请输入门店名称" @focus="getStoreList">
              <el-option
                v-for="item in storeLists"
                :key="item.id"
                :label="item.storeName"
                :value="item.storeName">
              </el-option>
            </el-select>
            <span class="enterpriseName">区域名称</span>
            <el-select class="el_box ml10" v-model="listModel.areaId" clearable filterable placeholder="请输入区域名称">
              <el-option
                v-for="item in areaLists"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="status">企业</span>
            <el-select v-model="listModel.enterpriseId" class="el_box ml10" clearable filterable placeholder="请选择企业">
              <el-option
                v-for="item in companyOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span class="status">状态</span>
            <el-select v-model="listModel.state" class="el_box ml10" clearable filterable placeholder="请选择状态">
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
              <th>门店名称</th>
              <th>管理类型</th>
              <th>状态</th>
              <th>门店负责人</th>
              <th>负责人电话</th>
              <th>所属区域</th>
              <th>所属企业</th>
              <th>添加人</th>
              <th>添加时间</th>
              <th>修改人</th>
              <th>修改时间</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(areaInfor,index) in areaInfors" :key="index">
              <td>{{index+1}}</td>
              <!--操作-->
              <td class="redact" @click="redact(areaInfor.id)">
                编辑
              </td>
              <td>{{areaInfor.storeName}}</td>
              <td>{{areaInfor.manageType=='0'?'白名单管理':(areaInfor.manageType=='1'?'车间黑名单管理':'黑名单管理')}}</td>
              <td>{{areaInfor.state?"启用":"停用"}}</td>
              <td>{{areaInfor.linkMan}}</td>
              <td>{{areaInfor.linkTel}}</td>
              <td>{{areaInfor.areaName}}</td>
              <td>{{areaInfor.enterpriseName}}</td>
              <td>{{areaInfor.createUserName}}</td>
              <td>{{areaInfor.createTime | dateFormatToSecond}}</td>
              <td>{{areaInfor.updateUserName}}</td>
              <td>{{areaInfor.updateTime | dateFormatToSecond}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" v-if="areaInfors.length">
          <nt-pagination ref="child" @fetchData="fetchData"></nt-pagination>
        </div>
        <div class="desc">
          <h5>管理类型释义:</h5>
          <p>黑名单管理：所有入场车辆进入“待申请放行”列表，适用于对所有进场车辆进行出场管控的门店;</p>
          <p>车间黑名单管理：所有入场车辆进入“待申请放行”列表，默认业务类型为“售后”，适用于仅对售后车间车辆进行出场管控的门店;</p>
          <p>白名单管理：所有入场车辆进入“待出场”列表，适用于仅对产生付费的车辆进行出场管控的门店;</p>
        </div>
      </div>
    </div>
    <!--新增-编辑遮罩层-->
    <addit :popUp="popUp" @change="change" :title="title" :companyOptions1="companyOptions1" :storeId="storeId"  @relod="relod" ref="storeEdit"></addit>
  </div>
</template>

<script>
  import addit from './components/add-edit.vue'
  export default {
    name: 'storeInfo',
    components: {
      addit
    },
    inject:['reload'],//注入reload方法
    data() {
      return {
        listModel:{
          areaId:'',
          state:'',
          enterpriseId:'',
          storeName:'',
          pageSize:10,//每页行数
          pageNo:1
        },
        areaInfors:[],//门店所有信息
        title:'',
        popUp:false,
        storeId:'',//门店id
        storeLists: [],//搜索部分门店
        areaLists: [],//搜索部分区域
        companyOptions:[],//搜索部分企业
        companyOptions1:[],//'启用'企业
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
      this.fetchData();//初始获取信息
      this.getBusinessList1();//'启用'企业
      this.getAreaList();//搜索-区域
      this.getBusinessList();//搜索--企业
    },
    methods: {
      relod(){
        this.$message.success('保存成功');
        this.reload();
      },
      // 新增
      add(){
        this.popUp = true;
        this.title = '新增';
        this.getBusinessList();
        this.getAreaList();
      },
      redact(arg){
        this.popUp = true;
        this.title = '编辑';
        this.getBusinessList();
        this.getAreaList();
        if(arg){
          this.storeId=arg+'';
        }
        this.$refs.storeEdit.getDetail(this.storeId);
      },
      change(){
        this.popUp = false
      },
      //搜索门店信息
      searchInfo(){
        var obj={};
        for(var key in this.listModel){
          obj[key]=this.listModel[key];
        }
        delete obj['pageNo'];
        this.getStoreInfo(obj);
      },
      //获取搜索部分所有门店
      getStoreList(){
        this.$axios.get('/system/store/all/0').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
            this.storeLists= data.value;
          }
        })
      },
      //请求搜索所有区域列表
      getAreaList(){
        this.$axios.get('/system//area/all/1').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
            this.areaLists= data.value;
            this.areaLists.unshift({id:'',name:'全部区域'})
          }
        })
      },
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
      //启用企业
      getBusinessList1(){
        this.$axios.get('/system/enterprise/all/1').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
            this.companyOptions1= data.value;
          }
        })
      },
      //获取区域列表
      fetchData(args){
        if(args){
          if(args.page){//分页
            this.listModel.pageNo=args.page;//当前页数
            this.listModel.pageSize=args.pageSize;//每页显示多少条
          }
        }
        this.getStoreInfo(this.listModel);
      },
      getStoreInfo(arg){
        this.$axios.post('/system/store/list',arg).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data) {
            this.areaInfors=data.value.dataList;
          }
          //初始化分页
          //initPage 参数：总条数 当前页数 每页多少条
          if(data.value.dataList.length){
            this.$nextTick(()=>{
              this.$refs.child.initPage(data.value.totalNum,this.listModel.pageNo,this.listModel.pageSize)
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../../assets/css/base.css';
  .desc{
    text-align: left;
    font-size: 14px;
    color: #FF615B;
    p{
      font-size: 12px;
    }
  }
</style>
