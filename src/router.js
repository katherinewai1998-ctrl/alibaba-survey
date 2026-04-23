import { createRouter, createWebHistory } from 'vue-router'
import Survey from './pages/Survey.vue'
import Admin from './pages/Admin.vue'

const routes = [
  { path: '/', component: Survey },
  { path: '/admin', component: Admin }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
