<template>
    <div class="container">
        <header>
            <h1>MarineTech</h1>
        </header>

        <nav v-show="!showReport">
            <button v-for="section in sections" :key="section.id" class="nav-btn"
                :class="{ active: activeSection === section.id }" @click="handleSectionClick(section)">
                {{ section.icon }} {{ section.name }}
            </button>
        </nav>
        <div class="content" v-show="!showReport">
            <!-- Dashboard Direct -->
            <!-- Maintenance Tasks Form -->
            <section :class="['form-section', { active: activeSection === 'maintenance' }]"
                v-show="activeSection === 'maintenance'">
                <h2>🛠️ Maintenance Tasks</h2>
                <!-- Loading indicator -->
                <div class="loading-container" v-if="isLoading">
                    <div class="loading-spinner"></div>
                    <p>Loading checklist...</p>
                </div>
                <form v-if="!isLoading">
                    <div class="container">
                        <div class="d-flex justify-content-between align-items-center">
                            <h1>Maintenance Checklist</h1>
                            <button v-if="showAddTaskButton" class="btn btn-outline-custom" @click.prevent="addTask()">
                                Manually Add Task
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>

                        <div class="progress-container">
                            <div class="progress-info">
                                Progress: {{ progress }}% ({{ completedCount.length }}/{{ checklists.length }})
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" :style="{ width: progress + '%' }"></div>
                            </div>
                        </div>

                        <ul class="checklist">
                            <li v-for="checklist in checklists" :key="checklist.id" class="checklist-item">
                                <div class="checkbox" :class="{ 'checked': checklist.completed }"
                                    @click="toggleTask(checklist)">
                                    <span v-if="checklist.completed">✓</span>
                                </div>
                                <span class="task-text" :class="{ 'completed': checklist.completed }"
                                    @click="toggleTask(checklist)">
                                    {{ checklist.text }}
                                </span>
                                <button v-if="showAddTaskButton" class="delete-btn" @click="deleteTask(checklist.id)"
                                    title="Delete task">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="3,6 5,6 21,6"></polyline>
                                        <path
                                            d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2">
                                        </path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                </button>
                            </li>
                        </ul>

                        <div class="status" v-if="completedCount === checklists.length">
                            All tasks completed! ✅
                        </div>

                        <button class="reset-button" @click.prevent="resetTasks">{{ checklistButtonLabel }}</button>
                    </div>
                </form>
            </section>

            <!-- Maintenance Schedule Form -->
            <section :class="['form-section', { active: activeSection === 'schedule' && deepAccess() }]"
                v-show="activeSection === 'schedule'">
                <h2>📅 Maintenance Schedule</h2>
                <form>
                    <div class="form-group">
                        <label for="task-name">Task Name</label>
                        <input type="text" id="task-name" v-model="form.taskName" required>
                    </div>

                    <div class="form-group">
                        <label for="task-description">Description</label>
                        <textarea id="task-description" v-model="form.description" required></textarea>
                    </div>

                    <div class="input-group">
                        <div class="form-group">
                            <label for="maintenance-type">Maintenance Type</label>
                            <select id="maintenance-type" v-model="form.maintenanceType" required>
                                <option value="">-- Select Type --</option>
                                <option value="preventive">Preventive</option>
                                <option value="corrective">Corrective</option>
                                <option value="predictive">Predictive</option>
                                <option value="condition">Condition-Based</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="component">Component/System</label>
                            <select id="component" v-model="form.component" required>
                                <option value="">-- Select Component --</option>
                                <option value="engine">Engine</option>
                                <option value="hull">Hull</option>
                                <option value="electronics">Electronics</option>
                                <option value="deck">Deck Machinery</option>
                                <option value="plumbing">Plumbing</option>
                                <option value="electrical">Electrical</option>
                                <option value="hvac">HVAC</option>
                                <option value="safety">Safety Systems</option>
                                <option value="Other">Other</option>
                            </select>
                            <input v-if="form.component === 'Other'" type="text" placeholder="Enter custom component/system"
                                v-model="form.customComponent" style="margin-top: 8px;">
                        </div>
                    </div>

                    <div class="input-group">
                        <div class="form-group">
                            <label for="priority">Priority</label>
                            <select id="priority" v-model="form.priority" required>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="status">Status</label>
                            <input type="text" id="status" v-model="form.status" readonly>
                        </div>
                    </div>

                    <div class="input-group">
                        <div class="form-group">
                            <label for="estimated-hours">Estimated Hours</label>
                            <input type="number" id="estimated-hours" v-model="form.estimatedHours" min="0" step="0.5">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="assigned-to">Assigned To</label>
                        <select id="assigned-to" v-model="form.assignedTo">
                            <option value="">-- Select Personnel --</option>
                            <option v-for="member in getVesselCrew" :key="member.id"
                                :value="`${member.name} - ${member.role}`">
                                {{ member.name }} - {{ member.role }}
                            </option>
                        </select>
                    </div>

                    <div class="input-group">
                        <div class="form-group">
                            <label for="recurrence-type">Recurrence</label>
                            <select id="recurrence-type" v-model="form.recurrence" required>
                                <option value="once">One-time</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="semi-annual">Semi-annually</option>
                                <option value="annual">Annually</option>
                                <option value="custom">Custom Interval</option>
                            </select>
                        </div>
                    </div>

                    <div class="input-group">
                        <div class="form-group">
                            <label for="last-performed">Last Performed Date</label>
                            <input type="date" id="last-performed" v-model="form.lastPerformed">
                        </div>

                        <div class="form-group">
                            <label for="next-due">Due Date</label>
                            <input type="date" id="next-due" v-model="form.nextDue" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Notifications</label>
                        <div class="checkbox-group">
                            <div class="checkbox-item">
                                <input type="checkbox" id="notify-email" v-model="form.notifyEmail">
                                <label for="notify-email">Email Notification</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="notify-sms" v-model="form.notifySms">
                                <label for="notify-sms">SMS Notification</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="notify-app" v-model="form.notifyApp">
                                <label for="notify-app">In-App Notification</label>
                            </div>
                        </div>
                    </div>

                    <div class="input-group">
                        <div class="form-group">
                            <label for="reminder-days">Reminder (Days Before)</label>
                            <select id="reminder-days" v-model="form.reminderDays">
                                <option value="1">1 day</option>
                                <option value="3">3 days</option>
                                <option value="7">1 week</option>
                                <option value="14">2 weeks</option>
                                <option value="30">1 month</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="schedule-notes">Notes</label>
                        <textarea id="schedule-notes" v-model="form.notes"></textarea>
                    </div>

                    <div class="form-group">
                        <label>Attachments</label>
                        <div class="attachment-area">
                            <p>{{ imgText }}</p>
                            <input type="file" id="maintenance-files" class="file-input" @change="handleFiles" multiple>
                            <label for="maintenance-files" class="file-label">Browse Files</label>
                        </div>
                    </div>

                    <div class="action-buttons">
                        <button type="button" class="btn btn-primary" @click.prevent="saveSchedule" :disabled="isSaving">
                            {{ isSaving ? 'Saving...' : 'Save Schedule' }}
                        </button>
                    </div>
                </form>
            </section>

            <!-- Inventory Form -->
            <section :class="['form-section', { active: activeSection === 'inventory' }]"
                v-show="activeSection === 'inventory'">
                <h2>All Maintenance</h2>
                <div class="task-table-wrapper">
                    <!-- Filters and Controls -->
                    <div class="table-controls">
                        <div class="filters">
                            <button :class="{ active: activeFilter === 'due' }" @click="setFilter('due')">Due</button>
                            <button :class="{ active: activeFilter === 'all' }" @click="setFilter('all')">All</button>
                            <button :class="{ active: activeFilter === 'completed' }"
                                @click="setFilter('completed')">Completed</button>
                            <input type="text" v-model="searchQuery" placeholder="Search..." />
                        </div>
                    </div>

                    <!-- Task Table -->
                    <table class="task-table">
                        <thead>
                            <tr>
                                <th>Equipment</th>
                                <th>Task Name</th>
                                <th>Assigned To</th>
                                <th>Intervals</th>
                                <th>Remaining</th>
                                <th>Next Due</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="task in filteredTasks" :key="task.id">
                                <td>{{ task.component }}</td>
                                <td>{{ task.taskName }}</td>
                                <td>{{ task.assignedTo }}</td>
                                <td>{{ task.recurrence }}</td>
                                <td>{{ task.remainingDays }}</td>
                                <td>{{ task.nextDue }}</td>
                                <td>
                                    <span :class="['status-badge', task.status.toLowerCase().replace(' ', '-')]">
                                        {{ task.status }}
                                    </span>
                                </td>
                                <td>
                                    <button @click="printMaintenance(task.component)" v-if="task.status === 'Completed'"
                                        class="status-action">Print</button>
                                    <button @click="showMaintenance(task.component)" v-else
                                        class="status-action">Start</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Empty schedule -->
                    <div v-if="!tasks.length">
                        <div class="alert alert-primary" role="alert">
                            <h4 class="alert-heading">Such Empty!!!</h4>
                            <p>You have no maintenance, because you have not scheduled any for this ship.</p>
                            <hr>
                            <p class="mb-0">Navigate to the schedule tab, to start scheduling. Or click on this button to
                                <button type="button" class="btn btn-primary" @click="switchSchedule()">Schedule</button>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div class="report-container" ref="reportContainer">
            <div class="header">
                <div class="report-title">MAINTENANCE TASK REPORT</div>
            </div>

            <div class="report-info">
                <div class="info-box">
                    <div class="info-label">Report Generated:</div>
                    <div>{{ reportDate }}</div>
                </div>
                <div class="info-box">
                    <div class="info-label">Report ID:</div>
                    <div>{{ reportId }}</div>
                </div>
                <div class="info-box">
                    <div class="info-label">Total Tasks:</div>
                    <div>{{ maintenanceTasks.length }}</div>
                </div>
                <div class="info-box">
                    <div class="info-label">Generated By:</div>
                    <div>MarineTech System</div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">📊 Task Summary</div>
                <div class="summary-grid">
                    <div class="summary-card">
                        <div class="summary-number">1</div>
                        <div class="summary-label">Completed</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-number">0</div>
                        <div class="summary-label">Pending</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-number">0</div>
                        <div class="summary-label">Overdue</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-number">{{ totalEstimatedHours }}</div>
                        <div class="summary-label">Total Hours</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">🔧 Maintenance Tasks</div>
                <div v-for="task in maintenanceTasks" :key="task.taskName" :class="['task-item', getTaskStatusClass(task)]">

                    <div class="task-header">
                        <div>
                            <div class="task-title">
                                {{ task.taskName }}
                                <span :class="['maintenance-type', 'type-' + task.maintenanceType]">
                                    {{ task.maintenanceType }}
                                </span>
                            </div>
                            <div class="task-component">Component: {{ task.component }}</div>
                        </div>
                        <span :class="['status-badge', 'status-' + task.status.toLowerCase().replace(' ', '-')]">
                            {{ task.status }}
                        </span>
                    </div>

                    <div class="task-details">
                        <div class="detail-item">
                            <div class="detail-label">Assigned To</div>
                            <div class="detail-value">{{ task.assignedTo }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Estimated Hours</div>
                            <div class="detail-value">{{ task.estimatedHours }} hours</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Last Performed</div>
                            <div class="detail-value">{{ formatDate(task.lastPerformed) }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Next Due</div>
                            <div class="detail-value">{{ formatDate(task.nextDue) }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Recurrence</div>
                            <div class="detail-value">{{ task.recurrence }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Remaining Days</div>
                            <div class="detail-value">{{ task.remainingDays }} days</div>
                        </div>
                    </div>

                    <div v-if="task.description"
                        style="margin: 15px 0; padding: 10px; background: white; border-radius: 5px;">
                        <div class="detail-label">Description</div>
                        <div class="detail-value">{{ task.description }}</div>
                    </div>

                    <div v-if="task.notes" style="margin: 15px 0; padding: 10px; background: white; border-radius: 5px;">
                        <div class="detail-label">Notes</div>
                        <div class="detail-value">{{ task.notes }}</div>
                    </div>

                    <div v-if="task.checklistProgress && task.checklistProgress.length > 0" class="checklist-progress">
                        <div class="detail-label">Checklist Progress</div>
                        <div class="progress-bar">
                            <div class="progress-fill" :style="{ width: getChecklistProgress(task) + '%' }"></div>
                        </div>
                        <div style="font-size: 0.9em; color: #666; margin-top: 5px;">
                            {{ getCompletedChecklistItems(task) }} of {{ task.checklistProgress.length }} items completed
                            ({{ getChecklistProgress(task) }}%)
                        </div>
                        <div class="checklist-items">
                            <div v-for="(item, index) in task.checklistProgress" :key="index" class="checklist-item">
                                <span class="checklist-icon">{{ item.completed ? '✅' : '⭕' }}</span>
                                <span>{{ item.text || 'Checklist Item ' + (index + 1) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">📋 Recommendations</div>
                <div class="info-box">
                    <ul>
                        <li v-for="recommendation in generateRecommendations()" :key="recommendation">
                            {{ recommendation }}
                        </li>
                    </ul>
                </div>
            </div>

            <div class="signature-section">
                <div class="signature-box">
                    <div><strong>Report Generated By</strong></div>
                    <div style="margin-top: 10px; color: #666;">MarineTech Maintenance System</div>
                </div>
                <div class="signature-box">
                    <div><strong>Date</strong></div>
                    <div style="margin-top: 10px; color: #666;">{{ reportDate }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
import supabase from '../supabase';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            name: null,
            no: null,
            isSaving: false,
            lastSection: '',
            currentTask: '',
            imgText: 'Drag and drop files here or',
            tasks: [],
            activeSection: 'inventory',
            sections: [
                { id: 'schedule', name: 'Schedule', icon: '📅' },
                { id: 'inventory', name: 'All Maintenance', icon: '♻️' },
                {
                    id: 'dashboard', name: 'Dashboard', icon: '☰', onClick: () => {
                        this.$router.push({ path: `/app/dashboard` })
                    }
                }
            ],
            activeFilter: 'all',
            searchQuery: '',
            activeFilters: [1, 2], // example filter count
            vesselInfo: [],
            checklists: [],
            isLoading: false,
            form: {
                taskName: '',
                description: '',
                maintenanceType: '',
                component: '',
                priority: '',
                dueDate: '',
                estimatedHours: null,
                assignedTo: '',
                recurrence: '',
                lastPerformed: '',
                nextDue: '',
                notifyEmail: true,
                notifySms: false,
                notifyApp: true,
                reminderDays: '1',
                estimatedDuration: null,
                notes: '',
                status: 'Soon',
                remainingDays: null,
                attachments: {}
            },
            maintenanceTasks: [],
            showReport: false,
            reportDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            reportId: 'MT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        };
    },
    watch: {
        'form.lastPerformed': 'calculateNextDue',
        'form.recurrence': 'calculateNextDue',
        'form.nextDue': function (newDate) {
            this.calculateRemainingDays();
        }
    },
    computed: {
        ...mapGetters('user', ['userProfile', 'userRoleDescription']),
        filteredTasks() {
            let result = [...this.tasks];
            if (this.activeFilter === 'all') {
                result = result.filter(task => task.status === 'Overdue' || task.status === 'Soon' || task.status === 'Completed');
            }
            else if (this.activeFilter === 'due') {
                result = result.filter(task => task.status === 'Overdue' || task.status === 'Soon');
            } else if (this.activeFilter === 'completed') {
                result = result.filter(task => task.status === 'Completed');
            }

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(task =>
                    task.equipment.toLowerCase().includes(query) ||
                    task.taskName.toLowerCase().includes(query) ||
                    task.assignedTo.toLowerCase().includes(query)
                );
            }

            return result;
        },
        getName() {
            return this.currentTask;
        },
        getVesselCrew() {
            let vesselName = this.vesselInfo.name;
            return this.$store.getters['crew/getCrewByVessel'](vesselName)
        },
        completedCount() {
            return this.checklists.filter(item => item.completed);
        },
        progress() {
            return Math.round((this.completedCount.length / this.checklists.length) * 100);
        },
        checklistButtonLabel() {
            return this.lastSection === 'schedule' ? 'Approve Maintenance' : 'Save Checklist';
        },
        showAddTaskButton() {
            return this.checklistButtonLabel !== 'Save Checklist';
        },
        vessels() {
            return this.$store.getters['vessel/allVessels'];
        },
        totalEstimatedHours() {
            return this.maintenanceTasks.reduce((total, task) => total + (task.estimatedHours || 0), 0);
        }
    },
    async mounted() {
        let id = this.$route.params.id;
        let vesselInfo = this.vessels.find(v => v.registrationNumber === id);
        this.vesselInfo = vesselInfo;
        if (this.grantAccess(vesselInfo.name)) {

            if (vesselInfo) {
                this.no = vesselInfo.registrationNumber;
                this.name = vesselInfo.name;

                await this.$store.dispatch('tasks/loadTasks', this.$route.params.id);

                this.tasks = this.$store.getters['tasks/getTasksByVessel'](this.$route.params.id);

                this.currentTask = localStorage.getItem('currentTask');
            } else {
                this.$router.push({ path: `/app/dashboard` })
            }

            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('company_id')
                    .eq('id', session.user.id)
                    .single();

                if (profile?.company_id) {
                    await this.$store.dispatch('company/fetchCompanyInfo', profile.company_id);
                }
            }
        } else {
            this.$router.push({ path: `/app/dashboard` })
        }
    },
    methods: {
        grantAccess(vessel) {
            if (this.userProfile.role == 'owner' || this.userProfile.role == 'staff' || (this.userProfile.role == 'captain' && this.userProfile.vessel == vessel)) {
                return true
            }
        },
        deepAccess() {
            if (this.userProfile.role === 'owner' || this.userProfile.role === 'captain') {
                return true;
            } else {
                Swal.fire({
                    title: 'Unauthorized',
                    text: 'You do not have the access to do this',
                    icon: 'info'
                });
                return false;
            }
        },
        deleteTask(taskId) {
            this.checklists = this.checklists.filter(checklist => checklist.id !== taskId);
        },
        addTask(event) {
            if (event) event.preventDefault(); // Stop form from submitting
            Swal.fire({
                title: 'Add New Task',
                input: 'text',
                inputLabel: 'Task Description',
                inputPlaceholder: 'Enter the task details',
                showCancelButton: true,
                confirmButtonText: 'Add Task',
                inputValidator: (value) => {
                    if (!value) {
                        return 'Please enter a task';
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const newTask = {
                        id: 30,
                        text: result.value,
                        completed: false
                    };

                    this.checklists.push(newTask);
                }
            })

        },

        setFilter(filter) {
            this.activeFilter = filter;
        },
        loadChecklist(taskComponent) {
            this.isLoading = true; // Start loading

            this.checklist(taskComponent)
                .then((res) => {
                    this.checklists = res.map(item => ({
                        ...item,
                        completed: false
                    }));
                })
                .catch(error => {
                    console.error("Error loading checklist:", error);
                    // You might want to show an error message to the user
                })
                .finally(() => {
                    this.isLoading = false; // End loading regardless of success or failure
                });
        },
        showMaintenance(taskComponent) {
            if (this.deepAccess()) {
                const tasks = this.tasks;
                const task = tasks.find(t => t.component === taskComponent);

                if (task && task.checklistProgress) {
                    this.checklists = [...task.checklistProgress];
                } else {
                    // Reset all checklist items to not completed
                    this.loadChecklist(taskComponent);
                }

                // Also update current task in localStorage (optional)
                localStorage.setItem('currentTask', taskComponent);
                this.currentTask = taskComponent;
                // save the lastsection, to edit button text
                this.lastSection = 'inventory';

                this.activeSection = 'maintenance';
            }
        },
        printMaintenance(taskComponent) {
            const tasks = this.tasks;
            const task = tasks.find(t => t.component === taskComponent);
            this.maintenanceTasks = [task];
            this.loadMaintenanceData();

            // Show the report and trigger print
            this.showReport = true;

            // Small delay to ensure DOM is updated before printing
            this.$nextTick(() => {
                setTimeout(() => {
                    window.print();
                    // Hide report again after printing
                    this.showReport = false;
                }, 100);
            });
        },
        switchSchedule() {
            if (this.deepAccess()) {
                this.activeSection = 'schedule';
            }
        },
        handleFiles(event) {
            this.imgText = event.target.files[0].name
            this.form.attachments = {
                file: event.target.files[0] // only the first file
            };
        },
        validateForm() {
            const requiredFields = [
                'taskName',
                'description',
                'maintenanceType',
                'component',
                'priority',
                'estimatedHours',
                'recurrence',
                'lastPerformed',
                'assignedTo'
            ];

            for (const field of requiredFields) {
                if (!this.form[field]) {
                    Swal.fire({
                        title: "Missing info",
                        text: `Please fill in the required field: ${field}`,
                        icon: "error"
                    });
                    return false;
                }
            }

            return true;
        },

        handleSectionClick(section) {
            this.activeSection = section.id;
            if (typeof section.onClick === 'function') {
                section.onClick();
            }
        },

        calculateNextDue() {
            const date = this.form.lastPerformed ? new Date(this.form.lastPerformed) : null;
            const recurrence = this.form.recurrence;

            if (!date || !recurrence) return;

            let nextDate = new Date(date);

            switch (recurrence) {
                case 'daily':
                    nextDate.setDate(nextDate.getDate() + 1);
                    break;
                case 'weekly':
                    nextDate.setDate(nextDate.getDate() + 7);
                    break;
                case 'monthly':
                    nextDate.setMonth(nextDate.getMonth() + 1);
                    break;
                case 'quarterly':
                    nextDate.setMonth(nextDate.getMonth() + 3);
                    break;
                case 'semi-annual':
                    nextDate.setMonth(nextDate.getMonth() + 6);
                    break;
                case 'annual':
                    nextDate.setFullYear(nextDate.getFullYear() + 1);
                    break;
                case 'once':
                case 'custom':
                    // Don't auto-calculate for these
                    return;
            }

            this.form.nextDue = nextDate.toISOString().split('T')[0]; // Format as yyyy-mm-dd
        },

        calculateRemainingDays() {
            if (!this.form.nextDue) {
                this.form.remainingDays = null;
                return;
            }

            const today = new Date();
            const nextDueDate = new Date(this.form.nextDue);

            // Set time to 00:00 to ensure date-only comparison
            today.setHours(0, 0, 0, 0);
            nextDueDate.setHours(0, 0, 0, 0);

            const diffTime = nextDueDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            this.form.remainingDays = `${diffDays} Days`;
        },

        async saveSchedule() {
            // the captain or owner is shown an initial checklist where they can add or remove checklist.
            // then save the checklist.
            // on open, open the already saved checklist.
            this.isSaving = true;
            const id = this.$route.params.id;
            if (!this.validateForm()) {
                this.isSaving = false;
                return; // Stop if validation fails
            }

            // Create a copy of form data
            const taskData = { ...this.form };

            // Replace component with custom value if "other" was selected
            if (this.form.component === 'Other' && this.form.customComponent) {
                taskData.component = this.form.customComponent;
            }
            // perform validation
            // validate that the component isn't already in maintenance.
            const tasksData = localStorage.getItem(`tasks-${id}`) || '[]';
            const tasks = JSON.parse(tasksData);

            // Check for duplicate component
            const hasDuplicateComponent = tasks.some(task => task.component === taskData.component);

            if (hasDuplicateComponent) {
                Swal.fire({
                    icon: 'error',
                    title: 'Duplicate Component',
                    text: `A task with the component "${taskData.component}" already exists in maintenance`,
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'swal2-confirm'
                    }
                });
                return; // Stop further execution
            } else {
                // Remove the customComponent field before saving
                delete taskData.customComponent;

                const file = taskData.attachments.file;

                await this.$store.dispatch('tasks/addTask', {
                    vesselId: this.$route.params.id,
                    task: taskData
                });

                /* Push Image */
                const randomText = Math.random().toString(36).substring(2, 8);
                let companyId = localStorage.getItem('company_id');
                const { data, error } = await supabase.storage
                    .from('company-files')
                    .upload(`tasks/${companyId}-${randomText}.png`, file, {
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

                    console.log(publicUrlData)

                    const publicUrl = publicUrlData.publicUrl;

                    // Update the company's logo with the public URL
                    const { error: updateError } = await supabase
                        .from('tasks')
                        .update({ attachments: publicUrl })
                        .eq('company_id', companyId)
                        .eq('vessel', this.$route.params.id)
                        .eq('component', taskData.component);

                    if (updateError) console.error('Update failed', error);
                }

                // load maintenance checklist
                this.loadChecklist(taskData.component);

                // save the lastsection, to edit button text
                this.lastSection = 'schedule';
                // Also update current task in localStorage (optional)
                localStorage.setItem('currentTask', taskData.component);
                // Then reset
                this.resetForm();
                // push to maintenance section
                this.activeSection = 'maintenance';
            }
        },

        // Then reset
        resetForm() {
            this.form = {
                taskName: '',
                description: '',
                maintenanceType: '',
                component: '',
                priority: '',
                dueDate: '',
                estimatedHours: null,
                assignedTo: '',
                recurrence: '',
                lastPerformed: '',
                nextDue: '',
                notifyEmail: true,
                notifySms: false,
                notifyApp: true,
                reminderDays: '1',
                estimatedDuration: null,
                notes: '',
                status: 'Soon',
                remainingDays: null,
                attachments: []
            }
        },

        resetChecklist() {
            this.checklists.value.forEach(item => item.completed = false);
        },

        toggleTask(task) {
            task.completed = !task.completed;
        },

        async resetTasks() {
            let id = this.$route.params.id;
            // get current task id from localstorage.
            let currentTask = localStorage.getItem('currentTask');
            let taskIndex = this.tasks.findIndex(task => task.component === currentTask);

            if (taskIndex !== -1) {
                const allCompleted = this.checklists.every(item => item.completed);
                if (allCompleted) {
                    this.tasks[taskIndex].status = 'Completed';
                } else {
                    // clone checklist and store progress in the task tab
                    this.tasks[taskIndex].checklistProgress = [...this.checklists];
                }
                // Save and updated tasks array back to localStorage
                // localStorage.setItem(`tasks-${id}`, JSON.stringify(this.tasks));
                let updateTask = {
                    checklistProgress: this.tasks[taskIndex].checklistProgress,
                    status: this.tasks[taskIndex].status,
                    component: currentTask
                }
                await this.$store.dispatch('tasks/updateTask', {
                    vesselId: id,
                    tasks: this.tasks,
                    updateTask
                });
                // send to maintenance page
                this.activeSection = 'inventory';
            }
        },
        cleanAndParseAIResponse(text) {
            // Step 1: Replace smart quotes with straight quotes
            text = text
                .replace(/[‘’]/g, "'")   // smart apostrophes
                .replace(/[“”]/g, '"');  // smart double quotes

            // Step 2: Convert single quotes around keys to double quotes
            text = text.replace(/([{,]\s*)'([^']+?)'\s*:/g, '$1"$2":');

            // Step 3: Convert single quotes around string values to double quotes
            // only when the value doesn't contain inner single quotes (to avoid breaking apostrophes)
            text = text.replace(/:\s*'([^']*?)'/g, (match, p1) => {
                if (p1.includes('"')) return match; // skip if it already contains double quotes
                if (p1.includes("'")) return match; // skip if value contains apostrophes
                return `: "${p1}"`;
            });

            // Step 4: Attempt parsing
            try {
                return JSON.parse(text);
            } catch (err) {
                console.error("Failed to parse cleaned response:", err.message);
                console.log("Raw cleaned text:", text);
                return null;
            }
        },
        async checklist(mainType) {
            try {
                const res = await axios.post(`https://proctoredserver.peppubuild.com/promptai`, {
                    userReq: mainType
                });
                console.log(res.data.result)
                let result = res.data.result;
                let content = '';

                try {
                    const match = result.match(/```(?:\w*\n)?([\s\S]*?)```/);
                    content = match ? match[1] : result; // If no match, fallback to using the full result
                } catch (error) {
                    console.error("Failed to extract code block:", error);
                    content = result;
                }

                const theContent = this.cleanAndParseAIResponse(content)
                return theContent;
            } catch (err) {
                Swal.fire({
                    title: "An error occurred",
                    text: `We ran into an error while generating the checklist. Try again, or generate checklist manually.`,
                    icon: "error"
                });
            }
        },

        // This function simulates receiving data from your print function
        loadMaintenanceData() {
            // In real implementation, this would call your Vue.js print function
            // that returns the data structure you provided
            // For example: this.maintenanceTasks = await yourPrintFunction();

            // Generate new report ID for each print
            this.reportId = 'MT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            this.reportDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        formatDate(dateString) {
            if (!dateString) return 'N/A';
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },

        getTaskStatusClass(task) {
            if (task.status === 'Completed') return 'completed';
            if (task.status === 'Overdue') return 'overdue';
            if (task.status === 'In Progress') return 'in-progress';
            return 'pending';
        },

        getChecklistProgress(task) {
            if (!task.checklistProgress || task.checklistProgress.length === 0) return 0;
            const completed = task.checklistProgress.filter(item => item.completed).length;
            return Math.round((completed / task.checklistProgress.length) * 100);
        },

        getCompletedChecklistItems(task) {
            if (!task.checklistProgress) return 0;
            return task.checklistProgress.filter(item => item.completed).length;
        },

        generateRecommendations() {
            const recommendations = [];

            recommendations.push('Maintain regular communication with assigned technicians');
            recommendations.push('Ensure all safety protocols are followed during maintenance activities');
            recommendations.push('Update task progress and notes in real-time for accurate reporting');

            return recommendations;
        }
    }

};
</script>

<style scoped>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    background-color: #f5f5f5;
    color: #333;
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.progress-container {
    margin-bottom: 20px;
}

.progress-bar {
    background-color: #e9ecef;
    border-radius: 4px;
    height: 10px;
    margin-top: 8px;
}

.progress-fill {
    background-color: #00a8e8;
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
}

.checklist {
    list-style-type: none;
    padding: 0;
}

.checklist-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    cursor: pointer;
}

