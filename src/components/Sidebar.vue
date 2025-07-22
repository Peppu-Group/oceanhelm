<template>
    <nav id="sidebar">
        <div class="logo d-flex align-items-center left">
            <i class="bi bi-water me-2"></i>
            <span>MarineTech</span>
        </div>
        <ul class="list-unstyled components mt-4">
            <li class="active">
                <a href="/app/dashboard"><i class="bi bi-speedometer2"></i> Dashboard</a>
            </li>
            <li v-if="this.userProfile.role == 'owner'">
                <a href="/activity-log"><i class="bi bi-activity"></i> Activity Log</a>
            </li>
            <li>
                <a> Services</a>
            </li>
            <li class="dropdown" @click="getMaintenance()">
                <a><i class="bi bi-tools"></i> Maintenance</a>
            </li>
            <li>
                <a class="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i
                        class="bi bi-people"></i> Crew Management</a>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <a class="dropdown-item black" @click="crewManage('vessel.name')"
                        v-if="this.userProfile.role == 'owner' || this.userProfile.role == 'staff'">All Crew</a>
                    <div class="dropdown-divider black"></div>
                    <a class="dropdown-item black" @click="crewManage()">Get Crew by Vessel</a>
                </div>
            </li>
            <li>
                <a href="/app/inventory"><i class="bi bi-clipboard-data"></i> Inventory Management</a>
            </li>
            <li>
                <a href="/app/requisition"><i class="bi bi-calendar-check"></i> Requisition
                    Processing</a>
            </li>
            <li>
                <a @click="comingSoon()"><i class="fas fa-ship"></i> Voyage
                    Manager</a>
            </li>
            <li v-if="this.userProfile.role == 'owner'">
                <a @click="updateCompanyInfo()"><i class="bi bi-gear"></i> Settings</a>
            </li>
            <li>
                <a @click="comingSoon()"><i class="bi bi-question-circle"></i> Help & Support</a>
            </li>
        </ul>
    </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import supabase from '../supabase';

