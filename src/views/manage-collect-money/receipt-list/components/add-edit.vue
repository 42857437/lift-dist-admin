<template>
  <div>
    <div class="zzc" v-if="popUp">
      <form action="" class="addform">
        <div class="addTitle">
          <div class="addUser">收款</div>
          <div class="close" @click="paymentCancel">×</div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>客户手机:</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" placeholder="请输入客户手机" v-model="addModel.customerTel" name="customerTel" v-validate="'required|telchk'">
            <p v-if="vaerrors.has('customerTel:telchk')" class="is-danger">手机号码格式不正确</p>
            <p v-if="vaerrors.has('customerTel:required')" class="is-danger">请输入手机号</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p>车牌号码:</p>
          </div>
          <div class="form_right">
            <el-input class="el_box w288" placeholder="请输入车牌号码" v-model="addModel.carNumber" @blur="showIfReleases"></el-input>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>收款金额:</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" placeholder="请输入收款金额" v-model="addModel.receiptMoney" name="receiptMoney" v-validate="'required'">
            <p v-if="vaerrors.has('receiptMoney:required')" class="is-danger">请输入收款金额</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p class="ml12"><i class="primary">*</i>收款方式:</p>
          </div>
          <div class="form_right w302">
            <el-select v-model="model.receiptType" class="el_box position-ab w288 ml10" clearable filterable placeholder="请选择" @change="reVal">
              <el-option
                v-for="item in receiptTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <p v-if="receiptTypeError" class="is-danger busiError l3">请选择收款方式</p>
          </div>
        </div>
        <div class="form_item" v-if="ifReleaseError">
          <div class="form_left">
            <p class="ml12">收款放行:</p>
          </div>
          <div class="form_right w302">
            <el-select v-model="model.ifRelease" class="el_box position-ab w288 ml10" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in ifReleases"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <!--<p v-if="ifReleaseError" class="is-danger busiError l3">请选择收款放行</p>-->
          </div>
        </div>
        <div class="form_item mtp10">
          <button v-if="coverBtn" class="serachBtn" type="button" @click="paymentStart">发起收款</button>
          <button v-else class="serachBtn" type="button" @click="paymentStart">确认收款</button>
          <button class="cancelBtn" type="button" @click="paymentCancel">取消</button>
        </div>
      </form>
    </div>
    <div class="cove" v-show="qrShow">
      <div class="conte">
        <div class="close" @click="closeQrcode">X</div>
        <div class="title">收款二维码</div>
        <div id="qrcode"></div>
        <div class="money">收款金额:&nbsp;&nbsp;{{money}}</div>
        <div class="bottom">请使用POS机扫码收款</div>
      </div>
    </div>
  </div>
</template>
<script>
  import QRcode from 'qrcodejs2'
  export default {
    name:'addit',
    props:{
      popUp:Boolean,
    },
    data(){
      return {
        model:{
          receiptType:'POS',
          ifRelease:'',
        },
        addModel:{
          customerTel:'',//客户手机
          customerName:'',//客户姓名
          carNumber:'',//车牌号码
          receiptMoney:'',//收款金额
          receiptType:'',//收款方式
          ifRelease:'',//是否放行
        },
        receiptTypeError:false,//收款方式错误状态
        ifReleaseError:false,//收款放行显示状态
        qrShow:false,
        coverBtn:true,
        money:'',//收款钱数
        receiptNumber:'',
        receiptTypes: [
          {
            id:0,
            name:'POS自选'
          },
          {
            id:1,
            name:'现金'
          }
        ],
        ifReleases: [
          {
            id:1,
            name:'是'
          },
          {
            id:0,
            name:'否'
          }
        ],
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
    methods:{
      showIfReleases(){
        console.log(this.addModel.carNumber);
        if(this.addModel.carNumber){
          this.ifReleaseError=false;
        }
      },
      closeQrcode(){
        window.location.reload();
      },
      qrcode() {
        var qrCod='Ncars'+this.receiptNumber;
        let qrcode = new QRcode('qrcode', {
          width: 150,
          height: 150, // 高度
          text:qrCod, // 二维码内容
          image: ''
          // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
          // background: '#f0f'
          // foreground: '#ff0'
        })
        this.getRe()
      },
      getRe(){
        var _this=this;
        var sec=0;
        var time=setInterval(function () {
          sec++;
          _this.$axios.get('/financial/receipt/status/'+_this.receiptNumber).then(res=> {
            let data = _this.AppUtils.checkResponse(res);
            if(data.value!=2){
              clearInterval(time);
              window.location.reload();
            }else{
              if(sec==180){
                 clearInterval(time);
                 window.location.reload();
              }
            }
          })
        },1000);
      },
      reVal(arg){
        if(arg==1){
          this.coverBtn=false;
        }else{
          this.coverBtn=true;
        }
      },
      paymentStart(){
        this.addModel.receiptType=this.model.receiptType;
        if(this.addModel.receiptType==='POS'){
          this.addModel.receiptType=0+'';
          this.receiptTypeError=false;
        }
        if(this.addModel.receiptType===''){
          this.receiptTypeError=true;
        }else{
          this.receiptTypeError=false;
        }
        this.addModel.ifRelease=this.model.ifRelease;
        if(this.addModel.ifRelease===''){
          // this.ifReleaseError=true;
          this.addModel.ifRelease=null
        }else{
          // this.ifReleaseError=false;
        }
        this.$validator
          .validateAll()
          .then((result) => {
            if (result) {
              if(this.addModel.receiptType!==''){
                if(this.addModel.receiptType==0){
                  this.add();
                }else if(this.addModel.receiptType==1){
                  this.confir()
                }
              }
            } else {
              // this.AppUtils.alert("请正确填写信息");
            }
          })
          .catch(err => {
          });
      },
      add(){
        this.$axios.post('/financial/receipt/add',this.addModel).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          this.receiptNumber=data.value.receiptNumber;
          this.money=data.value.receiptMoney;
          this.qrShow=true;
          this.qrcode();
        })
      },
      confir(){
        this.$axios.post('/financial/receipt/add',this.addModel).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
            window.location.reload();
          }
        })
      },
      paymentCancel(){
        this.receiptTypeError=false;
        this.ifReleaseError=false;//收款放行错误状态
        this.$emit('change')
      }
    },
    computed:{
      /*coverBtn(){
        if(this.model.receiptType==='POS'){
          return true
        }else{
          return false
        }
      }*/
    },
  }
</script>
<style lang="scss" scoped>
  @import '../../../../assets/css/cover.css';
  .cove{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(50, 50, 50, .64);
    .conte{
      border-radius: 5px !important;
      overflow: hidden;
      text-align: center;
      background-color: #2184ea;
      padding: 0 50px;
      width: 166px;
      height: 327px;
      .title{
        text-align: center;
        color: #fff;
        font-size: 18px;
        font-weight: bold;
        padding-bottom: 21px;
      }
      .close{
        width: 9px;
        height: 18px;
        color: #fff;
        position: relative;
        right: -195px;
        cursor: pointer;
        font-size: 15px;
      }
      #qrcode{
        padding: 8px;
        background-color: #fff;
      }
      .money{
        font-size: 16px;
        text-align: center;
        color: #fff;
        margin-top: 15px;
      }
      .bottom{
        font-size: 14px;
        opacity: 0.5;
        text-align: center;
        color: #fff;
        padding: 6px 0 15px 0;
      }
    }
  }
</style>
