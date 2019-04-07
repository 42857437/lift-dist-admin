<template>
  <div class="zzc" v-if="printShow">
    <div id="print" class="content">
      <div id="printTest" style="">
        <div class="tableZonePrint">
          <ul class="ulPrint">
            <li class="topTitle">
              <div class="logoPrint"><img :src=imgSS alt="logo" id="ig" v-if="!hideLogo"></div>
              <div class="titlePrint">车辆出门证<span class="centerPrint">({{model.storeName}})</span></div>
            </li>
            <li class="liPrint">
              <div class="liPringLeft">车牌号码</div>
              <div class="liPringRight">{{model.carNumber!=''?model.carNumber:''}}</div>
            </li>
            <li class="liPrint">
              <div class="liPringLeft">VIN码</div>
              <div class="liPringRight">{{model.vin!=''?model.vin:''}}</div>
            </li>
            <li class="liPrint borderTopNone">
              <div class="liPringLeft">车型信息</div>
              <div class="liPringRight"></div>
            </li>
            <li class="liPrint borderTopNone">
              <div class="liPringLeft">车身颜色</div>
              <div class="liPringRight"></div>
            </li>
            <li class="liPrint borderTopNone">
              <div class="liPringLeft">客户名称</div>
              <div class="liPringRight"></div>
            </li>
            <li class="liPrint borderTopNone">
              <div class="liPringLeft">客户手机</div>
              <div class="liPringRight"></div>
            </li>
            <li class="liPrint borderTopNone">
              <div class="liPringLeft">进场时间</div>
              <div class="liPringRight">{{model.entryTime | dateFormatToSecond}}</div>
            </li>
            <li class="liPrint borderTopNone">
              <div class="liPringLeft">放行日期</div>
              <div class="liPringRight">{{model.confirmTime | dateFormatToSecond}}</div>
            </li>
            <li class="liPrint borderTopNone w9966 w995">
              <div class="liPringLeft">业务类型</div>
              <div class="liPringRight f513">{{model.businessType=='0'?'行政':(model.businessType=='1'?'新车销售':(model.businessType=='2'?'售后':''))}}</div>
            </li>
            <li class="liPrint borderTopNone borderl w9966 hei795 w995 reason">
              <div class="liPringLeft">放行原因</div>
              <div class="liPringRight f513">{{model.outReasonName}}</div>
            </li>
            <li class="li-mark borderTopNone hei795 reason w995">
              <div class="liPringLeftMark note">备注</div>
              <div class="liPringRightMark">{{model.remark}}</div>
            </li>
            <li class="liPrint borderTopNone borderl">
              <div class="liPringLeft">申请人</div>
              <div class="liPringRight">{{model.applyUserName}}</div>
            </li>
            <li class="liPrint borderTopNone borderLeftNone">
              <div class="liPringLeft">审核人</div>
              <div class="liPringRight">{{model.outUserName}}</div>
            </li>
            <li class="liPrint borderTopNone borderl w9966 hei85 w995 reason">
              <div class="liPringLeft">财务盖章</div>
              <div class="liPringRight f513"></div>
            </li>
          </ul>
        </div>
        <!--<div class="seal">财务盖章</div>-->
        <div class="printPersonTime">
          <div class="floatLeft" style="color: #4a4a4a;">打印人:{{userName}}</div><div class="floatRight" style="color: #4a4a4a;">打印时间:{{printTime}}</div>
        </div>　　　
      </div>
      <div class="printZ">
        <button v-print="'#printTest'" id="btn">打印</button>
      </div>
      <div class="closeZ">
        <div class="closePrint" @click="closePrint">X</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'print',
    props:{
      printShow:Boolean,
    },
    data(){
      return{
        model:{
          storeImg:'',
          businessType:'',
          outReasonName:'',
          carNumber:'',
          vin:'',
          entryTime:'',
          confirmTime:'',
          applyUserName:'',//申请人
          outUserName:'',//审核人
          storeName:'',//门店名称
          remark:'',//备注
        },
        imgSS:'',
        hideLogo:false,//是否隐藏logo
        userName:'',//打印人
        printTime:'',//打印时间
      }
    },
    mounted(){
      this.userName=this.$store.state.userName;//获取打印人
      var today=new Date();
      this.printTime=this.AppUtils.formatDate(today);
    },
    methods:{
      getPrintInfo(id){
        this.$axios.get('/record/entry/detail/'+id).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data) {
            var obj=data.value;
            for(var key in this.model){
              this.model[key]=obj[key]
            }
            var printObj={};
            for(var key in this.model){
              printObj[key]=this.model[key]
            }
            printObj['wholeImg']='https://defensor.oss-cn-beijing.aliyuncs.com/images/store/'+printObj.storeImg;
            if(printObj.storeImg==undefined||printObj.storeImg==''){
              this.hideLogo=true;
            }else{
              this.hideLogo=false;
            }
            this.imgSS=printObj['wholeImg'];
          }
        })
      },
      //关闭打印
      closePrint(){
        this.$emit('printClose');
        this.$emit('again');
      }
    }
  }
