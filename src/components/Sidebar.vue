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
                <a @click="comingSoon()"><i class="bi bi-calendar-check"></i> Requisition
                    Processing</a>
            </li>
            <li>
                <a @click="editInfo()"><i class="bi bi-gear"></i> Settings</a>
            </li>
            <li>
                <a @click="comingSoon()"><i class="bi bi-question-circle"></i> Help & Support</a>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    name: 'SideBar',
    data() {
        return {
            company: {
                name: "MarineOps Solutions Inc.",
                location: "Port Harbor, CA 92614",
                estYear: 2005,
                phoneNumber: "(555) 123-4567",
                email: "info@marineops.com",
                license: "MCL-273845",
                vessels: []
            }
        };
    },
    computed: {
        vessels() {
            return this.$store.getters['vessel/allVessels'];
        }
    },
    mounted() {
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
        // get all vessels
        let vessels = this.vessels;
        this.company.vessels.push(...vessels);
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