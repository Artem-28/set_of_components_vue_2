import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/IndexPage.vue')
  },
  {
    path: '/scene',
    name: 'scene',
    component: () => import('../views/scene-page.vue')
  },
  {
    path: '/svg',
    name: 'svg',
    component: () => import('../views/svg-page.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
