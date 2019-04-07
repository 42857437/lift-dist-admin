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
    name:'addit',
    data(){
      return{}
    },
    props:{
      reconfirmShow:Boolean,//确认出场二次确认
      title:String,
      obj:Object,//确认出场所传参数
    },
    methods:{
      certainLeave(){
        this.$axios.post('/record/entry/update/4',this.obj).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data) {
            this.$message.success('操作成功');
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