.checkbox {
    margin-right: 15px;
    width: 20px;
    height: 20px;
    border: 2px solid #00a8e8;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.checkbox.checked {
    background-color: #00a8e8;
    color: white;
}

.task-text {
    flex-grow: 1;
}

.task-text.completed {
    text-decoration: line-through;
    color: #6c757d;
}

.status {
    margin-top: 20px;
    font-weight: bold;
    text-align: center;
}

.reset-button {
    background-color: #005792;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
    font-weight: bold;
}

.btn-outline-custom {
    color: #005792;
    /* your custom text color */
    border: 2px solid #005792;
    /* your custom border color */
    background-color: transparent;
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
}

.btn-outline-custom:hover {
    background-color: #005792;
    /* custom hover background */
    color: white;
    /* text color on hover */
}

.reset-button:hover {
    background-color: #003d5b;
}

header {
    background-color: var(--maitprimary);
    color: white;
    padding: 1rem;
    text-align: center;
    border-radius: 5px 5px 0 0;
}

nav {
    background-color: var(--maitsecondary);
    padding: 10px;
    display: flex;
    justify-content: center;
}

nav button {
    background-color: var(--maitsecondary);
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 0 5px;
    cursor: pointer;
    font-weight: bold;
    border-radius: 3px;
    transition: background-color 0.3s;
}

