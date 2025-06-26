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
        UPDATE_INVENTORY_ITEM(state, payload) {
            const { id, location, vessel, stockData } = payload;
        
            const index = state.inventory.findIndex(item =>
              item.id === id &&
              item.location === location &&
              item.vessel === vessel
            );
        
            if (index !== -1) {
              state.inventory[index].value = stockData.value;
              state.inventory[index].currentStock = stockData.currentStock;
              state.inventory[index].status = stockData.status;
            }
        }
    },
    actions: {
        setCrew({ commit }, inventory) {
            commit('SET_INVENTORY', inventory);
        },
        async addInventory({ commit }, inventory) {
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
                                maxStock: inventory.maxStock,
                                minStock: inventory.minStock,
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
                            maxStock: inventory.maxStock,
                            minStock: inventory.minStock,
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

        async updateInventory({ commit }, payload) {
            const { data, error } = await supabase
                .from('inventory')
                .update({
                    value: payload.stockData.value,
                    currentstock: payload.stockData.currentStock,
                    status: payload.stockData.status,
                    lastupdated: new Date().toISOString()
                })
                .match({
                    itemId: payload.id,
                    location: payload.location,
                    vessel: payload.vessel
                });

            if (error) {
                console.error('Update failed:', error.message);
            } else {
                commit('UPDATE_INVENTORY_ITEM', payload);
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
                maxStock: inventory.maxStock,
                minStock: inventory.minStock,
                active: inventory.active
            }));

            commit('SET_INVENTORY', inventory);
        },
    },
    getters: {
        allInventory: state => state.inventory,
    }
};
