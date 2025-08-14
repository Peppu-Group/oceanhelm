import { createStore } from 'vuex';
import crew from './modules/crew';
import vessel from './modules/vessel';
import tasks from './modules/tasks';
import user from './modules/user';
import company from './modules/company';
import inventory from './modules/inventory';
import requisitions from './modules/requisitions';

const store = createStore({
  modules: {
    crew,
    vessel,
    tasks,
    user,
    company,
    inventory,
    requisitions
  }
});

export default store;