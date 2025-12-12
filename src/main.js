import './assets/main.css'

import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import router from './router'
import store from './store'

import 'oceanhelm/dist/style.css'
const app = createApp(App)
const head = createHead()

app.use(router)
app.use(head)
app.use(store)
app.mount('#app')
