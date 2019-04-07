<template>
  <div>
    <div class="zzc" v-if="rejectConfirmShow">
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
    name:'rejectconfirm',
    data(){
      return{}
    },
    props:{
      rejectConfirmShow:Boolean,//驳回二次确认
      title:String,
      rejectEnterId:String,
    },
    methods:{
      certainLeave(){
        this.$axios.post('/record/entry/update/3',{enterId:this.rejectEnterId}).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data) {
            this.$message.error('驳回放行申请');
            this.$emit('relod');
          }
        })
      },
      certainCancel(){
        this.$emit('hideRejectReconfirm');
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import '../../../../assets/css/cover.css';
</style>
