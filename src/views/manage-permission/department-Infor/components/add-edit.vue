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
            <p><i class="primary">*</i>部门名称</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" placeholder="请输入部门名称" v-model="model.name" name="depName" v-validate="'required'">
            <p v-if="vaerrors.has('depName:required')" class="is-danger">请输入部门名称</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>所属门店</p>
          </div>
          <div class="form_right w302">
            <el-select v-model="model.storeId" class="el_box position-ab ml10 ml16-wi299" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in storeOptions1"
                :key="item.id"
                :label="item.storeName"
                :value="item.id">
              </el-option>
            </el-select>
            <p v-if="storeError" class="is-danger busiError">请输入所属门店</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>状态</p>
          </div>
          <div class="form_right w302">
            <el-select v-model="model.state" class="el_box position-ab ml10 ml16-wi299" clearable filterable placeholder="请选择">
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
    data(){
      return{
        model:{
          name:'',//部门名称
          storeId:'',//门店id
          state:1,//状态
        },
        storeError:false,//所属门店错误状态
        stateError:false,//状态错误显示
        editModel:{},
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
    props:{
      popUp:Boolean,
      title:String,
      storeOptions1:Array,//所属门店
      departId:String,//部门id
    },
    methods:{
      addCancel(){
        for(var key in this.model){
          if(key=='state'){
            this.model[key]=1;
          }else{
            this.model[key]='';
          }
        }
        this.stateError=false;
        this.storeError=false;
        this.$emit('change');
      },
      addSave(){
        if(this.model.storeId===''){
          this.storeError=true;
        }else{
          this.storeError=false;
        };
        if(this.model.state===''){
          this.stateError=true;
        }else{
          this.stateError=false;
        }
        this.$validator
          .validateAll()
          .then((result) => {
            if (result) {
              if(this.model.storeId!==''&&this.model.state!=='') {
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
          this.$axios.post('/permission/department/add',this.model).then(res=>{
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
          this.editModel.id=this.departId;
          this.$axios.post('/permission/department/update',this.editModel).then(res=>{
            let data = this.AppUtils.checkResponse(res);
            if(data) {
              this.$emit('change');
              this.$emit('relod');
            }
          })
        }
      },
      //获取部门信息编辑详情
      getDetail(arg){
        this.detail(parseFloat(arg));
      },
      detail(arg){
        this.$axios.get(`/permission/department/detail/${arg}`).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if (data.value){
            var departInfor=data.value;
            for(var key in this.model){
              this.model[key]=departInfor[key];
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
