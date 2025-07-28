import supabase from '../../supabase';
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
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Added to Fleet!',
        text: 'Your vessel has been added successfully. It should be in your dashboard now.',
        confirmButtonText: 'Close',
        customClass: {
          confirmButton: 'swal2-confirm'
        }
      });
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
      Swal.fire('Deleted!', 'The vessel has been deleted.', 'success');
    }
  },
  actions: {
    setVessels({ commit }, vessels) {
      commit('SET_VESSELS', vessels);
    },
    async addVessel({ commit }, vessel) {
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
            .from('vessels')
            .insert([
              {
                name: vessel.name,
                company_id: companyId,
                registration_number: vessel.registrationNumber,
                status: vessel.status
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
              table: 'vessel',
              details: {
                status: `Added a new vessel to your fleet`, information: {
                  name: vessel.name,
                  registration_number: vessel.registrationNumber,
                  status: vessel.status
                }
              }
            });
            commit('ADD_VESSEL', vessel);
          }
        }
      } else {
        // router push to login
      }

    },
    async fetchVessels({ commit }) {
      const { data, error } = await supabase
        .from('vessels')
        .select('*');

      if (error) {
        console.error('Error fetching vessels:', error.message);
        return [];
      }

      // Extract only name and registration_number
      const simplifiedVessels = data.map(vessel => ({
        name: vessel.name,
        registrationNumber: vessel.registration_number,
        status: vessel.status,
        type: vessel.type,
        built: vessel.built,
        flag: vessel.flag,
        length: vessel.length,
        beam: vessel.beam,
        draft: vessel.draft,
        gross: vessel.gross,
        net: vessel.net,
        certifications: vessel.certifications
      }));

      commit('SET_VESSELS', simplifiedVessels);
      return simplifiedVessels;
    },
    async updateVessel({ commit }, vessel) {
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
          // Update in Supabase
          const { data, error } = await supabase
            .from('vessels')
            .update(vessel)
            .eq('registration_number', vessel.registration_number)

          await logActivity({
            id: profile.company_id,
            action: 'update',
            table: 'vessel',
            details: {
              status: `Updated vessel information, with registration number: ${vessel.registration_number}`
            }
          });
        }
      }
    },
    async updateVesselCert({ rootState }, { cert, id }) {
      let email = rootState.company.company.email  ;

       // Attach email to each certificate
      const cert_with_email = cert.map(c => ({
        ...c,
        email
      }));
      // Update in Supabase
      const { data, error } = await supabase
        .from('vessels')
        .update({ certifications: cert_with_email  })
        .eq('registration_number', id);
    },
    async deleteVessel({ commit }, id) {
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
            .from('vessels')
            .delete()
            .eq('registration_number', id);

          if (error) {
            errorMessage(error)
          } else {
            await logActivity({
              id: profile.company_id,
              action: 'delete',
              table: 'vessel',
              details: {
                status: `Deleted vessel, with registration number: ${id}`
              }
            });
            commit('DELETE_VESSEL', id);
          }
        }
      }
    },


    markInactive: async ({ state, commit }, registrationNumber) => {
      const vessels = [...state.vessels];
      const index = vessels.findIndex(v => v.registrationNumber === registrationNumber);
      if (index === -1) return;

      // Toggle status
      const currentStatus = vessels[index].status;
      const newStatus = currentStatus === 'Inactive' ? 'Active' : 'Inactive';

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
          // Update in Supabase
          const { data, error } = await supabase
            .from('vessels')
            .update({ status: newStatus })
            .eq('registration_number', registrationNumber)

          if (error) {
            Swal.fire({
              title: 'Error!',
              text: `Failed to update vessel status: ${error.message}`,
              icon: 'error'
            });
            return;
          } else {
            // Update in local state
            vessels[index].status = newStatus;
            await logActivity({
              id: profile.company_id,
              action: 'update',
              table: 'vessel',
              details: {
                status: `Changed the status of vessel, with registration number: ${registrationNumber} to ${newStatus}`
              }
            });
            commit('SET_VESSELS', vessels);

            // Optional success message
            if (newStatus === 'Active') {
              Swal.fire({
                title: 'Vessel Active!',
                text: 'Your vessel is now active.',
                icon: 'success'
              });
            }
          }
        }
      }
    }
  },
  getters: {
    allVessels: state => state.vessels
  }
};
