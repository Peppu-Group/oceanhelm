import { createStore } from 'vuex';
import crew from './modules/crew';
import vessel from './modules/vessel';
import tasks from './modules/tasks';
import user from './modules/user';

const store = createStore({
  modules: {
    crew,
    vessel,
    tasks,
    user
  }
});

export default store;