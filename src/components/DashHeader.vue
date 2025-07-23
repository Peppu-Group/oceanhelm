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
import supabase from '../supabase'
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'DashHeader',
    props: ['name'],

    computed: {
        ...mapGetters('user', ['userProfile', 'userRoleDescription']),
        vessels() {
            return this.$store.getters['vessel/allVessels'];
        },
    },

    methods: {
        ...mapActions('user', ['fetchUserProfile']),

        async logout() {
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('Error signing out:', error.message);
            } else {
                  // Clear all localStorage data
                 localStorage.clear();
                this.$router.push({ name: 'login' })
            }

        },

        async loggedIn() {
            await this.fetchUserProfile();

            if (this.userRoleDescription) {
                Swal.fire({
                    title: "Logged in",
                    text: this.userRoleDescription,
                    icon: "info",
                    showCancelButton: true,
                    confirmButtonText: "OK",
                    cancelButtonText: "Logout",
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.cancel) {
                        this.logout(); // Call your logout method
                    }
                });
            }

        },
        addUser() {
            Swal.fire({
                title: `Add Team Members.`,
                text: 'Admins can add members of their team to MarineTech',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Add New User',
                cancelButtonText: 'Close',
                customClass: {
                    confirmButton: 'swal2-confirm'
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // Build the vessel options dynamically
                    const vesselOptions = this.vessels.map(v =>
                        `<option value="${v.name}">${v.name} (${v.registrationNumber})</option>`
                    ).join('');

                    const { value: formValues } = await Swal.fire({
                        title: 'Create New User',
                        html: `
                            <div>
                            <input type="text" id="swal-input-name" class="custom-input swal2-input" placeholder="Full Name">
                            <input type="email" id="swal-input-email" class="custom-input swal2-input" placeholder="Email Address">
                            
                            <select id="swal-input-role" class="swal2-select">
                                <option value="" disabled selected>Select Role</option>
                                <option value="owner">Owner</option>
                                <option value="captain">Captain</option>
                                <option value="staff">Staff</option>
                            </select>

                            <div style="position: relative;">
                                <input type="password" id="swal-input-password" class="custom-input swal2-input" placeholder="Password" required>
                                <span id="toggle-password" style="position: absolute; top: 25px; right: 10px; cursor: pointer;">👁️</span>
                            </div>                            
                            <div id="vessel-container" style="margin-top: 10px; display: none;">
                                <label for="swal-input-vessel">Select Vessel</label>
                                <select id="swal-input-vessel" class="swal2-select">
                                <option value="" disabled selected>Select Vessel</option>
                                ${vesselOptions}
                                </select>
                            </div>

                            <div id="category-container" style="margin-top: 10px; display: none;">
                                <label>Select Category</label>
                                <div style="margin-top: 8px;">
                                    <label><input type="checkbox" class="category-checkbox" value="controller"> Inventory Controller</label><br>
                                    <label><input type="checkbox" class="category-checkbox" value="purchaser"> Purchaser</label><br>
                                    <label><input type="checkbox" class="category-checkbox" value="requisitor"> Requisitor</label>
                                </div>
                                <p style="font-size: 11px; color: gray; margin-top: 5px;">
                                    You can select multiple, but only one of "purchaser" or "requisitor".
                                </p>
                            </div>

                            </div>
                        `,
                        focusConfirm: false,
                        showCancelButton: true,
                        confirmButtonText: 'Create User',
                        cancelButtonText: 'Cancel',
                        didOpen: () => {
                            const roleInput = document.getElementById('swal-input-role');
                            const vesselContainer = document.getElementById('vessel-container');
                            const categoryContainer = document.getElementById('category-container');
                            const categoryCheckboxes = () => Array.from(document.querySelectorAll('.category-checkbox'));
                            const passwordInput = document.getElementById('swal-input-password');
                            const toggleBtn = document.getElementById('toggle-password');

                            toggleBtn.addEventListener('click', () => {
                                const type = passwordInput.type === 'password' ? 'text' : 'password';
                                passwordInput.type = type;
                                toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
                            });


                            roleInput.addEventListener('change', (e) => {
                                const selectedRole = e.target.value;
                                vesselContainer.style.display = selectedRole === 'captain' ? 'block' : 'none';
                                categoryContainer.style.display = selectedRole === 'staff' ? 'block' : 'none';
                            });

                            // Prevent selecting both purchaser and requisitor
                            categoryCheckboxes().forEach(checkbox => {
                                checkbox.addEventListener('change', () => {
                                    const selected = categoryCheckboxes().filter(cb => cb.checked).map(cb => cb.value);
                                    if (selected.includes('purchaser') && selected.includes('requisitor')) {
                                        Swal.showValidationMessage('You can’t select both Purchaser and Requisitor');
                                    } else {
                                        Swal.resetValidationMessage();
                                    }
                                });
                            });
                        },
                        preConfirm: () => {
                            const name = document.getElementById('swal-input-name').value.trim();
                            const email = document.getElementById('swal-input-email').value.trim();
                            const role = document.getElementById('swal-input-role').value;
                            const password = document.getElementById('swal-input-password').value;
                            const vessel = document.getElementById('swal-input-vessel')?.value;

                            const categories = Array.from(document.querySelectorAll('.category-checkbox'))
                                .filter(cb => cb.checked)
                                .map(cb => cb.value);

                            const isValidEmail = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);

                            if (!name || !email || !role || !password || !isValidEmail) {
                                Swal.showValidationMessage('Please fill all required fields');
                                return false;
                            }

                            if (role === 'captain' && (!vessel || vessel === '')) {
                                Swal.showValidationMessage('Captains must select a vessel');
                                return false;
                            }

                            if (categories.includes('purchaser') && categories.includes('requisitor')) {
                                Swal.showValidationMessage('You can’t select both Purchaser and Requisitor');
                                return false;
                            }

                            return { name, email, role, password, vessel, categories };
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
                                    role: formValues.role,
                                    vessel: formValues.vessel || null,
                                    categories: formValues.categories || []
                                },
                                emailRedirectTo: 'https://marine.peppubuild.com/subredirect'
                            }
                        });

                        if (!error) {
                            Swal.fire({
                                title: "Success",
                                text: `A confirmation mail has been sent to ${formValues.name}`,
                                icon: "success"
                            });
                        }
                    }
                }
            });
        }
    }
}
</script>