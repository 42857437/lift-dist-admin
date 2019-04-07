<template>
  <div class="main_wrap">
    <div class="search-box bg_fff">
      <form>
        <div class="selectWrap">
          <div class="column inlineBlock">
            <span class="enterpriseName">账号</span>
            <div class="el-select el_box ml10">
              <div class="el-input el-input--suffix">
                <input class="el-input__inner" v-model="model.userCode" placeholder="请输入账号">
              </div>
            </div>
            <span class="enterpriseName">姓名</span>
            <div class="el-select el_box ml10">
              <div class="el-input el-input--suffix">
                <input class="el-input__inner"  v-model="model.userName" placeholder="请输入姓名">
              </div>
            </div>
            <span class="enterpriseName">手机</span>
            <div class="el-select el_box ml10">
              <div class="el-input el-input--suffix">
                <input class="el-input__inner" v-model="model.userTel" placeholder="请输入手机号码">
              </div>
            </div>
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
              <th>账号</th>
              <th>状态</th>
              <th>姓名</th>
              <th>手机</th>
              <th>所属部门</th>
              <th>所属门店</th>
              <th v-if="enShow">所属企业</th>
              <th>用户角色</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(userAcccountInfo,index) in userAcccountInfos" :key="index">
              <td>{{index+1}}</td>
              <!--操作-->
              <td class="redact" @click="redact(userAcccountInfo.userId)">
                编辑
              </td>
              <td>{{userAcccountInfo.userCode}}</td>
              <td>{{userAcccountInfo.state?'启用':'停用'}}</td>
              <td>{{userAcccountInfo.userName}}</td>
              <td>{{userAcccountInfo.userTel}}</td>
              <td>{{userAcccountInfo.departmentName}}</td>
              <td>{{userAcccountInfo.storeName}}</td>
              <td v-if="enShow">{{userAcccountInfo.companyName}}</td>
              <td>{{userAcccountInfo.roleName}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" v-if="userAcccountInfos.length">
          <nt-pagination ref="child" @fetchData="fetchData"></nt-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'departmentInfor',
    components: {},
    data() {
      return {
        model:{
          pageSize:10,//每页行数
          pageNo:1,
          userName:'',//用户名
          userCode:'',//用户账号
          userTel:'',//手机号
          storeId:'',//门店id
          state:'',//状态
        },
        enShow:false,//所属企业显示状态
        userAcccountInfos:[],//用户账号列表
        popUp:false,
        userId:'',//userId
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
        storeOptions:[],//搜索--门店
      }
    },
    mounted() {
      this.fetchData();//获取用户账号列表信息
      this.getStoreList();//搜索--门店
      if(this.$store.state.roleId==1){
        this.enShow=true;
      }else{
        this.enShow=false;
      }
    },
    methods: {
      //搜索
      searchInfo() {
        this.model.pageNo=1;
        var obj={};
        for(var key in this.model){
          obj[key]=this.model[key];
        }
        delete obj['pageNo']
        this.getUserAccountInfo(obj);
      },
        // 新增
      add(){
        this.$router.push({path:'/managePermission/userAccountAdd',query:{title:'新增'}})
      },
      redact(arg){
        console.log(arg);
        if(arg){
          this.userId=arg+'';
        }
        this.$router.push({path:'/managePermission/userAccountEdit',query:{title:'编辑',userId:this.userId}});
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
      //获取摄像头列表
      fetchData(args){
        if(args){
          if(args.page){//分页
            this.model.pageNo=args.page;//当前页数
            this.model.pageSize=args.pageSize;//每页显示多少条
          }
        }
        this.getUserAccountInfo(this.model);
      },
      getUserAccountInfo(arg){
        this.$axios.post('/permission/user/list',arg).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
            this.userAcccountInfos=data.value.dataList;
            if(data.value.dataList[0]) {
              this.AppUtils.setCookie('companyName', data.value.dataList[0].companyName);
              this.AppUtils.setCookie('companyId', data.value.dataList[0].companyId);
              this.AppUtils.setCookie('storeName', data.value.dataList[0].storeName);
              this.AppUtils.setCookie('storeId', data.value.dataList[0].storeId);
            }
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
