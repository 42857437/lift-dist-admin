<template>
  <div class="main_wrap">
    <div class="search-box bg_fff">
      <form>
        <div class="selectWrap">
          <div class="column inlineBlock">
            <span class="enterpriseName">摄像头名称</span>
            <el-select class="el_box ml10" v-model="model.cameraName" clearable filterable placeholder="请输入摄像头名称" @focus="getCameraList">
              <el-option
                v-for="item in cameraLists"
                :key="item.cameraId"
                :label="item.cameraName"
                :value="item.cameraName">
              </el-option>
            </el-select>
            <span class="status">企业</span>
            <el-select v-model="model.enterpriseId" class="el_box ml10" clearable filterable placeholder="请选择企业" @focus="getBusinessList">
              <el-option
                v-for="item in companyLists"
                :key="item.id"
                :label="item.name"
                :value="item.id">
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
              <th>摄像头名称</th>
              <th>状态</th>
              <th>在线状态</th>
              <th>类型</th>
              <th>抬杆类型</th>
              <th>所属企业</th>
              <th>所属门店</th>
              <th>添加人</th>
              <th>添加时间</th>
              <th>修改人</th>
              <th>修改时间</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(cameraInfo,index) in cameraInfos" :key="index">
              <td>{{index+1}}</td>
              <!--操作-->
              <td class="redact" @click="redact(cameraInfo.cameraId)">
                编辑
              </td>
              <td>{{cameraInfo.cameraName}}</td>
              <td>{{cameraInfo.state?'启用':'停用'}}</td>
              <td>{{cameraInfo.lineStatus=='0'?"离线":"在线"}}</td>
              <td>{{cameraInfo.cameraType?'出场':'入场 '}}</td>
              <td>{{cameraInfo.liftingType?'识别抬杆':'自动抬杆'}}</td>
              <td>{{cameraInfo.enterpriseName}}</td>
              <td>{{cameraInfo.storeName}}</td>
              <td>{{cameraInfo.createUserName}}</td>
              <td>{{cameraInfo.createTime | dateFormatToSecond}}</td>
              <td>{{cameraInfo.updateUserName}}</td>
              <td>{{cameraInfo.updateTime | dateFormatToSecond}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" v-if="cameraInfos.length">
          <nt-pagination ref="child" @fetchData="fetchData"></nt-pagination>
        </div>
      </div>
    </div>
    <!--新增-编辑遮罩层-->
    <addit :popUp="popUp" @change="change" :title="title" @relod="relod" ref="cameraEdit" :cameraId="cameraId" :companyList="companyList"></addit>
  </div>
</template>

<script>
  import addit from './components/add-edit.vue'
  export default {
    name: 'manageCamera',
    components: {
      addit
    },
    inject:['reload'],//注入reload方法
    data() {
      return {
        model:{
          cameraName:'',//摄像头名称
          storeId:'',//门店id
          state:'',
          pageSize:10,//每页行数
          enterpriseId:'',//企业id
          pageNo:1
        },
        cameraInfos:[],//摄像头列表
        cameraId:'',//摄像头id
        title:'',
        popUp:false,
        cameraLists:[],//搜索-摄像头名称
        companyLists:[],//'启用'企业
        companyList:[],//'启用'企业
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
      }
    },
    mounted() {
      this.fetchData();//获取摄像头列表信息
      this.getStoreList();//获取搜索--门店列表
      this.getBusinessList();//'启用'企业
    },
    methods: {
      //请求搜索部分企业列表
      getBusinessList(){
        this.$axios.get('/system/enterprise/all/1').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
            for(var key in data.value){
              this.companyList[key]=data.value[key];
            }
            this.companyLists=data.value;
            this.companyLists.unshift({'id':'','name':'全部企业'})
          }
        })
      },
      searchInfo(){
        var obj={};
        for(var key in this.model){
          obj[key]=this.model[key];
        }
        delete obj['pageNo']
        this.getCameraInfo(obj);
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
      change(){
        this.popUp = false
      },
      redact(arg){
        this.popUp = true
        this.title = '编辑'
        if(arg){
          this.cameraId=arg+'';
        }
        this.$refs.cameraEdit.getDetail(this.cameraId);
      },
      //搜索-摄像头列表
      getCameraList(){
        this.$axios.get('/system/camera/all/0').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data.value){
             this.cameraLists= data.value;
          }
        })
      },
      //搜索-门店列表
      getStoreList(){
        this.$axios.get('/system/store/all/1').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data.value){
            this.storeOptions= data.value;
            this.storeOptions.unshift({'id':'','storeName':'全部门店'})
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
        this.getCameraInfo(this.model);
      },
      getCameraInfo(arg){
        this.$axios.post('/system/camera/list',arg).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
            this.cameraInfos=data.value.dataList;
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

