<template>
    <nav id="sidebar">
        <div class="logo d-flex align-items-center left">
            <i class="bi bi-water me-2"></i>
            <span>MarineTech</span>
        </div>
        <ul class="list-unstyled components mt-4">
            <li class="active">
                <a href="/app/dashboard"><i class="bi bi-speedometer2"></i> Dashboard</a>
                <a href="/app/certifications"><i class="bi bi-card-checklist"></i> Manage Certifications</a>
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
                    <a class="dropdown-item black" @click="crewManage('vessel.name')">All Crew</a>
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

export default {
    name: 'SideBar',
    computed: {
        vessels() {
            return this.$store.getters['vessel/allVessels'];
        },
        company() {
            return this.$store.getters['company/company'];
        },
        ...mapGetters('user', ['userProfile']),
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
            if (this.userProfile.role == 'owner') {
                const { value: formValues } = await Swal.fire({
                    title: 'Update Company Information',
                    html: `
      <div style="text-align: left; max-width: 400px; margin: 0 auto;">
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
                    preConfirm: () => {
                        const location = document.getElementById('swal-location').value.trim();
                        const estYear = document.getElementById('swal-estyear').value;
                        const phoneNumber = document.getElementById('swal-phone').value.trim();
                        const email = document.getElementById('swal-email').value.trim();
                        const license = document.getElementById('swal-license').value.trim();

                        // Validate email format if provided
                        if (email && !this.isValidEmail(email)) {
                            Swal.showValidationMessage('Please enter a valid email address');
                            return false;
                        }

                        // Validate year if provided
                        if (estYear && (estYear < 1800 || estYear > 2025)) {
                            Swal.showValidationMessage('Please enter a valid year between 1800 and 2025');
                            return false;
                        }

                        // Return only non-empty values
                        const result = {};
                        if (location) result.location = location;
                        if (estYear) result.estYear = parseInt(estYear);
                        if (phoneNumber) result.phoneNumber = phoneNumber;
                        if (email) result.email = email;
                        if (license) result.license = license;

                        return result;
                    }
                });

                if (formValues) {
                    // Process the form data
                    await this.$store.dispatch('company/updateCompanyInfo', formValues)

                    // Show success message
                    await Swal.fire({
                        title: 'Success!',
                        text: 'Company information has been updated successfully.',
                        icon: 'success',
                        confirmButtonColor: '#0d6efd',
                        timer: 2000,
                        timerProgressBar: true
                    });

                    return formValues;
                }

                return null;
            } else {
                Swal.fire({
                    title: "Route Protected!",
                    text: `Only owners can edit company info, you don't have access`,
                    icon: "warning",
                    confirmButtonText: "OK"
                });
            }
        },
        // Email validation helper function
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
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