<template>
  <div class=" con table_wrap">
    <div class="table_layout bg_fff">
      <form class="table_scroll ">
        <table class="table textAlignL">
          <thead>
          <tr>
            <th colspan="2">{{title}}</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td><i class="primary">*</i>姓名</td>
            <td>
              <div class="el_box wid299 el-input">
                <input class="el-input__inner" placeholder="请输入姓名" v-model="addModel.userName" name="userName" v-validate="'required'">
                <span v-if="vaerrors.has('userName:required')" class="is-danger allCla l310">请输入姓名</span>
              </div>
            </td>
          </tr>
          <tr>
            <td><i class="primary">*</i>手机</td>
            <td>
              <div class="el_box wid299 el-input">
                <input class="el-input__inner" placeholder="请输入手机号码" v-model="addModel.userTel" name="userTel" v-validate="'required|telchk'">
                <span v-if="vaerrors.has('userTel:required')" class="is-danger allCla l310">请输入手机号码</span>
                <span v-if="vaerrors.has('userTel:telchk')" class="is-danger allCla l310">请输入正确格式的手机号</span>
              </div>
            </td>
          </tr>
          <tr>
            <td><i class="primary">*</i>账号</td>
            <td>
              <div class="el_box wid299 el-input">
                <input class="el-input__inner" placeholder="请输入账号" v-model="addModel.userCode" name="userCode" v-validate="'required|ucdchk'">
                <span v-if="vaerrors.has('userCode:required')" class="is-danger allCla l310">请输入账号</span>
                <span v-if="vaerrors.has('userCode:ucdchk')" class="is-danger allCla l310">账号必须字母开头且仅允许字母和数字的组合</span>
              </div>
            </td>
          </tr>
          <tr>
            <td><i class="primary">*</i>密码</td>
            <td>
              <div class="el_box wid299 el-input" v-if="pass">
                <input class="el-input__inner" placeholder="请输入密码" type="password" v-model="addModel.userPass" name="userPass" v-validate="'required|upchk'">
                <span v-if="vaerrors.has('userPass:required')" class="is-danger allCla l310">请输入密码</span>
                <span v-if="vaerrors.has('userPass:upchk')" class="is-danger allCla l310">密码包含至少6位数字，字母或字符</span>
              </div>
              <div class="el_box wid299 el-input" v-else>
                <input class="el-input__inner" placeholder="请输入密码" type="password" v-model="addModel.userPass" name="userPass">
              </div>
            </td>
          </tr>
          <tr>
            <td><i class="primary">*</i>用户角色</td>
            <td>
              <div class="re-10">
                  <el-select v-model="model.roleName" class="el_box ml10 w288" clearable filterable placeholder="请选择">
                    <el-option
                      v-for="item in userRoles"
                      :key="item.roleId"
                      :label="item.roleName"
                      :value="item.roleId">
                    </el-option>
                  </el-select>
                  <span v-if="roleError" class="is-danger allCla">请选择用户角色</span>
              </div>
            </td>
          </tr>
          <tr>
            <td><i class="primary">*</i>所属企业</td>
            <td>
              <div class="re-10">
                <el-select v-model="model.company" class="el_box ml10 w288" clearable filterable placeholder="请选择" :disabled=comDis @focus="clear">
                  <el-option
                    v-for="item in belongCompanys"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <span v-if="busiError" class="is-danger allCla">请选择所属企业</span>
              </div>
            </td>
          </tr>
          <tr>
            <td><i class="primary">*</i>所属门店</td>
            <td>
              <div class="re-10">
                <el-select v-model="model.store" class="el_box ml10 w288" clearable filterable placeholder="请选择"  :disabled=storeDis @focus="getStoreList" @visible-change="storeBlur">
                  <el-option
                    v-for="item in belongStores"
                    :key="item.id"
                    :label="item.storeName"
                    :value="item.id">
                  </el-option>
                </el-select>
                <span v-if="storeError" class="is-danger allCla">请选择所属门店</span>
              </div>
            </td>
          </tr>
          <tr>
            <td><i class="primary">*</i>所属部门</td>
            <td>
              <div class="re-10">
                <el-select v-model="model.depart" class="el_box ml10 w288" clearable filterable placeholder="请选择" @focus="getDepartList" @visible-change="departBlur">
                  <el-option
                    v-for="item in belongDeparts"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <span v-if="departError" class="is-danger allCla">请选择所属部门</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>状态</td>
            <td>
              <div class="re-10">
                <el-select v-model="addModel.state" class="el_box ml10 w288" clearable filterable placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span v-if="stateError" class="is-danger allCla">请选择状态</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <div class="re-10">
                <textarea maxlength="120" v-model="addModel.remark" class="textArea"></textarea>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <div class="item">
                <button class="submitSave" type="button" @click="addSave">保存</button>
                <button class="submitCancel" type="button" @click="addCancel">取消</button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </form>
    </div>
  </div>