nav button:hover,
nav button.active {
    background-color: var(--maitprimary);
}

.content {
    background-color: white;
    padding: 20px;
    border-radius: 0 0 5px 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
    color: var(--dark);
    margin-bottom: 20px;
    border-bottom: 2px solid var(--light);
    padding-bottom: 10px;
}

.form-section {
    display: none;
    animation: fadeIn 0.5s;
}

.form-section.active {
    display: block;
}

.form-row {
    margin-bottom: 15px;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: var(--dark);
}

input,
select,
textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

.input-group {
    display: flex;
    gap: 10px;
}

.input-group>div {
    flex: 1;
}

textarea {
    height: 120px;
    resize: vertical;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: background-color 0.3s;
}

.btn-primary {
    background-color: var(--maitprimary);
    color: white;
}

.btn-primary:hover {
    background-color: var(--dark);
}

.btn-success {
    background-color: var(--success);
    color: white;
}

.btn-success:hover {
    background-color: #219653;
}

.action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.status-badge {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 14px;
    font-weight: bold;
    color: white;
}

.status-pending {
    background-color: var(--warning);
}

.status-progress {
    background-color: var(--accent);
}

.status-completed {
    background-color: var(--success);
}

.attachment-area {
    border: 2px dashed #ddd;
    padding: 20px;
    text-align: center;
    border-radius: 5px;
    margin-bottom: 20px;
}

