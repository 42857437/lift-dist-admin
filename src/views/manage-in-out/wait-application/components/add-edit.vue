<template>
  <div>
    <div class="zzc" v-if="popUp">
      <form action="" class="addform">
        <div class="addTitle">
          <div class="addUser">申请放行</div>
          <div class="close" @click="confirmCancel">×</div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p style="position: relative;">
              <el-select v-model="carVinType" class="el_box position-ab w100l6" clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in carVinTypes"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id">
                </el-option>
              </el-select>
            </p>
          </div>
          <div class="form_right w302">
            <input class="el_box w288" placeholder="请输入车牌号码"  name="carNumber" v-if="carShow" v-model="model.carNumber">
            <input class="el_box w288" placeholder="请输入VIN码"  name="carNumber" v-else v-model="model.vin">
            <p v-if="carErrorShow" class="is-danger l2t0">车牌号码或VIN码必须填写一个</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p class="ml12"><i class="primary">*</i>业务类型</p>
          </div>
          <div class="form_right w302">
            <el-select v-model="model.businessType" class="el_box position-ab w288 ml10" clearable filterable placeholder="请选择" @visible-change="clearOutReason">
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
            <el-select v-model="model.outReason" class="el_box position-ab w288 ml10" clearable filterable placeholder="请选择" @focus="getAllOutreasons" @visible-change="getRemark">
              <el-option
                v-for="item in leaveReasonLists"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <p v-if="outReasonShow" class="is-danger busiError l3">请选择放行原因</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p class="ml12">备注</p>
          </div>
          <div class="form_right w302 formRightChange">
            <textarea maxlength="120" v-model="model.remark" class="textArea" placeholder="" v-if="remarkStatus==0"></textarea>
            <textarea maxlength="120" v-model="model.remark" class="textArea" v-if="remarkStatus==1" placeholder="详细业务信息请备注，如验车、精品、保险、置换、金融"></textarea>
            <textarea maxlength="120" v-model="model.remark" class="textArea" v-if="remarkStatus==2" placeholder="详细担保信息请备注，如保修订货、事故车定损、等定损单、等配件"></textarea>
            <textarea maxlength="120" v-model="model.remark" class="textArea" v-if="remarkStatus==3" placeholder="请备注详细信息"></textarea>
          </div>
        </div>
        <div class="form_item mtp10">
          <button class="serachBtn" type="button" @click="confirmSave">申请放行</button>
          <button class="cancelBtn" type="button" @click="confirmCancel">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
  export default {
    name:'confive',
    props:{
      confirmLeave:Boolean,
      enterId:String,
      popUp:Boolean,
      whichApplication:String,
      carNumber:String,
      businessType:String,
      outReason:String,
      vin:String,
      remark:String
    },
    data(){
      return{
        model:{
          carNumber:'',//车牌号码
          vin:'',//vin码
          businessType:'',//业务类型
          outReason:'',//放行原因
          remark:'',//备注
        },
        carShow:true,//输入车牌号码或者VIN码
        carErrorShow:false,
        remarkStatus:0,//0备注placeholder最初状态，1、新车办业务（备注中提示：详细业务信息请备注，如验车、精品、保险、置换、金融，2担保放行（备注中提示：详细担保信息请备注，如保修订货、事故车定损、等定损单、等配件）
        //3访客（备注中提示：请备注详细信息）
        editModel:{},
        carVinType:1,
        businessTypeShow:false,//业务类型显示
        outReasonShow:false,//放行原因错误显示
        carVinTypes:[
          {
            id:1,
            value:"车牌号码",
          },
          {
            id:2,
            value:"VIN码",
          },
        ],
        businessTypes:[
          {
            value:"0",
            text:'行政'
          },
          {
            value:"1",
            text:'新车销售'
          },
          {
            value:"2",
            text:'售后'
          }
        ],
        leaveReasonLists:[],
      }
    },
    watch:{
      carVinType(newVal,oldVal){
        if(this.whichApplication=="0"){
          if(newVal==1){
            this.model.vin='';
            this.carShow=true;
            this.carErrorShow=false;
          }else if(newVal==2){
            this.model.carNumber='';
            this.carShow=false;
            this.carErrorShow=false;
          }
        }else if(this.whichApplication=="1"){
          if(newVal==1){
            this.carShow=true;
            this.carErrorShow=false;
          }else if(newVal==2){
            this.carShow=false;
            this.carErrorShow=false;
          }
        }
      },

      popUp(newVal,oldVal){
        if(newVal==true) {
          this.remarkStatus=0;//初始化备注输入框
          if(this.whichApplication=="1"){
           if(this.carNumber){
             this.carVinType=1;
             this.carShow=true;
             this.carErrorShow=false
             this.model.carNumber=this.carNumber;
           }else if(this.vin){
             this.carVinType=2;
             this.carShow=false;
             this.carErrorShow=false;
             this.model.vin=this.vin;
           }
           if(this.businessType){
             this.model.businessType=this.businessType
           }else{
             this.model.businessType="";
           }
           if(this.outReason){
              this.model.outReason=this.outReason
           }else{
             this.model.outReason='';
           }
           if(this.remark){
             this.model.remark=this.remark
           }else{
             this.model.remark='';
           }
         }
       }
     },
   },
   methods:{
     getRemark(arg){
       if(!arg){
         if(this.model.outReason==2){
           this.remarkStatus=1;
         }else if(this.model.outReason==6){
           this.remarkStatus=2;
         }else if(this.model.businessType==0&&this.model.outReason==10){
           this.remarkStatus=3;
         }else{
           this.remarkStatus=0;
         }
       }
     },
     clearOutReason(arg){
       if(!arg){
         this.model.outReason='';
         this.remarkStatus=0;
       }
     },
     getAllOutreasons(){
       if(this.model.businessType!=''){
         this.$axios.get('/record/reason/list/'+this.model.businessType).then(res=>{
           let data = this.AppUtils.checkResponse(res);
           if(data) {
             this.leaveReasonLists=data.value;
           }
         })
       }else{
        this.AppUtils.alert('请先选择业务类型')
       }
     },
     confirmCancel(){
       this.businessTypeShow=false;//业务类型显示
       this.outReasonShow=false;//放行原因错误显示
       this.carErrorShow=false;
       this.model.outReason='';//重新置空
       this.model.vin='';
       this.model.remark='';
       this.model.businessType='';
       this.model.carNumber='';
       this.carVinType=1;
       this.$emit('changeAddEdit');
     },
     confirmSave(){
       if(this.carVinType==1&&this.model.carNumber==''){
         this.carErrorShow=true;
       }else if(this.carVinType==1&&this.model.carNumber!=''){
         this.carErrorShow=false;
       }
       if(this.carVinType==2&&this.model.vin==''){
         this.carErrorShow=true;
       }else if(this.carVinType==2&&this.model.vin!=''){
         this.carErrorShow=false;
       }
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
       if(this.whichApplication=="0"){
         this.$axios.post('/record/entry/add',this.model).then(res=>{
           let data = this.AppUtils.checkResponse(res);
           if(data){
             this.$emit('changeAddEdit');
             this.$emit('relod');
           }
         })
       }else if(this.whichApplication=="1"){
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

      }
    },
  }
</script>
<style lang="scss" scoped>
  @import '../../../../assets/css/cover.css';
  .formRightChange{
    height: 95px;
    position: relative;
    left: -17px;
    top: -11px;
  }
</style>


