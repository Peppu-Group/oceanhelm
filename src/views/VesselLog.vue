<template>
    <!-- Wave background -->
    <div class="wave-bg"></div>

    <!-- Sidebar Toggle Button -->
    <button class="toggle-btn" id="sidebarToggle" @click="toggleSidebar">
        <i class="bi bi-list"></i>
    </button>

    <!-- Sidebar -->
    <Sidebar :class="{ active: sidebarActive }" />
    <div id="content" class="container" :class="{ active: sidebarActive }">
        <div class="header">
            <h1>Vessel Log</h1>
            <p>Track vessel status, operational conditions, and sub-actions</p>
        </div>

        <div class="vessel-table">
            <table v-if="flattenedVessels.length > 0">
                <thead>
                    <tr>
                        <th>Vessel Name / Sub-Action</th>
                        <th>Status</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Duration</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="item in flattenedVessels" :key="item.id">
                        <tr :class="{ 'main-row': item.isMainVessel, 'sub-row': !item.isMainVessel }">
                            <td>
                                <div :class="item.isMainVessel ? 'vessel-name' : 'sub-status-name'">
                                    {{ item.name }}
                                </div>
                            </td>
                            <td>
                                <span :class="'status-badge status-' + item.status">
                                    {{ item.status.replace('-', ' ') }}
                                </span>
                            </td>
                            <td>
                                <div>{{ formatDate(item.startDate) }}</div>
                                <div class="date-display">{{ formatTime(item.startDate) }}</div>
                            </td>
                            <td>
                                <div v-if="item.endDate">{{ formatDate(item.endDate) }}</div>
                                <div v-if="item.endDate" class="date-display">{{ formatTime(item.endDate) }}</div>
                                <div v-else class="date-display" style="color: var(--gray);">Ongoing</div>
                            </td>
                            <td>
                                <div><strong>{{ getDurationText(item.startDate, item.endDate) }}</strong></div>
                                <div class="date-display">
                                    {{ getDurationHours(item.startDate, item.endDate) }} hours
                                </div>
                            </td>
                            <td>
                                <button v-if="item.isMainVessel && item.status === 'Active'" @click="addSubAction(item)"
                                    class="btn"
                                    style="background: var(--dashprimary-color); color: white; padding: 8px 16px; font-size: 12px;">
                                    Add Sub-Action
                                </button>
                                <span v-else-if="item.isMainVessel && item.status === 'Inactive'" class="date-display"
                                    style="color: var(--gray); font-weight: 600;">
                                    🔒 Cycle Complete
                                </span>
                                <button v-else-if="!item.endDate" @click="endSubAction(item)" class="btn"
                                    style="background: var(--warning); color: white; padding: 8px 16px; font-size: 12px;">
                                    End Sub-Action
                                </button>
                                <span v-else class="date-display" style="color: var(--success); font-weight: 600;">
                                    ✓ Completed
                                </span>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <div v-else class="no-vessels">
                <p>No vessels added yet. Add your first vessel above.</p>
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import { mapActions } from 'vuex'

