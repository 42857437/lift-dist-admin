import Vue from 'vue'
import Router from 'vue-router'
import Cookies from 'js-cookie'
// import layout from './views/layout-dashboard.vue'
//import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)
const router = new Router({
  mode: 'history',
  base: '',
  routes: [
    {
      'path': '/auth',
      'component': require('./views/layout-auth.vue'),
      'children': [
        // ========== 用户机制 ==========
        {
          'path': 'login',
          'component': require('./views/auth/login.vue'),
        },
        {
          'path': 'changePassword',
          'component': require('./views/auth/changePassword.vue'),
        },
      ],
    },
    {
      path: '/',
      redirect: 'in-out/wait-application',
      component: () => import('./views/layout-dashboard.vue'),
      children:[
          // ==================== 系统管理===========================
          {
            path: 'manageSystem',
            component: () =>
              import('./views/manage-system/layout.vue'),
            children: [
              // ==================== 企业信息===========================
              {
                path: 'companyInfo',
                //      // redirect:"/enterpriseInfo/list",
                component: () =>
                  import('./views/manage-system/company-info/companyInfo.vue'),
                meta:{
                  crumbList:['首页','系统管理','企业信息']
                }
              },
              // ==================== 区域信息===========================
              {
                path: 'areaInfo',
                //      // redirect:"/enterpriseInfo/list",
                component: () =>
                  import('./views/manage-system/area-info/areaInfo.vue'),
                meta:{
                  crumbList:['首页','系统管理','区域信息']
                }
              },
              // ==================== 门店信息===========================
              {
                path: 'store-info',
                component: () =>
                  import('./views/manage-system/store-info/storeInfo.vue'),
                meta:{
                  crumbList:['首页','系统管理','门店信息']
                }
              },
              // ==================== 摄像头管理===========================
              {
                path: 'manage-camera',
                component: () =>
                  import('./views/manage-system/manage-camera/manageCamera.vue'),
                meta:{
                  crumbList:['首页','系统管理','摄像头管理']
                }
              },
            ]
          },
          // ==================== 权限管理===========================
          {
            path: 'managePermission',
            component: () =>
              import('./views/manage-permission/layout.vue'),
            children: [
              // ==================== 部门信息===========================
              {
                path: 'departmentInfor',
                component: () =>
                  import('./views/manage-permission/department-Infor/departmentInfor.vue'),
                meta:{
                  crumbList:['首页','部门信息']
                }
              },
              // ==================== 用户账号===========================
              {
                path: 'userAccount',
                component: () =>
                  import('./views/manage-permission/user-account/userAccount.vue'),
                children:[
                ],
                meta:{
                  crumbList:['首页','权限管理','用户账号']
                }
              },
              {
                path:'userAccountAdd',
                component: () =>
                  import('./views/manage-permission/user-account/components/userAccountAddEdit.vue'),
                meta:{
                  crumbList:['首页','权限管理','用户账号','新增账号']
                }
              },
              {
                path:'userAccountEdit',
                component: () =>
                  import('./views/manage-permission/user-account/components/userAccountAddEdit.vue'),
                meta:{
                  crumbList:['首页','权限管理','用户账号','编辑账号']
                }
              }
            ]
          },
          // ==================== 进出场管理===========================
          {
            path: 'in-out',
            component: () =>
              import('./views/manage-in-out/layout.vue'),
            children: [
              // ==================== 车辆白名单===========================
              {
                path: 'white-list-car',
                component: () =>
                  import('./views/manage-in-out/white-list-car/whiteListCar.vue'),
                meta:{
                  crumbList:['首页','车辆白名单']
                }
              },
              // ==================== 待申请放行===========================
              {
                path: 'wait-application',
                component: () =>
                  import('./views/manage-in-out/wait-application/waitApplication.vue'),
                meta:{
                  crumbList:['首页','待申请放行']
                }
              },
              // ==================== 待审核放行===========================
              {
                path: 'wait-check',
                component: () =>
                  import('./views/manage-in-out/wait-check/waitCheck.vue'),
                meta:{
                  crumbList:['首页','待审核放行']
                }
              },
              // ==================== 待出场车辆===========================
              {
                path: 'wait-out-car',
                component: () =>
                  import('./views/manage-in-out/wait-out/waitOut.vue'),
                meta:{
                  crumbList:['首页','待出场车辆']
                }
              },
              // ==================== 白名单出场===========================
              {
                path: 'white-list-car-out',
                component: () =>
                  import('./views/manage-in-out/white-list-car-out/whiteListCarOut.vue'),
                meta:{
                  crumbList:['首页','白名单出场']
                }
              },
              // ==================== 无牌出场===========================
              {
                path: 'unlicensed-car-out',
                component: () =>
                  import('./views/manage-in-out/unlicensed-out/unlicensedOut.vue'),
                meta:{
                  crumbList:['首页','无牌出场']
                }
              },
              // ==================== 异常出场===========================
              {
                path: 'unusual-car-out',
                component: () =>
                  import('./views/manage-in-out/unusual-out/unusualOut.vue'),
                meta:{
                  crumbList:['首页','异常出场']
                }
              },
              // ==================== 进出场记录===========================
              {
                path: 'in-out-record',
                component: () =>
                  import('./views/manage-in-out/in-out-record/inOutRecord.vue'),
                meta:{
                  crumbList:['首页','进出场记录']
                }
              },
            ]
          },
          // ==================== 收银管理===========================
          {
            path: 'collect-money',
            component: () =>
              import('./views/manage-collect-money/layout.vue'),
            children: [
              // ==================== 收款列表===========================
              {
                path: 'receipt-list',
                component: () =>
                  import('./views/manage-collect-money/receipt-list/receiptList.vue'),
                meta:{
                  crumbList:['首页','收款列表']
                }
              },
              // ==================== 退款列表===========================
              {
                path: 'refund-list',
                component: () =>
                  import('./views/manage-collect-money/refund-list/refundList.vue'),
                meta:{
                  crumbList:['首页','退款列表']
                }
              },
            ]

          },
          // ==================== 数据报表===========================
          {
            path: 'data-report',
            component: () =>
              import('./views/data-report/layout.vue'),
            children: [
              // ==================== 进出场数据===========================
              {
                path: 'in-out-data',
                component: () =>
                  import('./views/data-report/in-out-data/inOutData.vue'),
                meta:{
                  crumbList:['首页','数据报表','进出场数据']
                }
              },
              // ==================== 异常出场数据===========================
              {
                path: 'unusual-in-out-data',
                component: () =>
                  import('./views/data-report/unusual-in-out-data/unusualInOutData.vue'),
                meta:{
                  crumbList:['首页','数据报表','异常出场数据']
                }
              },
            ]

          },
        ],
      meta:{
        auth:true,
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  const token = Cookies.get('token');
  if(to.matched.some(m => m.meta.auth)) {
    if(token) {
      next();
    } else {
      next({
        path: '/auth/login',
        query: {
          returnUrl: to.fullPath
        }
      })
    }
  } else {
    next()
  }
})
export default router
