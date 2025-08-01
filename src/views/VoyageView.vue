<template>
    <!-- Wave background -->
    <div class="wave-bg"></div>

    <!-- Sidebar Toggle Button -->
    <button class="toggle-btn" id="sidebarToggle">
        <i class="bi bi-list"></i>
    </button>

    <!-- Sidebar -->
    <Sidebar />
    <div id="content" class="container">
        <!-- Header -->
        <div class="header">
            <div>
                <h1><i class="fas fa-ship"></i>OceanHelm Voyage Management System</h1>
            </div>
            <div class="header-actions">
                <button class="btn btn-secondary">
                    <i class="fas fa-file-alt"></i>
                    Fleet Report
                </button>
            </div>
        </div>

        <!-- Tabs -->
        <div class="tabs">
            <button class="tab" :class="{ active: selectedTab === 'ongoing' }" @click="selectedTab = 'ongoing'">
                <i class="fas fa-chart-bar"></i>
                Ongoing Voyage
            </button>

            <button class="tab" :class="{ active: selectedTab === 'awaiting-approval' }"
                @click="selectedTab = 'awaiting-approval'">
                <i class="fas fa-ship"></i>
                Planned Voyage
            </button>

            <button class="tab" :class="{ active: selectedTab === 'completed' }" @click="selectedTab = 'completed'">
                <i class="fas fa-history"></i>
                Past Voyage
            </button>

            <button class="tab" :class="{ active: selectedTab === 'dashboard' }" @click="selectedTab = 'dashboard'">
                <i class="fa-solid fa-bell"></i>
                Approval Dashboard
            </button>
        </div>

        <!-- Controls -->
        <div class="controls">
            <div class="controls-row">
                <div class="search-box">
                    <input type="text" placeholder="Search voyage, vessels, or port..." v-model="searchTerm">
                    <i class="fas fa-search"></i>
                </div>
                <select v-model="selectedVessel" class="filter-select">
                    <option value="">All Vessels</option>
                    <option v-for="vessel in vessels" :key="vessel" :value="vessel">{{ vessel.name }}</option>
                </select>
                <select v-model="selectedPort" class="filter-select">
                    <option value="">All Ports</option>
                    <option v-for="port in ports" :key="port" :value="port">{{ port }}</option>
                </select>
                <button class="btn btn-primary" @click="openHire">
                    <i class="fas fa-file-alt"></i>
                    Hire Information
                </button>
                <button class="btn btn-primary" @click="openModal">
                    <i class="fas fa-plus"></i>
                    Plan Voyage
                </button>
            </div>
        </div>

        <!-- Modal Overlay -->
        <div v-if="showModal" class="modal-overlay" @click="closeModal">
            <div class="modals" @click.stop>
                <div class="modal-header">
                    <h2 class="modal-title">
                        <i class="fas fa-route"></i>
                        Plan New Voyage
                    </h2>
                    <button class="modal-close" @click="closeModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="modal-body">
                    <form @submit.prevent="submitVoyage">
                        <div class="form-grid">
                            <!-- Vessel Selection -->
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-ship"></i>
                                    Vessel <span class="required">*</span>
                                </label>
                                <select v-model="voyageForm.vessel" class="form-select" :class="{ error: errors.vessel }"
                                    required>
                                    <option value="">Select Vessel</option>
                                    <option value="MV Legacy">MV Legacy</option>
                                    <option value="MV Ohafia">MV Ohafia</option>
                                    <option value="MV Eko Star">MV Eko Star</option>
                                    <option value="MV Bonnyat">MV Bonnyat</option>
                                    <option value="MV Ugo">MV Ugo</option>
                                    <option value="MV Virginia">MV Virginia</option>
                                </select>
                                <span v-if="errors.vessel" class="error-message">{{ errors.vessel }}</span>
                            </div>

                            <!-- Requested By -->
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-user"></i>
                                    Requested By <span class="required">*</span>
                                </label>
                                <input type="text" v-model="voyageForm.requestedBy" class="form-input"
                                    :class="{ error: errors.requestedBy }" placeholder="Enter requester name" required>
                                <span v-if="errors.requestedBy" class="error-message">{{ errors.requestedBy }}</span>
                            </div>

                            <!-- Port of Origin -->
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-map-marker-alt"></i>
                                    Port of Origin <span class="required">*</span>
                                </label>
                                <select v-model="voyageForm.origin" class="form-select" :class="{ error: errors.origin }"
                                    required>
                                    <option value="">Select Origin Port</option>
                                    <option value="Lagos Port">Lagos Port</option>
                                    <option value="Port Harcourt">Port Harcourt</option>
                                    <option value="Calabar Port">Calabar Port</option>
                                    <option value="Apapa">Apapa</option>
                                    <option value="Warri">Warri</option>
                                    <option value="Bonny Port">Bonny Port</option>
                                    <option value="Onne Port">Onne Port</option>
                                </select>
                                <span v-if="errors.origin" class="error-message">{{ errors.origin }}</span>
                            </div>

                            <!-- Port of Call -->
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-map-marker-alt"></i>
                                    Port of Call <span class="required">*</span>
                                </label>
                                <select v-model="voyageForm.call" class="form-select" :class="{ error: errors.call }"
                                    required>
                                    <option value="">Select Destination Port</option>
                                    <option value="Lagos Port">Lagos Port</option>
                                    <option value="Port Harcourt">Port Harcourt</option>
                                    <option value="Calabar Port">Calabar Port</option>
                                    <option value="Apapa">Apapa</option>
                                    <option value="Warri">Warri</option>
                                    <option value="Bonny Port">Bonny Port</option>
                                    <option value="Onne Port">Onne Port</option>
                                </select>
                                <span v-if="errors.call" class="error-message">{{ errors.call }}</span>
                            </div>

                            <!-- Proposed Start Time -->
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-clock"></i>
                                    Proposed Start Date & Time <span class="required">*</span>
                                </label>
                                <input type="datetime-local" v-model="voyageForm.start" class="form-input"
                                    :class="{ error: errors.start }" required>
                                <span v-if="errors.start" class="error-message">{{ errors.start }}</span>
                            </div>

                            <!-- Estimated Duration -->
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-hourglass-half"></i>
                                    Estimated Duration (hours)
                                </label>
                                <input type="number" v-model="voyageForm.estimatedDuration" class="form-input"
                                    placeholder="Enter duration in hours" min="1" step="0.5">
                            </div>

                            <!-- Purpose of Trip -->
                            <div class="form-group full-width">
                                <label class="form-label">
                                    <i class="fas fa-clipboard-list"></i>
                                    Purpose of Trip <span class="required">*</span>
                                </label>
                                <textarea v-model="voyageForm.purpose" class="form-textarea"
                                    :class="{ error: errors.purpose }" placeholder="Describe the purpose of this voyage..."
                                    required></textarea>
                                <span v-if="errors.purpose" class="error-message">{{ errors.purpose }}</span>
                            </div>

                            <!-- Additional Notes -->
                            <div class="form-group full-width">
                                <label class="form-label">
                                    <i class="fas fa-sticky-note"></i>
                                    Additional Notes
                                </label>
                                <textarea v-model="voyageForm.additionalNotes" class="form-textarea"
                                    placeholder="Any additional information or special requirements..."></textarea>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal">
                        <i class="fas fa-times"></i>
                        Cancel
                    </button>
                    <button type="button" class="btn btn-success" @click="submitVoyage">
                        <i class="fas fa-save"></i>
                        Plan Voyage
                    </button>
                </div>
            </div>
        </div>

        <!-- Ongoing Voyage Table -->
        <!-- Content Grid -->
        <div class="content-grid">
            <!-- Main Content -->
            <div class="main-content">
                <!-- Map Section -->
                <div class="map-container" id="mapContainer">
                    <div>
                        <i class="fas fa-map-marked-alt" style="font-size: 48px; margin-bottom: 10px; display: block;"></i>
                        <div>Interactive Map View</div>
                        <div style="font-size: 12px; margin-top: 5px; opacity: 0.7;">Vessel tracking and route visualization
                        </div>
                    </div>
                </div>

                <div v-if="filteredVoyage.length > 0 && selectedTab === 'dashboard'" class="empty-state">
                    <!-- Vessels Grid -->
                    <div class="vessels-grid">
                        <div class="vessel-card" v-for="item in filteredVoyage" :key="item.id">
                            <div class="vessel-header">
                                <div class="vessel-icon">
                                </div>
                                <div class="vessel-status">
                                    Awaiting-approval
                                </div>
                            </div>
                            <div class="vessel-info">
                                <h3 class="vessel-name">Vessel Name: {{ item.vessel }}</h3>
                                <h3 class="vessel-name">Port of Origin: </h3>
                                <p class="vessel-reg">{{ item.origin }}</p>
                                <h3 class="vessel-name">Port of Call: </h3>
                                <p class="vessel-reg">{{ item.call }}</p>
                                <div class="vessel-stats">
                                    <div class="vessel-stat">
                                        <h3 class="vessel-name">Purpose: </h3><span>{{ item.purpose }} </span>
                                    </div>
                                    <div class="vessel-stat">
                                        <h3 class="vessel-name">Start Time: </h3><span>{{ item.start }} </span>
                                    </div>
                                </div>
                            </div>
                            <div class="vessel-actions">
                                <button class="vessel-btn vessel-approve" @click.stop="approveVoyage(item.id)"
                                    title="Approve Voyage">
                                    Approve Voyage
                                </button>
                                <button class="vessel-btn vessel-decline" @click.stop="declineVoyage(item.id)"
                                    title="Decline Voyage">
                                    Decline Voyage
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="inventory-table" v-if="selectedTab == 'hire' && selectedTab !== 'dashboard'">
                    <div class="table-responsive item-row">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Vessel</th>
                                    <th>Engaged Date</th>
                                    <th>Dis-engaged Date</th>
                                    <th>Vessel</th>
                                    <th>Maintenance Start</th>
                                    <th>Maintenance End</th>
                                    <th>Port Call</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in filteredVoyage" :key="item.id">
                                    <td><strong>{{ item.id }}</strong></td>
                                    <td>
                                        <i class="fas fa-calendar"></i>
                                        {{ item.date }}
                                    </td>
                                    <td>{{ item.purpose }}</td>
                                    <td>{{ item.vessel }}</td>
                                    <td>
                                        <i class="fas fa-map-marker-alt"></i>
                                        {{ item.origin }}
                                    </td>
                                    <td>
                                        <i class="fas fa-map-marker-alt"></i>
                                        {{ item.call }}
                                    </td>
                                    <td>
                                        <i class="fa-solid fa-clock"></i>
                                        {{ item.start }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    </div>

                <div class="inventory-table" v-if="selectedTab !== 'dashboard'">
                    <div class="table-responsive item-row">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>S/N</th>
                                    <th>Date</th>
                                    <th>Purpose of Trip</th>
                                    <th>Vessel</th>
                                    <th>Port of Origin</th>
                                    <th>Port of Call</th>
                                    <th>Start Time</th>
                                    <th>ETA</th>
                                    <th>End Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in filteredVoyage" :key="item.id">
                                    <td><strong>{{ item.id }}</strong></td>
                                    <td>
                                        <i class="fas fa-calendar"></i>
                                        {{ item.date }}
                                    </td>
                                    <td>{{ item.purpose }}</td>
                                    <td>{{ item.vessel }}</td>
                                    <td>
                                        <i class="fas fa-map-marker-alt"></i>
                                        {{ item.origin }}
                                    </td>
                                    <td>
                                        <i class="fas fa-map-marker-alt"></i>
                                        {{ item.call }}
                                    </td>
                                    <td>
                                        <i class="fa-solid fa-clock"></i>
                                        {{ item.start }}
                                    </td>
                                    <td>
                                        <i class="fa-solid fa-clock"></i>
                                        {{ item.eta }}
                                    </td>
                                    <td>
                                        <i class="fa-solid fa-clock"></i>
                                        {{ item.end }}
                                    </td>
                                    <td>
                                        <span :class="['status-badge', getBadgeClass(item.status)]">
                                            {{ item.status }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div v-if="filteredVoyage.length === 0 && selectedTab !== 'dashboard'" class="empty-state">
                        <i class="fas fa-box-open"></i>
                        <h3>No voyage found</h3>
                        <p>Try adjusting your search or filters</p>
                    </div>

                    <div v-if="filteredVoyage.length === 0 && selectedTab === 'dashboard'" class="empty-state">
                        <i class="fas fa-box-open"></i>
                        <h3>No Voyage Awaiting Approval</h3>
                    </div>

                    <!-- Pagination -->
                    <div class="pagination" v-if="filteredVoyage.length > 0">
                        <button @click="prevPage" :disabled="currentPage === 1">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button v-for="page in totalPages" :key="page" @click="currentPage = page"
                            :class="{ active: currentPage === page }">
                            {{ page }}
                        </button>
                        <button @click="nextPage" :disabled="currentPage === totalPages">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
            <!-- Fleet Section -->
            <div class="fleet-section">
                <div class="fleet-header">
                    <i class="fas fa-anchor"></i>
                    My Fleet
                </div>
                <div class="fleet-list">
                    <div class="fleet-item">
                        <div class="fleet-vessel">
                            <div class="vessel-icon">
                                <i class="fas fa-ship"></i>
                            </div>
                            <div class="vessel-info">
                                <div class="vessel-name">MV Ohafia</div>
                                <div class="vessel-route">Port → Onni</div>
                            </div>
                        </div>
                    </div>
                    <div class="fleet-item">
                        <div class="fleet-vessel">
                            <div class="vessel-icon">
                                <i class="fas fa-ship"></i>
                            </div>
                            <div class="vessel-info">
                                <div class="vessel-name">MV Bonnyat</div>
                                <div class="vessel-route">Port → On transport</div>
                            </div>
                        </div>
                    </div>
                    <div class="fleet-item">
                        <div class="fleet-vessel">
                            <div class="vessel-icon">
                                <i class="fas fa-ship"></i>
                            </div>
                            <div class="vessel-info">
                                <div class="vessel-name">MV Ugo</div>
                                <div class="vessel-route">Port → Bayfield</div>
                            </div>
                        </div>
                    </div>
                    <div class="fleet-item">
                        <div class="fleet-vessel">
                            <div class="vessel-icon">
                                <i class="fas fa-ship"></i>
                            </div>
                            <div class="vessel-info">
                                <div class="vessel-name">MV Virginia</div>
                                <div class="vessel-route">Port → Inactive</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import VesselList from '../components/VesselList.vue';

export default {
    name: 'voyage',
    components: { Sidebar, VesselList },

    data() {
        return {
            showModal: false,
            voyageForm: {
                id: '',
                status: '',
                date: '',
                vessel: '',
                requestedBy: '',
                origin: '',
                call: '',
                start: '',
                estimatedDuration: '',
                purpose: '',
                additionalNotes: ''
            },
            errors: {},
            selectedTab: 'ongoing',
            searchTerm: '',
            selectedVessel: '',
            selectedPort: '',
            currentPage: 1,
            itemsPerPage: 10,
            voyages: [
                {
                    id: 1,
                    date: '2025-07-01',
                    purpose: 'Inspection',
                    vessel: 'MV Legacy',
                    origin: 'Lagos Port',
                    call: 'Bonny Port',
                    start: '08:00',
                    eta: '14:00',
                    end: '13:50',
                    status: 'Completed'
                },
                {
                    id: 2,
                    date: '2025-07-03',
                    purpose: 'Cargo Delivery',
                    vessel: 'MV Ohafia',
                    origin: 'Port Harcourt',
                    call: 'Calabar Port',
                    start: '09:15',
                    eta: '16:00',
                    end: '16:30',
                    status: 'Awaiting-approval'
                },
                {
                    id: 3,
                    date: '2025-07-05',
                    purpose: 'Crew Change',
                    vessel: 'MV Eko Star',
                    origin: 'Apapa',
                    call: 'Warri',
                    start: '07:30',
                    eta: '12:00',
                    end: '',
                    status: 'Ongoing'
                }
            ]
        }
    },
    computed: {
        totalPages() {
            return Math.ceil(this.voyages.length / this.itemsPerPage);
        },
        filteredVoyage() {
            let filtered = this.voyages;
            // Search filter
            if (this.searchTerm) {
                const search = this.searchTerm.toLowerCase();
                filtered = filtered.filter(item =>
                    item.purpose.toLowerCase().includes(search) ||
                    item.vessel.toLowerCase().includes(search) ||
                    item.origin.toLowerCase().includes(search) ||
                    item.call.toLowerCase().includes(search) ||
                    item.status.toLowerCase().includes(search)
                );
            }

            if (this.selectedTab && this.selectedTab !== 'dashboard') {
                filtered = filtered.filter(v => v.status.toLowerCase() === this.selectedTab.toLowerCase());
            }

            if (this.selectedTab === 'dashboard') {
                filtered = filtered.filter(v => v.status.toLowerCase() === 'awaiting-approval');
            }

            return filtered;
        }
    },
    mounted() {
        // fetch vessels.
        // this.$store.dispatch('vessel/fetchVessels');
    },
    methods: {
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        getBadgeClass(action) {
            if (!action) return '';
            action = action.toLowerCase().trim(); // Normalize input
            const classes = {
                'completed': 'status-completed',
                'awaiting-approval': 'status-planned',
                'ongoing': 'status-ongoing'
            };
            return classes[action] || '';
        },
        openHire() {
            this.selectedTab == 'hire'
        },
        openModal() {
            this.showModal = true;
            this.resetForm();
        },
        closeModal() {
            this.showModal = false;
            this.resetForm();
        },
        resetForm() {
            this.voyageForm = {
                vessel: '',
                requestedBy: '',
                origin: '',
                call: '',
                start: '',
                estimatedDuration: '',
                purpose: '',
                additionalNotes: ''
            };
            this.errors = {};
        },
        validateForm() {
            this.errors = {};
            let isValid = true;

            // Required field validation
            if (!this.voyageForm.vessel) {
                this.errors.vessel = 'Vessel selection is required';
                isValid = false;
            }

            if (!this.voyageForm.requestedBy.trim()) {
                this.errors.requestedBy = 'Requester name is required';
                isValid = false;
            }

            if (!this.voyageForm.origin) {
                this.errors.origin = 'Port of origin is required';
                isValid = false;
            }

            if (!this.voyageForm.call) {
                this.errors.call = 'Port of call is required';
                isValid = false;
            }

            if (!this.voyageForm.start) {
                this.errors.start = 'Proposed start time is required';
                isValid = false;
            }

            if (!this.voyageForm.purpose.trim()) {
                this.errors.purpose = 'Purpose of trip is required';
                isValid = false;
            }

            // Business logic validation
            if (this.voyageForm.origin === this.voyageForm.call) {
                this.errors.call = 'Port of call must be different from port of origin';
                isValid = false;
            }

            // Date validation
            if (this.voyageForm.start) {
                const proposedDate = new Date(this.voyageForm.start);
                const now = new Date();
                if (proposedDate <= now) {
                    this.errors.start = 'Proposed start time must be in the future';
                    isValid = false;
                }
            }

            return isValid;
        },
        submitVoyage() {
            if (!this.validateForm()) {
                return;
            }

            let date = new Date();
            this.voyageForm.date = date.toISOString().split('T')[0];
            this.voyageForm.id = this.voyages.reduce((max, item) => Math.max(max, item.id), 0) + 1;
            this.voyageForm.status = 'Awaiting-approval'

            this.voyages.push(this.voyageForm)

            // Close modal
            this.closeModal();
        },
        approveVoyage(id) {
            const voyage = this.voyages.find(v => v.id === id);
            if (voyage) {
                voyage.status = 'ongoing';

                // Optional: show success feedback
                Swal.fire({
                    title: 'Voyage Approved',
                    text: `Voyage for ${voyage.vessel} is now marked as ongoing.`,
                    icon: 'success',
                    confirmButtonColor: '#0d6efd'
                });
            } else {
                console.warn(`Voyage with id ${id} not found.`);
            }
        },
        declineVoyage(id) {
            const index = this.voyages.findIndex(v => v.id === id);
            if (index !== -1) {
                const removedVoyage = this.voyages.splice(index, 1)[0];

                // Optional: confirmation alert
                Swal.fire({
                    title: 'Voyage Rejected',
                    text: `Voyage for ${removedVoyage.vessel} has been removed.`,
                    icon: 'info',
                    confirmButtonColor: '#d33'
                });
            } else {
                console.warn(`Voyage with id ${id} not found.`);
            }
        }
    }

}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    background-color: #f5f7fa;
    color: #333;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    background: linear-gradient(135deg, var(--dashprimary-color), #0f172a);
    color: white;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
}

.header h1 {
    font-size: 28px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 12px;
}

.header-actions {
    display: flex;
    gap: 10px;
    align-items: center;
}

.header-stats {
    display: flex;
    gap: 20px;
    margin-top: 10px;
}

.controls {
    background: white;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.controls-row {
    display: flex;
    gap: 15px;
    align-items: center;
    flex-wrap: wrap;
}

.search-box {
    position: relative;
    flex: 1;
    min-width: 250px;
}

.search-box input {
    width: 100%;
    padding: 10px 40px 10px 15px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
}

.search-box i {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
}

.filter-select {
    padding: 10px 15px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    font-size: 14px;
    min-width: 150px;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
}

.btn-primary {
    background: var(--dashprimary-color);
    color: white;
}

.btn-primary:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
}

.btn-secondary {
    background: #6b7280;
    color: white;
}

.btn-secondary:hover {
    background: #4b5563;
}

.tabs {
    margin-top: 20px;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 20px;
    display: flex;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tab {
    flex: 4;
    padding: 15px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    background: transparent;
    font-size: 14px;
    font-weight: 500;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.tab.active {
    background: var(--dashprimary-color);
    color: white;
}

.tab:hover:not(.active) {
    background: #f3f4f6;
}


.inventory-table {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table th,
.table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
}

.table th {
    background: #f9fafb;
    font-weight: 600;
    color: #374151;
}

.table tr:hover {
    background: #f9fafb;
}

.action-btns {
    display: flex;
    gap: 8px;
}

.action-btn {
    padding: 6px 10px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.3s ease;
}

.action-btn:hover {
    transform: translateY(-1px);
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #6b7280;
}

.empty-state i {
    font-size: 48px;
    margin-bottom: 20px;
    opacity: 0.5;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
}

.pagination button {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
}

.pagination button:hover {
    background: #f3f4f6;
}

.pagination button.active {
    background: var(--dashprimary-color);
    color: white;
    border-color: var(--dashprimary-color);
}


#content.active {
    margin-left: var(--sidebar-width);
    width: calc(100% - var(--sidebar-width));
}

.item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
}

.inactive-item {
    color: grey;
    opacity: 0.6;
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

/* Header Actions */
.header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 20px;
}

.header-actions {
    display: flex;
    gap: 10px;
    align-items: center;
}

.header-actions .btn {
    white-space: nowrap;
}

/* Vessels Grid */
.vessels-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
    padding: 20px;
}

