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
        UPDATE_REQUISITION(state, updatedRequisition) {
            const index = state.requisitions.findIndex(r => r.id === updatedRequisition.id);
            if (index !== -1) {
                const requisition = state.requisitions[index];

                // Always update status
                requisition.status = updatedRequisition.status;

                // Conditionally update justification
                if (updatedRequisition.justification !== undefined && updatedRequisition.justification !== null) {
                    requisition.justification = updatedRequisition.justification;
                }

                // Conditionally update declinedBy and rejectionReason
                if (updatedRequisition.declinedBy !== undefined && updatedRequisition.declinedBy !== null) {
                    requisition.declinedBy = updatedRequisition.declinedBy;
                    requisition.rejectionReason = updatedRequisition.rejectionReason;
                }

                // Conditionally update infoRequestedBy and requestedInfo
                if (updatedRequisition.infoRequestedBy !== undefined && updatedRequisition.infoRequestedBy !== null) {
                    requisition.infoRequestedBy = updatedRequisition.infoRequestedBy;
                    requisition.requestedInfo = updatedRequisition.requestedInfo;
                }
            }
        }

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
                        const existing = JSON.parse(localStorage.getItem('requisitions') || '[]');
                        const updated = [...existing, requisition];
                        commit('SET_REQUISITIONS', updated);
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
        async updateRequisition({ commit }, updatedRequisition) {
            return new Promise(async (resolve, reject) => {
                const updateRequisition = {
                    status: updatedRequisition.status,
                };

                if (updatedRequisition.justification !== undefined && updatedRequisition.justification !== null) {
                    updateRequisition.justification = updatedRequisition.justification;
                }

                if (updatedRequisition.declinedBy !== undefined && updatedRequisition.declinedBy !== null) {
                    updateRequisition.declinedBy = updatedRequisition.declinedBy;
                    updateRequisition.rejectionReason = updatedRequisition.rejectionReason;
                }

                if (updatedRequisition.infoRequestedBy !== undefined && updatedRequisition.infoRequestedBy !== null) {
                    updateRequisition.infoRequestedBy = updatedRequisition.infoRequestedBy;
                    updateRequisition.requestedInfo = updatedRequisition.requestedInfo;
                }

                const { error } = await supabase
                    .from('requisitions')
                    .update(updateRequisition)
                    .eq('id', updatedRequisition.id);

                if (error) {
                    errorMessage(error)
                    reject(error); // Reject promise
                } else {
                    commit('UPDATE_REQUISITION', updatedRequisition);
                    resolve(); // Resolve promise
                }
            });
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