</template>

<script>
  export default{
    name:'userAccountAdd',
    data(){
      return{
        model:{
          company:'',
          roleName:'',
          depart:'',//部门
          store:'',
          state:1,
          storeId:'',
          departmentId:''
        },
        addModel:{
          userName:'',//姓名
          userTel:'',//手机
          userCode:'',//用户账号
          userPass:'',//用户密码
          roleId:'',//角色ID
          departmentId:'',//部门ID
          companyId:'',//企业ID
          areaId:'',//区域ID
          storeId:'',//门店ID
          state:1,//状态
          remark:'',//备注
        },
        editModel:{},
        note:'',
        departNam:'',
        roleError:false,//用户角色错误状态
        busiError:false,//所属企业错误状态
        storeError:false,//所属门店错误状态
        departError:false,//所属部门错误状态
        stateError:false,//状态
        userRoles:[],//用户角色
        belongCompanys:[],//所属企业列表
        belongStores:[],//所属门店列表
        belongDeparts:[],//所属部门
        comDis:false,//不同身份，所属企业是否可选
        storeDis:false,//不同身份，所属门店是否可选
        options:[
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
    computed:{
      title() {
        return this.$route.query.title
      },
      pass(){
        var tit=this.$route.query.title;
        if(tit==='新增'){
          return true;
        }else if(tit==='编辑'){
          return false;
        }
      }
    },
    created(){
      //自定义过滤
      this.$validator.remove("telchk");
      this.$validator.extend("telchk", {
        validate: value => {
          const reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
          return reg.test(value)
        }
      });
      this.$validator.remove("ucdchk");
      this.$validator.extend("ucdchk", {
        validate: value => {
          const reg = /^[a-zA-Z][a-zA-Z0-9]*$/;
          return reg.test(value)
        }
      });
      this.$validator.remove("upchk");
      this.$validator.extend("upchk", {
        validate: value => {
          const reg = /^([a-zA-Z0-9]|[!@#$%^&*¥(),.，。)]){6,}$/;//字母，数字，字符至少6位密码校验规则
          return reg.test(value)
        }
      });
    },
    mounted(){
      this.getRoleList();
      this.getBusinessList();
      var userId=this.$route.query.userId;
      if(this.$route.query.title=='编辑'&&userId){
        this.getDetail(userId);
      }
    },
    methods:{
      storeBlur(arg){
        if(!arg){
          this.model.storeId=this.model.store;
        }
      },
      departBlur(arg){
        if(!arg){
          if(this.model.depart==this.departNam){
            this.model.depart=this.model.departmentId;
          }
          this.model.departmentId=this.model.depart;
        }
      },
      clear(){
        this.model.store='';
        this.model.depart='';
      },
      addCancel(){
        this.$router.push('/managePermission/userAccount');
      },
      addSave(){
        var roleId=this.$store.state.roleId;
        this.addModel.roleId=this.model.roleName;
        if(this.addModel.roleId===''){
          this.roleError=true;
        }else{
          this.roleError=false;
        }
        if(this.model.company===''){
          this.busiError=true;
        }else{
          this.busiError=false;
        }
        if(roleId=='1'){
          this.addModel.companyId=this.model.company;
        }
        if(this.model.store===''){
          this.storeError=true;
        }else{
          this.storeError=false;
        }
        if(roleId=='1' || roleId=='2'){
          this.addModel.storeId=this.model.store;
        }
        this.addModel.departmentId=this.model.depart;
        if(this.addModel.departmentId===''){
          this.departError=true;
        }else{
          this.departError=false;
        }
        this.$validator
          .validateAll()
          .then((result) => {
            if (result) {
              if(this.addModel.roleId!==''&&this.model.company!==''&&this.model.store!==''&&this.addModel.departmentId!=='') {
                this.save();
              }
            } else {
              // this.AppUtils.alert("请正确填写信息");
            }
          })
          .catch(err => {
          });
      },
      save(){
        if(this.title=="新增"){
          this.$axios.post('/permission/user/add',this.addModel).then(res=>{
            let data = this.AppUtils.checkResponse(res);
            if(data){
              this.$router.push('/managePermission/userAccount');
            }
          })
        }else if(this.title=="编辑"){
          this.addModel.storeId=this.model.storeId;
          this.addModel.departmentId=this.model.departmentId;
          for(var key in this.addModel){
             this.editModel[key]=this.addModel[key];
          }
          this.editModel.userId=this.$route.query.userId;
          this.$axios.post('/permission/user/update',this.editModel).then(res=>{
             let data = this.AppUtils.checkResponse(res);
             if(data) {
               this.$router.push('/managePermission/userAccount');
             }
           })
        }
      },
      //获取部门信息编辑详情
      getDetail(arg){
        this.detail(parseFloat(arg));
      },
      detail(arg){
        this.$axios.get(`/permission/user/detail/${arg}`).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if (data.value){
            var userInfor=data.value;
            for(var key in this.addModel){
              if(!userInfor[key]){
                this.addModel[key]='';
              }else{
                this.addModel[key]=userInfor[key];
              }
            }
            var roleId=this.$store.state.roleId;
            this.model.roleName=userInfor.roleId;
            if(roleId=='1'||roleId=='2'){
              this.model.company=userInfor.companyId;
            }
            this.model.store=userInfor.storeName;
            this.model.depart=userInfor.departmentName;
            this.departNam=userInfor.departmentName;
            this.model.storeId=userInfor.storeId;
            this.model.departmentId=userInfor.departmentId;
            this.addModel.state=userInfor.state;
          }
        })
      },
      //部门列表
      getDepartList(){
        if(this.model.store){
          var storeId;
          if(this.$store.state.roleId=='1'||this.$store.state.roleId=='2'){
              storeId=this.model.storeId;
          }else if(this.$store.state.roleId=='3'){
              storeId=this.addModel.storeId;
          }
          this.getDepar(storeId);
        }else{
          this.AppUtils.alert('请先选择所属门店');
        }
      },
      getDepar(storeId){
        this.$axios.post('/permission/department/all',{storeId:storeId}).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data.value){
            this.belongDeparts= data.value;
          }
        })
      },
      getBusi(id){
        this.$axios.post('/system/store/all',{enterpriseId:id}).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
            this.belongStores= data.value;
          }
        })
      },
      //门店列表
      getStoreList(){
        this.model.depart='';
        if(this.model.company){
          if(this.$store.state.roleId=='2'||this.$store.state.roleId=='3') {
            this.getBusi(this.addModel.companyId);
          }else if(this.$store.state.roleId=='1'){
            this.getBusi(this.model.company);
          }
        }else{
          this.AppUtils.alert('请先选择所属企业');
        }
      },
      //企业列表
      getBusinessList(){
        this.$axios.get('/system/enterprise/all/1').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
            this.belongCompanys= data.value;
          }
          var roleId=this.$store.state.roleId;
          if(roleId=='1'){
            this.comDis=false;
          }else if(roleId=='2'||roleId=='3'){
            this.comDis=true;
            this.model.company=data.value[0].name;
            this.addModel.companyId=this.AppUtils.getCookie("companyId");
          };
          if(roleId=='1' || roleId=='2'){
             this.storeDis=false;
          }else if(roleId=='3'){
             this.storeDis=true;
             this.model.store=this.AppUtils.getCookie("storeName");
             this.addModel.storeId=this.AppUtils.getCookie("storeId");
          };
        })
      },
      //用户角色列表
      getRoleList(){
        this.$axios.get('/permission/role/listByAuth').then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data.value){
            this.userRoles=data.value
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .con{
    margin: 0 10px;
  }
  .item {
    display:flex;
    justify-content:center;
  }
  td{
    position: relative;
  }
  .allCla{
    position: absolute;
    left: 320px;
    top: 8px;
  }
  .l310{
    left: 310px;
    font-size: 12px;
  }
</style>
