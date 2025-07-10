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
                <h1><i class="fas fa-ship"></i>MarineTech Voyage Management System</h1>
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

            <button class="tab" :class="{ active: selectedTab === 'delayed' }" @click="selectedTab = 'delayed'">
                <i class="fas fa-ship"></i>
                Delayed Voyage
            </button>

            <button class="tab" :class="{ active: selectedTab === 'completed' }" @click="selectedTab = 'completed'">
                <i class="fas fa-history"></i>
                Past Voyage
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
                <button class="btn btn-primary" @click="addNewItem">
                    <i class="fas fa-plus"></i>
                    Plan Voyage
                </button>
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
                <div class="inventory-table">
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

                    <div v-if="filteredVoyage.length === 0" class="empty-state">
                        <i class="fas fa-box-open"></i>
                        <h3>No voyage found</h3>
                        <p>Try adjusting your search or filters</p>
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
                    status: 'Delayed'
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
            console.log(this.selectedTab)
            return this.voyages.filter(v => v.status.toLowerCase() === this.selectedTab.toLowerCase());
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
                'delayed': 'status-delayed',
                'ongoing': 'status-ongoing'
            };
            return classes[action] || '';
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
    background: red;
    color: white;
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

.status-delayed {
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
</style>