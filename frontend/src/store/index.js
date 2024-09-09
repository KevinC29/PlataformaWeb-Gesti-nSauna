// store/index.js
import { createStore } from 'vuex';
import auth from '@/modules/auth/store/index'; // Importa el módulo auth
import section from '@/modules/section/store/index'; // Importa el módulo section
import home from '@/modules/home/store/index';
import dashboard from '@/modules/dashboard/store/index';
import itemType from '@/modules/itemType/store/index';

const store = createStore({
  modules: {
    auth,     // Registra el módulo de autenticación
    section,   // Registra el módulo de secciones
    home,
    dashboard,
    itemType
  }
});

export default store;