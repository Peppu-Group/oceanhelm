<template>
    <div class="container">
        <h1>MarineTech Crew Management</h1>

        <div class="crew-section">
            <div class="section-header">
                <h2>Current Crew {{  }}</h2>
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

            <div class="crew-grid" v-if="filteredCrew.length > 0">
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
                        <div v-if="member.vessel" class="status-available crew-availability vcard">
                            Vessel: {{ member.vessel }}
                        </div>
                        <div v-if="!member.vessel" class="status-unavailable crew-availability vcard">
                            Vessel: Unassigned
                        </div>
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
    name: 'CrewView',

    data() {
        return {
            crewMembers: [
                {
                    id: 1,
                    name: "John Smith",
                    role: "Captain",
                    status: "onduty",
                    certifications: ["Navigation", "Safety", "Command"],
                    nextShift: "Current - May 16, 08:00-20:00",
                    vessel: 'MV Melody'
                },
                {
                    id: 2,
                    name: "Emily Rodriguez",
                    role: "First Officer",
                    status: "onduty",
                    certifications: ["Navigation", "Communications"],
                    nextShift: "Current - May 16, 08:00-20:00"
                },
                {
                    id: 3,
                    name: "David Chen",
                    role: "Engineer",
                    status: "available",
                    certifications: ["Mechanical", "Electrical"],
                    nextShift: "May 17, 20:00-08:00"
                },
                {
                    id: 4,
                    name: "Sarah Johnson",
                    role: "Deckhand",
                    status: "unavailable",
                    certifications: ["First Aid", "Safety"],
                    nextShift: "May 20, 08:00-20:00"
                },
                {
                    id: 5,
                    name: "Michael Lee",
                    role: "Mechanic",
                    status: "available",
                    certifications: ["Mechanical", "Welding"],
                    nextShift: "May 18, 08:00-20:00",
                    vessel: 'MV Melody'
                },
                {
                    id: 6,
                    name: "Olivia Williams",
                    role: "Cook",
                    status: "onduty",
                    certifications: ["Food Safety", "First Aid"],
                    nextShift: "Current - May 16, 04:00-16:00"
                }
            ],
            searchQuery: '',
            filterStatus: 'all',
            showAddForm: false,
            newCrew: {
                name: '',
                role: 'Deckhand',
                status: 'available',
                nextShift: '',
                certificationsInput: '',
                notes: ''
            }
        };
    },
    computed: {
        filteredCrew() {
            return this.crewMembers.filter(member => {
                const matchesSearch = member.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    member.role.toLowerCase().includes(this.searchQuery.toLowerCase());
                const matchesStatus = this.filterStatus === 'all' || member.status === this.filterStatus;
                return matchesSearch && matchesStatus;
            });
        }
    },
    methods: {
        resetForm() {
            this.newCrew = {
                name: '',
                role: 'Deckhand',
                status: 'available',
                nextShift: '',
                certificationsInput: '',
                notes: ''
            };
        },
        addCrewMember() {
            const certArray = this.newCrew.certificationsInput
                .split(',')
                .map(cert => cert.trim())
                .filter(cert => cert.length > 0);

            const newMember = {
                id: this.crewMembers.length + 1,
                name: this.newCrew.name,
                role: this.newCrew.role,
                status: this.newCrew.status,
                certifications: certArray,
                nextShift: this.newCrew.nextShift,
                notes: this.newCrew.notes
            };

            this.crewMembers.push(newMember);
            this.resetForm();
            this.showAddForm = false;
        },
        showAssignForm(id) {
            const vessels = JSON.parse(localStorage.getItem('vessels') ?? '[]');

            const vesselOptionsHtml = vessels.map(v =>
                `<option value="${v.registrationNumber}">${v.name}</option>`
            ).join('');
            const { value: formValues } = Swal.fire({
                title: 'Assign Crew Shift',
                html:
                    `
                    <p>(Assign crew to vessel and shift)</p>
                    <div class="custom-swal-content">
                        <label class="custom-input-label" for="swal-shift">Scheduled Shift *</label>
                        <input id="swal-shift" class="custom-input" placeholder="e.g., May 18, 08:00-16:00">
                        
                        <label for="custom-input-label">Vessel Name *</label>
                        <select id="swal-vessel" class="custom-input">
                        <option value="">Select vessel ...</option>
                        ${vesselOptionsHtml}
                        </select>
                        
                        <label for="custom-input-label">Status</label><br/>
                        <select id="swal-status" class="custom-input">
                        <option value="">Select status ...</option>
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                        <option value="onduty">Onduty</option>
                        </select>
                    </div>
                    `,
                focusConfirm: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                showCancelButton: true,
                confirmButtonText: 'Assign',
                preConfirm: () => {
                    const shift = document.getElementById('swal-shift').value;
                    const vessel = document.getElementById('swal-vessel').value;
                    if (vessel === '') {
                        Swal.showValidationMessage('Please select a valid vessel');
                        return false;
                    }

                    return { shift, vessel };
                }
            });

            if (formValues) {
                const member = this.crewMembers.find(m => m.id === id);
                if (member) {
                    member.nextShift = formValues.shift;
                    member.vessel = formValues.vessel;

                    Swal.fire('Success', 'Shift assigned successfully', 'success');
                } else {
                    Swal.fire('Error', 'Crew member not found', 'error');
                }

                // You can now use formValues.shift and formValues.vessel as needed
            }
        }
    }

}
</script>

