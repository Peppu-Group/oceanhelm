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
    inventory: JSON.parse(localStorage.getItem('inventory') || '[]')
  },
  mutations: {
    SET_INVENTORY(state, payload) {
      state.inventory = payload;
      localStorage.setItem('inventory', JSON.stringify(payload));
    },
    ADD_INVENTORY(state, inventory) {
      state.inventory.push(inventory);
      localStorage.setItem('inventory', JSON.stringify(state.inventory));
    },
    UPDATE_CREW(state, inventory) {
      const index = state.inventory.findIndex(m => m.id === inventory.id);
      if (index !== -1) {
        state.inventory.splice(index, 1, inventory);
        localStorage.setItem('inventory', JSON.stringify(state.inventory));
      }
    },
  },
  actions: {
    setCrew({ commit }, inventory) {
      commit('SET_INVENTORY', inventory);
    },
    async addInventory({ commit }, inventory) {
        console.log(inventory)
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
            .from('inventory')
            .insert([
              {
                itemId: inventory.itemId,
                itemname: inventory.itemname,
                value: inventory.value,
                status: inventory.status,
                category: inventory.category,
                vessel: inventory.vessel,
                currentstock: inventory.currentstock,
                lastupdated: inventory.lastupdated,
                location: inventory.location,
                active: true,
                company_id: companyId
              }
            ], { returning: 'minimal' }
            );

          if (error) {
            // tell user about error.
            errorMessage(error)
          } else {
            const transformedInventory = {
                id: inventory.itemId,
                location: inventory.location,
                itemName: inventory.itemname,
                value: inventory.value,
                status: inventory.status,
                category: inventory.category,
                vessel: inventory.vessel,
                currentStock: inventory.currentstock,
                lastIpdated: inventory.lastUpdated,
                active: true
            };

            commit('ADD_INVENTORY', transformedInventory);
            Swal.fire({
                title: 'Success!',
                text: 'Inventory item has been added successfully.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
          }
        }
      } else {
        // router push to login
      }

    },

    async fetchInventory({ commit }) {
      const { data, error } = await supabase
        .from('inventory')
        .select('*');

      if (error) {
        console.error('Error fetching inventory:', error.message);
        return [];
      }

      // Extract only name and registration_number
      const inventory = data.map(inventory => ({
        id: inventory.itemId,
        location: inventory.location,
        itemName: inventory.itemname,
        value: inventory.value,
        status: inventory.status,
        category: inventory.category,
        vessel: inventory.vessel,
        currentStock: inventory.currentstock,
        lastIpdated: inventory.lastUpdated,
        active: inventory.active
      }));

      commit('SET_INVENTORY', inventory);
    },
  },
  getters: {
    allInventory: state => state.inventory,
  }
};
