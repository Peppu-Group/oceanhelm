import supabase from '../../supabase';

export default {
    namespaced: true,
    state: () => ({
      company: {
        name: "",
        location: "",
        estYear: null,
        phoneNumber: "",
        email: "",
        license: "",
        vessels: JSON.parse(localStorage.getItem('vessel') || '[]')
      }
    }),
    mutations: {
      SET_COMPANY(state, companyData) {
        state.company = { ...state.company, ...companyData };
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
      }
    },
    getters: {
      company: (state) => state.company
    }
  };
  