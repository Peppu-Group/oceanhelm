<template>
  <div class="vessel-management">
    <VesselList :vessels="vessels" :user-profile="userProfile" :current-route="currentRouteName"
      :config="vesselListConfig" @vessel-add="handleVesselAdd" @vessel-click="handleVesselClick" @date-change="changeDate"
      @vessel-edit="handleVesselEdit" @vessel-delete="handleVesselDelete" @vessel-toggle-status="handleVesselToggleStatus"
      @vessel-navigate="handleVesselNavigation" @access-denied="handleAccessDenied" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { VesselList } from 'oceanhelm'

export default {
  name: 'ParentVesselPage',

  components: {
    VesselList
  },

  data() {
    return {
      vesselListConfig: {
        enableAdd: true,
        enableEdit: true,
        enableDelete: true,
        enableStatusToggle: true,
        showCertifications: true
      }
    }
  },

  computed: {
    ...mapGetters('user', ['userProfile', 'userRoleDescription']),
    ...mapGetters('vessel', ['allVessels']),

    vessels() {
      return this.allVessels
    },



    currentRouteName() {
      return this.$route.name || 'dashboard'
    }
  },

  async mounted() {
    // Fetch vessels when component mounts
    await this.fetchVessels()
  },

  methods: {
    ...mapActions('vessel', [
      'fetchVessels',
      'addVessel',
      'updateVessel',
      'deleteVessel',
      'markInactive'
    ]),

    // Handle vessel add event
    async handleVesselAdd() {
      try {
        const result = await Swal.fire({
          title: 'Add New Vessel',
          html: `
            <div class="custom-swal-content">
              <label class="custom-input-label" for="vesselname">Vessel Name *</label>
              <input id="vesselname" class="custom-input" placeholder="Enter your vessel's name">
              <div id="vesselname-error" class="error-message" style="display:none; color:red;">Please enter your vessel's name</div>
              
              <label class="custom-input-label" for="regno">Registration Number *</label>
              <input id="regno" class="custom-input" placeholder="Enter your registration number">
              <div id="regno-error" class="error-message" style="display:none; color:red;">Please enter a valid registration number</div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel',
          preConfirm: () => {
            let isValid = true
            const vesselname = document.getElementById('vesselname').value.trim()
            const regno = document.getElementById('regno').value.trim()

            // Reset error messages
            document.getElementById('vesselname-error').style.display = 'none'
            document.getElementById('regno-error').style.display = 'none'

            // Validate vessel name
            if (!vesselname) {
              document.getElementById('vesselname-error').style.display = 'block'
              isValid = false
            }

            // Validate regno 
            if (!regno) {
              document.getElementById('regno-error').style.display = 'block'
              isValid = false
            }

            if (!isValid) {
              return false
            }

            return { vesselname, regno }
          }
        })

        if (result.isConfirmed) {
          const { vesselname, regno } = result.value
          const newVessel = {
            name: vesselname,
            registrationNumber: regno,
            status: 'Inactive'
          }

          await this.addVessel(newVessel)
        }
      } catch (error) {
        console.error('Error adding vessel:', error)
        this.showErrorMessage('Failed to add vessel')
      }
    },

    // Handle vessel click event
    handleVesselClick(vessel) {
      // Show vessel info modal or navigate
      this.showVesselInfo(vessel)
    },

    // Handle vessel edit event
    handleVesselEdit(vessel) {
      // Show edit modal - you can extract this to a separate method/component
      this.editVessel(vessel)
    },

    // Handle vessel delete event
    async handleVesselDelete(vessel) {
      try {
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: "You're trying to delete a vessel, this action cannot be undone!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, delete it!',
        })

        if (result.isConfirmed) {
          await this.deleteVessel(vessel.registrationNumber)

          await Swal.fire({
            title: 'Deleted!',
            text: 'Vessel has been deleted.',
            icon: 'success'
          })
        }
      } catch (error) {
        console.error('Error deleting vessel:', error)
        this.showErrorMessage('Failed to delete vessel')
      }
    },

    async changeDate(vessel) {
      const currentDateTime = new Date();
      const currentDateTimeString = currentDateTime.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM

      const { value: formValues } = await Swal.fire({
        title: `Update Status Timeline`,
        html: `
                <div class="text-start">
                    <div class="mb-3">
                        <label for="status-datetime" class="form-label">
                            <i class="bi bi-calendar-event me-1"></i>Effective Date & Time:
                        </label>
                        <input 
                            type="datetime-local" 
                            id="status-datetime" 
                            class="form-control" 
                            value="${currentDateTimeString}"
                            max="${currentDateTimeString}"
                        >
                        <small class="form-text text-muted">Cannot be set to a future date/time</small>
                    </div>
                    
                    <div class="mb-3">
                        <label for="status-reason" class="form-label">
                            <i class="bi bi-chat-text me-1"></i>Reason for Status Change:
                        </label>
                        <textarea 
                            id="status-reason" 
                            class="form-control" 
                            rows="3" 
                            placeholder="Enter reason for marking vessel as active"
                            required
                        ></textarea>
                        <small class="form-text text-muted">This field is required for audit purposes</small>
                    </div>
                </div>
            `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: `<i class="bi bi-check-circle me-1"></i>Confirm Timeline`,
        cancelButtonText: '<i class="bi bi-x-circle me-1"></i>Cancel',
        width: '600px',
        customClass: {
          popup: 'vessel-status-modal'
        },
        preConfirm: () => {
          const datetime = document.getElementById('status-datetime').value;
          const reason = document.getElementById('status-reason').value.trim();

          if (!datetime) {
            Swal.showValidationMessage('Please select an effective date and time');
            return false;
          }

          if (!reason) {
            Swal.showValidationMessage('Please provide a reason for the status change');
            return false;
          }

          // Validate datetime is not in the future
          const selectedDateTime = new Date(datetime);
          const now = new Date();

          if (selectedDateTime > now) {
            Swal.showValidationMessage('Effective date and time cannot be in the future');
            return false;
          }

          // Validate reason length
          if (reason.length < 5) {
            Swal.showValidationMessage('Reason must be at least 5 characters long');
            return false;
          }

          if (reason.length > 500) {
            Swal.showValidationMessage('Reason cannot exceed 500 characters');
            return false;
          }

          return {
            datetime: this.toIsoWithOffset(datetime),
            reason: reason,
            formattedDateTime: selectedDateTime.toLocaleString()
          };
        }
      });

      if (formValues) {
        let statusChangePayload = {
          date: formValues.datetime,
          reason: formValues.reason,
          registrationNumber: vessel.registrationNumber
        }
        // await this.markInactive(statusChangePayload);
      }
    },

    toIsoWithOffset(dateStr) {
      const date = new Date(dateStr);
      const offsetMinutes = -date.getTimezoneOffset(); // flip sign
      const sign = offsetMinutes >= 0 ? "+" : "-";
      const hours = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(2, "0");
      const minutes = String(Math.abs(offsetMinutes) % 60).padStart(2, "0");
      return date.toISOString().replace("Z", `${sign}${hours}:${minutes}`);
    },

    // Handle vessel status toggle event
    async handleVesselToggleStatus(vessel) {
      try {
        const isCurrentlyActive = vessel.status === 'Active';
        const newStatus = isCurrentlyActive ? 'Inactive' : 'Active';
        const currentDateTime = new Date();
        const currentDateTimeString = currentDateTime.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM

        const { value: formValues } = await Swal.fire({
          title: `Mark Vessel as ${newStatus}`,
          html: `
                <div class="text-start">
                    <div class="vessel-info mb-4 p-3 bg-light rounded">
                        <h6 class="mb-2"><i class="fas fa-ship me-2"></i>${vessel.name}</h6>
                        <p class="mb-1"><strong>Registration:</strong> ${vessel.registrationNumber}</p>
                        <p class="mb-0"><strong>Current Status:</strong> 
                            <span class="badge bg-${isCurrentlyActive ? 'success' : 'secondary'}">${vessel.status}</span>
                        </p>
                    </div>
                    
                    <div class="mb-3">
                        <label for="status-datetime" class="form-label">
                            <i class="bi bi-calendar-event me-1"></i>Effective Date & Time:
                        </label>
                        <input 
                            type="datetime-local" 
                            id="status-datetime" 
                            class="form-control" 
                            value="${currentDateTimeString}"
                            max="${currentDateTimeString}"
                        >
                        <small class="form-text text-muted">Cannot be set to a future date/time</small>
                    </div>
                    
                    <div class="mb-3">
                        <label for="status-reason" class="form-label">
                            <i class="bi bi-chat-text me-1"></i>Reason for Status Change:
                        </label>
                        <textarea 
                            id="status-reason" 
                            class="form-control" 
                            rows="3" 
                            placeholder="Enter reason for marking vessel as ${newStatus.toLowerCase()}..."
                            required
                        ></textarea>
                        <small class="form-text text-muted">This field is required for audit purposes</small>
                    </div>
                    
                    <div class="alert alert-${isCurrentlyActive ? 'warning' : 'info'} alert-sm">
                        <i class="bi bi-info-circle me-2"></i>
                        ${isCurrentlyActive
              ? 'This vessel will be marked as inactive and removed from active operations.'
              : 'This vessel will be marked as active and available for operations.'
            }
                    </div>
                </div>
            `,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: isCurrentlyActive ? '#dc3545' : '#28a745',
          cancelButtonColor: '#6c757d',
          confirmButtonText: `<i class="bi bi-check-circle me-1"></i>Confirm ${newStatus}`,
          cancelButtonText: '<i class="bi bi-x-circle me-1"></i>Cancel',
          width: '600px',
          customClass: {
            popup: 'vessel-status-modal'
          },
          preConfirm: () => {
            const datetime = document.getElementById('status-datetime').value;
            const reason = document.getElementById('status-reason').value.trim();

            if (!datetime) {
              Swal.showValidationMessage('Please select an effective date and time');
              return false;
            }

            if (!reason) {
              Swal.showValidationMessage('Please provide a reason for the status change');
              return false;
            }

            // Validate datetime is not in the future
            const selectedDateTime = new Date(datetime);
            const now = new Date();

            if (selectedDateTime > now) {
              Swal.showValidationMessage('Effective date and time cannot be in the future');
              return false;
            }

            // Validate reason length
            if (reason.length < 5) {
              Swal.showValidationMessage('Reason must be at least 5 characters long');
              return false;
            }

            if (reason.length > 500) {
              Swal.showValidationMessage('Reason cannot exceed 500 characters');
              return false;
            }

            return {
              datetime: this.toIsoWithOffset(datetime),
              reason: reason,
              formattedDateTime: selectedDateTime.toLocaleString()
            };
          }
        });

        if (formValues) {
          // Show confirmation with selected details
          const confirmResult = await Swal.fire({
            title: 'Confirm Status Change',
            html: `
                    <div class="text-start">
                        <div class="confirmation-details p-3 bg-light rounded">
                            <h6 class="mb-3"><i class="fas fa-ship me-2"></i>${vessel.name}</h6>
                            <div class="row mb-2">
                                <div class="col-6"><strong>New Status:</strong></div>
                                <div class="col-6">
                                    <span class="badge bg-${isCurrentlyActive ? 'danger' : 'success'}">${newStatus}</span>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-6"><strong>Effective Date/Time:</strong></div>
                                <div class="col-6">${formValues.formattedDateTime}</div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <strong>Reason:</strong>
                                    <p class="mt-1 mb-0 text-muted">"${formValues.reason}"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: isCurrentlyActive ? '#dc3545' : '#28a745',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="bi bi-check-lg me-1"></i>Proceed',
            cancelButtonText: '<i class="bi bi-arrow-left me-1"></i>Go Back'
          });

          if (confirmResult.isConfirmed) {
            // Show loading state
            Swal.fire({
              title: 'Updating Vessel Status',
              html: `
                        <div class="text-center">
                            <div class="spinner-border text-primary mb-3" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <p>Updating ${vessel.name} to ${newStatus}...</p>
                        </div>
                    `,
              allowOutsideClick: false,
              allowEscapeKey: false,
              showConfirmButton: false
            });

            // Prepare the complete status change data
            const statusChangePayload = {
              registrationNumber: vessel.registrationNumber,
              newStatus: newStatus,
              date: formValues.datetime,
              reason: formValues.reason,
            };

            // Call the appropriate method based on new status
            let response;
            response = await this.markInactive(statusChangePayload);
            console.log(formValues.datetime)
            if (response) {
              console.log(response)
              // Swal.close();
            }
          }
        }

      } catch (error) {
        console.error('Error toggling vessel status:', error);

        await Swal.fire({
          title: 'Update Failed',
          html: `
                <div class="text-center">
                    <i class="bi bi-exclamation-triangle-fill text-danger" style="font-size: 3rem;"></i>
                    <h5 class="mt-3">Status Update Failed</h5>
                    <p class="text-muted">${error.message || 'An unexpected error occurred while updating the vessel status.'}</p>
                </div>
            `,
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK'
        });
      }
    },

    // Handle vessel navigation event
    handleVesselNavigation({ vessel, route, id, name }) {
      if (route === 'maintenanceroute') {
        this.$router.push({ path: `/app/maintenance/${id}` })
      } else if (route === 'crewroute') {
        this.$router.push({ path: `/app/crew/${name}` })
      } else {
        // Default behavior
        this.$router.push({ path: `/app/vessels/${id}` })
      }
    },

    // Handle access denied event
    handleAccessDenied({ action, userProfile }) {
      Swal.fire({
        title: 'Unauthorized',
        text: `You do not have permission to ${action}`,
        icon: 'warning',
        confirmButtonText: 'OK'
      })
    },

    // Vessel info modal (extracted from your original component)
    showVesselInfo(vessel) {
      const htmlContent = this.generateVesselInfoHTML(vessel)

      Swal.fire({
        title: 'Vessel Information',
        html: htmlContent,
        width: '800px',
        showCloseButton: true,
        showDenyButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Edit Vessel',
        denyButtonText: 'Manage Certifications',
        denyButtonColor: '#005792',
        confirmButtonColor: '#005792',
        showCancelButton: true,
        cancelButtonText: 'Close',
        customClass: {
          container: 'custom-swal-container',
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
          htmlContainer: 'custom-swal-content'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.handleVesselEdit(vessel)
        } else if (result.isDenied) {
          this.$router.push({ path: `/app/certifications/${vessel.registrationNumber}` })
        }
      })
    },

    // Generate vessel info HTML (helper method)
    generateVesselInfoHTML(vessel) {
      return `
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
              <span class="info-label">Year Built:</span>
              <span class="info-value">${vessel.built || 'NA'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Flag State:</span>
              <span class="info-value">${vessel.flag || 'NA'}</span>
            </div>
          </div>
          <!-- Add more sections as needed -->
        </div>
      `
    },

    // Edit vessel method (simplified version)
    async editVessel(vessel) {
      // You can extract this to a separate component or use a modal library
      // This is a simplified version of your edit functionality
      console.log('Edit vessel:', vessel)

      // Show edit modal with form
      // On submit, call this.updateVessel(updatedVessel)
    },

    // Utility methods
    showErrorMessage(message) {
      Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: 'OK'
      })
    },

    showSuccessMessage(message) {
      Swal.fire({
        title: 'Success',
        text: message,
        icon: 'success',
        confirmButtonText: 'OK'
      })
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