
import Alertify from 'alertify.js'
// import scriptjs from 'scriptjs'
import dateFormat from "dateformat";
import Cookies from 'js-cookie'
const utils = {
  vm:null,
  authInit(vm) {
    this.vm=vm;
    return new Promise((resolve, reject) => {
      const token = Cookies.get('token');
      if (token) {
        const userName = Cookies.get('userName');
        const roleId = Cookies.get('roleId');
        // const permission =JSON.parse(Cookies.get('permission'));
        vm.$store.commit('AUTH_INIT', { 'token': token, 'userName': userName,'roleId':roleId });
        // vm.$store.dispatch("fetchStoreInfo");
      }
      resolve()
    })
  },
  loginRedirect(cb, redirect = true) {
    if (this.$store.state.auth.token !== '') {
      cb()
    }
    else {
      const str = redirect ? ('?returnUrl=' + this.$route.path) : '';
      this.$router.push('/login' + str);
    }
  },
  setCookie(key, value) {
    Cookies.set(key, value)

  },
  getCookie(name) {
    return Cookies.get(name)
  },
  autoSizeImage(w, h, slim = false) {
    // return `?imageMogr2/thumbnail/${w}x${h}/blur/1x0/quality/100${slim ? '|imageslim': ''}`
    return `?imageMogr2/auto-orient/thumbnail/!${w}x${h}r/gravity/Center/crop/${w}x${h}/blur/1x0/quality/100${slim ? '|imageslim' : ''}`
  },
  avatar(url, w, h) {
    return url + utils.autoSizeImage(w, h)
  },
  scrollTop() {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  },
  'alert': function () {
    Alertify.alert(...arguments)
  },

  'log': function () {
    Alertify.log(...arguments)
  },

  'confirm': function () {
    Alertify.confirm(...arguments)
  },

  'error': function () {
    Alertify.error(...arguments)
  },
'checkResponse': function (res, showError = true) {
    // const err_msg = this.retrieve_err_msg(data)
    // let data=JSON.parse(res.data);
    let data=res.data;
    // if (data.subMessage && showError) {
    //   this.alert(data.subMessage)
    // }
    if (10000 === data.code) {
      return data
    } else if(20001 === data.code) {//未登录 或者登录超时
      // 清空本地token跳转到登录页面
      // return false
      this.vm.$router.push('/auth/login');
      // window.location.href='/auth/login';
      Cookies.set('token','');
    }else{
      this.alert(data.subMessage)
      return false
    }
  },
  'retrieve_err_msg': function (data) {
    if ('object' === typeof data && 'string' === typeof data.err_msg && data.err_msg.length > 0) {
      return data.err_msg
    }
  },
  'formatDate':function (date) {
    return  dateFormat(date, "yyyy-mm-dd");
  },
  'formatDateToSecond':function (date) {
    if(date){
      return  dateFormat(date, "yyyy-mm-dd  HH:MM:ss");
    }else {
      return
    }

  },
  'add': function (num1, num2) {
      var baseNum, baseNum1, baseNum2;
      var precision;// 精度
      try {
        baseNum1 = num1.toString().split(".")[1].length;
      } catch (e) {
        baseNum1 = 0;
      }
      try {
        baseNum2 = num2.toString().split(".")[1].length;
      } catch (e) {
        baseNum2 = 0;
      }
      baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
      precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
      return ((num1 * baseNum + num2 * baseNum) / baseNum).toFixed(precision);
    },
  'formatTimeShow':function (arg) {
    if(arg){//时：分：秒 00：32：12  ==1天1小时32分
      var argArr=arg.split(':');
      if(argArr.length==2){
        return argArr[0]+'分'+argArr[1]+'秒'
      }else if(argArr.length==3){
        var hh=parseFloat(argArr[0]);
        if(hh>24){
          var day=Math.floor(hh/24);
          var hour=hh%24;
          return day+'天'+hour+'小时'+argArr[1]+'分';
        }else {
          if(argArr[0]=='00'){
            return argArr[1]+'分'+argArr[2]+'秒'
          }else{
            return argArr[0]+'时'+argArr[1]+'分'+argArr[2]+'秒'
          }
        }
      }
    }
  },
  'averageTimeShow':function (arg) {
    if(arg){//时：分：秒 25：32：12  ==1天1小时32分
      var argArr=arg.split('.');
      var time=argArr[0];
      var argArr=time.split(':');
      if(argArr.length==2){
        return argArr[0]+'分'+argArr[1]+'秒'
      }else if(argArr.length==3){
        var hh=parseFloat(argArr[0]);
        if(hh>24){
          var day=Math.floor(hh/24);
          var hour=hh%24;
          return day+'天'+hour+'小时'+argArr[1]+'分';
        }
      }
    }
  },
}

export default utils
