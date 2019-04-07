<template>
  <div>
    <div class="content">
      <div class="sidebar">
      <el-row class="tac">
        <el-col :span="24">
          <div class="sideBarTitle"><img src="../icons/leftLogo.png" alt="" width="120"></div>
          <el-menu
            router
            unique-opened
            :default-active="$route.path"
            class="el-menu-vertical-demo borderNone"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-submenu :index="menu.id+''" v-for="(menu,index) in menuList" :key="index">
              <template slot="title">
                <span :class="['icon'+(index+1)]"><div class="left"></div>{{menu.name}}</span>
              </template>
              <el-menu-item-group v-if="menu.subMenuList.length">
                <el-menu-item :index="subMenu.url" v-for="subMenu in menu.subMenuList" :key="subMenu.index"><router-link :to=subMenu.url class="leftHref">{{subMenu.name}}</router-link></el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-row>
    </div>
      <div class="rightCont">
        <header class="header">
          <div class="header_right">
            <div class="userInfo">
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                  <img src="../icons/user.png" alt="">{{state.userName}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item >修改密码</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="loginOut" @click="logOut"><img src="../icons/esc.png" alt="">退出</div>
          </div>
        </header>
        <div class="crumb bgC" v-if="crumbList&&crumbList.length">
            <span v-for="(item,index) in crumbList" class="crumb_item">{{item}}<i class="el-icon-arrow-right"></i></span>
        </div>
        <div class="bgC body">
          <transition name="fade" :key="$route.fullPath">
            <router-view/>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    export default{
        name:'dashboard',
        data () {
            return {
              menuList:[]
            }
        },
        components: {},
        computed:{
          state() {
            return this.$store.state;
          },
          loginName() {
            return this.$store.state.loginName;
          },
          crumbList() {
            return this.$route.meta.crumbList;
          }
        },
        methods: {
          handleCommand() {
            this.$router.push({path: '/auth/changePassword',query:{loginName:this.AppUtils.getCookie('loginName')}});
          },
          //登出
          logOut() {
            this.$axios.get('/permission/user/doLogout').then(res => {
              this.AppUtils.setCookie("token", "");
              this.$store.commit("AUTH_SIGN_OUT");
              this.$router.push({path: '/auth/login'})
            })
          },
          fetchData(){
            this.$axios.get('/menu/list/0').then(res => {
              let data = this.AppUtils.checkResponse(res);
              if(data){
                this.menuList = data.value
              }
            })
          },
          handleOpen(key, keyPath) {
            console.log(key, keyPath);
          },
          handleClose(key, keyPath) {
            console.log(key, keyPath);
          }
        },
        mounted(){
            this.fetchData();
        }
    }
</script>
<style lang="scss" scoped>
  .borderNone{
    border: none!important;
    width: 99%!important;
  }
  .content{
    width: 100%;
  }
  .sidebar{
    width: 180px;
    position: fixed;
    z-index: 1;
    height: 100%;
    overflow: hidden;
  }
  .sideBarTitle{
    width: 100%;
    height: 50px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
    background: #FF615B;
    color: #fff;
    margin-bottom: 5px;
  }
  .rightCont{
    position: absolute;
    left: 180px;
    top: 0;
    bottom: 0;
    right: 0;
    overflow: hidden;
    background: #c5c5c5;
  }
  .header{
    width: 100%;
    height: 50px;
    background: #fff;
  }
  .icon1{
    background: url("../icons/system.png") no-repeat  10px center;
    background-size: 17px 17px;
    color: #4A4A4A;
  }
  .is-opened .icon1 .left{
    width: 7px;
    height: 40px;
    position: absolute;
    left: 0;
    background:#FF615B;
  }
  .icon2{
    background: url("../icons/permission.png") no-repeat  10px center;
    background-size: 17px 17px;
    color: #4A4A4A;
  }
  .is-opened .icon2 .left{
    width: 7px;
    height: 40px;
    position: absolute;
    left: 0;
    background:#FF615B;
  }
  .icon3{
    background: url("../icons/connectCar.png") no-repeat  10px center;
    background-size: 17px 17px;
    text-indent: 10px;
    color: #4A4A4A;
  }
  .is-opened .icon3 .left{
    width: 7px;
    height: 40px;
    position: absolute;
    left: 0;
    background:#FF615B;
  }
  .icon4{
    background: url("../icons/getMon.png") no-repeat  10px center;
    background-size: 17px 17px;
    color: #4A4A4A;
  }
  .is-opened .icon4 .left{
    width: 7px;
    height: 40px;
    position: absolute;
    left: 0;
    background:#FF615B;
  }
  .icon5{
    background: url("../icons/table.png") no-repeat  10px center;
    background-size: 17px 17px;
    color: #4A4A4A;
  }
  .is-opened .icon5 .left{
    width: 7px;
    height: 40px;
    position: absolute;
    left: 0;
    background:#FF615B;
  }
  .is-opened .icon1{
    background: url("../icons/system_active.png") no-repeat  10px center;
    background-size: 17px 17px;
    color: #FF615B;
  }
  .is-opened .icon2{
    background: url("../icons/permission_active.png") no-repeat  10px center;
    background-size: 17px 17px;
    color: #FF615B;

  }
  .is-opened .icon3{
    background: url("../icons/connectCar_active.png") no-repeat  10px center;
    background-size: 17px 17px;
    color: #FF615B;
  }
  .is-opened .icon4{
    background: url("../icons/getMon-active.png") no-repeat  10px center;
    background-size: 17px 17px;
    color: #FF615B;
  }
  .is-opened .icon5{
    background: url("../icons/table_active.png") no-repeat  10px center;
    background-size: 17px 17px;
    color: #FF615B;
  }
  .crumb_item{
    color:#FF615B;
    cursor: pointer;
  }
  .crumb_item:first-child{
    color: #555;
  }
</style>
