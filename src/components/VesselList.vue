<template>
  <div class="vessel-management">
    <VesselList 
      :vessels="vessels"
      :user-profile="userProfile"
      :current-route="currentRouteName"
      :config="vesselListConfig"
      @vessel-add="handleVesselAdd"
      @vessel-click="handleVesselClick"
      @vessel-edit="handleVesselEdit"
      @vessel-delete="handleVesselDelete"
      @vessel-toggle-status="handleVesselToggleStatus"
      @vessel-navigate="handleVesselNavigation"
      @access-denied="handleAccessDenied"
    />
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
    
    // Handle vessel status toggle event
    async handleVesselToggleStatus(vessel) {
      try {
        const isCurrentlyActive = vessel.status === 'Active'
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: `You are about to mark this vessel as ${isCurrentlyActive ? 'Inactive' : 'Active'}.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#6c757d',
          confirmButtonText: `Yes, mark ${isCurrentlyActive ? 'Inactive' : 'Active'}`,
          cancelButtonText: 'Cancel'
        })
        
        if (result.isConfirmed) {
          await this.markInactive(vessel.registrationNumber)
        }
      } catch (error) {
        console.error('Error toggling vessel status:', error)
        this.showErrorMessage('Failed to update vessel status')
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