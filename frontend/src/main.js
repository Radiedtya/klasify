import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())   // ⚠️ HARUS sebelum app.use(router)
app.use(router)

app.mount('#app')