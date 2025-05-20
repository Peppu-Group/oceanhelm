export default {
    namespaced: true,
    state: {
      vessels: JSON.parse(localStorage.getItem('vessel') || '[]')
    },
    mutations: {
      SET_VESSELS(state, payload) {
        state.vessels = payload;
        localStorage.setItem('vessel', JSON.stringify(payload));
      },
      ADD_VESSEL(state, vessel) {
        state.vessels.push(vessel);
        localStorage.setItem('vessel', JSON.stringify(state.vessels));
      },
      UPDATE_VESSEL(state, updatedVessel) {
        const index = state.vessels.findIndex(v => v.id === updatedVessel.id);
        if (index !== -1) {
          state.vessels.splice(index, 1, updatedVessel);
          localStorage.setItem('vessel', JSON.stringify(state.vessels));
        }
      },
      DELETE_VESSEL(state, id) {
        state.vessels = state.vessels.filter(v => v.registrationNumber !== id);
        localStorage.setItem('vessel', JSON.stringify(state.vessels));
      }
    },
    actions: {
      setVessels({ commit }, vessels) {
        commit('SET_VESSELS', vessels);
      },
      addVessel({ commit }, vessel) {
        commit('ADD_VESSEL', vessel);
      },
      updateVessel({ commit }, vessel) {
        commit('UPDATE_VESSEL', vessel);
      },
      deleteVessel({ commit }, id) {
        commit('DELETE_VESSEL', id);
      },
      markInactive({ state, commit }, registrationNumber) {
        const vessels = [...state.vessels];
        const index = vessels.findIndex(v => v.registrationNumber === registrationNumber);
    
        if (index !== -1) {
          if (vessels[index].status !== 'Inactive') {
            vessels[index].status = 'Inactive';
          } else {
            vessels[index].status = 'Active';
            Swal.fire({
              title: "Vessel Active!",
              text: "Your vessel is now active, if it is under maintenance, the status will change soon",
              icon: "success"
            });
          }
    
          commit('SET_VESSELS', vessels);
        }
      }
    },
    getters: {
      allVessels: state => state.vessels
    }
  };
  