export default {
    namespaced: true,
    state: {
      crewMembers: JSON.parse(localStorage.getItem('crew') || '[]')
    },
    mutations: {
      SET_CREW(state, payload) {
        state.crewMembers = payload;
        localStorage.setItem('crew', JSON.stringify(payload));
      },
      ADD_CREW(state, member) {
        state.crewMembers.push(member);
        localStorage.setItem('crew', JSON.stringify(state.crewMembers));
      },
      UPDATE_CREW(state, updatedMember) {
        const index = state.crewMembers.findIndex(m => m.id === updatedMember.id);
        if (index !== -1) {
          state.crewMembers.splice(index, 1, updatedMember);
          localStorage.setItem('crew', JSON.stringify(state.crewMembers));
        }
      },
      DELETE_CREW(state, id) {
        state.crewMembers = state.crewMembers.filter(m => m.id !== id);
        localStorage.setItem('crew', JSON.stringify(state.crewMembers));
      }
    },
    actions: {
      setCrew({ commit }, members) {
        commit('SET_CREW', members);
      },
      addCrew({ commit }, member) {
        commit('ADD_CREW', member);
      },
      updateCrew({ commit }, updatedMember) {
        commit('UPDATE_CREW', updatedMember);
      },
      deleteCrew({ commit }, id) {
        commit('DELETE_CREW', id);
      }
    },
    getters: {
      allCrew: state => state.crewMembers,
      getCrewByVessel: state => vesselName =>
        state.crewMembers.filter(m => m.vessel === vesselName)
    }
  };
  