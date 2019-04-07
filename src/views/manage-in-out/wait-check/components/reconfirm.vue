<template>
  <div>
    <div class="zzc" v-if="reconfirmShow">
      <form action="" class="addform">
        <div class="addTitle">
          <div class="addUser">{{title}}</div>
          <div class="close" @click="certainCancel">×</div>
        </div>

        <div class="form_item mtp10">
          <button class="serachBtn" type="button" @click="certainLeave">确认</button>
          <button class="cancelBtn" type="button" @click="certainCancel">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
  export default {
    name:'reconfirm',
    data(){
      return{}
    },
    props:{
      reconfirmShow:Boolean,//同意二次确认
      title:String,
      acceptEnterId:String,
    },
    methods:{
      certainLeave(){
        this.$axios.post('/record/entry/update/2',{enterId:this.acceptEnterId}).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data) {
            this.$message.success('同意放行申请');
            this.$emit('relod');
          }
        })
      },
      certainCancel(){
        this.$emit('hideReconfirm');
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import '../../../../assets/css/cover.css';
</style>
