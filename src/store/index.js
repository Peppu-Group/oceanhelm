import { createStore } from 'vuex';
import crew from './modules/crew';
import vessel from './modules/vessel';
import tasks from './modules/tasks';

const store = createStore({
  modules: {
    crew,
    vessel,
    tasks
  }
});

export default store;