<template>
    <div class="container">
        <header>
            <h1>MarineTech</h1>
        </header>

        <nav>
            <button v-for="section in sections" :key="section.id" class="nav-btn"
                :class="{ active: activeSection === section.id }" @click="handleSectionClick(section)">
                {{ section.icon }} {{ section.name }}
            </button>
        </nav>
        <div class="content">
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
            <section :class="['form-section', { active: activeSection === 'schedule' }]"
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
                                <option value="other">Other</option>
                            </select>
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
                            <p>Drag and drop files here or</p>
                            <input type="file" id="maintenance-files" class="file-input" @change="handleFiles" multiple>
                            <label for="maintenance-files" class="file-label">Browse Files</label>
                        </div>
                    </div>

                    <div class="action-buttons">
                        <button type="button" class="btn btn-primary" @click.prevent="saveSchedule">Save Schedule</button>
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
                                    <button v-if="task.status === 'Completed'" class="status-action">Print</button>
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
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            name: null,
            no: null,
            lastSection: '',
            currentTask: '',
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
            tasks: [],
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
                attachments: []
            }
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
            let crew = JSON.parse(localStorage.getItem('crew') ?? '[]');
            return crew.filter(member => member.vessel?.trim() === vesselName);
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
        }
    },
    async mounted() {
        let id = this.$route.params.id;
        let vessels = JSON.parse(localStorage.getItem('vessel')) || [];

        let vesselInfo = vessels.find(v => v.registrationNumber === id);
        this.vesselInfo = vesselInfo;

        if (vesselInfo) {
            this.no = vesselInfo.registrationNumber;
            this.name = vesselInfo.name;

            // get all tasks
            let tasks = JSON.parse(localStorage.getItem(`tasks-${id}`) ?? '[]');
            this.tasks.push(...tasks);
            this.currentTask = localStorage.getItem('currentTask');
        } else {
            this.$router.push({ path: `/app/dashboard` })
        }
    },
    methods: {
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
        },
        switchSchedule() {
            this.activeSection = 'schedule';
        },
        handleFiles(event) {
            this.form.attachments = Array.from(event.target.files);
        },
        validateForm() {
            const requiredFields = [
                'taskName',
                'description',
                'maintenanceType',
                'component',
                'priority',
                'lastPerformed',
                'nextDue',
                'recurrence'
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

        saveSchedule() {
            // the captain or owner is shown an initial checklist where they can add or remove checklist.
            // then save the checklist.
            // on open, open the already saved checklist.

            // perform validation
            const id = this.$route.params.id;
            if (!this.validateForm()) {
                return; // Stop if validation fails
            }

            // push the form info into task
            this.tasks.push(this.form);

            // save current task in localstorage.
            const existing = localStorage.getItem(`tasks-${id}`);

            if (!existing) {
                // If no vessel data in localStorage, create a new array with the vessel
                localStorage.setItem(`tasks-${id}`, JSON.stringify([this.form]));
            } else {
                // If vessel data exists, parse it, push the new vessel, then save it back
                const tasks = JSON.parse(existing);
                tasks.push(this.form);
                localStorage.setItem(`tasks-${id}`, JSON.stringify(tasks));
            }

            // load maintenance checklist
            this.loadChecklist(this.form.component);

            // save the lastsection, to edit button text
            this.lastSection = 'schedule';
            // Also update current task in localStorage (optional)
            localStorage.setItem('currentTask', this.form.component);
            console.log(this.form)
            console.log(this.form.component)

            // Then reset
            this.resetForm();
            // push to maintenance section
            this.activeSection = 'maintenance';
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

        resetTasks() {
            let id = this.$route.params.id;
            // get current task id from localstorage.
            let currentTask = localStorage.getItem('currentTask');
            let taskIndex = this.tasks.findIndex(task => task.component === currentTask);
            console.log(taskIndex)
            console.log(currentTask)

            if (taskIndex !== -1) {
                const allCompleted = this.checklists.every(item => item.completed);
                if (allCompleted) {
                    this.tasks[taskIndex].status = 'Completed';
                } else {
                    // clone checklist and store progress in the task tab
                    this.tasks[taskIndex].checklistProgress = [...this.checklists];
                }
                // Save and updated tasks array back to localStorage
                localStorage.setItem(`tasks-${id}`, JSON.stringify(this.tasks));
                // send to maintenance page
                this.activeSection = 'inventory';
            }
        },
        cleanAndParseAIResponse(text) {
            // Step 1: Replace smart quotes (like ’ or “ ”) with straight quotes
            text = text
                .replace(/[‘’]/g, "'")  // smart apostrophes
                .replace(/[“”]/g, '"'); // smart double quotes

            // Step 2: Replace single quotes around keys/values with double quotes (if needed)
            text = text.replace(/([{,]\s*)'([^']+?)'\s*:/g, '$1"$2":'); // keys
            text = text.replace(/:\s*'([^']*?)'/g, ': "$1"'); // string values

            // Now attempt to parse
            try {
                return JSON.parse(text);
            } catch (err) {
                console.error("Failed to parse cleaned response:", err.message);
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
</style>