.vessel-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    overflow: hidden;
    border-left: 4px solid var(--dashprimary-color);
    position: relative;
}

.vessel-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.vessel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px 10px;
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(15, 23, 42, 0.1));
}

.vessel-name {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 5px;
}

.vessel-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 15px 20px;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
}

.vessel-btn {
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    color: white;
}

.vessel-decline {
    background: red;
}

.vessel-approve {
    background: green;
}

.vessel-btn:hover {
    background: var(--dashprimary-color);
    transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
    .vessels-grid {
        grid-template-columns: 1fr;
        padding: 15px;
    }

    .header {
        flex-direction: column;
        align-items: stretch;
    }

    .header-actions {
        justify-content: center;
    }
}

.content-grid {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 20px;
    margin-bottom: 20px;
}

.main-content {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.fleet-section {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.fleet-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
}

.fleet-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #e5e7eb;
}

.fleet-item:last-child {
    border-bottom: none;
}

.fleet-vessel {
    display: flex;
    align-items: center;
    gap: 12px;
}

.vessel-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--dashprimary-color), #1e40af);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
}

.vessel-info {
    flex: 1;
}

.vessel-name {
    font-weight: 600;
    color: #1f2937;
    font-size: 14px;
}

.vessel-route {
    color: #6b7280;
    font-size: 12px;
    margin-top: 2px;
}