export default {
    name: 'VesselLog',
    components: { Sidebar },

    data() {
        return {
            sidebarActive: false,
            /*
            vessels: [
                {
                    registrationNumber: "REG001",
                    name: "MV Ocean Pioneer",
                    mainStatus: "active",
                    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                    subActions: [
                        {
                            id: 0,
                            name: "In Port Operations",
                            status: "in-port",
                            startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                            endDate: null
                        }
                    ]
                },
                {
                    registrationNumber: "REG002",
                    name: "SS Maritime Explorer",
                    mainStatus: "inactive",
                    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                    subActions: [
                        {
                            id: 0,
                            name: "Scheduled Maintenance",
                            status: "maintenance",
                            startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                            endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
                        }
                    ]
                }
            ]*/
        }
    },
    computed: {
        flattenedVessels() {
            const flattened = [];

            this.vessels.forEach(vessel => {
                // Add main vessel row
                flattened.push({
                    id: vessel.registrationNumber,
                    name: vessel.name,
                    status: vessel.mainStatus,
                    startDate: vessel.startDate,
                    endDate: vessel.endDate, // Main status doesn't have end date
                    isMainVessel: true,
                    vesselId: vessel.registrationNumber
                });

                // Add sub-action rows
                vessel.subActions.forEach((subAction, index) => {
                    flattened.push({
                        id: subAction.id,
                        name: subAction.name,
                        status: subAction.status,
                        startDate: subAction.startDate,
                        endDate: subAction.endDate,
                        isMainVessel: false,
                        vesselId: vessel.registrationNumber,
                        subActionIndex: index
                    });
                });
            });

            return flattened;
        },
        vessels() {
            return this.$store.getters['vessel/allVessels'].flatMap((vessel, index) =>
                (vessel.cycle || []).map((cycle, cycleIndex) => ({
                    registrationNumber:
                        vessel.registrationNumber,
                    name: vessel.name,

                    // From cycle
                    mainStatus: cycle.mainStatus,
                    startDate: cycle.startDate
                        ? new Date(cycle.startDate).toISOString().slice(0, 16)
                        : new Date().toISOString().slice(0, 16),
                    endDate: cycle.endDate
                        ? new Date(cycle.endDate).toISOString().slice(0, 16)
                        : null,

                    // SubActions inside this cycle
                    subActions: Array.isArray(cycle.subActions)
                        ? cycle.subActions.map((subAction, subIndex) => ({
                            id: subAction.id || Number(`${index + 1}${cycleIndex + 1}${subIndex + 1}`),
                            name: subAction.name || "Unknown Action",
                            status: subAction.status || "unknown",
                            startDate: subAction.startDate
                                ? new Date(subAction.startDate).toISOString().slice(0, 16)
                                : new Date().toISOString().slice(0, 16),
                            endDate: subAction.endDate
                                ? new Date(subAction.endDate).toISOString().slice(0, 16)
                                : null,
                            vesselId:
                                vessel.registrationNumber ||
                                `REG${String(index + 1).padStart(3, '0')}`
                        }))
                        : []
                }))
            );
        }
    },
    async mounted() {
        // Initialize sidebar toggle functionality
        this.initializeSidebarToggle();
        // fetch vessels
        await this.fetchVessels();
    },
    methods: {
        ...mapActions('vessel', [
            'fetchVessels'
        ]),
        toggleSidebar() {
            this.sidebarActive = !this.sidebarActive;
        },
        initializeSidebarToggle() {
            // You can add any additional initialization logic here
            // For example, checking localStorage for sidebar preference
            const savedState = localStorage.getItem('sidebarActive');
            if (savedState !== null) {
                this.sidebarActive = JSON.parse(savedState);
            }
        },
        async addSubAction(vesselItem) {
            // Safety check: Only allow adding sub-actions to active vessels
            if (vesselItem.status !== 'Active') {
                await Swal.fire({
                    title: 'Cannot Add Sub-Action',
                    text: 'This vessel cycle is already complete. Sub-actions can only be added to active vessels.',
                    icon: 'warning',
                    confirmButtonText: 'Understood',
                    confirmButtonColor: '#0d6efd'
                });
                return;
            }

            // Find the original vessel from the store using registration number
            const originalVessels = this.$store.getters['vessel/allVessels'];
            const originalVessel = originalVessels.find(v => v.registrationNumber === vesselItem.vesselId);

            // Multi-step form using SweetAlert2
            const { value: subActionName } = await Swal.fire({
                title: 'Add New Sub-Action',
                text: `Adding sub-action for ${originalVessel.name}`,
                input: 'text',
                inputLabel: 'Sub-Action Name (Reason for sub action)',
                inputPlaceholder: 'e.g., Loading Cargo, Engine Repair, Port Inspection',
                showCancelButton: true,
                confirmButtonText: 'Next',
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#6c757d',
                inputValidator: (value) => {
                    if (!value) {
                        return 'Please enter a sub-action name';
                    }
                }
            });

            if (!subActionName) return;

            const { value: subActionType } = await Swal.fire({
                title: 'Select Sub-Action Type',
                text: `Sub-Action: ${subActionName}`,
                input: 'select',
                inputOptions: {
                    'in-port': '🚢 In Port Operations',
                    'maintenance': '🔧 Maintenance',
                    'out-of-service': '⚠️ Out of Service'
                },
                inputLabel: 'Action Type',
                showCancelButton: true,
                confirmButtonText: 'Next',
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#6c757d',
                inputValidator: (value) => {
                    if (!value) {
                        return 'Please select a sub-action type';
                    }
                }
            });

            if (!subActionType) return;

            const currentDateTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
            const { value: startDateTime } = await Swal.fire({
                title: 'Set Start Date & Time',
                text: `${subActionName} - ${subActionType.replace('-', ' ').toUpperCase()}`,
                input: 'text',
                inputLabel: 'Start Date & Time',
                inputPlaceholder: 'YYYY-MM-DD HH:MM',
                inputValue: currentDateTime,
                showCancelButton: true,
                confirmButtonText: 'Create Sub-Action',
                confirmButtonColor: '#27ae60',
                cancelButtonColor: '#6c757d',
                inputValidator: (value) => {
                    if (!value) {
                        return 'Please enter a start date and time';
                    }
                    // Basic date format validation
                    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
                    if (!dateRegex.test(value)) {
                        return 'Please use format: YYYY-MM-DD HH:MM';
                    }
                }
            });

            if (!startDateTime) return;

            // Gather all existing subAction IDs from all vessels and cycles

            let existingIds = [];
            if (originalVessel && Array.isArray(originalVessel.cycle)) {
                existingIds = originalVessel.cycle.flatMap(cycle =>
                    (cycle.subActions || []).map(sub => sub.id || 0)
                );
            }
            const newId = Math.max(...existingIds, 0) + 1;
            // Create the new sub-action object (index will be assigned automatically)
            const newSubAction = {
                name: subActionName,
                status: subActionType,
                startDate: startDateTime.replace(' ', 'T'),
                vesselId: originalVessel.registrationNumber,
                id: newId,
                endDate: null
            };

            console.log(newSubAction)

            // Update the store using registration number
            this.$store.dispatch('vessel/addSubAction', {
                vesselRegistrationNumber: originalVessel.registrationNumber,
                subAction: newSubAction
            });
        },
        async endSubAction(subActionItem) {
            // Find the vessel name for display using registration number
            const vessel = this.vessels.find(v => v.registrationNumber === subActionItem.vesselId);

            const vesselName = vessel ? vessel.name : 'Unknown Vessel';

            const currentDateTime = new Date().toISOString().slice(0, 16).replace('T', ' ');

            const { value: endDateTime } = await Swal.fire({
                title: 'End Sub-Action',
                text: `Ending "${subActionItem.name}" for ${vesselName}`,
                input: 'text',
                inputLabel: 'End Date & Time',
                inputPlaceholder: 'YYYY-MM-DD HH:MM',
                inputValue: currentDateTime,
                showCancelButton: true,
                confirmButtonText: 'End Sub-Action',
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                inputValidator: (value) => {
                    if (!value) {
                        return 'Please enter an end date and time';
                    }
                    // Basic date format validation
                    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
                    if (!dateRegex.test(value)) {
                        return 'Please use format: YYYY-MM-DD HH:MM';
                    }

                    // Validate that end time is after start time
                    const endDate = new Date(value.replace(' ', 'T'));
                    const startDate = new Date(subActionItem.startDate);
                    if (endDate <= startDate) {
                        return 'End time must be after start time';
                    }
                }
            });

            if (endDateTime) {
                // Convert back to ISO format for storage
                const isoDateTime = endDateTime.replace(' ', 'T');

                // Update the store using registration number and sub-action index
                this.$store.dispatch('vessel/endSubAction', {
                    vesselId: subActionItem.vesselId,
                    subActionId: subActionItem.id,
                    endDate: isoDateTime
                });

                // Success notification
            }
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        },
        formatTime(dateString) {
            const date = new Date(dateString);

            // add 60 minutes (in ms) to adjust for UTC+1
            date.setMinutes(date.getMinutes() + 60);

            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false // use 24-hour format, set to true if you want AM/PM
            });
        },
        getDurationHours(startDateString, endDateString) {
            const start = new Date(startDateString);
            const end = endDateString ? new Date(endDateString) : new Date();
            const diffMs = end - start;
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            return Math.max(0, diffHours);
        },
        getDurationText(startDateString, endDateString) {
            const hours = this.getDurationHours(startDateString, endDateString);
            const days = Math.floor(hours / 24);
            const remainingHours = hours % 24;

            if (days > 0) {
                return `${days}d ${remainingHours}h`;
            } else {
                return `${hours}h`;
            }
        }
    },
    watch: {
        sidebarActive(newVal) {
            // Save sidebar state to localStorage
            localStorage.setItem('sidebarActive', JSON.stringify(newVal));
        }
    }
}
</script>

