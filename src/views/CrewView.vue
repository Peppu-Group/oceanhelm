<template>
    <div class="crew-page">
      <!-- Sidebar Toggle Button (if needed) -->
      <button class="toggle-btn" id="sidebarToggle" v-if="config.showSidebar">
          <i class="bi bi-list"></i>
      </button>
  
      <!-- Sidebar -->
      <Sidebar v-if="config.showSidebar" />
      
      <div id="content" class="container">
          <h1>OceanHelm Crew Management</h1>
          
          <CrewManagement
              :crew="crewMembers"
              :user-profile="userProfile"
              :loading="loading"
              :available-roles="availableRoles"
              :config="crewConfig"
              @crew-add="handleCrewAdd"
              @crew-edit="handleCrewEdit"
              @crew-delete="handleCrewDelete"
              @crew-assign-shift="handleAssignShift"
              @crew-add-certification="handleAddCertification"
              @crew-view-certification="handleViewCertification"
              @search-changed="handleSearchChanged"
              @filter-changed="handleFilterChanged"
              @access-denied="handleAccessDenied"
          />
      </div>
    </div>
  </template>
     
  <script>
  import { mapGetters, mapActions } from 'vuex'
  import Sidebar from '../components/Sidebar.vue';
  import { CrewManagement } from 'oceanhelm'
  
  
  export default {
      name: 'CrewView',
      components: { Sidebar, CrewManagement },
      data() {
          return {
              availableRoles: [
                  'Captain', 'First Officer', 'Engineer', 'Deckhand', 
                  'Mechanic', 'Cook', 'Radio Officer', 'Safety Officer'
              ],
              crewConfig: {
                  showWaveBackground: true,
                  enableAdd: true,
                  enableEdit: true,
                  enableDelete: true,
                  enableAssignShift: true,
                  enableCertificationManagement: true
              },
              config: {
                  showSidebar: true
              }
          }
      },
      
      computed: {
          ...mapGetters('user', ['userProfile']),
          ...mapGetters('crew', ['isLoading']),
          
          vessels() {
            return this.$store.getters['vessel/allVessels'];
        },
          
          crewMembers() {
              // const vesselId = this.$route.params.id
              return this.$store.getters['crew/allCrew']
          },
          
          loading() {
              return this.isLoading
          }
      },
      
      async mounted() {
          // Fetch crew data when component mounts
          await this.fetchCrew();
          // fetch vessels
          await this.fetchVessels();
      },
      
      methods: {
          ...mapActions('crew', [
              'fetchCrew',
              'addCrew', 
              'updateCrewMember',
              'deleteCrew'
          ]),

          ...mapActions('vessel', ['fetchVessels']),
          
          // Handle crew add event
          async handleCrewAdd(newMember) {
              try {
                  // Generate unique ID
                  const memberWithId = {
                      ...newMember,
                      id: Date.now() + Math.random()
                  }
                  
                  await this.addCrew(memberWithId)
                  
                  this.showSuccessMessage('Crew member added successfully!')
              } catch (error) {
                  console.error('Error adding crew member:', error)
                  this.showErrorMessage('Failed to add crew member. Please try again.')
              }
          },
          
          // Handle crew edit event
          handleCrewEdit(member) {
              // You can implement inline editing or modal editing here
              console.log('Edit crew member:', member)
              // For now, just log - you can extend this with actual edit functionality
          },
          
          // Handle crew delete event
          async handleCrewDelete(member) {
              try {
                  const result = await Swal.fire({
                      title: 'Are you sure?',
                      text: "You're trying to delete a crew member. This action cannot be undone!",
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#d33',
                      cancelButtonColor: '#3085d6',
                      confirmButtonText: 'Yes, delete it!',
                  })
                  
                  if (result.isConfirmed) {
                      await this.deleteCrew(member.name || member.id)
                      
                      await Swal.fire({
                          title: 'Deleted!',
                          text: 'The crew member has been deleted.',
                          icon: 'success'
                      })
                  }
              } catch (error) {
                  console.error('Error deleting crew member:', error)
                  this.showErrorMessage('Failed to delete crew member. Please try again.')
              }
          },
          
          // Handle assign shift event
          async handleAssignShift(member) {
            const vessels = this.vessels;

            const vesselOptionsHtml = vessels.map(v =>
                `<option value="${v.name}">${v.name}</option>`
            ).join('');
              try {
                  const result = await Swal.fire({
                      title: 'Assign Crew Shift',
                      html: `
                          <p>Assign crew to vessel and shift</p>
                          <div class="custom-swal-content">
                              <label class="custom-input-label" for="swal-shift">Embarkation Date:</label>
                              <input id="swal-shift" class="custom-input" type="date" value="${member.nextShift || ''}">
  
                              <label class="custom-input-label" for="swal-timeline">Expected Days On Board (in days):</label>
                              <input id="swal-timeline" class="custom-input" type="number" value="${member.onBoard || ''}" min="1">
  
                              <label class="custom-input-label">Vessel Name *</label>
                              <select id="swal-vessel" class="custom-input">
                              <option value="">Select vessel ...</option>
                              ${vesselOptionsHtml}
                              </select>

                              <label class="custom-input-label">Status</label>
                              <select id="swal-status" class="custom-input">
                                  <option value="available" ${member.status === 'available' ? 'selected' : ''}>Available</option>
                                  <option value="unavailable" ${member.status === 'unavailable' ? 'selected' : ''}>Unavailable</option>
                                  <option value="onduty" ${member.status === 'onduty' ? 'selected' : ''}>On Duty</option>
                              </select>
                          </div>
                      `,
                      focusConfirm: false,
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      showCancelButton: true,
                      confirmButtonText: 'Assign',
                      cancelButtonText: 'Cancel',
                      customClass: {
                          container: 'custom-swal-container',
                          popup: 'custom-swal-popup',
                          title: 'custom-swal-title',
                          htmlContainer: 'custom-swal-content'
                      },
                      preConfirm: () => {
                          const shift = document.getElementById('swal-shift').value
                          const status = document.getElementById('swal-status').value
                          const onBoard = document.getElementById('swal-timeline').value
                          const vessel = document.getElementById('swal-vessel').value || prevvessel;
  
                          if (!shift) {
                              Swal.showValidationMessage('Please select an embarkation date')
                              return false
                          }
                          
                          if (!onBoard || onBoard < 1) {
                              Swal.showValidationMessage('Please enter valid days on board (minimum 1 day)')
                              return false
                          }

                          if (!vessel) {
                              Swal.showValidationMessage('Please enter a vessel')
                              return false
                          }
  
                          return { shift, status, onBoard, vessel }
                      }
                  })
                  
                  if (result.isConfirmed) {
                      const { shift, status, onBoard, vessel } = result.value
                      
                      // Store previous shift for reference
                      if (member.nextShift) {
                          localStorage.setItem("last_shift", member.nextShift)
                      }
                      
                      await this.updateCrewMember({
                          name: member.name,
                          nextShift: shift,
                          status: status,
                          vessel: vessel,
                          onBoard: parseInt(onBoard)
                      })
                      
                      this.showSuccessMessage('Shift assigned successfully!')
                  }
              } catch (error) {
                  console.error('Error assigning shift:', error)
                  this.showErrorMessage('Failed to assign shift. Please try again.')
              }
          },
          
          // Handle add certification event
          async handleAddCertification(member) {
              try {
                  const result = await Swal.fire({
                      title: 'Add Certification',
                      html: `
                          <div class="swal-cert-form">
                              <div class="form-group">
                                  <label for="cert-name">Certification Name:</label>
                                  <input type="text" id="cert-name" class="swal2-input" placeholder="Enter certification name">
                              </div>
                              <div class="form-group">
                                  <label for="cert-expiry">Expiry Date:</label>
                                  <input type="date" id="cert-expiry" class="swal2-input">
                              </div>
                          </div>
                      `,
                      focusConfirm: false,
                      showCancelButton: true,
                      confirmButtonText: 'Add Certification',
                      cancelButtonText: 'Cancel',
                      customClass: {
                          container: 'custom-swal-container',
                          popup: 'custom-swal-popup',
                          title: 'custom-swal-title'
                      },
                      preConfirm: () => {
                          const name = document.getElementById('cert-name').value.trim()
                          const expiryDate = document.getElementById('cert-expiry').value
  
                          if (!name) {
                              Swal.showValidationMessage('Please enter certification name')
                              return false
                          }
  
                          if (!expiryDate) {
                              Swal.showValidationMessage('Please select expiry date')
                              return false
                          }
  
                          return { name, expiryDate }
                      }
                  })
                  
                  if (result.isConfirmed) {
                      const { name, expiryDate } = result.value
                      
                      // Update crew member with new certification
                      const updatedCertifications = [
                          ...(member.certifications || []),
                          { name, expiryDate }
                      ]
                      
                      await this.updateCrewMember({
                          name: member.name,
                          certifications: updatedCertifications
                      })
                      
                      this.showSuccessMessage('Certification added successfully!')
                  }
              } catch (error) {
                  console.error('Error adding certification:', error)
                  this.showErrorMessage('Failed to add certification. Please try again.')
              }
          },
          
          // Handle view certification event
          handleViewCertification({ certification, member }) {
              Swal.fire({
                  html: `
                      <div class="certificate-header">
                          <svg class="certificate-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" fill="white"/>
                              <path d="M12 15V23L8 19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M12 15V23L16 19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" stroke="white" stroke-width="2"/>
                          </svg>
                          <h2 class="certificate-title">${certification.name} Certification</h2>
                      </div>
                      <div class="certificate-body">
                          <div class="certificate-name">Crew Member: ${member.name}</div>
                          <div class="certificate-name">Certification Name: ${certification.name}</div>
                          <div class="certificate-border"></div>
                          <div class="certificate-date">Expiration Date: ${certification.expiryDate}</div>
                          <div class="certificate-footer">We don't validate certifications, download to ensure everything is in order.</div>
                      </div>
                  `,
                  showConfirmButton: true,
                  showCancelButton: true,
                  confirmButtonText: 'Download',
                  cancelButtonText: 'Close',
                  customClass: {
                      container: 'custom-swal-container',
                      popup: 'custom-swal-popup',
                      title: 'custom-swal-title'
                  }
              }).then((result) => {
                  if (result.isConfirmed) {
                      // Handle certificate download
                      console.log('Download certification:', certification)
                      // Implement download functionality here
                  }
              })
          },
          
          // Handle search change event
          handleSearchChanged(searchQuery) {
              // You can implement search analytics or logging here
              console.log('Search query changed:', searchQuery)
          },
          
          // Handle filter change event
          handleFilterChanged(filterStatus) {
              // You can implement filter analytics or logging here
              console.log('Filter changed:', filterStatus)
          },
          
          // Handle access denied event
          handleAccessDenied({ action, userProfile }) {
              Swal.fire({
                  title: 'Unauthorized',
                  text: `You do not have permission to ${action}. Your current role: ${userProfile.role}`,
                  icon: 'warning',
                  confirmButtonText: 'OK',
                  customClass: {
                      container: 'custom-swal-container',
                      popup: 'custom-swal-popup',
                      title: 'custom-swal-title'
                  }
              })
          },
          
          // Utility methods
          showSuccessMessage(message) {
              Swal.fire({
                  title: 'Success!',
                  text: message,
                  icon: 'success',
                  confirmButtonText: 'OK',
                  customClass: {
                      container: 'custom-swal-container',
                      popup: 'custom-swal-popup',
                      title: 'custom-swal-title'
                  }
              })
          },
          
          showErrorMessage(message) {
              Swal.fire({
                  title: 'Error!',
                  text: message,
                  icon: 'error',
                  confirmButtonText: 'OK',
                  customClass: {
                      container: 'custom-swal-container',
                      popup: 'custom-swal-popup',
                      title: 'custom-swal-title'
                  }
              })
          }
      }
  
  }
  </script>
  
  <style scoped>
  h1,
  h2 {
      color: #005792;
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
  
  #content.active {
      margin-left: var(--sidebar-width);
      width: calc(100% - var(--sidebar-width));
  }
  </style>