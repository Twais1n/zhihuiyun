import {createRouter, createWebHashHistory} from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: () => import('@/views/ChangePassword.vue'),
    meta: { requiresAuth: true }
  },
  
  {
    path: '/',
    name: 'Main',
    component: () => import('@/views/Main.vue'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: { requiresAuth: true }  // 添加需要认证的标记
      },
      {
        path: '/member',
        name: 'Member',
        component: () => import('@/views/Member.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/order',
        name: 'Order',
        component: () => import('@/views/Order.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/order-detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/OrderDetail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/refund',
        name: 'Refund',
        component: () => import('@/views/Refund.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/vip-level',
        name: 'VipLevel',
        component: () => import('@/views/VipLevel.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/voucher',
        name: 'Voucher',
        component: () => import('@/views/Voucher.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/voucher-analyze',
        name: 'VoucherAnalyze',
        component: () => import('@/views/VoucherAnalyze.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/voucher-edit/:id',
        name: 'VoucherEdit',
        component: () => import('@/views/VoucherEdit.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/member-detail/:id',
        name: 'MemberDetail',
        component: () => import('@/views/MemberDetail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/goods',
        name: 'Goods',
        component: () => import('@/views/Goods.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/level',
        name: 'VipLevel',
        component: () => import('@/views/Level.vue'),
        meta: { requiresAuth: true }
      },
       {
        path: '/Member-advanced',
        name: 'memberAdvanced',
        component: () => import('@/views/Member-advanced.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// // 添加路由守卫
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem('loginUser');

//   // 检查路由是否需要认证
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (!isAuthenticated) {
//       // 如果未登录且尝试访问需要认证的页面，重定向到登录页
//       next({ name: 'Login' });
//       return;
//     }
//   }

//   // 如果已登录但尝试访问登录/注册页，重定向到首页
//   if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
//     next({ path: '/' });
//     return;
//   }

//   next();
// });

export default router;