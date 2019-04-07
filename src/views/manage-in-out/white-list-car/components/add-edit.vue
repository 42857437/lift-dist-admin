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
            <p><i class="primary">*</i>车牌号码</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" placeholder="请输入车牌号码" v-model="model.carNumber" name="carNumber" v-validate="'required'">
            <p v-if="vaerrors.has('carNumber:required')" class="is-danger">请输入车牌号码</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p class="ml12"><i class="primary">*</i>业务类型</p>
          </div>
          <div class="form_right w302">
            <el-select v-model="model.whiteType" class="el_box position-ab ml10 w288" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in businessTypes"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
            <p v-if="businessTypeShow" class="is-danger busiError l3">请选择业务类型</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p>车主姓名</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" placeholder="请输入车主姓名" v-model="model.whiteName">
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p>联系电话</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" placeholder="请输入联系电话" name="userTel" v-validate="'telchk'" v-model="model.whiteTel">
            <span v-if="vaerrors.has('userTel:telchk')" class="is-danger allCla l310">请输入正确格式的手机号</span>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p class="ml12"><i class="primary">*</i>状态</p>
          </div>
          <div class="form_right w302">
            <el-select v-model="model.whiteState" class="el_box position-ab w288 ml10" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
            <p v-if="stateShow" class="is-danger busiError l3">请选择状态</p>
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
    data(){
      return{
        model:{
          carNumber:'',//车牌号
          whiteType:'',//业务类型
          whiteName:'',//车主姓名
          whiteTel:'',//联系电话
          whiteState:1,//状态
        },
        businessTypeShow:false,//业务类型错误状态
        stateShow:false,//状态错误显示
        editModel:{},
        businessTypes:[
          {
            value:0,
            text:'行政'
          },
          {
            value:1,
            text:'新车销售'
          },
          {
            value:2,
            text:'售后'
          }
        ],
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
    props:{
      popUp:Boolean,
      title:String,
      whiteId:String
    },
    methods:{
      addCancel(){
        this.businessTypeShow=false;
        this.stateShow=false;
        for(var key in this.model){
          if(key=='whiteState'){
            this.model[key]=1;
          }else{
            this.model[key]='';
          }
        }
         this.$emit('change')
      },
      addSave(){
        if(this.model.whiteType===''){
          this.businessTypeShow=true;
        }else{
          this.businessTypeShow=false;
        }
        if(this.model.whiteState===''){
          this.stateShow=true;
        }else{
          this.stateShow=false;
        }
        this.$validator
          .validateAll()
          .then((result) => {
            if (result) {
              if(this.model.whiteType!==''&&this.model.whiteState!==''){
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
          this.$axios.post('/permission/white/add',this.model).then(res=>{
            let data = this.AppUtils.checkResponse(res);
            if(data){
              this.$emit('change');
              this.$emit('relod');
            }
          })
        }else if(this.title=="编辑"){
          for(var key in this.model){
            this.editModel[key]=this.model[key];
          }
          this.editModel.whiteId=this.whiteId;
          this.$axios.post('/permission/white/update',this.editModel).then(res=>{
            let data = this.AppUtils.checkResponse(res);
            if(data) {
              this.$emit('change');
              this.$emit('relod');
            }
          })
        }
      },
      //获取车辆白名单编辑详情
      getDetail(arg){
        this.detail(parseFloat(arg));
      },
      detail(arg){
        this.$axios.get(`/permission/white/detail/${arg}`).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if (data.value){
            for(var key in this.model){
              this.model[key]=data.value[key];
            }
          }
        })
      }
    },
    created(){
      this.$validator.remove("telchk");
      this.$validator.extend("telchk", {
        validate: value => {
          const reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
          return reg.test(value)
        }
      });
    },
  }
</script>
<style lang="scss" scoped>
  @import '../../../../assets/css/cover.css';
</style>
