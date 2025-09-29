<template>
    <DashHead :name="name" :user-profile="userProfile" @add-user="addUser" @logged-in="loggedIn" />
</template>

<script>
import supabase from '../supabase'
import { mapGetters, mapActions } from 'vuex';
import { DashHead } from 'oceanhelm'
import { createClient } from '@supabase/supabase-js'

export default {
    name: 'DashHeader',

    props: {
        name: String,
    },

    components: {
        DashHead
    },

    computed: {
        ...mapGetters('user', ['userProfile', 'userRoleDescription']),
        ...mapGetters('vessel', ['allVessels']),
        vessels() {
            return this.allVessels
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
                text: 'Admins can add members of their team to OceanHelm',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Add New User',
                showCloseButton: true,
                cancelButtonText: 'Update Role',
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

                            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
                                emailRedirectTo: 'https://oceanhelmtech.com/subredirect'
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
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // open update role flow
                    this.updateRole();
                }
            });
        },
        async updateRole() {
            // Step 1: get the company_id of the logged in user

            // Step 2: fetch all profiles in the same company
            let comp_id = localStorage.getItem('company_id')
            const { data: companyProfiles, error: profilesError } = await supabase
                .from('profiles')
                .select('full_name, role, vessel, id')
                .eq('company_id', comp_id);

            if (profilesError) {
                console.error("Error fetching company profiles:", profilesError);
            } else {
                const userOptions = companyProfiles.map(p =>
                    `<option value="${p.full_name}" data-role="${p.role}" data-vessel="${p.vessel || ''}" data-user-id="${p.id}">
                        ${p.full_name} - ${p.role}${p.vessel ? ` (${p.vessel})` : ""}
                    </option>`
                ).join('');

                const { value: formValues } = await Swal.fire({
                    title: 'Update User Role',
                    showCloseButton: true,
                    html: `
                    <div>
                        <select id="swal-input-user" class="swal2-select-2">
                            <option value="" disabled selected>Select User</option>
                            ${userOptions}
                        </select>

                        <div id="vessel-container" style="margin-top: 10px; display: none;">
                            <label for="swal-input-vessel">Select Vessel</label>
                            <select id="swal-input-vessel" class="swal2-select-2">
                                <option value="" disabled selected>Select Vessel</option>
                                ${this.vessels.map(v => `<option value="${v.name}">${v.name} (${v.registrationNumber})</option>`).join('')}
                            </select>
                            <p style="font-size: 11px; color: gray; margin-top: 5px;">
                                You can assign captains to another vessel.
                            </p>
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

                                Remember this action rewrites the former settings.
                            </p>
                        </div>
                    </div>
                    `,
                    didOpen: () => {
                        const userInput = document.getElementById('swal-input-user');
                        const vesselContainer = document.getElementById('vessel-container');
                        const categoryContainer = document.getElementById('category-container');
                        const categoryCheckboxes = () => Array.from(document.querySelectorAll('.category-checkbox'));

                        // Event: user selection
                        userInput.addEventListener('change', (e) => {
                            const selectedOption = userInput.options[userInput.selectedIndex];
                            const role = selectedOption.getAttribute('data-role');

                            // Hide all first
                            vesselContainer.style.display = 'none';
                            categoryContainer.style.display = 'none';

                            if (role === 'captain') {
                                vesselContainer.style.display = 'block';
                            } else if (role === 'staff') {
                                categoryContainer.style.display = 'block';
                            }
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
                        const userInput = document.getElementById('swal-input-user');
                        const selectedOption = userInput.options[userInput.selectedIndex];
                        const role = selectedOption ? selectedOption.getAttribute('data-role') : null;
                        const user_id = selectedOption ? selectedOption.getAttribute('data-user-id') : null;
                        const company_id = comp_id;
                        const vessel = document.getElementById('swal-input-vessel')?.value;
                        const categories = Array.from(document.querySelectorAll('.category-checkbox'))
                            .filter(cb => cb.checked)
                            .map(cb => cb.value);

                        if (!role) {
                            Swal.showValidationMessage('Please select a user');
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

                        return { role, vessel, categories, company_id, user_id };
                    }
                });
                if (formValues) {
                    const supabaseAdmin = createClient(import.meta.env.VITE_APP_URL, import.meta.env.VITE_APP_SERVICE_ROLE);

                    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
                        formValues.user_id, // user id
                        {
                            user_metadata: {
                                company_id: formValues.company_id,
                                role: formValues.role,
                                vessel: formValues.vessel || null,
                                categories: formValues.categories || null
                            }
                        }
                    );

                    if (error) {
                        Swal.fire({
                            title: 'Unsuccessful!',
                            text: error.message,
                            icon: 'error'
                        })
                    } else {
                        // update profile before success message
                        const { data, error } = await supabase
                            .from('profiles')
                            .update({
                                vessel: formValues.vessel,
                                categories: formValues.categories || null, // must be array (e.g., ["controller", "purchaser"])
                            })
                            .eq('id', formValues.user_id) // update only the selected user
                            .select();

                        if (error) {
                            Swal.fire({
                                title: 'Unsuccessful!',
                                text: error.message,
                                icon: 'error'
                            })
                            return null;
                        } else {
                            Swal.fire({
                                title: 'Successful',
                                text: 'User Role Updated',
                                icon: 'success'
                            })
                        }
                    }
                }
            }
        }
    }
}
</script>