<style scoped>
/* Sidebar Toggle Button */
.toggle-btn {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 1001;
    background: var(--dashprimary-color);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    font-size: 18px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.toggle-btn:hover {
    background: var(--dashsecondary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(13, 110, 253, 0.3);
}

#content {
    width: 100%;
    min-height: 100vh;
    transition: all 0.3s ease;
    padding: 1% 5%;
    margin-left: 0;
    box-sizing: border-box;
}

/* When sidebar is active, adjust content position */
#content.active {
    margin-left: var(--sidebar-width, 250px);
    width: calc(100% - var(--sidebar-width, 250px));
}

.container {
    max-width: none;
    width: 100%;
    padding: 0;
}

.header {
    background: linear-gradient(135deg, var(--dashprimary-color), var(--dashsecondary-color));
    color: white;
    padding: 30px;
    border-radius: 12px;
    margin-bottom: 30px;
    box-shadow: 0 4px 20px rgba(13, 110, 253, 0.2);
}

.header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    font-weight: 700;
}

.header p {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0;
}

.form-group {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    align-items: end;
}

.input-group {
    display: flex;
    flex-direction: column;
    min-width: 150px;
}

.input-group label {
    margin-bottom: 5px;
    font-weight: 600;
    color: var(--dark);
}

.input-group input,
.input-group select {
    padding: 10px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s ease;
}

