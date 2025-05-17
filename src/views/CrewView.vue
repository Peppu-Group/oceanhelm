<template>
    <div class="container">
        <h1>MarineTech Crew Management</h1>

        <div class="crew-section">
            <div class="section-header">
                <h2>All Fleet Crew</h2>
                <button class="btn btn-primary" @click="showAddForm = !showAddForm">
                    {{ showAddForm ? 'Cancel' : '+ Add Crew Member' }}
                </button>
            </div>

            <div class="search-filter">
                <input type="text" placeholder="Search crew by name, vessel, or role..." v-model="searchQuery">
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
                        <div v-for="cert in member.certifications" :key="cert" class="certification-tag" :class="{
                            'text-danger': getExpiryStatus(cert.expiryDate) === 'expired',
                            'text-warning': getExpiryStatus(cert.expiryDate) === 'expiringSoon',
                            'text-success': getExpiryStatus(cert.expiryDate) === 'valid'
                        }" @click="viewCertification(cert.name, cert.expiryDate)">{{ cert.name }}
                        </div>
                        <i class="bi bi-patch-plus-fill icon" @click="addCertification()"></i>
                    </div>
                    <div class="crew-availability">
                        <strong>Embarkation Date:</strong> {{ member.nextShift || 'Not Scheduled' }}
                    </div>
                    <div class="crew-availability">
                        <strong>Expected Days Onboard (in days):</strong> {{ member.onBoard || 'Not Scheduled' }}
                    </div>
                    <div class="action-buttons">
                        <div v-if="member.vessel" class="status-available crew-availability vcard">
                            Vessel: {{ member.vessel }}
                        </div>
                        <div v-if="!member.vessel" class="status-unavailable crew-availability vcard">
                            Vessel: Unassigned
                        </div>
                        <button class="btn btn-primary"
                            @click="showAssignForm(member.id, member.nextShift, member.vessel, member.status)">Assign
                            Shift</button>
                    </div>
                    <i class="bi bi-trash icon" @click="deleteCrew(member.id)"></i>
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
                        <label for="crew-next-shift">Embarkation Date:</label>
                        <input type="date" id="crew-next-shift" v-model="newCrew.nextShift">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="crew-days-shift">Expected Days Onboard (in days)</label>
                        <input type="number" id="crew-days-shift" v-model="newCrew.onBoard">
                    </div>
                </div>

                <div class="certification-section">
                    <h3>Certifications</h3>
                    <div class="certification-grid">
                        <div v-for="cert in availableCertifications" :key="cert.id" class="certification-item">
                            <input type="checkbox" :id="'cert-' + cert.id" :value="cert.id"
                                v-model="newCrew.selectedCertifications">
                            <label :for="'cert-' + cert.id">{{ cert.name }}</label>
                        </div>
                    </div>

                    <div v-if="newCrew.selectedCertifications.length > 0">
                        <h4>Expiry Dates</h4>
                        <div class="form-row" v-for="certId in newCrew.selectedCertifications" :key="certId">
                            <div class="form-group">
                                <label>{{ getCertificationName(certId) }} Expiry Date</label>
                                <input type="date" v-model="newCrew.certificationExpiry[certId]">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="crew-notes">Notes</label>
                        <textarea id="crew-notes" rows="3" v-model="newCrew.notes"></textarea>
                    </div>
                </div>

                <div class="form-actions">
                    <button class="btn btn-secondary" @click="cancelForm">Cancel</button>
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
            crewMembers: [],
            availableCertifications: [
                { id: 1, name: "Navigation" },
                { id: 2, name: "Safety" },
                { id: 3, name: "Command" },
                { id: 4, name: "First Aid" },
                { id: 5, name: "CPR" },
                { id: 6, name: "Mechanical" },
                { id: 7, name: "Electrical" },
                { id: 8, name: "Welding" },
                { id: 9, name: "Communications" },
                { id: 10, name: "Fire Fighting" },
                { id: 11, name: "Survival at Sea" },
                { id: 12, name: "Food Safety" },
                { id: 13, name: "Hazardous Materials" }
            ],
            searchQuery: '',
            filterStatus: 'all',
            showAddForm: false,
            newCrew: {
                name: '',
                role: 'Deckhand',
                status: 'available',
                nextShift: '',
                selectedCertifications: [],
                certificationExpiry: {},
                certificationsInput: '',
                notes: '',
                vessel: '',
                onBoard: ''
            }
        };
    },
    mounted() {
        // get all crew
        let crew = JSON.parse(localStorage.getItem('crew') ?? '[]');
        this.crewMembers.push(...crew);
    },
    computed: {
        filteredCrew() {
            return this.crewMembers.filter(member => {
                const matchesSearch = member.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    member.role.toLowerCase().includes(this.searchQuery.toLowerCase()) || member.vessel.toLowerCase().includes(this.searchQuery.toLowerCase());
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
                selectedCertifications: [],
                certificationExpiry: {},
                nextShift: '',
                certificationsInput: '',
                notes: '',
                onBoard: ''
            };
        },
        deleteCrew(crewId) {
            let crew = JSON.parse(localStorage.getItem('crew') ?? '[]');
            crew = crew.filter(member => member.id !== crewId);
            localStorage.setItem('crew', JSON.stringify(crew));
            this.crewMembers = crew;
            Swal.fire({
                icon: 'success',
                title: 'Deleted',
                text: 'Crew member has been removed.'
            });
        },
        getExpiryStatus(dateStr) {
            if (!dateStr) return 'none'; // No expiry date provided

            const expiry = new Date(dateStr);
            const today = new Date();
            const oneMonthFromNow = new Date();
            oneMonthFromNow.setMonth(today.getMonth() + 1);

            if (expiry <= today) return 'expired'; 
            if (expiry <= oneMonthFromNow) return 'expiringSoon'; 
            return 'valid';
        },
        getCertificationName(id) {
            const cert = this.availableCertifications.find(c => c.id === id);
            return cert ? cert.name : '';
        },
        addCrewMember() {
            const certifications = this.newCrew.selectedCertifications
                .map(certId => {
                    const expiry = this.newCrew.certificationExpiry[certId];
                    if (!expiry) return null; // skip if no expiry date
                    return {
                        name: this.getCertificationName(certId),
                        expiryDate: expiry
                    };
                })
                .filter(cert => cert !== null); // remove null entries

            const newMember = {
                id: this.crewMembers.length + 1,
                name: this.newCrew.name,
                role: this.newCrew.role,
                status: this.newCrew.status,
                certifications: certifications,
                nextShift: this.newCrew.nextShift,
                notes: this.newCrew.notes,
                onBoard: this.newCrew.onBoard,
            };

            this.crewMembers.push(newMember);
            // get crew
            let crew = localStorage.getItem('crew') || '[]';
            let parsedCrew = JSON.parse(crew);

            parsedCrew.push(newMember)
            localStorage.setItem('crew', JSON.stringify(parsedCrew))
            this.resetForm();
            this.showAddForm = false;
        },
        viewCertification(certificateName, certificateDate) {
            Swal.fire({
                html: `
                    <div class="certificate-header">
                        <svg class="certificate-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" fill="white"/>
                            <path d="M12 15V23L8 19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 15V23L16 19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" stroke="white" stroke-width="2"/>
                        </svg>
                        <h2 class="certificate-title">${certificateName} Certification</h2>
                    </div>
                    <div class="certificate-body">
                        <div class="certificate-name">Certification Name: ${certificateName}</div>
                        <div class="certificate-border"></div>
                        <div class="certificate-date">Expiration Date: ${certificateDate}</div>
                        <div class="certificate-footer">We don't validate certifications, download to ensure everything is in order.</div>
                    </div>
                `,
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: 'Download',
            });
        },
        cancelForm() {
            this.showAddForm = false;
        },
        showAssignForm(id, prevshift, prevvessel, prevstatus) {
            const vessels = JSON.parse(localStorage.getItem('vessel') ?? '[]');

            const vesselOptionsHtml = vessels.map(v =>
                `<option value="${v.name}">${v.name}</option>`
            ).join('');
            Swal.fire({
                title: 'Assign Crew Shift',
                html:
                    `
                    <p>(Assign crew to vessel and shift)</p>
                    <div class="custom-swal-content">
                        <label class="custom-input-label" for="swal-shift">Scheduled Shift *</label>
                        <input id="swal-shift" class="custom-input" placeholder="e.g., May 18, 08:00-16:00">
                        
                        <label class="custom-input-label">Vessel Name *</label>
                        <select id="swal-vessel" class="custom-input">
                        <option value="">Select vessel ...</option>
                        ${vesselOptionsHtml}
                        </select>
                        
                        <label class="custom-input-label">Status</label>
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
                    const shift = document.getElementById('swal-shift').value || prevshift;
                    const status = document.getElementById('swal-status').value || prevstatus;
                    const vessel = document.getElementById('swal-vessel').value || prevvessel;

                    if (vessel === '') {
                        Swal.showValidationMessage('Please select a valid vessel');
                        return false;
                    }

                    return { shift, vessel, status };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const { shift, vessel, status } = result.value;
                    const member = this.crewMembers.find(m => m.id === id);
                    if (member) {
                        member.nextShift = shift;
                        member.vessel = vessel;
                        member.status = status;
                        localStorage.setItem('crew', this.crewMembers)
                        Swal.fire('Success', 'Shift assigned successfully', 'success');
                    } else {
                        Swal.fire('Error', 'Crew member not found', 'error');
                    }
                }
            })

        }
    }

}
</script>

<style scoped>
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

.text-danger {
    color: red;
    font-weight: bolder;
}

.text-warning {
    color: orange;
    font-weight: bolder;
}

.text-success {
    color: green;
    font-weight: bolder;
}

.icon {
    font-size: 20px;
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