.map-container {
    height: 400px;
    background: #f8fafc;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    border: 2px dashed #cbd5e1;
    color: #64748b;
    font-size: 16px;
}

.status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
}

.status-completed {
    background: #d1fae5;
    color: #065f46;
}

.status-planned {
    background: #fed7aa;
    color: #9a3412;
}

.status-ongoing {
    background: #dbeafe;
    color: #1e40af;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #6b7280;
}

.empty-state i {
    font-size: 48px;
    margin-bottom: 20px;
    opacity: 0.5;
}

@media (max-width: 1024px) {
    .content-grid {
        grid-template-columns: 1fr;
    }

    .fleet-section {
        order: -1;
    }
}

@media (max-width: 768px) {
    .controls-row {
        flex-direction: column;
        align-items: stretch;
    }

    .search-box {
        min-width: auto;
    }

    .header {
        flex-direction: column;
        align-items: stretch;
    }

    .header-actions {
        justify-content: center;
    }

    .tabs {
        flex-direction: column;
    }

    .tab {
        justify-content: flex-start;
    }
}

/* Modal Styles */
.modal-overlay {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex !important;
    justify-content: center;
    align-items: center;
    z-index: 9999 !important;
    backdrop-filter: blur(4px);

}

.modals {
    background: white;
    border-radius: 16px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.modal-header {
    background: linear-gradient(135deg, var(--dashprimary-color), #0f172a);
    color: white;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-title {
    font-size: 1.5rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
}

.modal-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    transition: background 0.3s ease;
}

.modal-close:hover {
    background: rgba(255, 255, 255, 0.2);
}

.modal-body {
    padding: 30px;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group.full-width {
    grid-column: 1 / -1;
}

.form-label {
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.form-input,
.form-select,
.form-textarea {
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
    resize: vertical;
    min-height: 100px;
}

.modal-footer {
    padding: 20px 30px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.btn-secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
}

.btn-secondary:hover {
    background: #e5e7eb;
}

.btn-success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
}

.btn-success:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.required {
    color: #ef4444;
}

.demo-section {
    background: #f8fafc;
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    margin-bottom: 20px;
}

.demo-section h3 {
    color: #374151;
    margin-bottom: 10px;
}

.demo-section p {
    color: #6b7280;
    margin-bottom: 15px;
}

/* Form validation styles */
.form-input.error,
.form-select.error,
.form-textarea.error {
    border-color: #ef4444;
}

.error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 5px;
}

/* Responsive design */
@media (max-width: 768px) {
    .modals {
        width: 95%;
        margin: 10px;
    }

    .modal-body {
        padding: 20px;
    }

    .form-grid {
        grid-template-columns: 1fr;
    }

    .modal-footer {
        flex-direction: column;
    }
}</style>