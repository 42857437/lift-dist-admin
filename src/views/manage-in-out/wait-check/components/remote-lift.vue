<template>
  <div>
    <div class="zzc" v-if="remoteliftShow">
      <form action="" class="addform">
        <div class="addTitle">
          <div class="addUser">确认抬杆</div>
          <div class="close" @click="remoteCancel">×</div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p>车牌号码</p>
          </div>
          <div class="form_right pr">
            <input class="el_box w288" placeholder="请输入车牌号码" v-model="model.carNumber" name="carNumber">
            <!--<p v-if="vaerrors.has('carNumber:required')" class="is-danger">请输入车牌号码</p>-->
            <div class="chooseCar" @click="showCarImg">车辆图片</div>
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
                v-for="item in outReasonLists"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
            <p v-if="outReasonShow" class="is-danger busiError l3">请选择放行原因</p>
          </div>
        </div>
        <div class="form_item mtp10">
          <button class="serachBtn" type="button" @click="remoteSave">保存</button>
          <button class="cancelBtn" type="button" @click="remoteCancel">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
  export default {
    name:'remolift',
    data(){
      return {
        model:{
          carNumber:'',//车牌号码
          businessType:'',//业务类型
          outReason:'',//放行原因
        },
        businessTypeShow:false,//业务类型错误状态
        outReasonShow:false,//放行原因错误状态
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
        outReasonLists:[
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
      remoteliftShow:Boolean,
    },
    methods:{
      showCarImg(){
        this.$emit('showCar');
      },
      remoteCancel(){
        this.businessTypeShow=false;//还原业务类型错误状态
        this.outReasonShow=false;//还原放行原因错误状态
        this.$emit('changeRemote');
      },
      remoteSave(){
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
        this.$validator
          .validateAll()
          .then((result) => {
            if (result) {
              if(this.model.businessType!==''&&this.model.outReason!==''){
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
        this.$axios.post('/record/entry/update/3',this.model).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data) {
            this.$emit('changeRemote');
            this.$emit('relod');
          }
        })
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import '../../../../assets/css/cover.css';
  .pr{
    position: relative;
  }
  .chooseCar{
    position: absolute;
    top: 0px;
    height: 33px;
    right: 0px;
    line-height: 33px;
    border-left: 1px solid #ccc;
    font-size: 12px;
    padding: 0 12px;
    cursor: pointer;
  }
</style>
