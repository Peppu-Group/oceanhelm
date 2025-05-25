import supabase from '../../supabase';
function errorMessage(error) {
  Swal.fire({
    icon: 'error',
    title: 'An Error occurred',
    text: `Error: ${error.message}`,
    confirmButtonText: 'Close',
    customClass: {
      confirmButton: 'swal2-confirm'
    }
  });
};
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
      state.crewMembers = state.crewMembers.filter(m => m.name !== id);
      localStorage.setItem('crew', JSON.stringify(state.crewMembers));
    },
    UPDATE_CREW_MEMBER(state, updatedMember) {
      const index = state.crewMembers.findIndex(m => m.id === updatedMember.id);
      if (index !== -1) {
        state.crewMembers.splice(index, 1, {
          ...state.crewMembers[index],
          ...updatedMember
        });
      }
    }
  },
  actions: {
    setCrew({ commit }, members) {
      commit('SET_CREW', members);
    },
    async addCrew({ commit }, member) {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const user = session.user;
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          const companyId = profile.company_id;
          const { data, error } = await supabase
            .from('crew')
            .insert([
              {
                name: member.name,
                role: member.role,
                vessel: member.vessel || '',
                status: member.status,
                next_shift: member.nextShift,
                certifications: member.certifications,
                notes: member.notes,
                on_board: member.onBoard,
                company_id: companyId,
              }
            ], { returning: 'minimal' }
            );

          if (error) {
            // tell user about error.
            errorMessage(error)
          } else {
            commit('ADD_CREW', member);
          }
        }
      } else {
        // router push to login
      }

    },

    updateCrew({ commit }, updatedMember) {
      commit('UPDATE_CREW', updatedMember);
    },
    async deleteCrew({ commit }, id) {
      const { data, error } = await supabase
        .from('crew')
        .delete()
        .eq('name', id);

      if (error) {
        errorMessage(error)
      } else {
        console.log(data)
        commit('DELETE_CREW', id);
      }
    },
    async updateCrewMember({ commit, state }, updatedMember) {
      // Build payload safely
      const updatePayload = {
        status: updatedMember.status,
        next_shift: updatedMember.shift,
        on_board: updatedMember.onBoard,
      };

      // Only add 'vessel' if it's defined and not null
      if (updatedMember.vessel !== undefined && updatedMember.vessel !== null) {
        updatePayload.vessel = updatedMember.vessel;
      }
      // Update in Supabase
      const { data, error } = await supabase
        .from('crew')
        .update(updatePayload)
        .eq('name', updatedMember.name)

      if (error) {
        errorMessage(error)
        return;
      } else {
        commit('UPDATE_CREW_MEMBER', updatedMember);
        localStorage.setItem('crew', JSON.stringify(state.crewMembers));
      }
    },
    async fetchCrew({ commit }) {
      const { data, error } = await supabase
        .from('crew')
        .select('*');

      if (error) {
        console.error('Error fetching crew:', error.message);
        return [];
      }

      // Extract only name and registration_number
      const simplifiedCrew = data.map(crew => ({
        name: crew.name,
        role: crew.role,
        status: crew.status,
        nextShift: crew.next_shift,
        certifications: crew.certifications,
        notes: crew.notes,
        vessel: crew.vessel,
        onBoard: crew.on_board
      }));

      commit('SET_CREW', simplifiedCrew);
    },
  },
  getters: {
    allCrew: state => state.crewMembers,
    getCrewByVessel: state => vesselName =>
      state.crewMembers.filter(m => m.vessel === vesselName)
  }
};
