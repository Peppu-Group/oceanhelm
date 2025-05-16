<template>
    <div class="container">
        <h1>MarineOps Crew Management</h1>

        <div class="crew-section">
            <div class="section-header">
                <h2>Current Crew</h2>
                <button class="btn btn-primary" @click="showAddForm = !showAddForm">
                    {{ showAddForm ? 'Cancel' : '+ Add Crew Member' }}
                </button>
            </div>

            <div class="search-filter">
                <input type="text" placeholder="Search crew by name or role..." v-model="searchQuery">
                <select v-model="filterStatus">
                    <option value="all">All Statuses</option>
                    <option value="available">Available</option>
                    <option value="onduty">On Duty</option>
                    <option value="unavailable">Unavailable</option>
                </select>
            </div>

            <div class="crew-grid" v-if="this.filteredCrew.length > 0">
                <div v-for="member in filteredCrew" :key="member.id" class="crew-card"
                    :class="{ 'unavailable': member.status === 'unavailable' }">
                    <div :class="['status-badge',
                        member.status === 'available' ? 'status-available' :
                            member.status === 'onduty' ? 'status-onduty' : 'status-unavailable']">
                        {{ member.status.charAt(0).toUpperCase() + member.status.slice(1) }}
                    </div>
                    <div class="crew-name">{{ member.name }}</div>
                    <div class="crew-role">{{ member.role }}</div>
                    <div class="crew-certifications">
                        <div v-for="cert in member.certifications" :key="cert" class="certification-tag">{{ cert }}</div>
                    </div>
                    <div class="crew-availability">
                        <strong>Next Shift:</strong> {{ member.nextShift || 'Not Scheduled' }}
                    </div>
                    <div class="action-buttons">
                        <button class="btn btn-secondary">View Details</button>
                        <button class="btn btn-primary" @click="showAssignForm(member.id)">Assign Shift</button>
                    </div>
                </div>
            </div>

            <div v-else class="no-results">
                No crew members found matching your search criteria.
            </div>

            <div class="add-crew-form" v-if="showAddForm">
                <h2>Add New Crew Member</h2>
                <div class="form-row">
                    <div class="form-group">
                        <label for="crew-name">Full Name</label>
                        <input type="text" id="crew-name" v-model="newCrew.name">
                    </div>
                    <div class="form-group">
                        <label for="crew-role">Role/Position</label>
                        <select id="crew-role" v-model="newCrew.role">
                            <option value="Captain">Captain</option>
                            <option value="First Officer">First Officer</option>
                            <option value="Engineer">Engineer</option>
                            <option value="Deckhand">Deckhand</option>
                            <option value="Mechanic">Mechanic</option>
                            <option value="Cook">Cook</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="crew-status">Status</label>
                        <select id="crew-status" v-model="newCrew.status">
                            <option value="available">Available</option>
                            <option value="onduty">On Duty</option>
                            <option value="unavailable">Unavailable</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="crew-next-shift">Next Scheduled Shift</label>
                        <input type="text" id="crew-next-shift" v-model="newCrew.nextShift"
                            placeholder="e.g., May 18, 08:00-16:00">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="crew-certifications">Certifications (comma separated)</label>
                        <input type="text" id="crew-certifications" v-model="newCrew.certificationsInput"
                            placeholder="e.g., CPR, Safety, Navigation">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="crew-notes">Notes</label>
                        <textarea id="crew-notes" rows="3" v-model="newCrew.notes"></textarea>
                    </div>
                </div>

                <div class="form-actions">
                    <button class="btn btn-secondary" @click="resetForm">Clear Form</button>
                    <button class="btn btn-primary" @click="addCrewMember">Add Crew Member</button>
                </div>
            </div>
        </div>
    </div>
</template>
  
  <script>
  export default {
    name: 'CrewTemplate',
  }
  </script>