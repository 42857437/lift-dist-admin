<template>
  <div class="posFixed big-img-box" v-if="showFlag" @click="closePreviewImg">
    <img :src="previewImgUrl" alt="" width="600" height="500">
  </div>
</template>

<script>
  export default {
    name: "preview-image",
    data() {
      return{
        showFlag:false,
        previewImgUrl:''
      }

    },
    computed: {
      showMaskFlag() {
        return this.$store.state.showMaskFlag;
      },
    },
    methods: {
      showPreviewImg(url) {
        if(url) {
          this.showFlag = true;
          this.previewImgUrl = 'https://defensor.oss-cn-beijing.aliyuncs.com/images/record/' + url;
          console.log(this.previewImgUrl)
        }else {
          this.AppUtils.alert('图片不存在');
        }
      },
      closePreviewImg() {
        this.showFlag = false;
      }
    }

  }
</script>

<style scoped>
  .big-img-box {
    cursor: pointer;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
  }
</style>
