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
        requisitions: JSON.parse(localStorage.getItem('requisitions') || '[]')
    },
    mutations: {
        SET_REQUISITIONS(state, payload) {
            state.requisitions = payload;
            localStorage.setItem('requisitions', JSON.stringify(payload));
        },
    },
    actions: {
        setRequisitions({ commit }, requisitions) {
            commit('SET_REQUISITIONS', requisitions);
        },
        async addRequisition({ commit }, requisition) {
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
                        .from('requisitions')
                        .insert([
                            {
                                id: requisition.id,
                                itemCode: requisition.itemCode,
                                items: requisition.items,
                                justification: requisition.justification,
                                neededDate: requisition.neededDate,
                                submittedDate: requisition.submittedDate,
                                department: requisition.department,
                                project: requisition.project,
                                requestor: requisition.requestor,
                                status: requisition.status,
                                company_id: companyId
                            }
                        ], { returning: 'minimal' }
                        );

                    if (error) {
                        // tell user about error.
                        errorMessage(error)
                    } else {
                        commit('SET_REQUISITIONS', requisition);
                        Swal.fire({
                            title: 'Success!',
                            text: 'Requisition submitted successfully.',
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
        async fetchRequisitions({ commit }) {
            const { data, error } = await supabase
                .from('requisitions')
                .select('*');

            if (error) {
                console.error('Error fetching crew:', error.message);
                return [];
            }

            commit('SET_REQUISITIONS', data);
        },
    },
    getters: {
        allRequisitions: state => state.requisitions
    }
}