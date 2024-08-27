// store/index.js
import { createStore } from 'vuex';
import auth from '../modules/auth/store/index'; // Importa el módulo auth

const store = createStore({
  modules: {
    auth // Registra el módulo de autenticación
  }
});

export default store;
