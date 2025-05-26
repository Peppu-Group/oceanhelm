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
    state: () => ({
        company: {
            name: "",
            location: "",
            estYear: "",
            phoneNumber: "",
            email: "",
            license: "",
            vessels: []
        }
    }),
    mutations: {
        SET_COMPANY(state, companyData) {
            state.company = { ...state.company, 
            name: companyData.name || "",
            location: companyData.location || "",
            estYear: companyData.est_year || "",
            phoneNumber: companyData.phone_number || "",
            email: companyData.email || "",
            license: companyData.license || "",
            vessels: [] };
        }
    },
    actions: {
        async fetchCompanyInfo({ commit }, companyId) {
            try {
                const { data, error } = await supabase
                    .from('companies')
                    .select('*')
                    .eq('id', companyId)
                    .single();

                if (error) {
                    console.error('Error fetching company info:', error);
                } else {
                    commit('SET_COMPANY', data);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            }
        },

        async updateCompanyInfo({ commit }, Info) {
            const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('company_id')
                .eq('id', session.user.id)
                .single();

            // Build payload safely
            const updatePayload = {
                name: Info.name,
                location: Info.location,
                est_year: Info.estYear,
                phone_number: Info.phoneNumber,
                email: Info.email,
                license: Info.license
            };

            // Update in Supabase. we need a method to compare vesselId and component.
            const { data, companyError } = await supabase
                .from('companies')
                .update(updatePayload)
                .eq('id', profile.company_id);

            if (companyError) {
                errorMessage(error)
                return;
            } else {
                commit('SET_COMPANY', updatePayload);
            }}
        }
    },
    getters: {
        company: (state) => state.company
    }
};
