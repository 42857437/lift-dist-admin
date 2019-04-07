<template>
  <div>
    <div class="zzc" v-if="confirmLeave">
      <form action="" class="addform">
        <div class="addTitle">
          <div class="addUser">确认放行</div>
          <div class="close" @click="confirmCancel">×</div>
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
        <div class="form_item">
          <div class="form_left">
            <p class="ml12"><i class="primary">*</i>放行原因</p>
          </div>
          <div class="form_right w302">
            <el-select v-model="model.outReason" class="el_box position-ab w288 ml10" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in leaveReasonLists"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
            <p v-if="outReasonShow" class="is-danger busiError l3">请选择放行原因</p>
          </div>
        </div>
        <div class="form_item mtp10">
          <button class="serachBtn" type="button" @click="confirmSave">保存</button>
          <button class="cancelBtn" type="button" @click="confirmCancel">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
  export default {
    name:'confive',
    data(){
      return{
        model:{
          businessType:'',//业务类型
          outReason:''//放行原因
        },
        leaveModel:{},
        businessTypeShow:false,//业务类型显示
        outReasonShow:false,//放行原因错误显示
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
        leaveReasonLists:[
          {
            value:0,
            text:'结算放行'
          },
          {
            value:1,
            text:'担保放行'
          },
          {
            value:2,
            text:'行政'
          },
          {
            value:3,
            text:'访客'
          }
        ],
      }
    },
    props:{
      confirmLeave:Boolean,
      enterId1:String,
    },
    methods:{
      //获取点击放行传过来的businessType
      getbusinessType(arg){
        this.model.businessType=arg;
      },
      confirmCancel(){
        this.businessTypeShow=false;//业务类型显示
        this.outReasonShow=false;//放行原因错误显示
        this.model.outReason='';//重新置空
        this.$emit('changeConfirm')
      },
      confirmSave(){
        if(this.model.businessType===''){
          this.businessTypeShow=true;
        }else{
          this.businessTypeShow=false;
        }
        if(this.model.outReason===''){
          this.outReasonShow=true;
        }else{
          this.outReasonShow=false;
        }
        if(this.model.businessType!==''&&this.model.outReason!==''){
          this.save();
        }
      },
      save(){
        for(var key in this.model){
          this.leaveModel[key]=this.model[key];
        }
        this.leaveModel.enterId=this.enterId1;
        this.$axios.post('/record/entry/update/2',this.leaveModel).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data) {
            this.$emit('changeConfirm');
            this.$emit('relod');
          }
        })
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import '../../../../assets/css/cover.css';
</style>

