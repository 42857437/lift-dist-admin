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
            <p><i class="primary">*</i>区域名称</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" placeholder="请输入区域名称" v-model="model.name" name="areaName" v-validate="'required'">
            <p v-if="vaerrors.has('areaName:required')" class="is-danger">请输入区域名称</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>所属企业</p>
          </div>
          <div class="form_right w302">
            <el-select v-model="model.enterpriseId" class="el_box ml16-wi299 position-ab ml10" clearable filterable placeholder="请选择" name="busiName">
              <el-option
                v-for="(item,index) in compLists"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <p v-if="busiError" class="is-danger busiError">请选择所属企业</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>状态</p>
          </div>
          <div class="form_right w302">
            <el-select v-model="model.state" class="el_box position-ab  ml16-wi299 ml10" clearable filterable placeholder="请选择" name="state">
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
      return {
        model:{
          state:1,
          enterpriseId:'',
          name:'',//区域名称
        },
        editModel:{},
        busiError:false,//所属企业错误的显示状态
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
        ],
      }
    },
    props:{
      popUp:Boolean,
      title:String,
      compLists:Array,
      areaId:String
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
        this.$emit('change');
        this.busiError=false;
        this.stateError=false;
      },
      addSave(){
        if(this.model.enterpriseId===''){
          this.busiError=true;
        }else{
          this.busiError=false;
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
              if(this.model.enterpriseId!==''&&this.model.state!==''){
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
          this.$axios.post('/system/area/add',this.model).then(res=>{
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
          this.editModel.id=this.areaId;
          this.$axios.post('/system/area/update',this.editModel).then(res=>{
            let data = this.AppUtils.checkResponse(res);
            if(data) {
              this.$emit('change');
              this.$emit('relod');
            }
          })
        }
      },
      //获取区域编辑详情
      getDetail(arg){
          this.detail(parseFloat(arg));
      },
      detail(arg){
        this.$axios.get(`/system/area/detail/${arg}`).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if (data.value){
            var areaInfor=data.value;
            for(var key in this.model){
              this.model[key]=areaInfor[key];
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