.file-input {
    display: none;
}

.file-label {
    display: inline-block;
    padding: 10px 20px;
    background-color: var(--accent);
    color: white;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.file-label:hover {
    background-color: var(--maitsecondary);
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.form-section h3 {
    margin-top: 30px;
    margin-bottom: 15px;
    color: var(--maitsecondary);
}

.checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 10px;
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 5px;
}

.checkbox-item input {
    width: auto;
}

.status-badge {
    padding: 0.3em 0.6em;
    border-radius: 4px;
    color: white;
    font-weight: bold;
    font-size: 0.85rem;
}

.status-action {
    padding: 0.3em 0.6em;
    border-radius: 4px;
    color: white;
    font-weight: bold;
    font-size: 0.85rem;
    background-color: var(--maitprimary);
}

.status-badge.overdue {
    background-color: red;
}

.status-badge.soon {
    background-color: orange;
}

/* Wrapper layout */
.task-table-wrapper {
    font-family: 'Inter', sans-serif;
    padding: 1rem;
}

/* Controls section */
.table-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.filters {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.filters button,
.filters input {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    background-color: #f5f5f5;
    font-weight: 500;
    cursor: pointer;
}

.filters button.active {
    background-color: #002f6c;
    color: white;
}

.filters input {
    border: 1px solid #bbb;
}

.filter-badge {
    background-color: #eee;
    color: #333;
}

/* Print and Add buttons */
.table-controls>div:last-child button {
    padding: 0.5rem 1rem;
    border: 1px solid var(--maitprimary);
    border-radius: 6px;
    background-color: white;
    color: var(--maitprimary);
    ;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.table-controls>div:last-child button:last-child {
    background-color: var(--maitprimary);
    ;
    color: white;
}

/* Table */
.task-table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 0 0 1px #ccc;
}

.task-table thead {
    background-color: var(--maitprimary);
    ;
    color: white;
}

.task-table th,
.task-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #eee;
    white-space: pre-line;
    /* so \n works */
}

.task-table tbody tr:hover {
    background-color: #f9f9f9;
}

/* Status badges */
.status-badge {
    padding: 0.3em 0.6em;
    border-radius: 6px;
    font-weight: bold;
    font-size: 0.85rem;
    color: white;
    display: inline-block;
    text-align: center;
    min-width: 90px;
}

.status-badge.complete {
    background-color: #4dffd0;
}

.status-badge.soon {
    background-color: #ffa500;
}

.status-badge.completed {
    background-color: #4caf50;
}

.delete-btn {
    background: none;
    border: none;
    color: #dc3545;
    cursor: pointer;
    padding: 6px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    opacity: 1;
    margin-left: 8px;
    flex-shrink: 0;
    transform: scale(1.1);
}

.checklist-item:hover .delete-btn {
    opacity: 1;
}

.delete-btn:hover {
    background-color: #dc3545;
    color: white;
    transform: scale(1.1);
}

.delete-btn:active {
    transform: scale(0.95);
}

.print-only-container {
    text-align: center;
}

.initial-print-btn {
    background: linear-gradient(135deg, #0066cc, #004499);
    color: white;
    border: none;
    padding: 20px 40px;
    font-size: 1.3em;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 6px 20px rgba(0, 102, 204, 0.3);
    display: flex;
    align-items: center;
    gap: 15px;
    margin: 0 auto;
}

.initial-print-btn:hover {
    background: linear-gradient(135deg, #004499, #003366);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 102, 204, 0.4);
}

.initial-print-btn:active {
    transform: translateY(0);
}

.company-branding {
    margin-bottom: 30px;
}

.company-logo {
    font-size: 3em;
    font-weight: bold;
    color: #0066cc;
    margin-bottom: 10px;
}

.company-tagline {
    font-size: 1.1em;
    color: #666;
}

/* Report Styles - Hidden Initially */
.report-container {
    display: none;
    max-width: 900px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.header {
    text-align: center;
    border-bottom: 3px solid #0066cc;
    padding-bottom: 20px;
    margin-bottom: 30px;
}

.report-logo {
    font-size: 2.5em;
    font-weight: bold;
    color: #0066cc;
    margin-bottom: 10px;
}

.report-title {
    font-size: 1.8em;
    color: #333;
    margin: 10px 0;
}

.report-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.info-box {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid #0066cc;
}

.info-box ul li {
    margin-left: 15px;
}

.info-label {
    font-weight: bold;
    color: #0066cc;
    margin-bottom: 5px;
}

.section {
    margin-bottom: 30px;
}

.section-title {
    font-size: 1.3em;
    font-weight: bold;
    color: #0066cc;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 10px;
    margin-bottom: 15px;
}

.task-item {
    background: #f8f9fa;
    margin: 15px 0;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #28a745;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.task-item.pending {
    border-left-color: #ffc107;
}

.task-item.overdue {
    border-left-color: #dc3545;
}

.task-item.in-progress {
    border-left-color: #17a2b8;
}

.task-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
    flex-wrap: wrap;
    gap: 10px;
}

.task-title {
    font-size: 1.2em;
    font-weight: bold;
    color: #333;
}

.task-component {
    font-size: 0.9em;
    color: #666;
    margin-top: 5px;
}

.status-badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8em;
    font-weight: bold;
    text-transform: uppercase;
}

.status-completed {
    background: #d4edda;
    color: #155724;
}

.status-pending {
    background: #fff3cd;
    color: #856404;
}

.status-overdue {
    background: #f8d7da;
    color: #721c24;
}

.status-in-progress {
    background: #d1ecf1;
    color: #0c5460;
}

.task-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin: 15px 0;
}

.detail-item {
    display: flex;
    flex-direction: column;
}

.detail-label {
    font-weight: bold;
    font-size: 0.85em;
    color: #0066cc;
    margin-bottom: 3px;
}

.detail-value {
    font-size: 0.95em;
    color: #333;
}

.checklist-progress {
    margin-top: 15px;
}

.progress-bar {
    width: 100%;
    height: 20px;
    background: #e9ecef;
    border-radius: 10px;
    overflow: hidden;
    margin: 10px 0;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #28a745, #20c997);
    transition: width 0.3s ease;
}

.checklist-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
    margin-top: 10px;
}

