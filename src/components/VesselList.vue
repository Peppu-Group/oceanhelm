<template>
    <!-- Fleet Summary -->
    <div class="row mb-3">
        <div class="col-md-3">
            <div class="card border-0 shadow-sm">
                <div class="card-body d-flex align-items-center">
                    <div class="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                        <i class="bi bi-check-circle-fill text-primary fs-4"></i>
                    </div>
                    <div>
                        <h6 class="mb-0">Active Vessels</h6>
                        <h3 class="mt-2 mb-0"> {{ getActiveVesselCount() }}</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-0 shadow-sm">
                <div class="card-body d-flex align-items-center">
                    <div class="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                        <i class="bi bi-tools text-warning fs-4"></i>
                    </div>
                    <div>
                        <h6 class="mb-0">Under Maintenance</h6>
                        <h3 class="mt-2 mb-0"> {{ getMaintenanceVesselCount() }}</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-0 shadow-sm">
                <div class="card-body d-flex align-items-center">
                    <div class="rounded-circle bg-secondary bg-opacity-10 p-3 me-3">
                        <i class="bi bi-pause-circle-fill text-secondary fs-4"></i>
                    </div>
                    <div>
                        <h6 class="mb-0">Inactive</h6>
                        <h3 class="mt-2 mb-0">{{ getInactiveVesselCount() }}</h3>
                    </div>
                </div>
            </div>
        </div>
        <!-- Register New Fleet -->
        <div class="col-md-3">
            <div class="card border-0 shadow-sm" @click="newVessel()">
                <div class="card-body d-flex align-items-center">
                    <div class="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                        <i class="bi bi-patch-plus-fill text-success fs-4"></i>
                    </div>
                    <div>
                        <h6 class="mb-0">Add New Vessel</h6>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <h4 class="mb-4"><i class="bi bi-ship me-2"></i>Registered Vessels</h4>
    <div v-if="!company.vessels.length">
        <div class="alert alert-primary" role="alert">
            <h4 class="alert-heading">Empty Fleet!</h4>
            <p>You have an empty fleet, you have not added any vessel yet.</p>
            <hr>
            <p class="mb-0">Click on the add vessel button above, to start adding vessels to your fleet</p>
        </div>
    </div>
    <!-- Vessel Cards -->
    <div class="row">
        <div class="col-lg-6" v-for="vessel in this.company.vessels">
            <div class="vessel-card" @click="handleNavigation(vessel.registrationNumber, vessel.name, vessel)">
                <div class="card-body d-flex align-items-center">
                    <div class="vessel-icon left">
                        <i class="fas fa-ship"></i>
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title mb-0">{{ vessel.name }}</h5>
                            <span :class="['vessel-status', statusClass(vessel.status)]">{{ vessel.status }}</span>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <small class="text-muted">Registration #:</small>
                                <p class="mb-0">{{ vessel.registrationNumber }}</p>
                            </div>
                            <div class="col-6">
                                <small class="text-muted">Next Maintenance:</small>
                                <p class="mb-0">{{ vessel.nextMaintenance }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="action-icon left delete">
                    <i class="bi bi-trash" @click.stop="confirmDelete(vessel.registrationNumber)"></i>
                </div>
                <button class="btn btn-primary" @click.stop="markInactive(vessel.registrationNumber)">
                    {{ vessel.status === 'Active' ? 'Mark Inactive' : 'Mark Active' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'VesselList',
    computed: {
        vessels() {
            return this.$store.getters['vessel/allVessels'];
        },
        company() {
            return {
                name: "MarineOps Solutions Inc.",
                location: "Port Harbor, CA 92614",
                estYear: 2005,
                phoneNumber: "(555) 123-4567",
                email: "info@marineops.com",
                license: "MCL-273845",
                vessels: this.vessels,
            };
        }
    },
    mounted() {
        // fetch vessels.
        this.$store.dispatch('vessel/fetchVessels');
        this.vessels.map(vessel => {
            const registrationNumber = vessel.registrationNumber;
            const untasks = localStorage.getItem(`tasks-${registrationNumber}`) || '[]';
            const tasks = JSON.parse(untasks)
            const soonTask = tasks.find(task => task.status === 'Soon');
            if (soonTask && vessel.status != 'Inactive') {
                vessel.status = 'Maintenance';
            }
            return vessel;
        });
    },
    methods: {
        getActiveVesselCount() {
            return this.company.vessels.filter(vessel => vessel.status === "Active").length;
        },
        getMaintenanceVesselCount() {
            return this.company.vessels.filter(vessel => vessel.status === "Maintenance").length;
        },
        getInactiveVesselCount() {
            return this.company.vessels.filter(vessel => vessel.status === "Inactive").length;
        },
        newVessel() {
            Swal.fire({
                title: 'Add New Vessel',
                html: `
                  <p>(Add new vessel to your fleet)</p>
                    <div class="custom-swal-content">
                        <label class="custom-input-label" for="vesselname">Vessel Name *</label>
                        <input id="vesselname" class="custom-input" placeholder="Enter your vessel's name">
                        <div id="vesselname-error" class="error-message">Please enter your vessel's name</div>
                        
                        <label class="custom-input-label" for="regno">Registration Number *</label>
                        <input id="regno" class="custom-input" placeholder="Enter your registration number">
                        <div id="regno-error" class="error-message">Please enter a valid registration number</div>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Submit',
                cancelButtonText: 'Cancel',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                customClass: {
                    container: 'custom-swal-container',
                    popup: 'custom-swal-popup',
                    title: 'custom-swal-title'
                },
                preConfirm: () => {
                    // Validate inputs
                    let isValid = true;
                    const vesselname = document.getElementById('vesselname').value.trim();
                    const regno = document.getElementById('regno').value.trim();
                    // Reset error messages
                    document.getElementById('vesselname-error').style.display = 'none';
                    document.getElementById('regno-error').style.display = 'none';
                    // Validate vessel name
                    if (!vesselname) {
                        document.getElementById('vesselname-error').style.display = 'block';
                        isValid = false;
                    }
                    // Validate regno 
                    if (!regno) {
                        document.getElementById('regno-error').style.display = 'block';
                        isValid = false;
                    }
                    if (!isValid) {
                        return false; // Prevent the modal from closing
                    }
                    // Return the form data if valid
                    return { vesselname, regno };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // Process the form data
                    const { vesselname, regno } = result.value;
                    // Here you would typically send this data to your server
                    let status = 'Active';
                    let newVessel = { name: vesselname, registrationNumber: regno, status };

                    // Add a new vessel
                    this.$store.dispatch('vessel/addVessel', newVessel);
                }
            });
        },
        statusClass(status) {
            const normalized = status.toLowerCase();
            return `status-${normalized}`;
        },
        confirmDelete(task) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You're trying to delete a vessel, this action cannot be undone!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.deleteVessel(task);
                }
            })
        },
        deleteVessel(registrationNumber) {
            return this.$store.dispatch('vessel/deleteVessel', registrationNumber);
        },
        markInactive(registrationNumber) {
            return this.$store.dispatch('vessel/markInactive', registrationNumber);

        },
        handleNavigation(id, vname, vessel) {
            let name = this.$route.name;
            if (name == 'maintenanceroute') {
                this.$router.push({ path: `/app/maintenance/${id}` });
            } else if (name == 'crewroute') {
                this.$router.push({ path: `/app/crew/${vname}` });
            } else if (name == 'dashboard') {
                this.showVesselInfo(vessel)
            }
        },
        showVesselInfo(vessel) {
            const htmlContent = `
        <div class="vessel-header">
          <div class="vessel-name">${vessel.name}</div>
          <div class="vessel-imo">${vessel.registrationNumber}</div>
        </div>
        
        <div class="vessel-info-grid">
          <div class="info-section">
            <div class="section-title">General Information</div>
            <div class="info-row">
              <span class="info-label">Vessel Type:</span>
              <span class="info-value">${vessel.type || 'NA'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Owner/Operator:</span>
              <span class="info-value">${vessel.owner || 'NA'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Year Built:</span>
              <span class="info-value">${vessel.year || 'NA'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Flag State:</span>
              <span class="info-value">${vessel.flag || 'NA'}</span>
            </div>
          </div>

          <div class="info-section">
            <div class="section-title">Vessel Specifications</div>
            <div class="specs-grid">
              <div class="spec-item">
                <span class="spec-value">${vessel.length || 'NA'}(m)</span>
                <div class="spec-label">Length</div>
              </div>
              <div class="spec-item">
                <span class="spec-value">${vessel.beam || 'NA'}(m)</span>
                <div class="spec-label">Beam</div>
              </div>
              <div class="spec-item">
                <span class="spec-value">${vessel.draft || 'NA'}(m)</span>
                <div class="spec-label">Draft</div>
              </div>
            </div>
            <div class="info-row" style="margin-top: 15px;">
              <span class="info-label">Gross Tonnage:</span>
              <span class="info-value">${vessel.gross ? vessel.gross.toLocaleString() : 'NA'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Net Tonnage:</span>
              <span class="info-value">${vessel.net ? vessel.net.toLocaleString() : 'NA'}</span>
            </div>
          </div>
        </div>

        <div class="info-section" style="margin-top: 20px;">
          <div class="section-title">Engine Details</div>
          <div class="info-row">
            <span class="info-label">Main Engine:</span>
            <span class="info-value">${vessel.main || 'NA'}</span>
          </div>
          <div style="margin-top: 10px;">
            <div class="info-label" style="margin-bottom: 5px;">Auxiliary Engines:</div>
            <div class="engine-details">
                ${vessel.auxiliary ? vessel.auxiliary.replace(/\n/g, '<br>') : 'NA'}
            </div>
          </div>
        </div>
      `;

            Swal.fire({
                title: 'Vessel Information',
                html: htmlContent,
                width: '800px',
                showCloseButton: true,
                showConfirmButton: true,
                confirmButtonText: 'Edit Vessel',
                confirmButtonColor: '#005792',
                showCancelButton: true,
                cancelButtonText: 'Close',
                customClass: {
                    container: 'custom-swal-container',
                    popup: 'custom-swal-popup',
                    title: 'custom-swal-title',
                    htmlContainer: 'custom-swal-content'
                },
                didOpen: () => {
                    // Add any additional styling or functionality when modal opens
                    console.log('Vessel information modal opened');
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // Handle edit action
                    this.editVessel(vessel)
                }
            });
        },
        editVessel(vessel = {}) {
            // Helper function to safely get values
            const getValue = (value, defaultVal = '') => value || defaultVal;

            // Create the form HTML
            const formHtml = `
    <div class="edit-vessel-form" style="text-align: left; max-height: 500px; overflow-y: auto;">
      <div class="form-section">
        <h4 style="color: #005792; margin-bottom: 15px; border-bottom: 2px solid #00a8e8; padding-bottom: 5px;">
          Basic Information
        </h4>
        
        <div class="form-row" style="display: flex; gap: 15px; margin-bottom: 15px;">
          <div class="form-group" style="flex: 1;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #495057;">Vessel Name</label>
            <input type="text" id="edit-vessel-name" value="${getValue(vessel.name)}" 
                   style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
          </div>
          <div class="form-group" style="flex: 1;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #495057;">IMO Number</label>
            <input type="text" id="edit-imo" value="${getValue(vessel.registrationNumber)}" 
                   style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
          </div>
        </div>

        <div class="form-row" style="display: flex; gap: 15px; margin-bottom: 15px;">
          <div class="form-group" style="flex: 1;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #495057;">Vessel Type</label>
            <select id="edit-vessel-type" style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
              <option value="">-- Select Vessel Type --</option>
              <option value="cargo" ${vessel.type === 'Cargo Ship' ? 'selected' : ''}>Cargo Ship</option>
              <option value="tanker" ${vessel.type === 'Tanker' ? 'selected' : ''}>Tanker</option>
              <option value="passenger" ${vessel.type === 'Passenger Ship' ? 'selected' : ''}>Passenger Ship</option>
              <option value="fishing" ${vessel.type === 'Fishing Vessel' ? 'selected' : ''}>Fishing Vessel</option>
              <option value="offshore" ${vessel.type === 'Offshore Support' ? 'selected' : ''}>Offshore Support</option>
              <option value="research" ${vessel.type === 'Research Vessel' ? 'selected' : ''}>Research Vessel</option>
              <option value="other" ${vessel.type === 'Other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
          <div class="form-group" style="flex: 1;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #495057;">Owner/Operator</label>
            <input type="text" id="edit-owner" value="${getValue(vessel.owner)}" 
                   style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
          </div>
        </div>

        <div class="form-row" style="display: flex; gap: 15px; margin-bottom: 20px;">
          <div class="form-group" style="flex: 1;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #495057;">Year Built</label>
            <input type="number" id="edit-year-built" value="${getValue(vessel.yearBuilt)}" 
                   min="1900" max="2025"
                   style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
          </div>
          <div class="form-group" style="flex: 1;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #495057;">Flag State</label>
            <input type="text" id="edit-flag-state" value="${getValue(vessel.flagState)}" 
                   style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
          </div>
        </div>
      </div>

      <div class="form-section">
        <h4 style="color: #005792; margin-bottom: 15px; border-bottom: 2px solid #00a8e8; padding-bottom: 5px;">
          Vessel Specifications
        </h4>
        
        <div class="form-row" style="display: flex; gap: 15px; margin-bottom: 15px;">
          <div class="form-group" style="flex: 1;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #495057;">Length (m)</label>
            <input type="number" id="edit-length" value="${getValue(vessel.specifications?.length)}" 
                   step="0.01"
                   style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
          </div>
          <div class="form-group" style="flex: 1;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #495057;">Beam (m)</label>
            <input type="number" id="edit-beam" value="${getValue(vessel.specifications?.beam)}" 
                   step="0.01"
                   style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
          </div>
          <div class="form-group" style="flex: 1;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #495057;">Draft (m)</label>
            <input type="number" id="edit-draft" value="${getValue(vessel.specifications?.draft)}" 
                   step="0.01"
                   style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
          </div>
        </div>

        <div class="form-row" style="display: flex; gap: 15px; margin-bottom: 20px;">
          <div class="form-group" style="flex: 1;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #495057;">Gross Tonnage</label>
            <input type="number" id="edit-gross-tonnage" value="${getValue(vessel.specifications?.grossTonnage)}" 
                   step="0.01"
                   style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
          </div>
          <div class="form-group" style="flex: 1;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #495057;">Net Tonnage</label>
            <input type="number" id="edit-net-tonnage" value="${getValue(vessel.specifications?.netTonnage)}" 
                   step="0.01"
                   style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
          </div>
        </div>
      </div>

      <div class="form-section">
        <h4 style="color: #005792; margin-bottom: 15px; border-bottom: 2px solid #00a8e8; padding-bottom: 5px;">
          Engine Details
        </h4>
        
        <div class="form-group" style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #495057;">Main Engine</label>
          <input type="text" id="edit-main-engine" value="${getValue(vessel.engines?.main)}" 
                 placeholder="Make, Model, Power"
                 style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
        </div>

        <div class="form-group">
          <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #495057;">Auxiliary Engines</label>
          <textarea id="edit-auxiliary-engines" rows="3" 
                    placeholder="Details of auxiliary engines"
                    style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px; resize: vertical;">${getValue(vessel.engines?.auxiliary)}</textarea>
        </div>
      </div>
    </div>
  `;

            // Show the SweetAlert with the form
            Swal.fire({
                title: 'Edit Vessel Information',
                html: formHtml,
                width: '800px',
                showCancelButton: true,
                confirmButtonText: 'Save Changes',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#005792',
                cancelButtonColor: '#6c757d',
                customClass: {
                    container: 'custom-swal-container',
                    popup: 'custom-swal-popup',
                    title: 'custom-swal-title',
                    htmlContainer: 'custom-swal-content'
                },
                preConfirm: () => {
                    // Collect form data
                    const formData = {
                        name: document.getElementById('edit-vessel-name').value.trim(),
                        imo: document.getElementById('edit-imo').value.trim(),
                        type: document.getElementById('edit-vessel-type').value,
                        owner: document.getElementById('edit-owner').value.trim(),
                        yearBuilt: parseInt(document.getElementById('edit-year-built').value) || null,
                        flagState: document.getElementById('edit-flag-state').value.trim(),
                        specifications: {
                            length: parseFloat(document.getElementById('edit-length').value) || null,
                            beam: parseFloat(document.getElementById('edit-beam').value) || null,
                            draft: parseFloat(document.getElementById('edit-draft').value) || null,
                            grossTonnage: parseFloat(document.getElementById('edit-gross-tonnage').value) || null,
                            netTonnage: parseFloat(document.getElementById('edit-net-tonnage').value) || null
                        },
                        engines: {
                            main: document.getElementById('edit-main-engine').value.trim(),
                            auxiliary: document.getElementById('edit-auxiliary-engines').value.trim()
                        }
                    };

                    // Basic validation
                    if (!formData.name) {
                        Swal.showValidationMessage('Vessel name is required');
                        return false;
                    }

                    if (!formData.imo) {
                        Swal.showValidationMessage('IMO number is required');
                        return false;
                    }

                    if (!formData.type) {
                        Swal.showValidationMessage('Please select a vessel type');
                        return false;
                    }

                    return formData;
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const updatedVessel = result.value;

                    // Here you would typically save to database/API
                    // For now, we'll show a success message and log the data
                    console.log('Updated vessel data:', updatedVessel);

                    // Show success message
                    Swal.fire({
                        title: 'Success!',
                        text: 'Vessel information has been updated successfully.',
                        icon: 'success',
                        confirmButtonColor: '#005792',
                        customClass: {
                            container: 'custom-swal-container',
                            popup: 'custom-swal-popup',
                            title: 'custom-swal-title'
                        }
                    }).then(() => {
                        // Optionally refresh the vessel display or update the UI
                        // updateVesselDisplay(updatedVessel);
                    });

                    // Call your save function here
                    // saveVesselToDatabase(updatedVessel);
                }
            }).catch((error) => {
                console.error('Error in edit vessel form:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'There was an error processing your request. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#005792'
                });
            });
        },

        // Helper function to save vessel data (implement based on your backend)
        saveVesselToDatabase(vesselData) {
            // Example implementation:
            /*
            fetch('/api/vessels/' + vesselData.id, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(vesselData)
            })
            .then(response => response.json())
            .then(data => {
              console.log('Vessel saved successfully:', data);
              // Update UI as needed
            })
            .catch(error => {
              console.error('Error saving vessel:', error);
              Swal.fire('Error', 'Failed to save vessel information', 'error');
            });
            */
        }
    }
}
</script>

<style scoped>
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

.vessel-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background-color: #e3f2fd;
    border-radius: 10px;
    color: var(--accent-color);
    font-size: 24px;
    margin-right: 15px;
}

.black {
    color: black !important;
}

.action-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 20px;
    color: var(--accent-color);
    font-size: 16px;
    margin-right: 15px;
    margin-top: 20px;
    margin-bottom: 10px;
}

.delete {
    background-color: var(--danger);
}

.edit {
    background-color: var(--success);
}

.vessel-status {
    display: inline-block;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
}

.status-active {
    background-color: #e8f5e9;
    color: #2e7d32;
}

.status-maintenance {
    background-color: #fff8e1;
    color: #f57f17;
}

.status-inactive {
    background-color: #f5f5f5;
    color: #757575;
}
</style>