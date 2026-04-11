import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import { pt } from './primevue/pt';

const app = createApp(App);

app.use(createPinia());
app.use(router);

// PrimeVue in unstyled mode — all styling lives in src/primevue/pt.ts
app.use(PrimeVue, { unstyled: true, pt });
app.use(ToastService);

app.mount('#app');
