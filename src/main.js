import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import router from './router'
import 'babel-polyfill'
import axios from 'axios';
import './assets/css/initialize.css'
import './assets/css/index.css'
import Alertify from 'alertify.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import AppUtils from './utils'
import VeeValidate, {Validator} from 'vee-validate'
import store from './store/index'
import Print from 'vue-print-nb'
window.jQuery = window.$ = require('jquery');
require('owl.carousel');
import 'owl.carousel/dist/assets/owl.carousel.css'
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(VeeValidate, {
  errorBagName: 'vaerrors',
  inject: true,
  enableAutoClasses: true,
  events: 'blur',
  classNames: {
    invalid: 'invalid', // model is invalid
  },
});
Vue.use(Print); //注册
// 日期 年-月-日
Vue.filter('dateFormat', (date) => {
  return AppUtils.formatDate(date);
});
//日期  年-月-日 时：分： 秒
Vue.filter('dateFormatToSecond', (date) => {
  return AppUtils.formatDateToSecond(date);
});
//停留时长格式
Vue.filter('formatTimeShow', (date) => {
  return AppUtils.formatTimeShow(date);
});
Vue.filter('averageTimeShow', (date) => {
  return AppUtils.averageTimeShow(date);
});
Vue.component('nt-pagination', require('./components/pagination'))
Vue.component('nt-pulse-loader', require('./components/pulse-loader'))//加载动画
Vue.component('nt-preview-image', require('./components/preview-image'))//查看图片
Alertify.logPosition('bottom right')
Alertify.maxLogItems(6)
Alertify.okBtn('确认')
Alertify.cancelBtn('取消')
// Vue.prototype.$loginRedirect = AppUtils.loginRedirect
axios.interceptors.request.use(
  function (config) {
    // 这里的config包含每次请求的内容
    store.state.isLoading = true;
    if (store.state.token) {
      // config.headers.session = `Token ${store.getters.getToken}`;
      config.headers.token = store.state.token;
    }
    return config;
  },
  function (err) {
    return Promise.reject(err);
  },
);
// axios 统一处理网络错误
axios.interceptors.response.use(
  response => {
    store.state.isLoading = false;
    if (response.status == '200') {
      return response;
    } else if (response.status == '505') {
      Alertify.alert(response.data.message)
      return Promise.reject(response);
    } else if (response.status == '300') {
      Alertify.alert(response.data.message)
      return Promise.reject(response);
    } else if ([403, 404].indexOf(response.status) > -1) {
      this.$router.replace('/404')
    } else {
      Alertify.alert(response.data.message)
      return Promise.reject(response);
    }
  },
  error => {
    store.state.isLoading = false;
    Alertify.alert('网络请求失败')
    return Promise.reject(error);
  },
);
let BASE_URL;
if(window.location.port=="8089"){
    // BASE_URL = 'http://10.165.104.194:9001/defensor'//测试BASE_URL
    //   BASE_URL='http://lift.n-cars.com.cn/defensor';
  BASE_URL='http://127.0.0.1:9001/defensor';

  // BASE_URL = 'http://s5m6ru.s1.natapp.cc'
}
if(window.location.host=='zhima.n-cars.com.cn'){
  BASE_URL='http://zhima.n-cars.com.cn/defensor';
}else{
  BASE_URL='http://127.0.0.1:9001/defensor';
}
axios.defaults.baseURL = BASE_URL;
Vue.prototype.AppUtils = AppUtils;
Vue.prototype.$axios = axios;
Vue.prototype.$bus = new Vue();

new Vue({
  // el: '#app',
  store,
  router,
  components: {App},
  template: '<App/>',
  created() {
    AppUtils.authInit(this)
      .then(() => this.$mount('#app'))
  },
})