<style scoped>
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 20px;
    background-color: #f5f7fa;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1,
h2 {
    color: #005792;
}

h1 {
    margin-bottom: 20px;
    border-bottom: 2px solid #00a8e8;
    padding-bottom: 10px;
}

.crew-section {
    margin-bottom: 30px;
}

.crew-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.crew-card {
    background-color: #f8f9fa;
    border-radius: 6px;
    padding: 15px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.08);
    border-left: 4px solid #00a8e8;
    position: relative;
}

.crew-card.unavailable {
    border-left-color: #dc3545;
    opacity: 0.8;
}

.crew-name {
    font-weight: bold;
    font-size: 1.1em;
    margin-bottom: 5px;
    color: #005792;
}

.crew-role {
    color: #6c757d;
    font-size: 0.9em;
    margin-bottom: 10px;
}

.crew-certifications,
.crew-availability {
    font-size: 0.85em;
    margin: 5px 0;
}

.certification-tag {
    display: inline-block;
    background-color: #e6f7ff;
    color: #005792;
    border-radius: 4px;
    padding: 2px 8px;
    margin-right: 5px;
    margin-bottom: 5px;
    font-size: 0.85em;
}

.status-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 0.75em;
    padding: 3px 8px;
    border-radius: 12px;
    font-weight: bold;
}

.status-available {
    background-color: #d4edda;
    color: #155724;
}

.status-unavailable {
    background-color: #f8d7da;
    color: #721c24;
}

.status-onduty {
    background-color: #cce5ff;
    color: #004085;
}

.action-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
}

.btn {
    padding: 6px 12px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-size: 0.9em;
    transition: background-color 0.2s;
}

.btn-primary {
    background-color: #005792;
    color: white;
}

.btn-primary:hover {
    background-color: #004675;
}

.btn-secondary {
    background-color: #e9ecef;
    color: #495057;
}

.btn-secondary:hover {
    background-color: #dde2e6;
}

.search-filter {
    display: flex;
    margin-bottom: 20px;
    gap: 10px;
}

.search-filter input,
.search-filter select {
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
}

.search-filter input {
    flex-grow: 1;
}

.search-filter select {
    width: 30%;
}

.add-crew-form {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 6px;
    margin-top: 30px;
}

.form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 15px;
}

.form-group {
    flex: 1;
    min-width: 200px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #495057;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ced4da;
    border-radius: 4px;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.no-results {
    text-align: center;
    padding: 20px;
    color: #6c757d;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.vcard {
    border-radius: 6px;
    padding: 5px;
}
</style>