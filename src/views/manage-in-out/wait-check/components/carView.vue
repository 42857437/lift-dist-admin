<template>
  <div>
    <div class="zzc" v-if="carShow">
      <div class="carZone">
        <div class="close" @click="closeCarImg">X</div>
        <div class="title">
          车辆图片
        </div>
        <div class="imgZone">
          <ul>
            <li class="zone"></li>
            <li class="zone"></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'carview',
    props:{
      carShow:Boolean
    },
    methods:{
      closeCarImg(){
        this.$emit('closeCar');
      }
    }
  }
</script>
<style scoped lang="scss">
  @import '../../../../assets/css/cover.css';
  .carZone{
    width: 920px;
    height: 610px;
    background: #fff;
    box-sizing: border-box;
    position: relative;
    .close{
      position: absolute;
      right: -13px;
      font-size: 17px;
      top: -3px;
    }
    .title{
      text-align: left;
      box-sizing: border-box;
      padding-left: 40px;
      border-bottom: 1px solid #ccc;
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #0056FF;
      letter-spacing: 0;
      padding-top: 10px;
      padding-bottom: 10px;
    }
    .imgZone{
      width:100%;
      padding: 40px;
      height: 570px;
      box-sizing: border-box;
      ul{
        width: 100%;
        height: 100%;
        li{
          width: 400px;
          height: 400px;
          background: rebeccapurple;
          float: left;
          margin-bottom: 41px;
        }
        li:nth-child(even){
          margin-left: 40px;
        }
      }
    }
  }
</style>
