<template>
  <div class="main_wrap">
    <div class="search-box bg_fff">
      <form>
        <div class="selectWrap">
          <div class="column inlineBlock">
            <span class="enterpriseName">区域名称</span>
            <el-select class="el_box ml10" v-model="model.name" clearable filterable placeholder="请输入区域名称" @focus="focusArea">
              <el-option
                v-for="(item,index) in areaSearchList"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <span class="status">企业</span>
            <el-select v-model="model.enterpriseId" class="el_box ml10" clearable filterable placeholder="请选择企业">
              <el-option
                v-for="item in companyLists"
                :key="item.id"
                :label="item.name"
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
              <th>区域名称</th>
              <th>所属企业</th>
              <th>状态</th>
              <th>添加人</th>
              <th>添加时间</th>
              <th>修改人</th>
              <th>修改时间</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(areaInfo,index) in areaInfos" :key="index">
              <td>{{index+1}}</td>
              <!--操作-->
              <td class="redact" @click="redact(areaInfo.id)">
                编辑
              </td>
              <td>{{areaInfo.name}}</td>
              <td>{{areaInfo.enterpriseName}}</td>
              <td>{{areaInfo.state?'启用':'停用'}}</td>
              <td>{{areaInfo.createUserName}}</td>
              <td>{{areaInfo.createTime | dateFormatToSecond}}</td>
              <td>{{areaInfo.updateUserName}}</td>
              <td>{{areaInfo.updateTime | dateFormatToSecond}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" v-if="areaInfos.length">
          <nt-pagination ref="child" @fetchData="fetchData"></nt-pagination>
        </div>
      </div>
    </div>
    <!--新增-编辑遮罩层-->
    <addit :popUp="popUp" @change="change" :title="title" @relod="relod" :areaId="areaId" :compLists="compLists" ref="areaEdit"></addit>
  </div>
</template>

<script>
  import addit from './components/add-edit.vue'
  export default {
    name: 'areaInfo',
    inject:['reload'],//注入reload方法
    components: {
      addit
    },
    data() {
      return {
        model:{
          name:'',
          state:'',
          enterpriseId:'',//企业ID
          pageSize:10,//每页行数
          pageNo:1
        },
        companyLists:[],
        compLists:[],
        areaId:'',//区域id
        popUp:false,
        title:'',
        areaInfos:[],//区域信息
        businessList:[],//企业列表
        areaSearchList:[],//搜索部分区域列表
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
      this.$store.state.pageSize=10;
      this.fetchData();
      this.getBusinessInfo();//获取企业列表
      this.getBusinessInfo0();//获取启用企业列表
      this.getAreaList();//获取搜索部分区域列表
    },
    methods: {
      relod(){
        this.$message.success('保存成功');
        this.reload();
      },
      focusArea(){
        this.getAreaList();//获取搜索部分区域列表
      },
      // 新增
      add(){
        this.popUp = true
        this.title = '新增'
      },
      change(){
        this.popUp = false;
      },
      redact(arg){
        this.popUp = true
        this.title = '编辑'
        if(arg){
          this.areaId=arg+'';
        }
        this.$refs.areaEdit.getDetail(this.areaId);
      },
      //获取区域列表
      fetchData(args){
        if(args){
          if(args.page){//分页
            console.log(args);
            this.model.pageNo=args.page;//当前页数
            this.model.pageSize=args.pageSize;//每页显示多少条
          }
        }
        this.getAreaInfo(this.model);
      },
      //搜索区域信息
      searchInfo(){
        this.model.pageNo=1;
        var obj={};
        for(var key in this.model){
          obj[key]=this.model[key];
        }
        delete obj['pageNo']
        this.getAreaInfo(obj);
      },
      //请求企业信息
      getBusinessInfo(){
        this.$axios.get('/system/enterprise/all/1').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
             this.companyLists = data.value;
          }
        })
      },
      //请求企业信息
      getBusinessInfo0(){
        this.$axios.get('/system/enterprise/all/1').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
            this.compLists = data.value;
          }
        })
      },
      //请求搜索所有区域列表
      getAreaList(){
        this.$axios.get('/system//area/all/0').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
            this.areaSearchList = data.value;
          }
        })
      },
      getAreaInfo(arg){
        this.$axios.post('/system/area/list',arg).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data.value.dataList) {
            this.areaInfos = data.value.dataList;
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
