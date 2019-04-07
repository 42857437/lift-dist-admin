<template>
  <div>
    <div class="top">
      <div class="img">
        <img src="../../icons/mainLogo.png" alt="">
      </div>
    </div>
    <div class="middle">
      <img src="../../icons/bg.png" alt="">
      <form @submit.prevent="login">
        <div class="login-box">
          <div class="form-top">
            <div><i></i> <span>欢迎登录</span> <i></i></div>
            <p>WELCOME TO LOG IN</p>
          </div>
          <div class="form-group userNa">
            <input type="text" placeholder="用户名" required v-model="userInfo.name">
          </div>
          <div class="form-group pass">
            <input type="password" placeholder="密码" required v-model="userInfo.pass">
          </div>
          <div class="form-group clearfix forgetPass">
            <label class="fl_left checkBox pr">
              <input type="checkbox"v-model="rememberPassword">
              <span></span>记住密码
            </label>
          </div>
          <div class="bottom">
            <button class="serachBtn" ref="loginBtn" type="submit">立即登录</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
  export default{
    name:'login',
    data () {
      return {
        userInfo: {
          name: '',
          pass: ''
        },
        inputFlag: '0',
        rememberPassword:false
      }
    },
    mounted(){
      let userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        this.rememberPassword = true;
        this.userInfo = JSON.parse(userInfo)
      }
    },
    methods: {
     login(){
       let _loginBtn = this.$refs.loginBtn;
       _loginBtn.disabled = true;
       _loginBtn.innerText = "登录中...";
       this.$axios.post('/permission/user/login', this.userInfo).then(res => {
         let data = this.AppUtils.checkResponse(res);
         if (data.code == 10000) {
           var roleId=data.value.profile.roleId;
           var changeNum=data.value.changeNum;
           if(changeNum==0){
             var path="/auth/changePassword?loginName="+data.value.profile.loginName
             this.$router.push(path);
           }else{
             if(roleId=='1'||roleId=='2'||roleId=='3'||roleId=='5'){
               window.location.href='/in-out/wait-application';
             }else if(roleId=='4'||roleId=='9'){
               window.location.href='/in-out/wait-out-car';
             }else if(roleId=='6'||roleId=='7'||roleId=='8'||roleId=='10'||roleId=='11'||roleId=='12'){
               window.location.href='/in-out/wait-check';
             }
           }
           this.$store.commit("AUTH_INIT", {
             token: data.value.token,
             userName: data.value.profile.realName,
             roleId:data.value.profile.roleId,
             departmentId:data.value.profile.departmentId,
             companyId:data.value.profile.companyId,
             storeId:data.value.profile.storeId,
             loginName:data.value.profile.loginName
           });
           if (this.rememberPassword) { //记住密码
             localStorage.setItem("userInfo", JSON.stringify(this.userInfo))
           } else {
             localStorage.setItem("userInfo", "")
           }
           this.AppUtils.setCookie("userName", data.value.profile.realName);
           this.AppUtils.setCookie("token", data.value.token);
           this.AppUtils.setCookie("roleId", data.value.profile.roleId);
           this.AppUtils.setCookie("departmentId", data.value.profile.departmentId);
           this.AppUtils.setCookie("companyId", data.value.profile.companyId);
           this.AppUtils.setCookie("storeId", data.value.profile.storeId);
           this.AppUtils.setCookie("loginName", data.value.profile.loginName);
           // this.$router.push("/in-out/wait-application");
           _loginBtn.disabled = false;
         } else {
           _loginBtn.disabled = false;
           _loginBtn.innerText = "登录"
         }
       }).catch((err) => {
         console.log(err)
         _loginBtn.disabled = false;
         _loginBtn.innerText = "登录"
       });
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
    width: 100%;
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
    right: 200px;
    top: 0;
    bottom: 0;
    margin: auto 0;
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
  }
  .rememberPass{
    width: 14px!important;
    height: 14px!important;
  }
</style>

