<template>
  <div class="main_wrap">
    <div class="search-box bg_fff">
      <form>
        <div class="selectWrap">
          <div class="column inlineBlock">
            <span class="enterpriseName">企业名称</span>
            <el-select class="el_box ml10" v-model="model.name" clearable filterable placeholder="请输入企业名称" @focus="getBusinessList">
              <el-option
                v-for="item in companySearchLists"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <span class="status">状态</span>
            <el-select v-model="model.state" class="el_box ml10" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
            <button class="serachBtn" type="submit" @click.prevent="searchInfo">搜索</button>
            <button class="serachBtn" type="button" @click="add">新增</button>
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
              <th>企业名称</th>
              <th>状态</th>
              <th>企业联系人</th>
              <th>联系人电话</th>
              <th>平台负责人</th>
              <th>负责人电话</th>
              <th>添加人</th>
              <th>添加时间</th>
              <th>修改人</th>
              <th>修改时间</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(companyInfo,index) in companyLists" :key="index">
              <td>{{index+1}}</td>
              <!--操作-->
              <td class="redact" @click="redact(companyInfo.id)">
                编辑
              </td>
              <td>{{companyInfo.name}}</td>
              <td>{{companyInfo.state=='1'?'启用':'停用'}}</td>
              <td>{{companyInfo.linkUser}}</td>
              <td>{{companyInfo.linkMobile}}</td>
              <td>{{companyInfo.platformName}}</td>
              <td>{{companyInfo.platformTel}}</td>
              <td>{{companyInfo.createUserName}}</td>
              <td>{{companyInfo.createTime | dateFormatToSecond}}</td>
              <td>{{companyInfo.updateUserName}}</td>
              <td>{{companyInfo.updateTime | dateFormatToSecond}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div v-if="companyLists.length" class="pagination">
          <nt-pagination @fetchData="fetchData" ref="child"></nt-pagination>
        </div>
      </div>
    </div>
    <!--新增-编辑遮罩层-->
    <addit :popUp="popUp" @change="change" :title="title" @relod="relod" :businessId="businessId" ref="companyEdit"></addit>
  </div>
</template>

<script>
  import addit from './components/add-edit.vue'
  export default {
    name: 'companyInfo',
    components: {
      addit:addit
    },
    inject:['reload'],//注入reload方法
    data() {
      return {
        model:{
          name:'',
          state:'',
          pageSize:10,//每页行数
          pageNo:1
        },
        popUp:false,
        title:'',
        businessId:'',//企业详情id
        companyLists: [],//企业数据列表
        companySearchLists:[],//搜索部分企业列表
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
        ]
      }
    },
    mounted() {
      this.fetchData();//数据初始化
      this.getBusinessList();//获取搜索部分企业列表
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
      },
      change(){
        this.popUp = false;
      },
      redact(arg){
        this.popUp = true;
        this.title = '编辑';
        if(arg){
          this.businessId=arg+'';
        }
        this.$refs.companyEdit.getDetail(this.businessId);
      },
      //请求搜索部分企业列表
      getBusinessList(){
        this.$axios.get('/system/enterprise/all/0').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
            this.companySearchLists = data.value;
          }
        })
      },
      //搜索企业信息
      searchInfo(){
        var obj={};
        for(var key in this.model){
          obj[key]=this.model[key];
        }
        delete obj['pageNo'];
        this.getBusinessInfo(obj);
      },
      //获取企业信息列表
      fetchData(args){
        if(args){
         if(args.page){//分页
            this.model.pageNo=args.page;//当前页数
            this.model.pageSize=args.pageSize;//每页显示多少条
          }
        }
        this.getBusinessInfo(this.model);
      },
      //请求企业信息
      getBusinessInfo(arg){
        this.$axios.post('/system/enterprise/list',arg).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          // if(data.value.dataList.length){
          if(data.value.dataList) {
            this.companyLists = data.value.dataList;
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
