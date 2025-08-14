import supabase from '../../supabase';
import axios from 'axios';
import { logActivity } from '@/helpers/activityLogger';

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
    UPDATE_CREW_MEMBER(state, { updatedMember, companyInfo }) {
      const index = state.crewMembers.findIndex(m => m.id === updatedMember.id);
      if (index !== -1) {
        // Update the crew member in place
        state.crewMembers.splice(index, 1, {
          ...state.crewMembers[index],
          ...updatedMember
        });

        try {
          const existingMember = state.crewMembers.find(m => m.name === updatedMember.name);
          const crew = { ...existingMember, ...updatedMember };

          let notificationData = {
            companyName: companyInfo.company.name,
            name: crew.name,
            notification_type: "crew",
            id: crew.vessel,
            embarkation_date: crew.nextShift,
            duration: crew.onBoard,
            contact_person: crew.contactPerson || `${crew.vessel}'s Captain or HR`,
            email: crew.email,
            operations_email: companyInfo.company.email,
            operations_phone: companyInfo.company.phoneNumber
          };


          let last_shift = localStorage.getItem("last_shift");
          if (updatedMember.nextShift && last_shift != updatedMember.nextShift) {
            axios.post('https://proctoredserver.peppubuild.com/notification', notificationData)
              .then(response => {
                console.log('Success:', response.data);
              })
              .catch(error => {
                console.error('Error sending notification:', error.response?.data || error.message);
              });
          }
        } catch (error) {
          console.error('Try block failed:', error);
        }
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
                email: member.email,
                role: member.role,
                vessel: member.vessel || '',
                status: member.status,
                certifications: member.certifications,
                notes: member.notes,
                company_id: companyId
              }
            ], { returning: 'minimal' }
            );

          if (error) {
            // tell user about error.
            errorMessage(error)
          } else {
            await logActivity({
              id: profile.company_id,
              action: 'add',
              table: 'crew',
              details: { status: `Added a new crew to database `, information: { name: member.name, email: member.email, role: member.role } }
            });
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
          const { data, error } = await supabase
            .from('crew')
            .delete()
            .eq('name', id);

          if (error) {
            errorMessage(error)
          } else {
            await logActivity({
              id: profile.company_id,
              action: 'delete',
              table: 'crew',
              details: { status: `Deleted a crew with name: ${id} ` }
            });
            commit('DELETE_CREW', id);
          }
        }
      }
    },
    async updateCrewMember({ commit, state, rootState }, updatedMember) {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {

        const user = session.user;
        const { data: profile, error: Err } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user.id)
          .single();

        if (Err) {
          console.error('Error fetching profile:', Err);
        } else {

          // Build payload safely
          const updatePayload = {
            status: updatedMember.status,
            next_shift: updatedMember.nextShift,
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
            const companyInfo = rootState.company;
            await logActivity({
              id: profile.company_id,
              action: 'update',
              table: 'crew',
              details: { status: `Crew: ${updatedMember.name} was assigned a new shift`, information: { ...updatePayload} }
            });
            commit('UPDATE_CREW_MEMBER', { updatedMember, companyInfo });
            localStorage.setItem('crew', JSON.stringify(state.crewMembers));
          }
        }
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
        onBoard: crew.on_board,
        email: crew.email
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
