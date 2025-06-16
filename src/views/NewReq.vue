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
    <div class="container">
      <div class="header">
        <h1>MarineTech Requisition System</h1>
        <p>Streamlined Material Request & Ordering Process</p>
      </div>

      <!-- Navigation Tabs -->
      <div class="nav-tabs">
        <button v-for="tab in visibleTabs" :key="tab.name" :class="['nav-tab', { active: activeTab === tab.name }]"
          @click="activeTab = tab.name">
          {{ tab.label }}
        </button>
      </div>


      <!-- Tabs -->
      <div v-if="activeTab === 'new-requisition'" class="tab-content active">
        <form @submit.prevent="submitRequisition">
          <div class="form-grid">
            <div class="form-group">
              <label>Requestor Name *</label>
              <input type="text" v-model="form.requestor" required />
            </div>
            <div class="form-group">
              <label>Department *</label>
              <select v-model="form.department" required>
                <option value="">Select Department</option>
                <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Project/Vessel</label>
              <input type="text" v-model="form.project" placeholder="e.g., MV Neptune, Platform Alpha" />
            </div>
            <div class="form-group">
              <label>Priority Level *</label>
              <select v-model="form.priority" required>
                <option value="">Select Priority</option>
                <option v-for="priority in priorities" :key="priority" :value="priority">{{ priority }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Date Needed</label>
              <input type="date" v-model="form.neededDate" />
            </div>
            <div class="form-group">
              <label>Cost Center</label>
              <input type="text" v-model="form.costCenter" placeholder="e.g., CC-2024-001" />
            </div>
          </div>

          <div class="form-group">
            <label>Business Justification *</label>
            <textarea v-model="form.justification" placeholder="Explain why these materials are needed..."
              required></textarea>
          </div>

          <div class="items-section">
            <div class="items-header">
              <h3>Requested Items</h3>
              <button type="button" class="add-item-btn" @click="addItem">+ Add Item</button>
            </div>
            <div>
              <div v-for="(item, index) in form.items" :key="index" class="item-row">
                <div class="form-group">
                  <label>Item Description *</label>
                  <input type="text" v-model="item.desc" required />
                </div>
                <div class="form-group">
                  <label>Quantity *</label>
                  <input type="number" v-model.number="item.qty" min="1" required />
                </div>
                <div class="form-group">
                  <label>Unit</label>
                  <select v-model="item.unit">
                    <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Est. Unit Cost</label>
                  <input type="number" v-model.number="item.cost" step="0.01" placeholder="0.00" />
                </div>
                <button type="button" class="remove-item-btn" @click="removeItem(index)">Remove</button>
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <button type="button" class="btn btn-secondary" @click="saveDraft">Save as Draft</button>
            <button type="submit" class="btn btn-primary">Submit Requisition</button>
          </div>
        </form>
      </div>

      <!-- My Requisitions Tab -->
      <div v-if="activeTab === 'my-requisitions'" class="tab-content active">
        <div class="requisition-list">
          <div v-for="req in requisitions" :key="req.id" class="requisition-card">
            <div class="requisition-header">
              <div class="requisition-id">{{ req.id }}</div>
              <div :class="['status-badge', `status-${req.status}`]">{{ req.status }}</div>
            </div>
            <div class="requisition-details">
              <div class="detail-item" v-for="field in requisitionFields" :key="field.label">
                <div class="detail-label">{{ field.label }}</div>
                <div class="detail-value">{{ field.value(req) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Approval Tab -->
      <div v-if="activeTab === 'approvals'" class="tab-content active">
        <div style="margin-bottom: 20px;">
          <h3 style="color: #1e40af; margin-bottom: 15px;">Department Supervisor Dashboard</h3>
          <div style="background: #fef3c7; padding: 15px; border-radius: 10px; border-left: 4px solid #f59e0b;">
            <strong>Role:</strong> Department Supervisor - Review requests for accuracy, necessity, and budget compliance
          </div>
        </div>
        <div class="requisition-list" id="approvalsQueue">
          <div v-for="req in reviewRequisitions" :key="req.id" class="requisition-card">
            <div class="requisition-header">
              <div class="requisition-id">{{ req.id }}</div>
            </div>
            <div class="requisition-details">
              <div class="detail-item" v-for="field in requisitionFields" :key="field.label">
                <div class="detail-label">{{ field.label }}</div>
                <div class="detail-value">{{ field.value(req) }}</div>
              </div>
            </div>
            <!-- Justification -->
            <div class="detail-item">
              <div class="detail-label">Justification</div>
              <div class="detail-value">{{ req.justification || 'N/A' }}</div>
            </div>

            <!-- Item list -->
            <div class="detail-item">
              <div class="detail-label">Items</div>
              <ul class="item-list">
                <li v-for="(item, index) in req.items" :key="index">
                  {{ item.desc }} - {{ item.qty }} {{ item.unit }} @ ₦{{ item.cost.toFixed(2) }} each
                </li>
              </ul>
            </div>
            <button type="button" class="add-item-btn" @click="approveRequisition(req.id)">Approve</button>
            <button type="button" class="marginbox btn-reject" @click="declineRequisition(req.id)">Decline</button>
            <button type="button" class="marginbox btn-request" @click="infoRequisition(req.id)">Request Info</button>
          </div>
        </div>
      </div>

      <!-- Purchasing Queue Tab -->
      <div v-if="activeTab === 'purchasing'" class="tab-content active">
        <div style="margin-bottom: 20px;">
          <h3 style="color: #1e40af; margin-bottom: 15px;">Purchasing Department Dashboard</h3>
          <div style="background: #dbeafe; padding: 15px; border-radius: 10px; border-left: 4px solid #3b82f6;">
            <strong>Role:</strong> Purchasing Team - Convert approved requisitions to Purchase Orders
          </div>
        </div>
        <div class="requisition-list" id="purchasingQueue">
          <!-- Purchasing queue will be loaded here -->
        </div>
      </div>

      <!-- Receiving Tab -->
      <div v-if="activeTab === 'receiving'" class="tab-content active">
        <div style="margin-bottom: 20px;">
          <h3 style="color: #1e40af; margin-bottom: 15px;">Receiving & Inventory Dashboard</h3>
          <div style="background: #dcfce7; padding: 15px; border-radius: 10px; border-left: 4px solid #10b981;">
            <strong>Role:</strong> Warehouse Team - Process incoming deliveries and update inventory
          </div>
        </div>
        <div class="requisition-list" id="receivingQueue">
          <!-- Receiving queue will be loaded here -->
        </div>
      </div>

      <!-- Workflow Guide Tab -->
      <div v-if="activeTab === 'workflow'" class="tab-content active">
        <div class="workflow-steps">
          <div class="workflow-step">
            <div class="step-icon completed">1</div>
            <div class="step-title">Request Submitted</div>
          </div>
          <div class="workflow-step">
            <div class="step-icon active">2</div>
            <div class="step-title">Department Review</div>
          </div>
          <div class="workflow-step">
            <div class="step-icon">3</div>
            <div class="step-title">Management Approval</div>
          </div>
          <div class="workflow-step">
            <div class="step-icon">4</div>
            <div class="step-title">Purchase Order Created</div>
          </div>
          <div class="workflow-step">
            <div class="step-icon">5</div>
            <div class="step-title">Order Fulfilled</div>
          </div>
        </div>

        <div style="background: white; padding: 30px; border-radius: 15px; margin-top: 20px;">
          <h3 style="color: #1e40af; margin-bottom: 20px;">Requisition Workflow Process</h3>
          <div style="line-height: 1.8; color: #374151;">
            <p><strong>Step 1: Request Identification</strong><br>
              Department or individual identifies need for materials, equipment, or services.</p>

            <p><strong>Step 2: Requisition Creation</strong><br>
              Complete requisition form with detailed specifications, quantities, and business justification.</p>

            <p><strong>Step 3: Department Review</strong><br>
              Department supervisor reviews request for accuracy, necessity, and budget compliance.</p>

            <p><strong>Step 4: Management Approval</strong><br>
              Based on cost thresholds, appropriate management level provides approval.</p>

            <p><strong>Step 5: Purchase Order Generation</strong><br>
              Purchasing team converts approved requisition into formal Purchase Order (PO).</p>

            <p><strong>Step 6: Vendor Processing</strong><br>
              PO sent to vendor, order processed, and delivery scheduled.</p>

            <p><strong>Step 7: Receipt & Inventory</strong><br>
              Goods received, inspected, and entered into inventory system.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import Sidebar from '../components/Sidebar.vue';

export default {
  name: 'NewReq',
  components: { Sidebar },

  data() {
    return {
      userRole: 'owner', // Possible values: 'staff', 'supervisor', 'owner', 'purchasing'

      // Tabs with visibility rules
      tabs: [
        { name: 'new-requisition', label: 'New Requisition', roles: ['staff'] },
        { name: 'my-requisitions', label: 'My Requisitions', roles: ['staff'] },
        { name: 'approvals', label: 'Pending Approvals', roles: ['owner', 'supervisor'] },
        { name: 'purchasing', label: 'Purchasing Queue', roles: ['purchasing'] },
        { name: 'receiving', label: 'Receiving', roles: ['purchasing'] },
        { name: 'workflow', label: 'Workflow Guide', roles: ['staff', 'supervisor', 'owner', 'purchasing'] } // visible to all
      ],
      activeTab: 'workflow',

      // Form State
      form: {
        requestor: '',
        department: '',
        project: '',
        priority: '',
        neededDate: '',
        costCenter: '',
        justification: '',
        items: []
      },

      // Data
      requisitions: [
        {
          id: 'REQ-001234',
          requestor: 'John Smith',
          department: 'Marine Operations',
          project: 'MV Neptune',
          priority: 'High',
          status: 'delivered',
          submittedDate: '2025-06-05',
          items: [
            { desc: 'Marine Grade Steel Pipe', qty: 50, unit: 'Meters', cost: 125.0 },
            { desc: 'Safety Harness', qty: 10, unit: 'Pieces', cost: 85.0 }
          ]
        },
        {
          id: 'REQ-001235',
          requestor: 'Sarah Johnson',
          department: 'Engineering',
          project: 'Platform Alpha',
          priority: 'Normal',
          status: 'review',
          submittedDate: '2025-06-09',
          items: [{ desc: 'Hydraulic Pump Assembly', qty: 2, unit: 'Pieces', cost: 2500.0 }]
        }
      ],

      // Options
      departments: [
        'Marine Operations', 'Engineering', 'Maintenance',
        'Safety & Compliance', 'Logistics', 'Administration'
      ],

      priorities: [
        'Urgent - Same Day',
        'High - Within 3 Days',
        'Normal - Within 1 Week',
        'Low - Within 2 Weeks'
      ],

      units: ['Pieces', 'Kilograms', 'Liters', 'Meters', 'Sets', 'Boxes'],

      // Fields for My Requisitions display
      requisitionFields: [
        { label: 'Requestor', value: req => req.requestor },
        { label: 'Department', value: req => req.department },
        { label: 'Project', value: req => req.project || 'N/A' },
        { label: 'Priority', value: req => req.priority },
        { label: 'Submitted', value: req => req.submittedDate },
        { label: 'Items', value: req => `${req.items.length} item(s)` }
      ]
    }
  },

  computed: {
    visibleTabs() {
      return this.tabs.filter(tab => tab.roles.includes(this.userRole))
    },
    reviewRequisitions() {
      return this.requisitions.filter(r => r.status === 'review');
    }
  },

  methods: {
    addItem() {
      this.form.items.push({
        desc: '',
        qty: 1,
        unit: 'Pieces',
        cost: 0
      })
    },

    approveRequisition(id) {
      const requisition = this.requisitions.find(r => r.id === id);
      if (requisition) {
        requisition.status = 'approved';
        requisition.approvedBy = 'Captain John Doe';
        Swal.fire({
          title: "Request Approved",
          text: `You have approved ${id}, it has moved to stage 5 (Purchase Order Generation)`,
          icon: "success"
        });
      }
    },

    declineRequisition(id) {
      const requisition = this.requisitions.find(r => r.id === id);
      if (!requisition) return;

      Swal.fire({
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
          requisition.status = 'declined';
          requisition.declinedBy = 'Captain John Doe';
          requisition.rejectionReason = result.value;

          Swal.fire({
            title: "Request Declined",
            text: `Requisition ${id} was declined for: ${result.value}`,
            icon: "info"
          });
        }
      });
    },

    infoRequisition(id) {
      const requisition = this.requisitions.find(r => r.id === id);
      if (!requisition) return;

      Swal.fire({
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
          requisition.status = 'info';
          requisition.infoRequestedBy = 'Captain John Doe';
          requisition.requestedInfo = result.value;

          Swal.fire({
            title: "Info Request Sent",
            text: `You requested: "${result.value}" from the requester for requisition ${id}.`,
            icon: "success"
          });
        }
      });
    },

    removeItem(index) {
      this.form.items.splice(index, 1)
    },

    saveDraft() {
      const newReq = this.collectFormData('draft')
      this.requisitions.push(newReq)
      alert(`Requisition saved as draft! ID: ${newReq.id}`)
      this.resetForm()
    },

    submitRequisition() {
      const newReq = this.collectFormData('review')
      this.requisitions.push(newReq)
      alert(`Requisition submitted successfully! ID: ${newReq.id}`)
      this.resetForm()
    },

    collectFormData(status) {
      return {
        id: 'REQ-' + Date.now(),
        requestor: this.form.requestor,
        department: this.form.department,
        project: this.form.project,
        priority: this.form.priority,
        neededDate: this.form.neededDate,
        costCenter: this.form.costCenter,
        justification: this.form.justification,
        items: this.form.items.map(item => ({ ...item })),
        status,
        submittedDate: new Date().toLocaleDateString()
      }
    },

    resetForm() {
      this.form = {
        requestor: '',
        department: '',
        project: '',
        priority: '',
        neededDate: '',
        costCenter: '',
        justification: '',
        items: []
      }
      // Add initial item row again
      this.addItem()
    }
  },

  created() {
    // Initialize form with one item row
    this.addItem()
  }
}
</script>
  
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  backdrop-filter: blur(10px);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
}

