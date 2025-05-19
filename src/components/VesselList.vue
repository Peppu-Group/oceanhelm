<template>
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
                    <div class="vessel-card" @click="handleNavigation(vessel.registrationNumber, vessel.name)">
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
                            {{ vessel.status === 'Active' ? 'Mark Inactive' : 'Mark Active' }}
                        </button>
                    </div>
                </div>
            </div>
</template>

<script>
export default {
    name: 'VesselList',
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
        },
    },
    mounted() {
        this.company.vessels.push(...this.vessels);
    },

    methods: {
        getActiveVesselCount() {
            return this.company.vessels.filter(vessel => vessel.status === "Active").length;
        }, 
        getMaintenanceVesselCount() {
            return this.company.vessels.filter(vessel => vessel.status === "Maintenance").length;
        },
        getInactiveVesselCount() {
            return this.company.vessels.filter(vessel => vessel.status === "Inactive").length;
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
                    let status = 'Active';
                    let newVessel = { name: vesselname, registrationNumber: regno, status };
                    const existing = localStorage.getItem('vessel');
                    this.company.vessels.push(newVessel);
                    if (!existing) {
                        // If no vessel data in localStorage, create a new array with the vessel
                        localStorage.setItem('vessel', JSON.stringify([newVessel]));
                    }
                    else {
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
        statusClass(status) {
            const normalized = status.toLowerCase();
            return `status-${normalized}`;
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
                }
                else {
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
        handleNavigation(id, vname) {
            let name = this.$route.name;
            console.log(name)
            if (name == 'maintenanceroute') {
                this.$router.push({ path: `/app/maintenance/${id}` });
            } else if (name == 'crewroute') {
                this.$router.push({ path: `/app/crew/${vname}` });
            }
        }
    }
}
</script>

<style scoped>
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

.black {
    color: black !important;
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
</style>