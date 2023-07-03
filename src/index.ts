import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/routers/index'

import App from './App'

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')