.header {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  padding: 30px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.header::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  animation: float 20s infinite linear;
}

@keyframes float {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
}

.header p {
  font-size: 1.1rem;
  opacity: 0.9;
  position: relative;
  z-index: 1;
}

.nav-tabs {
  display: flex;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  overflow-x: auto;
  /* enable horizontal scroll */
  white-space: nowrap;
  /* prevent wrapping */
  -webkit-overflow-scrolling: touch;
  /* smooth scrolling on mobile */
  scrollbar-width: thin;
  /* optional: thinner scrollbar in Firefox */
}

/* Optional: style the scrollbar (Webkit browsers only) */
.nav-tabs::-webkit-scrollbar {
  height: 6px;
}

.nav-tabs::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.nav-tabs::-webkit-scrollbar-track {
  background: transparent;
}


.nav-tab {
  flex: 1;
  padding: 15px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  transition: all 0.3s ease;
  position: relative;
}

.nav-tab:hover {
  background: #e2e8f0;
  color: #1e40af;
}

.nav-tab.active {
  color: #1e40af;
  background: white;
}

.nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 3px;
  background: #1e40af;
}

.tab-content {
  display: none;
  padding: 30px;
  animation: fadeIn 0.5s ease-in;
}

.tab-content.active {
  display: block;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
  font-size: 0.95rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px 15px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.items-section {
  background: #f8fafc;
  border-radius: 15px;
  padding: 25px;
  margin: 25px 0;
  border: 2px solid #e2e8f0;
}

.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.items-header h3 {
  color: #1e40af;
  font-size: 1.3rem;
}

.add-item-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.add-item-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.item-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: 15px;
  align-items: end;
  margin-bottom: 15px;
  padding: 15px;
  background: white;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.item-row:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.marginbox {
  margin: 10px
}

.item-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
}

