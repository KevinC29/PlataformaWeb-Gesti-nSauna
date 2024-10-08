import { createStore } from 'vuex';
import auth from '@/modules/auth/store/index'
import section from '@/modules/section/store/index';
import home from '@/modules/home/store/index';
import dashboard from '@/modules/dashboard/store/index';
import itemType from '@/modules/itemType/store/index';
import role from '@/modules/role/store/index';
import item from '@/modules/item/store/index';
import user from '@/modules/user/store/index';
import client from '@/modules/client/store/index';
import comment from '@/modules/comment/store/index';
import credential from '@/modules/credential/store/index';
import order from '@/modules/order/store/index';
import detailOrder from '@/modules/detailOrder/store/index';
import statistics from '@/modules/statistics/store/index';

const store = createStore({
  modules: {
    auth,
    section,
    home,
    dashboard,
    itemType,
    role,
    item,
    user,
    client,
    comment,
    credential,
    order,
    detailOrder,
    statistics
  }
});

export default store;