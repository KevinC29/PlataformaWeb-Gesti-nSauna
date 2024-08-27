// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Asegúrate de importar el store

const app = createApp(App);

app.use(router);
app.use(store); // Asegúrate de usar el store

app.mount('#app');
