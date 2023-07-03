import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { Component } from 'vue'
import Temperature from '@/components/Temperature'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: { name: 'temperature' },
  },
  {
    path: '/temperature',
    name: 'temperature',
    component: Temperature,
  },
  {
    path: '/yen',
    name: 'yen',
    component: (): Promise<Component> => import(/* webpackChunkName: "yen" */ '@/components/Yen.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
