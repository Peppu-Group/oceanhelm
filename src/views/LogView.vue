<template>
    <!-- Wave background -->
    <div class="wave-bg"></div>

    <!-- Sidebar Toggle Button -->
    <button class="toggle-btn" id="sidebarToggle">
        <i class="bi bi-list"></i>
    </button>

    <!-- Sidebar -->
    <Sidebar />
    <!-- Page Content -->
    <div id="content">
        <div class="container">
            <div class="header">
                <h1>Activity Logs</h1>
                <p>Monitor and track all system activities in real-time</p>
            </div>

            <div class="controls">
                <div class="search-box">
                    <input type="text" placeholder="Search activities, users, or actions..." v-model="searchTerm"
                        @input="filterLogs">
                </div>
                <select class="filter-select" v-model="selectedFilter" @change="filterLogs">
                    <option value="all">All Activities</option>
                    <option value="login">Login</option>
                    <option value="logout">Logout</option>
                    <option value="create">Create</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                    <option value="view">View</option>
                </select>
                <button class="btn btn-primary" @click="refreshLogs">
                    🔄 Refresh
                </button>
                <button class="btn btn-secondary" @click="downloadReport">
                    📥 Download Report
                </button>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Total Activities</h3>
                    <div class="value">{{ totalActivities }}</div>
                </div>
                <div class="stat-card">
                    <h3>Today's Activities</h3>
                    <div class="value">{{ todayActivities }}</div>
                </div>
                <div class="stat-card">
                    <h3>Active Users</h3>
                    <div class="value">{{ activeUsers }}</div>
                </div>
                <div class="stat-card">
                    <h3>Important</h3>
                    <div class="badge-danger">Logs are deleted at the end of every month, please download a copy</div>
                </div>
            </div>

            <div class="logs-container">
                <div class="logs-header">
                    <h2>Recent Activities</h2>
                </div>

                <div v-if="loading" class="loading">
                    <div class="spinner"></div>
                    <p>Loading activity logs...</p>
                </div>

                <div v-else-if="filteredLogs.length === 0" class="no-logs">
                    <h3>No activities found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>

                <div v-else>
                    <table class="logs-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>User Name</th>
                                <th>Action</th>
                                <th>Details</th>
                                <th>Section</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="log in paginatedLogs" :key="log.id">
                                <td>{{ formatDate(log.timestamp) }}</td>
                                <td>
                                    <div>{{ log.user_name }}</div>
                                    <small style="color: gray">{{ log.email }}</small>
                                </td>

                                <td>
                                    <span class="activity-badge" :class="getBadgeClass(log.action)">
                                        {{ log.action }}
                                    </span>
                                </td>
                                <td>
                                    {{ log.details.status }}
                                    <div v-for="(change, key) in log.details.information" :key="key">
                                        <strong>{{ key }}: </strong><small style="color: gray">{{ change.from || change }} → {{
                                            change.to || change }}</small>
                                    </div>
                                </td>
                                <td>{{ log.table_name }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="pagination">
                        <button @click="currentPage--" :disabled="currentPage === 1">
                            Previous
                        </button>
                        <button v-for="page in totalPages" :key="page" @click="currentPage = page"
                            :class="{ active: currentPage === page }">
                            {{ page }}
                        </button>
                        <button @click="currentPage++" :disabled="currentPage === totalPages">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import { mapGetters } from 'vuex';
import { getActivityLogs } from '@/helpers/activityLogger';

export default {
    name: 'LogView',
    components: { Sidebar },
    data() {
        return {
            loading: false,
            searchTerm: '',
            selectedFilter: 'all',
            currentPage: 1,
            logsPerPage: 10,
            logs: [],
            filteredLogs: []
        };
    },
    computed: {
        ...mapGetters('user', ['userProfile', 'userRoleDescription']),
        totalActivities() {
            return this.logs.length;
        },
        todayActivities() {
            const today = new Date();
            return this.logs.filter(log => {
                const logDate = new Date(log.timestamp);
                return logDate.toDateString() === today.toDateString();
            }).length;
        },
        activeUsers() {
            const uniqueUsers = new Set(this.logs.map(log => log.user));
            return uniqueUsers.size;
        },
        criticalActions() {
            return this.logs.filter(log =>
                log.action === 'delete' || log.status === 'failed'
            ).length;
        },
        totalPages() {
            return Math.ceil(this.filteredLogs.length / this.logsPerPage);
        },
        paginatedLogs() {
            const start = (this.currentPage - 1) * this.logsPerPage;
            const end = start + this.logsPerPage;
            return this.filteredLogs.slice(start, end);
        }
    },
    methods: {
        filterLogs() {
            let filtered = [...this.logs];

            // Apply search filter
            if (this.searchTerm) {
                const term = this.searchTerm.toLowerCase();
                filtered = filtered.filter(log =>
                    log.user.toLowerCase().includes(term) ||
                    log.action.toLowerCase().includes(term) ||
                    log.resource.toLowerCase().includes(term) ||
                    log.ipAddress.includes(term)
                );
            }

            // Apply category filter
            if (this.selectedFilter !== 'all') {
                filtered = filtered.filter(log =>
                    log.action === this.selectedFilter
                );
            }

            this.filteredLogs = filtered.sort((a, b) =>
                new Date(b.timestamp) - new Date(a.timestamp)
            );
            this.currentPage = 1;
        },
        grantAccess() {
            if (this.userProfile.role === 'owner') {
                return true;
            }
        },
        formatDate(timestamp) {
            return new Date(timestamp).toLocaleString();
        },
        getBadgeClass(action) {
            const classes = {
                'login': 'badge-login',
                'logout': 'badge-logout',
                'create': 'badge-create',
                'update': 'badge-update',
                'delete': 'badge-delete',
                'view': 'badge-view'
            };
            return classes[action] || 'badge-view';
        },
        async refreshLogs() {
            this.loading = true;
            // Simulate API call
            setTimeout(async () => {
                this.loading = false;
                this.logs = await getActivityLogs();
                this.filterLogs();
            }, 1000);
        },
        downloadReport() {
            const csvContent = this.generateCSV();
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `activity-report-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        },
        generateCSV() {
            const headers = ['Timestamp', 'User', 'Action', 'Details', 'Section'];
            const rows = this.filteredLogs.map(log => [
                this.formatDate(log.timestamp),
                log.user_name ,
                log.action,
                log.details.status,
                log.table_name
            ]);

            const csvContent = [headers, ...rows]
                .map(row => row.map(cell => `"${cell}"`).join(','))
                .join('\n');

            return csvContent;
        }
    },
    async mounted() {
        if (this.grantAccess()) {
            this.logs = await getActivityLogs();
            this.filterLogs();
        } else {
            this.$router.push({ path: `/app/dashboard` })
        }
    }
}
</script>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
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

.header {
    background: linear-gradient(135deg, var(--dashprimary-color), var(--dashsecondary-color));
    color: white;
    padding: 2rem 0;
    margin-bottom: 2rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(52, 153, 64, 0.3);
}

.header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-align: center;
}

.header p {
    text-align: center;
    opacity: 0.9;
    font-size: 1.1rem;
}

.controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    align-items: center;
}

.search-box {
    flex: 1;
    min-width: 250px;
    position: relative;
}

.search-box input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.search-box input:focus {
    outline: none;
    border-color: var(--dashsecondary-color);
    box-shadow: 0 0 0 3px rgba(52, 153, 64, 0.1);
}

.filter-select {
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.filter-select:focus {
    outline: none;
    border-color: var(--dashsecondary-color);
    box-shadow: 0 0 0 3px rgba(52, 153, 64, 0.1);
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-primary {
    background: var(--primary);
    color: white;
}

.btn-primary:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(52, 153, 64, 0.3);
}

.btn-secondary {
    background: var(--secondary);
    color: var(--dark);
}

.btn-secondary:hover {
    background: #e6a200;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(244, 180, 0, 0.3);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
}

.stat-card h3 {
    color: var(--gray);
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
}

.stat-card .value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--dashsecondary-color);
}

.logs-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.logs-header {
    background: var(--light);
    padding: 1.5rem;
    border-bottom: 1px solid #e0e0e0;
}

.logs-header h2 {
    color: var(--dark);
    font-size: 1.3rem;
    font-weight: 600;
}

.logs-table {
    width: 100%;
    border-collapse: collapse;
}

.logs-table th,
.logs-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
}

.logs-table th {
    background: var(--light);
    font-weight: 600;
    color: var(--dark);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.logs-table tr:hover {
    background: #f8f9fa;
}

.activity-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.badge-login {
    background: var(--success);
    color: white;
}

.badge-logout {
    background: var(--gray);
    color: white;
}

.badge-create {
    background: var(--dashprimary-color);
    color: white;
}

.badge-update {
    background: var(--warning);
    color: white;
}

.badge-delete {
    background: var(--danger);
    color: white;
}

.badge-danger {
    color: var(--danger);
}

.badge-view {
    background: var(--maitsecondary);
    color: white;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem;
    background: var(--light);
}

.pagination button {
    padding: 8px 12px;
    border: 1px solid #e0e0e0;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.pagination button:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

.pagination button.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

.pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.no-logs {
    text-align: center;
    padding: 3rem;
    color: var(--gray);
}

.no-logs h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.loading {
    text-align: center;
    padding: 3rem;
    color: var(--gray);
}

.spinner {
    border: 3px solid #f3f3f3;
    border-top: 3px solid var(--primary);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@media (max-width: 768px) {
    .container {
        padding: 10px;
    }

    .controls {
        flex-direction: column;
        align-items: stretch;
    }

    .search-box {
        min-width: 100%;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .logs-table {
        font-size: 0.9rem;
    }

    .logs-table th,
    .logs-table td {
        padding: 0.5rem;
    }
}
</style>