</script>
<style lang="scss" scoped>
  .closeZ{
    height: 30px;
    width: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 100;
    /*background: rgba(0,0,0,0.1);*/
  }
  .zzc {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .3);
  }
  #ig{
    width: 109px;
    height: 40px;
    position: absolute;
    left: 0px;
    top: 0px;
  }
  .content{
    background: #fff;
  }
  .w995{
    width: 99.5% !important;
  }
  .printZ{
    position: absolute;
    width: 698px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding-left: 102px;
    padding-right: 102px;
    /* margin-left: -400px; */
    left: 0px;
    bottom: 5px;
    /*background: rgba(0, 0, 0, 0.1);*/
  }
  #print{
    position: absolute;
    width: 698px;
    height: 518px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    padding-top: 30px;
    /* overflow-y: scroll; */
    overflow-x: hidden;
    top: 50%;
    margin-top: -259px;
    left: 50%;
    margin-left: -349px;
  }
  #printTest{
    height: 447px;
    width: 688px;
    overflow-y: scroll;
    position: absolute;
    left: 50%;
    margin-left: -344px;
  }
  #printTest::-webkit-scrollbar {
    display:none
  }
  .topTitle{
    width: 99.5%;
    height: 57px;
    border: 1px solid #4a4a4a;
    border-bottom: none;
    position: relative;
  }
  .logoPrint{
    width: 109px;
    height: 40px;
    position: absolute;
    top: 50%;
    left: 18px;
    margin-top: -20px;
  }
  .titlePrint{
    text-align: center;
    font-size: 18px;
    line-height: 57px;
    font-family: MicrosoftYaHei-Bold;
    font-size: 18px;
    color: #4a4a4a;
    letter-spacing: 0;
  }
  .printPersonTime{
    width: 100px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    margin: 0 auto;
    margin-bottom: 40px;
    margin-top: 10px;
    text-align: right;
  }
  .closePrint{
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    /*color: #fff;*/
    border: 1px solid #ccc;
    border-radius: 50%;
    position: absolute;
    top: 4px;
    right: 4px;
    cursor: pointer;
  }
  .centerPrint{
    box-sizing: border-box;
    padding: 0px 6px;
    height: 20px;
    line-height: 20px;
    font-size: 13px;
    margin: 0 auto;
    text-align: right;
    margin-bottom: 5px;
    font-family: MicrosoftYaHei;
    font-size: 12px;
    color: #9B9B9B;
    letter-spacing: 0;
  }
  .tableZonePrint{
    /*width: 300px;*/
    /*height: 300px;*/
    box-sizing: border-box;
    /*padding: 0px 20px;*/
    margin: 0 auto;
    width: 595px;
    height: 538px;
    /*border: 1px solid red;*/
  }
  .ulPrint{
    width: 100%;
    height: 100%;
    display: inline-block;
  }
  .liPrint{
    width: 49.67%;
    height:39px;
    line-height: 39px;
    border: 1px solid #4a4a4a;
    float: left;
    display: flex;
    font-size: 12px;
  }
  .liPrint:nth-child(odd) {
    border-right: 1px solid #4a4a4a;
    border-left: none;
  }
  .li-mark{
    width: 99.5%;
    height:10px;
    line-height: 10px;
    border: 1px solid #4a4a4a;
    float: left;
    display: flex;
  }
  .liPringLeftMark{
    flex: 0.97;
    padding-left: 5px;
    color: #000;
    /*font-weight: bold;*/
    font-size: 12px;
    background: #ececec;
  }
  .liPringRightMark{
    flex: 5;
    border-left: 1px solid #4a4a4a;
    padding-left: 5px;
    font-size: 12px;
    color: #4a4a4a;
  }
  .liPringLeft{
    flex: 1;
    padding-left: 5px;
    color: #000;
    background: #ececec;
    /*font-weight: bold;*/
  }
  .liPringRight{
    flex: 2;
    border-left: 1px solid #4a4a4a;
    padding-left: 5px;
    color: #4a4a4a;
  }

  .borderTopNone{
    border-top: 0px solid #ccc;
  }
  .seal{
    /*width: 700px;*/
    height: 20px;
    line-height: 20px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 0px 20px;
    text-indent: 300px;
    margin-bottom: 10px;
    margin-top: 30px;
    font-size: 12px;
  }
  .printPersonTime{
    width: 598px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    margin: 0 auto;
    margin-bottom: 13px;
    margin-top: 10px;
    text-align: left;
  }
  #btn{
    width: 100px;
    height: 30px;
    /*border: 1px solid #ccc;*/
    border-radius: 3px;
    cursor: pointer;
    background: #FF615B;
    color: #fff;
    font-family: MicrosoftYaHei;
    font-size: 12px;
    color: #FFFFFF;
    letter-spacing: 0;
  }
  .hei85{
    height: 85px!important;
    line-height: 85px!important;
  }
  @media print{
    #ig{
      width: 80px;
      height: 30px;
      position: absolute;
      left: 0px;
      top: 0px;
    }
    #printTest {
      width: 700px;
      margin: 0 auto;
      position: absolute;
      left: 50%;
      margin-left: -350px;
    }
    .content{
      background: #fff;
    }
    #print{
      position: relative;
      width: 1000px;
      height: 900px;
      box-sizing: border-box;
      padding-left:59px;
      padding-right:59px;
      padding-top: 40px;
    }
    .topTitle{
      width: 99.8%;
      height: 40px;
      border: 1px solid #4a4a4a;
      border-bottom: none;
      position: relative;
      margin-top: 70px;
    }
    .logoPrint{
      width: 80px;
      height: 30px;
      position: absolute;
      top: 50%;
      left: 18px;
      margin-top: -15px;
    }
    .titlePrint{
      text-align: center;
      font-size: 18px;
      line-height: 40px;
      font-family: MicrosoftYaHei-Bold;
      font-size: 18px;
      color: #4a4a4a;
      letter-spacing: 0;
    }
    .printPersonTime{
      width: 100px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      margin: 0 auto;
      margin-bottom: 40px;
      margin-top: 10px;
      text-align: right;
    }
    .closePrint{
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border: 1px solid #ccc;
      border-radius: 50%;
      position: absolute;
      top: 4px;
      right: 4px;
      cursor: pointer;
    }
    .centerPrint{
      box-sizing: border-box;
      padding: 0px 6px;
      height: 20px;
      line-height: 20px;
      font-size: 13px;
      margin: 0 auto;
      text-align: right;
      margin-bottom: 5px;
      font-family: MicrosoftYaHei;
      font-size: 12px;
      color: #9B9B9B;
      letter-spacing: 0;
    }
    .tableZonePrint{
      /*width: 300px;*/
      /*height: 300px;*/
      box-sizing: border-box;
      /*padding: 0px 20px;*/
      width: 600px;
      height: 380px;
      text-align: center;
      margin: 0 auto;
    }
    .ulPrint{
      width: 100%;
      height: 100%;
      display: inline-block;
    }
    .liPrint{
      width: 49.75%;
      height:25px;
      line-height: 25px;
      border: 1px solid #4a4a4a;
      float: left;
      display: flex;
      font-size: 12px;
    }
    .liPrint:nth-child(odd) {
      border-right: 1px solid #4a4a4a;
      border-left: none;
    }
    .liPrint:nth-child(even) {
      border-left:1px solid #4a4a4a;
    }
    .li-mark{
      width: 99.66%;
      height:30px;
      line-height: 30px;
      border: 1px solid #4a4a4a;
      float: left;
      display: flex;
    }
    .liPringLeftMark{
      flex: 0.98;
      padding-left: 5px;
      /*font-weight: bold;*/
      font-size: 12px;
      background: #ececec;
    }
    .liPringRightMark{
      flex: 5;
      border-left: 1px solid #4a4a4a;
      padding-left: 5px;
      font-size: 12px;
    }
    .liPringLeft{
      flex: 1;
      padding-left: 5px;
      color: #000;
      background: #ececec;
      /*font-weight: bold;*/
    }
    .liPringRight{
      flex: 2;
      border-left: 1px solid #4a4a4a;
      padding-left: 5px;
      color: #4a4a4a;
    }
    .borderTopNone{
      border-top: 0px solid #ccc;
    }
    .seal{
      /*width: 700px;*/
      height: 20px;
      line-height: 20px;
      margin: 0 auto;
      box-sizing: border-box;
      padding: 0px 20px;
      text-indent: 300px;
      margin-bottom: 10px;
      margin-top: 30px;
      font-size: 12px;
    }
    .printPersonTime{
      width: 600px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      margin: 0 auto;
      margin-bottom: 40px;
      margin-top: 50px;
      text-align: left;
    }
    #btn{
      width: 100px;
      height: 30px;
      /*border: 1px solid #ccc;*/
      border-radius: 3px;
      cursor: pointer;
      background: #FF615B;
      color: #fff;
      font-family: MicrosoftYaHei;
      font-size: 12px;
      color: #FFFFFF;
      letter-spacing: 0;
    }
    .w995{
      width: 99.7% !important;
    }
    .reason{
      height: 40px!important;
      line-height: 40px!important;
    }
    .note{
      flex: 0.97
    }
    .hei85{
      height: 70px!important;
      line-height: 70px!important;
    }
    @page{
      margin:0;
      //控制是使用a4还是使用其它纸张规格
      size:auto;
    }
  }
</style>
