<template>
    <!-- Wave background -->
    <div class="wave-bg"></div>

    <!-- Sidebar Toggle Button -->
    <button class="toggle-btn" id="sidebarToggle">
        <i class="bi bi-list"></i>
    </button>

    <!-- Sidebar -->
    <nav id="sidebar">
        <div class="logo d-flex align-items-center left">
            <i class="bi bi-water me-2"></i>
            <span>MarineTech</span>
        </div>
        <ul class="list-unstyled components mt-4">
            <li class="active">
                <a href="#"><i class="bi bi-speedometer2"></i> Dashboard</a>
            </li>
            <li>
                <a href="#"><i class="bi bi-ship"></i> Fleet Management</a>
            </li>
            <li>
                <a><i class="bi bi-tools"></i> Maintenance</a>
            </li>
            <li>
                <a @click="comingSoon()"><i class="bi bi-calendar-check"></i> Requisition Processing</a>
            </li>
            <li>
                <a @click="comingSoon()"><i class="bi bi-clipboard-data"></i> Inventory Management</a>
            </li>
            <li>
                <a @click="crewManage()"><i class="bi bi-people"></i> Crew Management</a>
            </li>
            <li>
                <a @click="comingSoon()"><i class="bi bi-geo-alt"></i> Cross-Vessel Data Sharing</a>
            </li>
            <li>
                <a @click="editInfo()"><i class="bi bi-gear"></i> Settings</a>
            </li>
            <li>
                <a @click="comingSoon()"><i class="bi bi-question-circle"></i> Help & Support</a>
            </li>
        </ul>
    </nav>

    <!-- Page Content -->
    <div id="content">
        <div class="container-fluid">
            <div class="page-header d-flex justify-content-between align-items-center">
                <h2 style="margin-left: 20px;">Fleet Dashboard</h2>
                <div class="d-flex">
                    <button class="btn btn-outline-primary" @click="loggedIn()">
                        <i class="bi bi-person-circle"></i>
                    </button>
                </div>
            </div>

            <!-- Company Details -->
            <div class="company-card">
                <div class="row">
                    <div class="col-md-2">
                        <div class="company-logo">
                            <i class="bi bi-building"></i>
                        </div>
                    </div>
                    <div class="col-md-10">
                        <h3>{{ company.name }}</h3>
                        <div class="row mt-3">
                            <div class="col-md-4">
                                <p><strong>Location:</strong> {{ company.location }}</p>
                                <p><strong>Established:</strong> {{ company.estYear }}</p>
                            </div>
                            <div class="col-md-4">
                                <p><strong>Contact:</strong> {{ company.phoneNumber }}</p>
                                <p><strong>Email:</strong> {{ company.email }}</p>
                            </div>
                            <div class="col-md-4">
                                <p><strong>Fleet Size:</strong> {{ getVesselCount() }}</p>
                                <p><strong>License:</strong> {{ company.license }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Fleet Summary -->
            <div class="row mb-3">
                <div class="col-md-3">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body d-flex align-items-center">
                            <div class="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                                <i class="bi bi-check-circle-fill text-primary fs-4"></i>
                            </div>
                            <div>
                                <h6 class="mb-0">Active Vessels</h6>
                                <h3 class="mt-2 mb-0"> {{ getActiveVesselCount() }}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body d-flex align-items-center">
                            <div class="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                                <i class="bi bi-tools text-warning fs-4"></i>
                            </div>
                            <div>
                                <h6 class="mb-0">Under Maintenance</h6>
                                <h3 class="mt-2 mb-0"> {{ getMaintenanceVesselCount() }}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body d-flex align-items-center">
                            <div class="rounded-circle bg-secondary bg-opacity-10 p-3 me-3">
                                <i class="bi bi-pause-circle-fill text-secondary fs-4"></i>
                            </div>
                            <div>
                                <h6 class="mb-0">Inactive</h6>
                                <h3 class="mt-2 mb-0">{{ getInactiveVesselCount() }}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Register New Fleet -->
                <div class="col-md-3">
                    <div class="card border-0 shadow-sm" @click="newVessel()">
                        <div class="card-body d-flex align-items-center">
                            <div class="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                                <i class="bi bi-patch-plus-fill text-success fs-4"></i>
                            </div>
                            <div>
                                <h6 class="mb-0">Add New Vessel</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h4 class="mb-4"><i class="bi bi-ship me-2"></i>Registered Vessels</h4>
            <div v-if="!company.vessels.length">
                <div class="alert alert-primary" role="alert">
                    <h4 class="alert-heading">Empty Fleet!</h4>
                    <p>You have an empty fleet, you have not added any vessel yet.</p>
                    <hr>
                    <p class="mb-0">Click on the add vessel button above, to start adding vessels to your fleet</p>
                </div>
            </div>
            <!-- Vessel Cards -->
            <div class="row">
                <div class="col-lg-6" v-for="vessel in this.company.vessels">
                    <div class="vessel-card" @click="getMaintenance(vessel.registrationNumber)">
                        <div class="card-body d-flex align-items-center">
                            <div class="vessel-icon left">
                                <i class="bi bi-plugin"></i>
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h5 class="card-title mb-0">{{ vessel.name }}</h5>
                                    <span :class="['vessel-status', statusClass(vessel.status)]">{{ vessel.status }}</span>
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <small class="text-muted">Registration #:</small>
                                        <p class="mb-0">{{ vessel.registrationNumber }}</p>
                                    </div>
                                    <div class="col-6">
                                        <small class="text-muted">Next Maintenance:</small>
                                        <p class="mb-0">{{ vessel.nextMaintenance }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="action-icon left delete">
                            <i class="bi bi-trash" @click.stop="confirmDelete(vessel.registrationNumber)"></i>
                        </div>
                        <button class="btn btn-primary" @click.stop="markInactive(vessel.registrationNumber)">
                            Mark Inactive
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardView',
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
    mounted() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const content = document.getElementById('content');

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
        let vessels = JSON.parse(localStorage.getItem('vessel') ?? '[]');
        this.company.vessels.push(...vessels);

        // get all tasks and determine if vessel is undermaintenance.

        vessels = vessels.map(vessel => {
            const registrationNumber = vessel.registrationNumber;
            const tasks = JSON.parse(localStorage.getItem(`tasks-${registrationNumber}`) ?? '[]');

            const soonTask = tasks.find(task => task.status === 'Soon');

            if (soonTask) {
                vessel.status = 'Maintenance';
            }

            return vessel;
        });

        // Save updated vessels back to localStorage
        localStorage.setItem('vessel', JSON.stringify(vessels));
        this.company.vessels = vessels;
    },
    methods: {
        getMaintenance(id) {
            this.$router.push({ path: `/app/maintenance/${id}` })
        },
        newVessel() {
            Swal.fire({
                title: 'Add New Vessel',
                html: `
                  <p>(Add new vessel to your fleet)</p>
                    <div class="custom-swal-content">
                        <label class="custom-input-label" for="vesselname">Vessel Name *</label>
                        <input id="vesselname" class="custom-input" placeholder="Enter your vessel's name">
                        <div id="vesselname-error" class="error-message">Please enter your vessel's name</div>
                        
                        <label class="custom-input-label" for="regno">Registration Number *</label>
                        <input id="regno" class="custom-input" placeholder="Enter your registration number">
                        <div id="regno-error" class="error-message">Please enter a valid registration number</div>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Submit',
                cancelButtonText: 'Cancel',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                customClass: {
                    container: 'custom-swal-container',
                    popup: 'custom-swal-popup',
                    title: 'custom-swal-title'
                },
                preConfirm: () => {
                    // Validate inputs
                    let isValid = true;
                    const vesselname = document.getElementById('vesselname').value.trim();
                    const regno = document.getElementById('regno').value.trim();

                    // Reset error messages
                    document.getElementById('vesselname-error').style.display = 'none';
                    document.getElementById('regno-error').style.display = 'none';

                    // Validate vessel name
                    if (!vesselname) {
                        document.getElementById('vesselname-error').style.display = 'block';
                        isValid = false;
                    }

                    // Validate regno 
                    if (!regno) {
                        document.getElementById('regno-error').style.display = 'block';
                        isValid = false;
                    }

                    if (!isValid) {
                        return false; // Prevent the modal from closing
                    }

                    // Return the form data if valid
                    return { vesselname, regno };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // Process the form data
                    const { vesselname, regno } = result.value;

                    // Here you would typically send this data to your server
                    let status = 'Active'
                    let newVessel = { name: vesselname, registrationNumber: regno, status };
                    const existing = localStorage.getItem('vessel');
                    this.company.vessels.push(newVessel);

                    if (!existing) {
                        // If no vessel data in localStorage, create a new array with the vessel
                        localStorage.setItem('vessel', JSON.stringify([newVessel]));
                    } else {
                        // If vessel data exists, parse it, push the new vessel, then save it back
                        const vessels = JSON.parse(existing);
                        vessels.push(newVessel);
                        localStorage.setItem('vessel', JSON.stringify(vessels));
                    }
                    // Show success message
                    Swal.fire({
                        icon: 'success',
                        title: 'Added to Fleet!',
                        text: 'Your vessel has been added successfully. It should be in your dashboard now.',
                        confirmButtonText: 'Close',
                        customClass: {
                            confirmButton: 'swal2-confirm'
                        }
                    });
                }
            });
        },
        confirmDelete(task) {
            const result = Swal.fire({
                title: 'Are you sure?',
                text: "You're trying to delete a vessel, this action cannot be undone!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
            });

            if (result.isConfirmed) {
                this.deleteVessel(task);
                Swal.fire('Deleted!', 'The task has been deleted.', 'success');
            }
        },
        deleteVessel(registrationNumber) {
            let vessels = JSON.parse(localStorage.getItem('vessel') ?? '[]');
            vessels = vessels.filter(vessel => vessel.registrationNumber !== registrationNumber);
            localStorage.setItem('vessel', JSON.stringify(vessels));
            this.company.vessels = vessels;
            localStorage.removeItem(`tasks-${registrationNumber}`);
        },
        markInactive(registrationNumber) {
            // Get vessels from localStorage
            let vessels = JSON.parse(localStorage.getItem('vessel') ?? '[]');

            // Find and update the vessel
            const index = vessels.findIndex(v => v.registrationNumber === registrationNumber);
            if (index !== -1) {
                if (vessels[index].status !== 'Inactive') {
                    vessels[index].status = 'Inactive';
                } else {
                    vessels[index].status = 'Active'; 
                    Swal.fire({
                        title: "Vessel Active!",
                        text: "Your vessel is now active, if it is under maintenance, the status will change soon",
                        icon: "success"
                    });
                }
                localStorage.setItem('vessel', JSON.stringify(vessels));
                this.company.vessels = vessels;
            }
        },
        comingSoon() {
            Swal.fire({
                title: "Coming soon!",
                text: "This feature is coming soon",
                icon: "info"
            });
        },
        crewManage() {
            this.$router.push({ name: 'crew' });
        },
        editInfo() {
            Swal.fire({
                title: "Company info",
                text: "You will be able to edit company info here",
                icon: "info"
            });
        },
        loggedIn() {
            Swal.fire({
                title: "Logged in",
                text: "You're logged as Emeka, with an employee access. You have limited access, everyone with owner access can see the changes you make.",
                icon: "info"
            });
        },
        getFormattedJSON() {
            return JSON.stringify(this.company, null, 2);
        },
        getVesselCount() {
            return this.company.vessels.length;
        },
        getActiveVesselCount() {
            return this.company.vessels.filter(vessel => vessel.status === "Active").length;
        },
        getMaintenanceVesselCount() {
            return this.company.vessels.filter(vessel => vessel.status === "Maintenance").length;
        },
        getInactiveVesselCount() {
            return this.company.vessels.filter(vessel => vessel.status === "Inactive").length;
        },
        statusClass(status) {
            const normalized = status.toLowerCase();
            return `status-${normalized}`;
        }
    }
}
</script>

<style scoped>
/* Sidebar */
#sidebar {
    position: fixed;
    width: var(--sidebar-width);
    height: 100%;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    transition: all 0.3s;
    z-index: 1000;
    left: -280px;
}

#sidebar.active {
    left: 0;
}

#sidebar .logo {
    padding: 20px;
    color: white;
    font-weight: bold;
    font-size: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

#sidebar ul li a {
    padding: 15px 20px;
    display: block;
    color: #fff;
    text-decoration: none;
    transition: all 0.3s;
    border-left: 3px solid transparent;
}

#sidebar ul li a:hover {
    background: rgba(255, 255, 255, 0.1);
    border-left: 3px solid #00acc1;
}

#sidebar ul li a i {
    margin-right: 10px;
}

#content {
    width: 100%;
    min-height: 100vh;
    transition: all 0.3s;
    position: absolute;
    padding: 20px;
    padding-left: 40px;
}

#content.active {
    margin-left: var(--sidebar-width);
    width: calc(100% - var(--sidebar-width));
}

/* Header */
.page-header {
    margin-bottom: 30px;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 15px;
}

/* Company Card */
.company-card {
    background: white;
    border-radius: 10px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    padding: 25px;
    margin-bottom: 30px;
}

.company-logo {
    width: 80px;
    height: 80px;
    background-color: #e6f2ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    color: var(--dashprimary-color);
}

/* Vessel Cards */
.left {
    margin-left: 20px;
}

.vessel-card {
    background: white;
    border-radius: 10px;
    box-shadow: 0 8px 16px rgba(0, 105, 192, 0.15);
    transition: all 0.3s ease;
    margin-bottom: 20px;
    overflow: hidden;
    border-left: 4px solid var(--accent-color);
}

.vessel-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 105, 192, 0.2);
}

.vessel-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background-color: #e3f2fd;
    border-radius: 10px;
    color: var(--accent-color);
    font-size: 24px;
    margin-right: 15px;
}

.action-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 20px;
    color: var(--accent-color);
    font-size: 16px;
    margin-right: 15px;
    margin-top: 20px;
    margin-bottom: 10px;
}

.delete {
    background-color: var(--danger);
}

.edit {
    background-color: var(--success);
}

.vessel-status {
    display: inline-block;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
}

.status-active {
    background-color: #e8f5e9;
    color: #2e7d32;
}

.status-maintenance {
    background-color: #fff8e1;
    color: #f57f17;
}

.status-inactive {
    background-color: #f5f5f5;
    color: #757575;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    #content.active {
        margin-left: 0;
        width: 100%;
    }

    #sidebar {
        width: 100%;
        max-width: 280px;
    }
}

.toggle-btn {
    position: fixed;
    left: 15px;
    top: 15px;
    z-index: 1100;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--dashprimary-color);
    color: white;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    border: none;
    cursor: pointer;
    transition: all 0.3s;
}

.toggle-btn:hover {
    background-color: var(--dashsecondary-color);
}

/* Wave effect for marine theme */
.wave-bg {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 200px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%230d6efd" fill-opacity="0.1" d="M0,160L48,165.3C96,171,192,181,288,176C384,171,480,149,576,154.7C672,160,768,192,864,181.3C960,171,1056,117,1152,101.3C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') repeat-x;
    background-size: cover;
    z-index: -1;
}
</style>