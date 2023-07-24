import Vue from 'vue'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'

Vue.use(VueRouter)
Vue.use(Meta)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      header: true
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0, behavior: 'smooth', };
  },
})

export default router
