export default {
    namespaced: true,
    state: {
      tasksByVessel: {}
    },
    mutations: {
      SET_TASKS(state, { vesselId, tasks }) {
        state.tasksByVessel[vesselId] = tasks;
        localStorage.setItem(`tasks-${vesselId}`, JSON.stringify(tasks));
      },
      ADD_TASK(state, { vesselId, task }) {
        if (!state.tasksByVessel[vesselId]) {
          state.tasksByVessel[vesselId] = [];
        }
        state.tasksByVessel[vesselId].push(task);
        localStorage.setItem(`tasks-${vesselId}`, JSON.stringify(state.tasksByVessel[vesselId]));
      },
      DELETE_TASK(state, { vesselId, taskId }) {
        state.tasksByVessel[vesselId] = state.tasksByVessel[vesselId].filter(t => t.id !== taskId);
        localStorage.setItem(`tasks-${vesselId}`, JSON.stringify(state.tasksByVessel[vesselId]));
      }
    },
    actions: {
      loadTasks({ commit }, vesselId) {
        const tasks = JSON.parse(localStorage.getItem(`tasks-${vesselId}`) || '[]');
        commit('SET_TASKS', { vesselId, tasks });
      },
      addTask({ commit }, { vesselId, task }) {
        commit('ADD_TASK', { vesselId, task });
      },
      deleteTask({ commit }, { vesselId, taskId }) {
        commit('DELETE_TASK', { vesselId, taskId });
      }
    },
    getters: {
      getTasksByVessel: state => vesselId => state.tasksByVessel[vesselId] || []
    }
  };
  