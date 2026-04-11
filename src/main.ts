import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// PrimeVue in unstyled mode — we apply all styles via Tailwind + glass utilities
app.use(PrimeVue, {
  unstyled: true,
})
app.use(ToastService)

app.mount('#app')
