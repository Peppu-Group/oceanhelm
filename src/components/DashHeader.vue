<template>
    <div class="page-header d-flex justify-content-between align-items-center">
        <h2 style="margin-left: 20px;">{{ name }}</h2>
        <div class="d-flex">
            <button class="btn btn-outline-primary me-2" @click="addUser()" v-if="this.userProfile.role == 'owner'">
                <i class="bi bi-bell"></i>
                <span class="badge bg-danger">1</span>
            </button>
            <button class="btn btn-outline-primary" @click="loggedIn()">
                <i class="bi bi-person-circle"></i>
            </button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'DashHeader',
    props: ['name'],

    computed: {
        ...mapGetters('user', ['userProfile', 'userRoleDescription']),
    },

    methods: {
        ...mapActions('user', ['fetchUserProfile']),

        async loggedIn() {
            await this.fetchUserProfile();

            if (this.userRoleDescription) {
                Swal.fire({
                    title: "Logged in",
                    text: this.userRoleDescription,
                    icon: "info"
                });
            }
        },
        addUser() {
            Swal.fire({
                title: `Add Team Members.`,
                text: 'Owners can add members of their team to MarineTech',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Add New User',
                cancelButtonText: 'Close',
                customClass: {
                    confirmButton: 'swal2-confirm'
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { value: formValues } = await Swal.fire({
                        title: 'Create New User',
                        html:
                            `<input id="swal-input-name" class="swal2-input" placeholder="Full Name">` +
                            `<input id="swal-input-email" class="swal2-input" placeholder="Email Address">`
                            `<select id="swal-input-role" class="swal2-select">
                            <option value="" disabled selected>Select Role</option>
                            <option value="owner">Owner</option>
                            <option value="captain">Captain</option>
                            <option value="staff">Staff</option>
                            </select>` +
                            `<input id="swal-input-password" type="password" class="swal2-input" placeholder="Password">`,
                        focusConfirm: false,
                        showCancelButton: true,
                        preConfirm: () => {
                            const name = document.getElementById('swal-input-name').value;
                            const email = document.getElementById('swal-input-email').value;
                            const role = document.getElementById('swal-input-role').value;
                            const password = document.getElementById('swal-input-password').value;

                            if (!name || !role || !password || !email) {
                                Swal.showValidationMessage('All fields are required');
                                return;
                            }

                            return { name, role, password, email };
                        }
                    });

                    if (formValues) {
                        const { data: signUpData, error } = await supabase.auth.signUp({
                            email: formValues.email,
                            password: formValues.password,
                            options: {
                                data: {
                                    fullName: formValues.name,
                                    company_id: this.userProfile.company_id,
                                    role: formValues.role
                                },
                                emailRedirectTo: 'https://marine.peppubuild.com/subredirect'
                            }
                        });
                    }
                }
            });
        }
    }
}
</script>