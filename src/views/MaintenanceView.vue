<template>
    <div class="container">
        <header>
            <h1>MarineTech</h1>
        </header>

        <nav>
            <button v-for="section in sections" :key="section.id" class="nav-btn"
                :class="{ active: activeSection === section.id }" @click="activeSection = section.id">
                {{ section.icon }} {{ section.name }}
            </button>
        </nav>

        <div class="content">
            <!-- Vessel Information Form -->
            <section :class="['form-section', { active: activeSection === 'vessel' }]" v-show="activeSection === 'vessel'">
                <h2>⚓ Vessel Information</h2>
                <form>
                    <div class="input-group">
                        <div class="form-group">
                            <label for="vessel-name">Vessel Name</label>
                            <input type="text" id="vessel-name" required>
                        </div>
                        <div class="form-group">
                            <label for="imo-number">IMO Number</label>
                            <input type="text" id="imo-number" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="vessel-type">Vessel Type</label>
                        <select id="vessel-type" required>
                            <option value="">-- Select Vessel Type --</option>
                            <option value="cargo">Cargo Ship</option>
                            <option value="tanker">Tanker</option>
                            <option value="passenger">Passenger Ship</option>
                            <option value="fishing">Fishing Vessel</option>
                            <option value="offshore">Offshore Support</option>
                            <option value="research">Research Vessel</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="owner">Owner/Operator</label>
                        <input type="text" id="owner" required>
                    </div>

                    <div class="input-group">
                        <div class="form-group">
                            <label for="year-built">Year Built</label>
                            <input type="number" id="year-built" min="1900" max="2025" required>
                        </div>
                        <div class="form-group">
                            <label for="flag-state">Flag State</label>
                            <input type="text" id="flag-state" required>
                        </div>
                    </div>

                    <h3>Vessel Specifications</h3>
                    <div class="input-group">
                        <div class="form-group">
                            <label for="length">Length (m)</label>
                            <input type="number" id="length" step="0.01">
                        </div>
                        <div class="form-group">
                            <label for="beam">Beam (m)</label>
                            <input type="number" id="beam" step="0.01">
                        </div>
                        <div class="form-group">
                            <label for="draft">Draft (m)</label>
                            <input type="number" id="draft" step="0.01">
                        </div>
                    </div>

                    <div class="input-group">
                        <div class="form-group">
                            <label for="gross-tonnage">Gross Tonnage</label>
                            <input type="number" id="gross-tonnage" step="0.01">
                        </div>
                        <div class="form-group">
                            <label for="net-tonnage">Net Tonnage</label>
                            <input type="number" id="net-tonnage" step="0.01">
                        </div>
                    </div>

                    <h3>Engine Details</h3>
                    <div class="form-group">
                        <label for="main-engine">Main Engine</label>
                        <input type="text" id="main-engine" placeholder="Make, Model, Power">
                    </div>

                    <div class="form-group">
                        <label for="auxiliary-engines">Auxiliary Engines</label>
                        <textarea id="auxiliary-engines" placeholder="Details of auxiliary engines"></textarea>
                    </div>

                    <div class="action-buttons">
                        <button type="button" class="btn btn-primary">Save Vessel Information</button>
                    </div>
                </form>
            </section>

            <!-- Maintenance Tasks Form -->
            <section :class="['form-section', { active: activeSection === 'maintenance' }]" v-show="activeSection === 'maintenance'">
                <h2>🛠️ Maintenance Tasks</h2>
                <form>
                    <div class="form-group">
                        <label for="task-name">Task Name</label>
                        <input type="text" id="task-name" required>
                    </div>

                    <div class="form-group">
                        <label for="task-description">Description</label>
                        <textarea id="task-description" required></textarea>
                    </div>

                    <div class="input-group">
                        <div class="form-group">
                            <label for="maintenance-type">Maintenance Type</label>
                            <select id="maintenance-type" required>
                                <option value="">-- Select Type --</option>
                                <option value="preventive">Preventive</option>
                                <option value="corrective">Corrective</option>
                                <option value="predictive">Predictive</option>
                                <option value="condition">Condition-Based</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="component">Component/System</label>
                            <select id="component" required>
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
                            <select id="priority" required>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="status">Status</label>
                            <select id="status" required>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="deferred">Deferred</option>
                            </select>
                        </div>
                    </div>

                    <div class="input-group">
                        <div class="form-group">
                            <label for="due-date">Due Date</label>
                            <input type="date" id="due-date" required>
                        </div>

                        <div class="form-group">
                            <label for="estimated-hours">Estimated Hours</label>
                            <input type="number" id="estimated-hours" min="0" step="0.5">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="assigned-to">Assigned To</label>
                        <select id="assigned-to">
                            <option value="">-- Select Personnel --</option>
                            <option value="1">John Smith - Engineer</option>
                            <option value="2">Maria Garcia - Chief Engineer</option>
                            <option value="3">David Chen - Technician</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Required Parts</label>
                        <div class="checkbox-group">
                            <div class="checkbox-item">
                                <input type="checkbox" id="part1">
                                <label for="part1">Fuel Filter</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="part2">
                                <label for="part2">Oil Filter</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="part3">
                                <label for="part3">Air Filter</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="part4">
                                <label for="part4">Impeller</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="part5">
                                <label for="part5">Belts</label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="notes">Additional Notes</label>
                        <textarea id="notes"></textarea>
                    </div>

                    <div class="form-group">
                        <label>Attachments</label>
                        <div class="attachment-area">
                            <p>Drag and drop files here or</p>
                            <input type="file" id="maintenance-files" class="file-input" multiple>
                            <label for="maintenance-files" class="file-label">Browse Files</label>
                        </div>
                    </div>

                    <div class="action-buttons">
                        <button type="button" class="btn btn-primary">Save Task</button>
                    </div>
                </form>
            </section>

            <!-- Maintenance Schedule Form -->
            <section :class="['form-section', { active: activeSection === 'schedule' }]" v-show="activeSection === 'schedule'">
                <h2>📅 Maintenance Schedule</h2>
                <form>
                    <div class="form-group">
                        <label for="schedule-task">Task Name</label>
                        <input type="text" id="schedule-task" required>
                    </div>

                    <div class="input-group">
                        <div class="form-group">
                            <label for="recurrence-type">Recurrence</label>
                            <select id="recurrence-type" required>
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

                        <div class="form-group">
                            <label for="custom-interval">Custom Interval (Days)</label>
                            <input type="number" id="custom-interval" min="1" disabled>
                        </div>
                    </div>

                    <div class="input-group">
                        <div class="form-group">
                            <label for="last-performed">Last Performed Date</label>
                            <input type="date" id="last-performed">
                        </div>

                        <div class="form-group">
                            <label for="next-due">Next Due Date</label>
                            <input type="date" id="next-due" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="schedule-component">Component/System</label>
                        <select id="schedule-component" required>
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

                    <div class="form-group">
                        <label>Notifications</label>
                        <div class="checkbox-group">
                            <div class="checkbox-item">
                                <input type="checkbox" id="notify-email" checked>
                                <label for="notify-email">Email Notification</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="notify-sms">
                                <label for="notify-sms">SMS Notification</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="notify-app" checked>
                                <label for="notify-app">In-App Notification</label>
                            </div>
                        </div>
                    </div>

                    <div class="input-group">
                        <div class="form-group">
                            <label for="reminder-days">Reminder (Days Before)</label>
                            <select id="reminder-days">
                                <option value="1">1 day</option>
                                <option value="3">3 days</option>
                                <option value="7">1 week</option>
                                <option value="14">2 weeks</option>
                                <option value="30">1 month</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="estimated-duration">Estimated Duration (Hours)</label>
                            <input type="number" id="estimated-duration" min="0" step="0.5">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="schedule-notes">Notes</label>
                        <textarea id="schedule-notes"></textarea>
                    </div>

                    <div class="action-buttons">
                        <button type="button" class="btn btn-primary">Save Schedule</button>
                    </div>
                </form>
            </section>

            <!-- Personnel Form -->
            <section :class="['form-section', { active: activeSection === 'personnel' }]" v-show="activeSection === 'personnel'">
                <h2>🧑‍🔧 Personnel & Technician Info</h2>
                <form>
                    <div class="input-group">
                        <div class="form-group">
                            <label for="personnel-name">Full Name</label>
                            <input type="text" id="personnel-name" required>
                        </div>

                        <div class="form-group">
                            <label for="personnel-id">Personnel ID</label>
                            <input type="text" id="personnel-id" required>
                        </div>
                    </div>

                    <div class="input-group">
                        <div class="form-group">
                            <label for="role">Role</label>
                            <select id="role" required>
                                <option value="">-- Select Role --</option>
                                <option value="chief-engineer">Chief Engineer</option>
                                <option value="engineer">Engineer</option>
                                <option value="technician">Technician</option>
                                <option value="electrician">Electrician</option>
                                <option value="mechanic">Mechanic</option>
                                <option value="supervisor">Supervisor</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="department">Department</label>
                            <select id="department">
                                <option value="">-- Select Department --</option>
                                <option value="engine">Engine</option>
                                <option value="deck">Deck</option>
                                <option value="electrical">Electrical</option>
                                <option value="safety">Safety</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div class="input-group">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" required>
                        </div>

                        <div class="form-group">
                            <label for="phone">Phone</label>
                            <input type="tel" id="phone">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="certifications">Certifications</label>
                        <textarea id="certifications" placeholder="List all relevant certifications"></textarea>
                    </div>

                    <div class="form-group">
                        <label>Specializations</label>
                        <div class="checkbox-group">
                            <div class="checkbox-item">
                                <input type="checkbox" id="spec1">
                                <label for="spec1">Engine Maintenance</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="spec2">
                                <label for="spec2">Electrical Systems</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="spec3">
                                <label for="spec3">Hull Inspection</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="spec4">
                                <label for="spec4">Safety Equipment</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="spec5">
                                <label for="spec5">Electronics</label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="personnel-notes">Notes</label>
                        <textarea id="personnel-notes"></textarea>
                    </div>

                    <div class="form-group">
                        <label>Upload Documents</label>
                        <div class="attachment-area">
                            <p>Upload certificates, licenses, etc.</p>
                            <input type="file" id="personnel-files" class="file-input" multiple>
                            <label for="personnel-files" class="file-label">Browse Files</label>
                        </div>
                    </div>

                    <div class="action-buttons">
                        <button type="button" class="btn btn-primary">Save Personnel Info</button>
                    </div>
                </form>
            </section>

            <!-- Inspection Form -->
            <section :class="['form-section', { active: activeSection === 'inspection' }]" v-show="activeSection ==='inspection'">
                <h2>📷 Inspection & Audit Logs</h2>
                <form>
                    <div class="input-group">
                        <div class="form-group">
                            <label for="inspection-type">Inspection Type</label>
                            <select id="inspection-type" required>
                                <option value="">-- Select Type --</option>
                                <option value="internal">Internal</option>
                                <option value="class">Classification Society</option>
                                <option value="flag">Flag State</option>
                                <option value="port">Port State Control</option>
                                <option value="third-party">Third-Party</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="inspection-date">Inspection Date</label>
                            <input type="date" id="inspection-date" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="inspector">Inspector Name</label>
                        <input type="text" id="inspector" required>
                    </div>

                    <div class="form-group">
                        <label for="inspection-area">Inspection Area</label>
                        <select id="inspection-area" required>
                            <option value="">-- Select Area --</option>
                            <option value="engine-room">Engine Room</option>
                            <option value="hull">Hull</option>
                            <option value="deck">Deck</option>
                            <option value="navigation">Navigation Equipment</option>
                            <option value="safety">Safety Systems</option>
                            <option value="living">Living Quarters</option>
                            <option value="cargo">Cargo Spaces</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="findings">Findings/Observations</label>
                        <textarea id="findings" required></textarea>
                    </div>

                    <div class="form-group">
                        <label for="required-actions">Required Actions</label>
                        <textarea id="required-actions"></textarea>
                    </div>

                    <div class="input-group">
                        <div class="form-group">
                            <label for="action-deadline">Action Deadline</label>
                            <input type="date" id="action-deadline">
                        </div>

                        <div class="form-group">
                            <label for="next-inspection">Next Inspection Date</label>
                            <input type="date" id="next-inspection">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Compliance Status</label>
                        <div class="checkbox-group">
                            <div class="checkbox-item">
                                <input type="radio" name="compliance" id="compliant" value="compliant">
                                <label for="compliant">Compliant</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="radio" name="compliance" id="minor" value="minor">
                                <label for="minor">Minor Non-Compliance</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="radio" name="compliance" id="major" value="major">
                                <label for="major">Major Non-Compliance</label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Attachments & Evidence</label>
                        <div class="attachment-area">
                            <p>Upload photos, documents, certificates</p>
                            <input type="file" id="inspection-files" class="file-input" multiple>
                            <label for="inspection-files" class="file-label">Browse Files</label>
                        </div>
                    </div>

                    <div class="action-buttons">
                        <button type="button" class="btn btn-primary">Save Inspection Log</button>
                    </div>
                </form>
            </section>

            <!-- Inventory Form -->
            <section :class="['form-section', { active: activeSection === 'inventory' }]" v-show="activeSection ==='inventory'">
                <h2>🧾 Parts and Inventory</h2>
                <form>
                    <div class="input-group">
                        <div class="form-group">
                            <label for="part-name">Part Name</label>
                            <input type="text" id="part-name" required>
                        </div>

                        <div class="form-group">
                            <label for="part-number">Part Number</label>
                            <input type="text" id="part-number" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="part-category">Category</label>
                        <select id="part-category" required>
                            <option value="">-- Select Category --</option>
                            <option value="engine">Engine Parts</option>
                            <option value="electrical">Electrical</option>
                            <option value="plumbing">Plumbing</option>
                            <option value="deck">Deck Equipment</option>
                        </select>
                    </div>
                </form>
            </section>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
    return {
      activeSection: 'vessel',
      sections: [
        { id: 'vessel', name: 'Vessel Info', icon: '⚓' },
        { id: 'maintenance', name: 'Maintenance', icon: '🛠️' },
        { id: 'schedule', name: 'Schedule', icon: '📅' },
        { id: 'personnel', name: 'Personnel', icon: '🧑‍🔧' },
        { id: 'inspection', name: 'Inspection', icon: '📷' },
        { id: 'inventory', name: 'Inventory', icon: '🧾' },
      ],
    };
  },
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
}</style>