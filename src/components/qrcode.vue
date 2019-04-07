<template>
  <div class="zzc">
      <div id="qrcode"></div>
  </div>
</template>
<script>
  import QRcode from 'qrcodejs2'
  export default {
    name:'qrcode',
    props:{
      text:String,
      receiptNumber:String
    },
    methods:{
      qrcode() {
        console.log(this.receiptNumber)
        let qrcode = new QRcode('qrcode', {
          width: 100,
          height: 100, // 高度
          text:this.receiptNumber, // 二维码内容
          image: ''
          // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
          // background: '#f0f'
          // foreground: '#ff0'
        })
        console.log(qrcode)
      }
    }
  }
</script>
<style scoped lang="scss">
  @import '../assets/css/cover.css';
</style>