export default {
    name: 'SideBar',
    data() {
        return {
            selectedLogoFile: null
        }
    },
    computed: {
        vessels() {
            return this.$store.getters['vessel/allVessels'];
        },
        company() {
            return this.$store.getters['company/company'];
        },
        ...mapGetters('user', ['userProfile'])
    },
    async mounted() {
        // fetch users
        await this.fetchUserProfile()
        // fetch vessels.
        this.$store.dispatch('vessel/fetchVessels');
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const content = document.getElementById('content');
        if (window.innerWidth >= 768) {
            sidebar.classList.toggle('active');
            content.classList.toggle('active');
        }
        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
            content.classList.toggle('active');
        });
        // Handle clicks outside sidebar to close it on mobile
        document.addEventListener('click', function (event) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnToggleBtn = sidebarToggle.contains(event.target);
            if (!isClickInsideSidebar && !isClickOnToggleBtn && window.innerWidth < 768 && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                content.classList.remove('active');
            }
        });

        if (this.userProfile) {
            await this.$store.dispatch('company/fetchCompanyInfo', this.userProfile.company_id);
        }

        // get all vessels
        let vessels = this.vessels;
        // this.company.vessels.push(...vessels);
        // get all tasks and determine if vessel is undermaintenance.
        vessels = vessels.map(vessel => {
            const registrationNumber = vessel.registrationNumber;
            const tasks = this.getTasks(registrationNumber);
            const soonTask = tasks.find(task => task.status === 'Soon');
            if (soonTask && vessel.status != 'Inactive') {
                vessel.status = 'Maintenance';
            }
            return vessel;
        });
        // Save updated vessels back to localStorage
        // localStorage.setItem('vessel', JSON.stringify(vessels));
        // this.company.vessels = vessels;
    },
    methods: {
        ...mapActions('user', ['fetchUserProfile']),
        getMaintenance() {
            this.$router.push({ name: 'maintenanceroute' })
        },
        crewManage(id = null) {
            if (id) {
                this.$router.push({ name: 'crew' });
            } else {
                this.$router.push({ name: 'crewroute' });
            }
        },
        comingSoon() {
            Swal.fire({
                title: "Coming soon!",
                text: "This feature is coming soon",
                icon: "info"
            });
        },
        editInfo() {
            Swal.fire({
                title: "Company info",
                text: "You will be able to edit company info here",
                icon: "info"
            });
        },
        editInfo() {
            Swal.fire({
                title: "Company info",
                text: "You will be able to edit company info here",
                icon: "info"
            });
        },
        getTasks(regno) {
            return this.$store.getters['tasks/getTasksByVessel'](regno);
        },
        async updateCompanyInfo(currentData = this.company) {
            const { value: formValues } = await Swal.fire({
                title: 'Update Company Information',
                html: `
                        <div style="text-align: left; max-width: 400px; margin: 0 auto;">
                        <div style="margin-bottom: 20px;">
                            <label class="file-upload">
                            <i class="bi bi-upload"></i> Change Logo
                            <input type="file" id="swal-logo-input" accept="image/*" />
                            <small id="file-name-display" style="display:block; margin-top: 5px; font-size: 12px; color: gray;"></small>
                            </label>
                        </div>

                        <div style="margin-bottom: 20px;">
                            <label for="swal-location" style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">
                            📍 Location
                            </label>
                            <input id="swal-location" class="swal2-input" placeholder="Enter company location" 
                                value="${currentData.location || ''}" style="margin: 0; width: 100%;">
                        </div>

                        <div style="margin-bottom: 20px;">
                            <label for="swal-estyear" style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">
                            📅 Established Year
                            </label>
                            <input id="swal-estyear" class="swal2-input" type="number" 
                                placeholder="Enter establishment year" min="1800" max="2025"
                                value="${currentData.estYear || ''}" style="margin: 0; width: 100%;">
                        </div>

                        <div style="margin-bottom: 20px;">
                            <label for="swal-phone" style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">
                            📞 Phone Number
                            </label>
                            <input id="swal-phone" class="swal2-input" type="tel" 
                                placeholder="Enter phone number" 
                                value="${currentData.phoneNumber || ''}" style="margin: 0; width: 100%;">
                        </div>

                        <div style="margin-bottom: 20px;">
                            <label for="swal-email" style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">
                            📧 Email Address
                            </label>
                            <input id="swal-email" class="swal2-input" type="email" 
                                placeholder="Enter email address" 
                                value="${currentData.email || ''}" style="margin: 0; width: 100%;">
                        </div>

                        <div style="margin-bottom: 20px;">
                            <label for="swal-license" style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">
                            🏷️ License Number
                            </label>
                            <input id="swal-license" class="swal2-input" placeholder="Enter license number" 
                                value="${currentData.license || ''}" style="margin: 0; width: 100%;">
                        </div>

                        <p style="font-size: 12px; color: #666; margin-top: 20px; text-align: center;">
                            💡 Don't edit the fields if you don't want to change them
                        </p>
                        </div>
                    `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Update Information',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#6c757d',
                width: '500px',
                customClass: {
                    popup: 'company-info-popup',
                    title: 'company-info-title'
                },

                didOpen: async () => {
                    const fileInput = document.getElementById('swal-logo-input');
                    const fileNameDisplay = document.getElementById('file-name-display');

                    if (fileInput && fileNameDisplay) {
                        fileInput.addEventListener('change', async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                                fileNameDisplay.textContent = `Selected file: ${file.name}`;
                                this.selectedLogoFile = file;
                                await this.handleLogoChange(file)
                            } else {
                                fileNameDisplay.textContent = '';
                                this.selectedLogoFile = null;
                            }
                        });
                    }
                },

                preConfirm: () => {
                    const location = document.getElementById('swal-location').value.trim();
                    const estYear = document.getElementById('swal-estyear').value;
                    const phoneNumber = document.getElementById('swal-phone').value.trim();
                    const email = document.getElementById('swal-email').value.trim();
                    const license = document.getElementById('swal-license').value.trim();

                    if (email && !this.isValidEmail(email)) {
                        Swal.showValidationMessage('Please enter a valid email address');
                        return false;
                    }

                    if (estYear && (estYear < 1800 || estYear > 2025)) {
                        Swal.showValidationMessage('Please enter a valid year between 1800 and 2025');
                        return false;
                    }

                    const result = {};
                    if (location) result.location = location;
                    if (estYear) result.estYear = estYear;
                    if (phoneNumber) result.phoneNumber = phoneNumber;
                    if (email) result.email = email;
                    if (license) result.license = license;

                    return result;
                }
            });

            if (formValues) {
                formValues.logo = this.company.logo;
                const changedFields = {};

                for (const key in formValues) {
                    if (formValues[key] !== currentData[key]) {
                        changedFields[key] = {
                            from: currentData[key],
                            to: formValues[key]
                        };
                    }
                }

                if (Object.keys(changedFields).length === 0) {
                    await Swal.fire({
                        title: 'No Changes Detected',
                        text: 'No fields were changed. Update cancelled.',
                        icon: 'info',
                        confirmButtonColor: '#0d6efd'
                    });
                    return null;
                }

                await this.$store.dispatch('company/updateCompanyInfo', {
                    formValues,
                    changedFields,
                    newLogo: this.selectedLogoFile || null
                });

                await Swal.fire({
                    title: 'Success!',
                    text: 'Company information has been updated successfully. Image update may take as much as 1 hour to update in your local system due to caching',
                    icon: 'success',
                    confirmButtonColor: '#0d6efd',
                    timer: 2000,
                    timerProgressBar: true
                });

                return formValues;
            }

        },

        // Email validation helper function
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        async handleLogoChange(file) {

            if (file) {
                this.selectedLogoFile = file;
                // Generate a temporary preview
                // this.previewLogo = URL.createObjectURL(file);
                // You can now use this.selectedLogoFile in your Supabase upload
                // Example: this.uploadLogoToSupabase(this.selectedLogoFile);
                let companyId = localStorage.getItem('company_id');
                const { data, error } = await supabase.storage
                    .from('company-files')
                    .upload(`logos/${companyId}.png`, file, {
                        cacheControl: '3600',
                        upsert: true
                    });

                if (data) {
                    const filePath = data.path;

                    const { data: publicUrlData, error: urlError } = supabase
                        .storage
                        .from('company-files')
                        .getPublicUrl(filePath);

                    if (urlError) {
                        console.error('Failed to get public URL', urlError);
                        return;
                    }

                    const publicUrl = publicUrlData.publicUrl;

                    // Update the company's logo with the public URL
                    const { error: updateError } = await supabase
                        .from('companies')
                        .update({ logo: publicUrl })
                        .eq('id', companyId);

                    if (updateError) console.error('Update failed', error);
                }
            }

        }
    }
}
</script>
<style scoped>
.left {
    margin-left: 20px;
}

.black {
    color: black !important;
}
</style>