import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'oceanhelm/dist/style.css'
const app = createApp(App)

app.use(router)
app.use(store)
app.mount('#app')
