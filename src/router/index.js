import Vue from 'vue'
import Router from 'vue-router'
import index from '../components/index.vue'
import login from '../components/login.vue'
import accout from '../components/page/accout.vue'
import feiyong from '../components/page/feiyong.vue'
import grade from '../components/page/grade.vue'
import user from '../components/page/user.vue'
import swip from '../components/page/swip.vue'
import news from '../components/page/news.vue'
import order from '../components/page/order.vue'
import goods from '../components/page/goods.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/index',
      component: index,
      children: [{
        path: '/feiyong',
        component: feiyong
      },
      {
        path: '/accout',
        component: accout
      },
      {
        path: '/grade',
        component: grade
      },
      {
        path: '/swip',
        component: swip
      },
      {
        path: '/news',
        component: news
      },
      {
        path: '/order',
        component: order
      },
      {
        path: '/goods',
        component: goods
      },
      {
        path: '/user',
        component: user
      }]
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: login
    }

  ]
})
router.beforeEach((to, from, next) => {
  let islogin = sessionStorage.getItem('code')
  if (islogin) {
    next()
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})
export default router
