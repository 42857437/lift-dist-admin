<template>
  <div>
    <div class="zzc" v-if="confirmLeave">
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
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
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
    data(){
      return{
        model:{
          carNumber:'',//车牌号码
          vin:'',//vin码
          businessType:'',//业务类型
          outReason:''//放行原因
        },
        carShow:true,//输入车牌号码或者VIN码
        carErrorShow:false,
        leaveModel:{},
        carVinType:'车牌号码',
        businessTypeShow:false,//业务类型显示
        outReasonShow:false,//放行原因错误显示
        carVinTypes:[
          {
            value:"车牌号码",
          },
          {
            value:"VIN码",
          },
        ],
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
    watch:{
      carVinType(newVal,oldVal){
        if(newVal=='车牌号码'){
          this.carShow=true;
          this.carErrorShow=false;
        }else if(newVal=='VIN码'){
          this.carShow=false;
          this.carErrorShow=false;
        }else{
          this.carErrorShow=true;
        }
      }
    },
    props:{
      confirmLeave:Boolean,
      enterId1:String,
    },
    methods:{
      confirmCancel(){
        this.businessTypeShow=false;//业务类型显示
        this.outReasonShow=false;//放行原因错误显示
        this.carErrorShow=false;
        this.model.outReason='';//重新置空
        this.carVinType='车牌号码';
        this.$emit('changeConfirm')
      },
      confirmSave(){
        if(this.carVinType=='车牌号码'&&this.model.carNumber==''){
          this.carErrorShow=true;
        }
        if(this.carVinType=='VIN码'&&this.model.vin==''){
          this.carErrorShow=true;
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
        for(var key in this.model){
          this.leaveModel[key]=this.model[key];
        }
        this.leaveModel.enterId=this.enterId1;
        this.$axios.post('/record/entry/update/1',this.leaveModel).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          console.log(data);
          // if(data) {
          //   this.$emit('changeConfirm');
          //   this.$emit('relod');
          // }
        })
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import '../../../../assets/css/cover.css';
</style>

