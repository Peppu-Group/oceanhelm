import supabase from '../../supabase'

export default {
  namespaced: true,

  state: {
    profile: null
  },

  getters: {
    userProfile: (state) => state.profile,
    userRoleDescription: (state) => {
      if (!state.profile) return null;
      const { full_name, role } = state.profile;

      switch (role) {
        case 'owner':
          return `You're logged as ${full_name}, with owner access. You have full access, you can see the changes everyone makes.`;
        case 'captain':
          return `You're logged as ${full_name}, with captain access. You have full access for your vessel's information, you can see the changes everyone makes to your vessel.`;
        case 'staff':
          return `You're logged as ${full_name}, with an employee access. You have limited access, everyone with owner or captain access can see the changes you make.`;
        default:
          return `You're logged in as ${full_name}.`;
      }
    }
  },

  mutations: {
    SET_PROFILE(state, profile) {
      state.profile = profile;
    }
  },

  actions: {
    async fetchUserProfile({ commit }) {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Error fetching session:', sessionError);
        return;
      }

      if (session) {
        const user = session.user;

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          commit('SET_PROFILE', profile);
        }
      }
    }
  }
}
