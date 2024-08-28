// store/index.js
import { createStore } from 'vuex';
import auth from '@/modules/auth/store/index'; // Importa el módulo auth
import section from '@/modules/section/store/index'; // Importa el módulo section

const store = createStore({
  modules: {
    auth,     // Registra el módulo de autenticación
    section   // Registra el módulo de secciones
  }
});

export default store;