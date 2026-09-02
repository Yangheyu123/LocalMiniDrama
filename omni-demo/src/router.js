import { createRouter, createWebHistory } from 'vue-router'

// 演示版仅一条主路径:全能创作工作台(项目模式,episode_id=1)
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/create?episode_id=1' },
    {
      path: '/create',
      name: 'free-create',
      component: () => import('./views/FreeCreate.vue'),
    },
    { path: '/:pathMatch(.*)*', redirect: '/create?episode_id=1' },
  ],
})

export default router
