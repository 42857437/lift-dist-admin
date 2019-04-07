<template>
  <div>
    <div class="middle">
      <form @submit.prevent="login">
        <div class="login-box">
          <div class="form-top">
            <div><i></i> <span>修改密码</span> <i></i></div>
          </div>
          <div class="form-group userNa">
            <input type="password" placeholder="输入旧密码" required v-model="model.pass">
          </div>
          <div class="form-group userNa">
            <input type="password" placeholder="输入新密码" required v-model="model.newPass">
          </div>
          <div class="form-group pass">
            <input type="password" placeholder="再次输入新密码" required v-model="userInfo.pass">
          </div>
          <div class="bottom">
            <button class="serachBtn" ref="loginBtn" type="submit" @click.prevent="changePass">确认</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
  export default{
    name:'changePassword',
    data () {
      return {
        model:{
          name: '',
          pass:'',//旧密码
          newPass:'',//新密码
        },
        userInfo: {
          pass:'',//重新输入密码
        },
      }
    },
    methods:{
      changePass(){
        var roleId=this.$store.state.roleId;
        var loginName=this.$route.query.loginName;
        this.model.name=loginName;
        if(this.model.newPass!=this.userInfo.pass){
          this.AppUtils.alert('两次输入的新密码应保持一致');
        }else{
          this.$axios.post('/permission/user/change',this.model).then(res => {
            let data = this.AppUtils.checkResponse(res);
            if(data){
              this.$message.success('修改密码成功');
              if(roleId=='1'||roleId=='2'||roleId=='3'||roleId=='5'){
                window.location.href='/in-out/wait-application';
              }else if(roleId=='4'||roleId=='9'){
                window.location.href='/in-out/wait-out-car';
              }else if(roleId=='6'||roleId=='7'||roleId=='8'||roleId=='10'||roleId=='11'||roleId=='12'){
                window.location.href='/in-out/wait-check';
              }
            }
          });
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  ::-webkit-input-placeholder {
    font-size: 14px!important;
  }
  :-moz-placeholder {
    font-size: 14px!important;
  }
  ::-moz-placeholder {
    font-size: 14px!important;
  }
  :-ms-input-placeholder {
    font-size: 14px!important;
  }
  span{
    font-size: 14px;
  }
  p{
    font-size: 14px;
  }
  .top {
    background-color: #fff;
    height: 60px;
  }
  .top .img {

    width: 1200px;
    margin: 0 auto;
    text-align: left;
    padding: 10px;
    /*margin-left: 428px;*/
  }
  .top img {
    width: 217px;
    height: 40px;
  }
  .middle {
    height: 400px;
    margin-top: 160px;
    position: relative;
  }
  .middle img {
    width: 100%;
  }
  .middle form {
    position: absolute;
    width: 420px;
    height: 380px;
    border-radius: 3px;
    background-color: #fff;
    /* right: 200px; */
    /* top: 0; */
    /* bottom: 0; */
    margin-left: -210px;
    left: 50%;
  }
  .login-box {
    width: 270px;
    margin: 0 auto;
  }
  .form-top {
    margin-bottom: 50px;
  }
  .form-top div {
    margin: 35px auto 5px;
    display: flex;
    align-items: center;
  }
  .form-top span {
    margin: 0 10px;
    color: #323C47;
  }
  .form-top i {
    height: 1px;
    background-color: #E9E9E9;
    flex: 1;
    opacity: 0.8;
  }
  .form-top p {
    color: #A3ABB9;
  }
  .form-group {
    margin-bottom: 20px;
  }
  .form-group input {
    width: 260px;
    height: 36px;
    line-height: 36px;
    padding-left: 10px;
    border-radius: 3px;
    align-items: center;
    border: 0;
    background-color: #F7F7F9;
    font-size: 14px;
    color: #000;
  }
  .form-group .checkBox {
    font-size: 12px;
    color: #ADADAD;
  }
  .bottom {
    display: flex;
    justify-content: center;;
    align-items: center;
  }
  .serachBtn {
    font-size: 14px;
    margin: 10px auto;
    height: 36px;
    width: 100%;
    background-color: $btnColor;
    color: #fff;
    border-radius: 3px;
  }
  .rememberPass{
    width: 27px!important;
  }

</style>

