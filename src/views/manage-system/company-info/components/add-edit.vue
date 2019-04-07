<template>
  <div>
    <div class="zzc" v-if="popUp">
      <form action="" class="addform">
        <div class="addTitle">
          <div class="addUser">{{title}}</div>
          <div class="close" @click="addCancel">×</div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>企业名称</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" name="companyInf" placeholder="请输入企业名称" v-validate="'required'" v-model="addData.name">
            <p v-if="vaerrors.has('companyInf:required')" class="is-danger">请输入企业名称</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>企业域名</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" name="domai" placeholder="请输入企业域名" v-validate="'required|domain'" v-model="addData.domain">
            <p v-if="vaerrors.has('domai:required')" class="is-danger">请输入企业域名</p>
            <p v-if="vaerrors.has('domai:domain')" class="is-danger">企业域名格式不正确</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p>企业负责人</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" placeholder="请输入企业负责人" name="resPerson" v-model="addData.linkUser">
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p>负责人电话</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" placeholder="请输入负责人电话" name="resTel" v-validate="'telchk'" v-model="addData.linkMobile">
            <p v-if="vaerrors.has('resTel:telchk')" class="is-danger">手机号码格式不正确</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p>平台联系人</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" placeholder="请输入平台联系人" name="platformName" v-model="addData.platformName">
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p>联系人电话</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" placeholder="请输入联系人电话"  name="linkTel" v-validate="'telchk'" v-model="addData.platformTel">
            <p v-if="vaerrors.has('linkTel:telchk')" class="is-danger">手机号码格式不正确</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>状态</p>
          </div>
          <div class="form_right w302">
            <el-select v-model="addData.state" class="el_box ml16-wi299 position-ab ml10" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
            <p v-if="stateError" class="is-danger busiError">请选择状态</p>
          </div>
        </div>
        <div class="form_item mtp10">
          <button class="serachBtn" type="button" @click="addSave">保存</button>
          <button class="cancelBtn" type="button" @click="addCancel">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
  export default {
    name:'addit',
    props:{
      popUp:Boolean,
      title:String,
      businessId:String
    },
    data(){
      return {
        addData:{
          name:'',//企业名称
          domain:'',//企业域名
          linkUser:'',//企业负责人
          linkMobile:'',//负责人电话
          platformName:'',//平台联系人
          platformTel:'',//联系人电话
          state:1//状态默认启用
        },
        stateError:false,//状态显示
        options:[
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
    watch:{
        businessId:function (newValue,oldValue) {
            if(this.title=='编辑'){
              this.detail(parseFloat(this.businessId));
            }
        },
    },
    created() {
      this.$validator.remove("telchk");
      this.$validator.extend("telchk", {
        validate: value => {
          const reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
          return reg.test(value)
        }
      });
      this.$validator.remove("domain");
      this.$validator.extend("domain", {
        validate: value => {
          const reg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/;
          return reg.test(value)
        }
      });
    },
    mounted(){},
    methods:{
      addCancel(){
        for(var key in this.addData){
          if(key=='state'){
            this.addData[key]=1;
          }else{
            this.addData[key]='';
          }
        }
        this.$emit('change');
        this.stateError=false;
      },
      addSave(){
        if(this.addData.state===''){
          this.stateError=true;
        }else{
          this.stateError=false;
        }
        this.$validator
          .validateAll()
          .then((result) => {
            if (result) {
              if(this.addData.state!==''){
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
        if(this.title=='新增'){
          this.$axios.post('/system/enterprise/add',this.addData).then(res=>{
            let data = this.AppUtils.checkResponse(res);
            if(data){
              this.$emit('change');
              this.$emit('relod');
            }
          })
        }else if(this.title=='编辑'){
          this.$axios.post('/system/enterprise/update',this.addData).then(res=>{
             let data = this.AppUtils.checkResponse(res);
             if(data) {
               this.$emit('change');
               this.$emit('relod');
             }
          })
        }
      },
      //获取企业编辑详情
      getDetail(arg){
        this.detail(parseFloat(arg));
      },
      detail(arg){
         this.$axios.get(`/system/enterprise/detail/${arg}`).then(res=>{
           let data = this.AppUtils.checkResponse(res);
           if (data.value){
             var businessInfor=data.value;
             for(var key in businessInfor){
                this.addData[key]=businessInfor[key];
             }
           }
         })
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import '../../../../assets/css/cover.css';
</style>