.input-group input:focus,
.input-group select:focus {
    outline: none;
    border-color: var(--dashprimary-color);
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.btn-primary {
    background: var(--dashprimary-color);
    color: white;
}

.btn-primary:hover {
    background: var(--dashsecondary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(13, 110, 253, 0.3);
}

.vessel-table {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
}

table {
    width: 100%;
    border-collapse: collapse;
}

th {
    background: linear-gradient(135deg, var(--dashprimary-color), var(--dashsecondary-color));
    color: white;
    padding: 18px 15px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

td {
    padding: 15px;
    border-bottom: 1px solid #f0f0f0;
    vertical-align: middle;
}

tr:hover {
    background-color: #f8f9ff;
}

.main-row {
    border-bottom: 2px solid #e0e0e0;
}

.sub-row {
    background-color: #f8f9ff;
    border-left: 4px solid var(--dashprimary-color);
}

.sub-row td:first-child {
    padding-left: 40px;
}

.status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-block;
    margin: 2px;
}

.status-active {
    background-color: var(--success);
    color: white;
}

.status-inactive {
    background-color: var(--gray);
    color: white;
}

.status-in-port {
    background-color: var(--dashsecondary-color);
    color: white;
}

.status-maintenance {
    background-color: var(--warning);
    color: white;
}

.status-out-of-service {
    background-color: var(--danger);
    color: white;
}

.vessel-name {
    font-weight: 700;
    color: var(--dashprimary-color);
    font-size: 16px;
}

.sub-status-name {
    font-weight: 500;
    color: var(--gray);
    font-size: 14px;
}

.date-display {
    font-size: 12px;
    color: var(--gray);
    margin-top: 3px;
}

.no-vessels {
    padding: 60px;
    text-align: center;
    color: var(--gray);
    font-size: 18px;
}

/* Responsive Design */
@media (max-width: 768px) {
    #content.active {
        margin-left: 0;
        width: 100%;
    }

    .toggle-btn {
        left: 10px;
        top: 10px;
        padding: 10px;
        font-size: 16px;
    }

    #content {
        padding: 15px;
    }

    .form-group {
        flex-direction: column;
        align-items: stretch;
    }

    .header h1 {
        font-size: 2rem;
    }

    .header {
        padding: 20px;
    }

    table {
        font-size: 14px;
    }

    th,
    td {
        padding: 10px 8px;
    }

    .vessel-table {
        overflow-x: auto;
    }
}
</style>