// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'; // Importar MDI

//Idioma
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { en, es } from 'vuetify/locale'
import { createI18n, useI18n } from 'vue-i18n';

const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallback: 'en',
  messages: {
    en: {
      $vuetify: en
    },
    es: {
      $vuetify: es
    }
  },
})

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    iconfont: 'mdi',
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
})

const app = createApp(App);

app.use(router);
app.use(i18n)
app.use(store);
app.use(vuetify)
app.mount('#app');
