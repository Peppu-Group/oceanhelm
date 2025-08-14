<template>
  <!-- Wave background -->
  <div class="wave-bg"></div>

  <!-- Sidebar Toggle Button -->
  <button class="toggle-btn" id="sidebarToggle">
    <i class="bi bi-list"></i>
  </button>

  <!-- Sidebar -->
  <Sidebar />
  <div id="content">
    <RequisitionSystem :user-profile="userProfile" :user-role="userRole" :requisitions="requisitions" :vessels="vessels"
      @submit-requisition="handleSubmitRequisition" @submit-info-response="handleSubmitInfoResponse"
      @approve-requisition="handleApproveRequisition" @decline-requisition="handleDeclineRequisition"
      @info-requisition="handleInfoRequisition" @create-po="handleCreatePO" @open-po="handleOpenPO"
      @finish-po="handleFinishPO" @accept-delivery="handleAcceptDelivery">
    </RequisitionSystem>
  </div>
</template>

<script>
import { RequisitionSystem } from 'oceanhelm';
import Sidebar from '../components/Sidebar.vue';
import html2pdf from 'html2pdf.js';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'NewReq',
  components: {
    RequisitionSystem,
    Sidebar
  },

  data() {
    return {
      userRole: '', // Possible values: 'requisitor', 'supervisor', 'owner', 'purchasing', 'captain'
      requisitionSystemComponent: null
    }
  },

  computed: {
    ...mapGetters('user', ['userProfile', 'userRoleDescription']),
    requisitions() {
      return this.$store.getters['requisitions/allRequisitions'];
    },
    vessels() {
      return this.$store.getters['vessel/allVessels'];
    }
  },

  mounted() {
    this.setUserRole();
    this.fetchData();
  },

  methods: {
    ...mapActions('requisitions', ['addRequisition', 'updateRequisition', 'fetchRequisitions', 'updateVendor']),
    ...mapActions('vessel', ['fetchVessels']),
    ...mapActions('inventory', ['updateInventory', 'addInventory']),

    setUserRole() {
      if (this.userProfile.role !== 'staff') {
        this.userRole = this.userProfile.role;
      } else {
        const categories = this.userProfile.categories || [];

        if (categories.includes('purchaser')) {
          this.userRole = 'purchaser';
        } else if (categories.includes('requisitor')) {
          this.userRole = 'requisitor';
        } else {
          this.userRole = 'staff'; // optional fallback
        }
      }
    },

    fetchData() {
      this.$store.dispatch('requisitions/fetchRequisitions');
      this.$store.dispatch('vessel/fetchVessels');
    },

    handleSubmitRequisition(requisition) {
      this.$store.dispatch('requisitions/addRequisition', requisition).then(() => {
        this.$swal.fire({
          title: 'Requisition Submitted',
          text: `Your requisition ${requisition.id} has been submitted for review.`,
          icon: 'success'
        });
      }).catch(error => {
        this.$swal.fire({
          title: 'Submission Failed',
          text: 'There was an error submitting your requisition. Please try again.',
          icon: 'error'
        });
      });
    },

    handleSubmitInfoResponse({ req, response }) {
      const updatedRequisition = { ...req, status: 'under-review', justification: response };
      this.$store.dispatch('requisitions/updateRequisition', updatedRequisition).then(() => {
        this.$swal.fire({
          title: 'Info Submitted',
          text: `Your response has been submitted for requisition ${req.id}.`,
          icon: 'success'
        });
      }).catch(error => {
        this.$swal.fire({
          title: 'Submission Failed',
          text: 'There was an error submitting your response. Please try again.',
          icon: 'error'
        });
      });
    },

    handleApproveRequisition(id) {
      const requisition = this.requisitions.find(r => r.id === id);
      if (requisition) {
        const updatedRequisition = { ...requisition, status: 'approved' };
        this.$store.dispatch('requisitions/updateRequisition', updatedRequisition).then(() => {
          this.$swal.fire({
            title: "Request Approved",
            text: `You have approved ${updatedRequisition.id}, it has moved to stage 5 (Purchase Order Generation)`,
            icon: "success"
          });
        }).catch(error => {
          this.$swal.fire({
            title: 'Approval Failed',
            text: 'There was an error approving the requisition. Please try again.',
            icon: 'error'
          });
        });
      }
    },

    handleDeclineRequisition(id) {
      const requisition = this.requisitions.find(r => r.id === id);
      if (!requisition) return;

      this.$swal.fire({
        title: 'Decline Requisition',
        input: 'text',
        inputLabel: 'Reason for rejection',
        inputPlaceholder: 'Enter a reason',
        inputValidator: (value) => {
          if (!value) {
            return 'You must provide a reason!';
          }
        },
        showCancelButton: true,
        confirmButtonText: 'Decline',
        cancelButtonText: 'Cancel',
        icon: 'warning'
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedRequisition = {
            ...requisition,
            status: 'declined',
            declinedBy: this.userProfile.role,
            rejectionReason: result.value
          };
          this.$store.dispatch('requisitions/updateRequisition', updatedRequisition).then(() => {
            this.$swal.fire({
              title: "Request Declined",
              text: `Requisition ${id} was declined for: ${result.value}`,
              icon: "info"
            });
          }).catch(error => {
            this.$swal.fire({
              title: 'Decline Failed',
              text: 'There was an error declining the requisition. Please try again.',
              icon: 'error'
            });
          });
        }
      });
    },

    handleInfoRequisition(id) {
      const requisition = this.requisitions.find(r => r.id === id);
      if (!requisition) return;

      this.$swal.fire({
        title: 'Request Additional Info',
        input: 'text',
        inputLabel: 'What information do you need from the requester?',
        inputPlaceholder: 'Enter your info request',
        inputValidator: (value) => {
          if (!value) {
            return 'You must specify the info you need!';
          }
        },
        showCancelButton: true,
        confirmButtonText: 'Send Request',
        cancelButtonText: 'Cancel',
        icon: 'question'
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedRequisition = {
            ...requisition,
            status: 'info-requested',
            infoRequestedBy: this.userProfile.role,
            requestedInfo: result.value
          };
          this.$store.dispatch('requisitions/updateRequisition', updatedRequisition).then(() => {
            this.$swal.fire({
              title: "Info Request Sent",
              text: `You requested: "${result.value}" from the requester for requisition ${id}.`,
              icon: "success"
            });
          }).catch(error => {
            this.$swal.fire({
              title: 'Request Failed',
              text: 'There was an error sending the info request. Please try again.',
              icon: 'error'
            });
          });
        }
      });
    },

    async handleCreatePO(id) {
      let reqId = id;
      const { value: vendor } = await this.$swal.fire({
        title: 'Enter Vendor Information',
        html:
          `<div class="custom-swal-container">` +
          `<input id="vendor-company" class="custom-input" placeholder="Company Name *">` +
          `<input id="vendor-contact" class="custom-input" placeholder="Contact Person *">` +
          `<input id="vendor-email" type="email" class="custom-input" placeholder="Email *">` +
          `<input id="vendor-phone" class="custom-input" placeholder="Phone *">` +
          `<input id="vendor-address" class="custom-input" placeholder="Address *">` +
          `<input id="vendor-tax" type="number" class="custom-input" placeholder="Tax (Optional)">` +
          `<input id="vendor-shipping" type="number" class="custom-input" placeholder="Shipping Cost (Optional)">` +
          `</div>`,
        focusConfirm: false,
        showCancelButton: true,
        customClass: {
          container: 'custom-swal-container',
          popup: 'custom-swal-popup',
        },
        preConfirm: () => {
          const company = document.getElementById('vendor-company').value.trim();
          const contact = document.getElementById('vendor-contact').value.trim();
          const email = document.getElementById('vendor-email').value.trim();
          const phone = document.getElementById('vendor-phone').value.trim();
          const address = document.getElementById('vendor-address').value.trim();
          const tax = document.getElementById('vendor-tax').value.trim();
          const shipping = document.getElementById('vendor-shipping').value.trim();
          const poDate = new Date().toLocaleDateString();
          const poApproved = 'PO Owner';

          // Validation
          if (!company || !contact || !email || !phone || !address) {
            this.$swal.showValidationMessage('Please fill in all required fields (*)');
            return false;
          }

          return {
            company, contact, email, phone, address, tax, shipping,
            id: reqId, poDate, poApproved
          };
        }
      });

      if (vendor) {
        // Update vendor info in store
        this.$store.dispatch('requisitions/updateVendor', vendor);

        // Get the component reference and update it
        const requisitionComponent = this.$children[0];
        if (requisitionComponent) {
          const requisition = this.requisitions.find(r => r.id === id);
          requisitionComponent.updateVendorInfo(vendor);
          requisitionComponent.updatePODetails(requisition);
          requisitionComponent.setActiveTab('po');
        }
      }
    },

    async handleOpenPO(id) {
      const requisitionComponent = this.$children[0];
      if (requisitionComponent) {
        // Set printing mode
        requisitionComponent.setPrintingMode(true);

        // Switch to PO tab and update details
        const requisition = this.requisitions.find(r => r.id === id);
        requisitionComponent.updatePODetails(requisition);
        requisitionComponent.setActiveTab('po');

        // Wait for DOM to render
        await this.$nextTick();

        const element = document.getElementById('po-content');
        if (!element) {
          console.error('PO element not found');
          return;
        }

        const options = {
          margin: 0.5,
          filename: `PO-${id}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        try {
          await html2pdf().set(options).from(element).save();
        } catch (error) {
          console.error('Error generating PDF:', error);
          this.$swal.fire({
            title: 'PDF Generation Failed',
            text: 'Error generating PDF. Please try again.',
            icon: 'error'
          });
        } finally {
          // Reset printing mode
          requisitionComponent.setPrintingMode(false);
        }
      }
    },

    handleFinishPO(id) {
      const requisition = this.requisitions.find(r => r.id === id);
      const updatedRequisition = { ...requisition, status: 'po-created' };
      this.$store.dispatch('requisitions/updateRequisition', updatedRequisition).then(() => {
        const requisitionComponent = this.$children[0];
        if (requisitionComponent) {
          requisitionComponent.setActiveTab('purchasing');
        }
        this.$swal.fire({
          title: 'PO Approved',
          text: `Purchase Order for requisition ${id} has been approved and is ready for delivery.`,
          icon: 'success'
        });
      }).catch(error => {
        this.$swal.fire({
          title: 'PO Approval Failed',
          text: 'There was an error approving the PO. Please try again.',
          icon: 'error'
        });
      });
    },

    async handleAcceptDelivery(id) {
      const requisition = this.requisitions.find(r => r.id === id);
      if (!requisition) return;

      try {
        await this.findInventoryFromRequisition(requisition);
      } catch (error) {
        console.error('Error processing delivery:', error);
        this.$swal.fire({
          title: 'Delivery Processing Failed',
          text: 'There was an error processing the delivery. Please try again.',
          icon: 'error'
        });
      }
    },

    getStockStatus(stockLevel, minStock, maxStock) {
      const currentStock = parseInt(stockLevel);

      if (currentStock === 0) {
        return 'Out';
      } else if (currentStock > parseInt(maxStock)) {
        return 'Over';
      } else if (currentStock > parseInt(minStock)) {
        return 'Available';
      } else {
        return 'Low';
      }
    },

    async findInventoryFromRequisition(requisition) {
      const inventoryList = this.$store.state.inventory.inventory || [];
      const dispatchPromises = [];

      let hasValidItems = false;

      for (const requisitionItem of requisition.items) {
        const matchingInventory = inventoryList.find(item => item.id === requisitionItem.id);

        if (!matchingInventory) {
          this.$swal.fire({
            title: 'Not Found',
            text: `No inventory found with ID ${requisitionItem.id}. Navigate to inventory and add the item first.`,
            icon: 'error'
          });
          continue;
        }

        // If full match on vessel + location
        if (
          matchingInventory.location === requisition.department &&
          matchingInventory.vessel === requisition.project
        ) {
          hasValidItems = true;

          const currentStock = matchingInventory.currentStock + parseFloat(requisitionItem.qty);
          const stockData = {
            value: parseFloat(requisitionItem.cost) + matchingInventory.value,
            currentStock,
            status: this.getStockStatus(currentStock, matchingInventory.minStock, matchingInventory.maxStock),
            quantityReceived: requisitionItem.qty
          };

          const actionType = {
            action: 'stockin',
            initialQuantity: parseInt(currentStock) - parseInt(requisitionItem.qty),
            finalQuantity: currentStock,
            date: new Date().toISOString()
          };

          const payload = {
            id: matchingInventory.id,
            location: matchingInventory.location,
            vessel: matchingInventory.vessel,
            stockData,
            actionType
          };

          dispatchPromises.push(this.$store.dispatch('inventory/updateInventory', payload));
        }
        // Fallback when location/vessel don't match
        else {
          const fallback = inventoryList.find(item => item.id === requisitionItem.id);

          if (fallback) {
            hasValidItems = true;

            const newInventory = {
              itemId: fallback.id,
              itemname: fallback.itemName,
              value: parseFloat(requisitionItem.cost),
              status: this.getStockStatus(parseFloat(requisitionItem.qty), fallback.minStock, fallback.maxStock),
              category: fallback.category,
              location: requisition.department,
              vessel: requisition.project,
              currentstock: parseFloat(requisitionItem.qty),
              lastupdated: new Date().toISOString().split('T')[0],
              maxStock: fallback.maxStock,
              minStock: fallback.minStock,
            };

            dispatchPromises.push(this.$store.dispatch('inventory/addInventory', newInventory));

            const actionType = {
              action: 'transfer',
              quantity: requisitionItem.qty,
              date: new Date().toISOString()
            };

            const stockData = {
              value: parseFloat(requisitionItem.cost),
              currentStock: parseFloat(requisitionItem.qty),
              status: this.getStockStatus(parseFloat(requisitionItem.qty), fallback.minStock, fallback.maxStock),
              quantityReceived: requisitionItem.qty
            };

            const payload = {
              id: fallback.id,
              location: requisition.department,
              vessel: requisition.project,
              stockData,
              actionType
            };

            dispatchPromises.push(this.$store.dispatch('inventory/updateInventory', payload));
          } else {
            this.$swal.fire({
              title: 'Data Error',
              text: `Inventory exists but could not extract stock info.`,
              icon: 'error'
            });
          }
        }
      }

      // Run updateRequisition and feedback if at least one item succeeded
      if (hasValidItems) {
        const updatedRequisition = { ...requisition, status: 'delivered' };
        dispatchPromises.push(this.$store.dispatch('requisitions/updateRequisition', updatedRequisition));
      }

      // Execute all store actions
      if (dispatchPromises.length > 0) {
        await Promise.all(dispatchPromises);
        this.$swal.fire({
          title: 'Inventory Updated',
          text: 'Requisition items have been received into the inventory.',
          icon: 'success'
        });
      }
    }
  }
}
</script>

<style scoped>
#content {
    width: 100%;
    min-height: 100vh;
    transition: all 0.3s;
    position: absolute;
    padding: 20px;
    padding-left: 40px;
}

#content.active {
    margin-left: var(--sidebar-width);
    width: calc(100% - var(--sidebar-width));
}
</style>