.checklist-item {
    display: flex;
    align-items: center;
    padding: 8px;
    background: white;
    border-radius: 5px;
    font-size: 0.9em;
}

.checklist-icon {
    margin-right: 8px;
    font-size: 1.1em;
}

.summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin: 20px 0;
}

.summary-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    border: 2px solid #e9ecef;
}

.summary-number {
    font-size: 2em;
    font-weight: bold;
    color: #0066cc;
}

.summary-label {
    font-size: 0.9em;
    color: #666;
    margin-top: 5px;
}

.signature-section {
    margin-top: 40px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
}

.signature-box {
    padding-top: 10px;
    text-align: center;
}

.maintenance-type {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75em;
    font-weight: bold;
    text-transform: uppercase;
    margin-left: 10px;
}

.type-corrective {
    background: #fff3cd;
    color: #856404;
}

.type-preventive {
    background: #d4edda;
    color: #155724;
}

.type-predictive {
    background: #d1ecf1;
    color: #0c5460;
}

/* Print Styles */
@media print {
    body {
        background: white;
        padding: 0;
        display: block;
    }

    .print-only-container {
        display: none !important;
    }

    .report-container {
        display: block !important;
        box-shadow: none;
        padding: 0;
        margin: 0;
        max-width: none;
    }
}
</style>