.item-list li {
  background: #f1f5f9;
  /* Light blue-gray background */
  margin-bottom: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  /* Rounded corners */
  font-size: 0.95rem;
  color: #1e293b;
  /* Dark text */
  display: flex;
  justify-content: space-between;
  align-items: center;
  content: '•';
  color: #3b82f6;
}


.remove-item-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.remove-item-btn:hover {
  background: #dc2626;
  transform: scale(1.05);
}

.approval-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn-approve {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-approve:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-reject {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-reject:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-request {
  background: linear-gradient(135deg, #ef9a44 0%, #fa920a 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-request:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(240, 162, 52, 0.3);
}


.btn-create-po {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-create-po:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.btn-mark-delivered {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-mark-delivered:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
}

.po-info {
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  margin: 10px 0;
  border: 1px solid #e2e8f0;
}

.po-info h4 {
  color: #1e40af;
  margin-bottom: 10px;
  font-size: 1rem;
}

.po-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  font-size: 0.9rem;
}

.items-list {
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
  border: 1px solid #e2e8f0;
}

.items-list h4 {
  color: #374151;
  margin-bottom: 10px;
  font-size: 1rem;
}

.item-detail {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.item-detail:last-child {
  border-bottom: none;
}

.comments-section {
  margin-top: 15px;
}

.comments-section textarea {
  width: 100%;
  min-height: 80px;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  resize: vertical;
}

.role-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: 10px;
}

.role-supervisor {
  background: #fef3c7;
  color: #92400e;
}

.role-purchasing {
  background: #dbeafe;
  color: #1e40af;
}

.role-receiving {
  background: #dcfce7;
  color: #166534;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-draft {
  background: #fef3c7;
  color: #92400e;
}

.status-review {
  background: #dbeafe;
  color: #1e40af;
}

.status-approved {
  background: #dcfce7;
  color: #166534;
}

.status-rejected {
  background: #fee2e2;
  color: #dc2626;
}

.status-ordered {
  background: #e0e7ff;
  color: #4338ca;
}

.status-delivered {
  background: #f3e8ff;
  color: #7c3aed;
}

.status-received {
  background: #ecfdf5;
  color: #065f46;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 25px;
  border-top: 2px solid #e5e7eb;
}

.btn {
  padding: 12px 25px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.btn-primary {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
  transform: translateY(-2px);
}

.requisition-list {
  display: grid;
  gap: 20px;
}

.requisition-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.requisition-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.requisition-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.requisition-id {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e40af;
}

.requisition-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 1rem;
  color: #374151;
  font-weight: 500;
}

.workflow-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0;
  padding: 20px;
  background: #f8fafc;
  border-radius: 15px;
  border: 2px solid #e2e8f0;
}

.workflow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}

.workflow-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20px;
  right: -50%;
  width: 100%;
  height: 2px;
  background: #e5e7eb;
  z-index: 1;
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #6b7280;
  margin-bottom: 10px;
  position: relative;
  z-index: 2;
}

.step-icon.active {
  background: #3b82f6;
  color: white;
}

.step-icon.completed {
  background: #10b981;
  color: white;
}

.step-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  text-align: center;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .item-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .workflow-steps {
    flex-direction: column;
    gap: 20px;
  }

  .workflow-step::after {
    display: none;
  }
}

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