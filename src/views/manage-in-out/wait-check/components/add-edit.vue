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
            <el-select v-model="model.businessType" class="el_box position-ab w288 ml10" clearable filterable placeholder="请选择">
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
      enterId:String
    },
    data(){
      return{
        model:{
          businessType:'',//业务类型
          carNumber:'',//车牌号
        },
        editModel:{},
        businessTypeShow:false,//业务类型错误状态
        businessTypes:[
          {
            value:0,
            text:'行政'
          },
          {
            value:1,
            text:'销售'
          },
          {
            value:2,
            text:'售后'
          }
        ],
      }
    },
    methods:{
      addCancel(){
        this.businessTypeShow=false;
        this.$emit('changeAddEdit')
      },
      addSave(){
        if(this.model.businessType===''){
          this.businessTypeShow=true;
        }else {
          this.businessTypeShow=false;
        }
        this.$validator
          .validateAll()
          .then((result) => {
            if (result) {
              if(this.model.businessType!==''){
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
          this.$axios.post('/record/entry/add',this.model).then(res=>{
            let data = this.AppUtils.checkResponse(res);
            if(data){
              this.$emit('changeAddEdit');
              this.$emit('relod');
            }
          })
        }else if(this.title=="编辑"){
          for(var key in this.model){
            this.editModel[key]=this.model[key];
          }
          this.editModel.enterId=this.enterId;
          this.$axios.post('/record/entry/update/1',this.editModel).then(res=>{
            let data = this.AppUtils.checkResponse(res);
            if(data) {
              this.$emit('changeAddEdit');
              this.$emit('relod');
            }
          })
        }
      },
      //获取待出场放行编辑详情
      getDetail(arg){
        this.detail(parseFloat(arg));
      },
      detail(arg){
        this.$axios.get(`/record/entry/detail/${arg}`).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if (data.value){
            for(var key in this.model){
              this.model[key]=data.value[key];
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

