import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AddPortView from '@/views/AddPortView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/ajouter', name: 'AjouterPort', component: AddPortView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
