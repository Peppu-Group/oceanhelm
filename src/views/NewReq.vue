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
              <input type="text" :value="this.userProfile.full_name" readonly required
                class="form-control" />
            </div>
            <div class="form-group">
              <label>Department *</label>
              <select v-model="form.department" required>
                <option value="">Select Department</option>
                <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Vessel *</label>
              <select v-model="form.project" class="form-control" required>
                <option disabled value="">Select a vessel</option>
                <option v-for="v in vessels" :key="v.id" :value="v.name">
                  {{ v.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Date Needed *</label>
              <input type="date" v-model="form.neededDate" required />
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
                  <label>Item Code *</label>
                  <input type="text" v-model="item.id" required />
                </div>
                <div class="form-group">
                  <label>Item Description *</label>
                  <input type="text" v-model="item.desc" required />
                </div>
                <div class="form-group">
                  <label>Quantity *</label>
                  <input type="number" v-model.number="item.qty" min="1" required />
                </div>
                <div class="form-group">
                  <label>Unit *</label>
                  <select v-model="item.unit" required>
                    <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Est. Unit Cost *</label>
                  <input type="number" v-model.number="item.cost" step="0.01" placeholder="0.00" required />
                </div>
                <button type="button" class="remove-item-btn" @click="removeItem(index)">Remove</button>
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <button type="submit" class="btn btn-primary">Submit Requisition</button>
          </div>
        </form>
      </div>

      <!-- All Requisitions Tab -->
      <div v-if="activeTab === 'all-requisitions'" class="tab-content active">
        <div class="requisition-list">
          <div v-for="req in requisitions" :key="req.id" class="requisition-card">
            <div class="requisition-header">
              <div class="requisition-id">{{ req.id }}</div>
              <div :class="['status-badge', `status-${req.status}`]">{{ req.status }}</div>
            </div>
            <div class="requisition-details">
              <div class="detail-item" v-for="field in getRequisitionFields(req)" :key="field.label">
                <div class="detail-label">{{ field.label }}</div>
                <div class="detail-value">{{ field.value(req) }}</div>
              </div>
            </div>
            <div v-if="req.status === 'po-created' || req.status === 'delivered'" class="form-group comments-section">
              <button @click="openPO(req.id)" class="add-item-btn comments-section">
                Print PO
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- My Requisitions Tab -->
      <div v-if="activeTab === 'my-requisitions'" class="tab-content active">
        <div class="requisition-list">
          <div v-for="req in myRequisitions" :key="req.id" class="requisition-card">
            <div class="requisition-header">
              <div class="requisition-id">{{ req.id }}</div>
              <div :class="['status-badge', `status-${req.status}`]">{{ req.status }}</div>
            </div>
            <div class="requisition-details">
              <div class="detail-item" v-for="field in getRequisitionFields(req)" :key="field.label">
                <div class="detail-label">{{ field.label }}</div>
                <div class="detail-value">{{ field.value(req) }}</div>
              </div>
            </div>
            <div v-if="req.status === 'info-requested'" class="form-group comments-section">
              <label class="detail-label">Your Response</label>
              <textarea v-model="form.justification" class="response-textarea"
                placeholder="Submit more info..."></textarea>
              <button @click="submitInfoResponse(req)" class="add-item-btn comments-section">
                Submit Info
              </button>
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
          <div v-for="req in poRequisitions" :key="req.id" class="requisition-card">
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
            <button type="button" class="add-item-btn" @click="createPO(req.id)">Create PO</button>
          </div>
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
          <div v-for="req in awaitingDelivery" :key="req.id" class="requisition-card">
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
            <button type="button" class="add-item-btn" @click="acceptDelivery(req.id)">Accept Delivery</button>
          </div>
        </div>
      </div>

      <!-- PO Tab -->
      <div v-if="activeTab === 'po'" class="tab-content active">
        <div class="po-content" id="po-content">
          <div class="po-header">
            <div class="company-info">
              <h3>Vendor Information</h3>
              <div class="info-row">
                <span class="info-label">Company:</span>
                <span class="info-value">{{ vendorInfo.company || poDetails.vendorInfo.company }} </span>
              </div>
              <div class="info-row">
                <span class="info-label">Contact:</span>
                <span class="info-value">{{ vendorInfo.contact || poDetails.vendorInfo.contact }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">{{ vendorInfo.email || poDetails.vendorInfo.email }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Phone:</span>
                <span class="info-value">{{ vendorInfo.phone || poDetails.vendorInfo.phone }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Address:</span>
                <span class="info-value">{{ vendorInfo.address || poDetails.vendorInfo.address }}</span>
              </div>
            </div>

            <div class="company-info">
              <h3>Purchase Order Details</h3>
              <div class="info-row">
                <span class="info-label">PO Number:</span>
                <span class="info-value">{{ poDetails.id }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Date:</span>
                <span class="info-value"> {{ vendorInfo.poDate || poDetails.vendorInfo.poDate }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Requested By:</span>
                <span class="info-value">{{ vendorInfo.poApproved || poDetails.vendorInfo.poApproved }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Department:</span>
                <span class="info-value">PO-{{ poDetails.department }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Delivery Date:</span>
                <span class="info-value"> {{ poDetails.neededDate }}</span>
              </div>
            </div>
          </div>

          <div class="items-section">
            <h2 class="section-title">Order Items</h2>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item #</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                  <th v-if="!isPrinting">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in poDetails.items" :key="index">
                  <td>{{ item.itemNumber }}</td>
                  <td>{{ item.desc }}</td>
                  <td>{{ item.qty }}</td>
                  <td>
                    <span v-if="!item.editing">
                      ${{ item.cost.toFixed(2) }}
                      <span v-if="item.cost !== item.unitPrice" class="price-change-indicator">!</span>
                    </span>
                    <input v-else v-model.number="item.tempPrice" type="number" step="0.01" class="price-input"
                      :class="{ 'price-changed': item.cost !== item.tempPrice }">
                  </td>
                  <td>${{ (item.unitPrice * item.qty).toFixed(2) }}</td>
                  <td v-if="!isPrinting">
                    <button v-if="!item.editing" @click="startEdit(index)" class="edit-btn">
                      Edit Price
                    </button>
                    <div v-else>
                      <button @click="savePrice(index)" class="save-btn">Save</button>
                      <button @click="cancelEdit(index)" class="cancel-btn">Cancel</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-for="(item, index) in poDetails.items" :key="'note-' + index">
              <div v-if="item.justification" class="justification-note">
                <strong>Price Change Justification (Item {{ item.itemNumber }}):</strong> {{ item.justification }}
              </div>
            </div>

            <div class="totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>${{ subTotal.toFixed(2) }}</span>
              </div>
              <div class="total-row">
                <span>Tax (%):</span>
                <span>${{ getOptional(vendorInfo.tax) }}</span>
              </div>
              <div class="total-row">
                <span>Shipping:</span>
                <span>${{ getOptional(vendorInfo.shipping) }}</span>
              </div>
              <div class="total-row grand-total">
                <span>Grand Total:</span>
                <span>${{ subTotal + getOptional(vendorInfo.tax) + getOptional(vendorInfo.shipping) }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Justification Modal -->
        <div v-if="showJustificationModal" class="justification-modal" @click.self="closeJustificationModal">
          <div class="modal-content">
            <h3>Price Change Justification Required</h3>
            <p style="margin-bottom: 15px; color: #666;">
              Please provide a justification for changing the price from
              <strong>${{ currentItem.cost.toFixed(2) }}</strong> to
              <strong>${{ currentItem.tempPrice.toFixed(2) }}</strong>
            </p>
            <textarea v-model="justificationText" class="justification-textarea"
              placeholder="Enter justification for price change..." required></textarea>
            <div class="modal-buttons">
              <button @click="closeJustificationModal" class="cancel-btn">Cancel</button>
              <button @click="confirmPriceChange" class="save-btn" :disabled="!justificationText.trim()">
                Confirm Change
              </button>
            </div>
          </div>
        </div>
        <button v-if="!isPrinting" type="button" class="add-item-btn" @click="finishPO(poDetails.id)">Approve
          PO</button>
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
import html2pdf from 'html2pdf.js';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'NewReq',
  components: { Sidebar },

  data() {
    return {
      userRole: 'staff', // Possible values: 'staff', 'supervisor', 'owner', 'purchasing', 'captain'

      isPrinting: false,
      // Tabs with visibility rules
      tabs: [
        { name: 'new-requisition', label: 'New Requisition', roles: ['staff'] },
        { name: 'my-requisitions', label: 'My Requisitions', roles: ['staff'] },
        { name: 'all-requisitions', label: 'All Requisitions', roles: ['staff', 'supervisor', 'captain', 'owner', 'purchasing'] },
        { name: 'approvals', label: 'Pending Approvals', roles: ['owner', 'supervisor', 'captain'] },
        { name: 'purchasing', label: 'Purchasing Queue', roles: ['purchasing'] },
        { name: 'receiving', label: 'Receiving', roles: ['purchasing'] },
        { name: 'workflow', label: 'Workflow Guide', roles: ['staff', 'supervisor', 'owner', 'purchasing', 'captain'] } // visible to all
      ],
      activeTab: 'workflow',

      // Form State
      form: {
        requestor: '',
        department: '',
        project: '',
        neededDate: '',
        justification: '',
        items: []
      },
      poDetails: {
        editing: false
      },
      vendorInfo: {},
      justificationText: '',
      // common fields
      requisitionFields: [
        { label: 'Requestor', value: req => req.requestor },
        { label: 'Department', value: req => req.department },
        { label: 'Project', value: req => req.project || 'N/A' },
        { label: 'Submitted', value: req => req.submittedDate },
        { label: 'Items', value: req => `${req.items.length} item(s)` }
      ],

      // Fields for My Requisitions display
      requisitionFieldsMap: {
        approved: [
          { label: 'Approved By', value: req => req.approvedBy },
        ],

        declined: [
          { label: 'Declined By', value: req => req.declinedBy },
          { label: 'Rejection Reason', value: req => req.rejectionReason },
        ],

        'info-requested': [
          { label: 'Info Requester', value: req => req.infoRequestedBy },
          { label: 'Requested Info', value: req => req.requestedInfo }
        ]
      },

      // Options
      departments: [
        'Marine Operations', 'Engineering', 'Maintenance',
        'Safety & Compliance', 'Logistics', 'Administration',
        'Engine Room'
      ],

      priorities: [
        'Urgent - Same Day',
        'High - Within 3 Days',
        'Normal - Within 1 Week',
        'Low - Within 2 Weeks'
      ],

      units: ['Pieces', 'Kilograms', 'Liters', 'Meters', 'Sets', 'Boxes'],
      currentItemIndex: null,
      showJustificationModal: false
    }
  },

  computed: {
    ...mapGetters('user', ['userProfile', 'userRoleDescription']),
    visibleTabs() {
      return this.tabs.filter(tab => tab.roles.includes(this.userRole))
    },
    subTotal() {
      return this.poDetails.items.reduce((sum, item) => {
        return sum + (item.unitPrice * item.qty);
      }, 0);
    },
    reviewRequisitions() {
      return this.requisitions.filter(r => r.status === 'under-review');
    },
    poRequisitions() {
      return this.requisitions.filter(r => r.status === 'approved');
    },
    awaitingDelivery() {
      return this.requisitions.filter(r => r.status === 'po-created');
    },
    currentItem() {
      return this.currentItemIndex !== null ? this.poDetails.items[this.currentItemIndex] : null;
    },
    requisitions() {
      return this.$store.getters['requisitions/allRequisitions'];
    },
    myRequisitions() {
      const userId = localStorage.getItem('profile_id');
      return this.requisitions.filter(req => req.profile_id == userId);
    },
    vessels() {
      return this.$store.getters['vessel/allVessels'];
    },
  },

  mounted() {
    // this.userRole = this.userProfile.role;
    // fetch requisitions
    this.$store.dispatch('requisitions/fetchRequisitions');
    // fetch vessels.
    this.$store.dispatch('vessel/fetchVessels');
  },

  methods: {
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
    getNumber() {
      return this.poDetails.items.map((item, index) => {
        return item.itemNumber = + index + 1;
      })
    },
    getOptional(value) {
      return typeof value === 'number' ? value.toFixed(2) : 0.00;
    },
    startEdit(index) {
      console.log(this.poDetails.items[index])
      this.poDetails.items[index].editing = true;
      this.poDetails.items[index].tempPrice = this.poDetails.items[index].unitPrice;
    },
    cancelEdit(index) {
      this.poDetails.items[index].editing = false;
      this.poDetails.items[index].tempPrice = this.poDetails.items[index].unitPrice;
    },
    confirmPriceChange() {
      if (!this.justificationText.trim()) {
        alert('Please provide a justification for the price change.');
        return;
      }

      const item = this.poDetails.items[this.currentItemIndex];
      item.unitPrice = item.tempPrice;
      item.cost = item.tempPrice;
      item.justification = this.justificationText.trim();
      item.editing = false;

      this.closeJustificationModal();
    },
    closeJustificationModal() {
      this.showJustificationModal = false;
      this.currentItemIndex = null;
      this.justificationText = '';
    },
    savePrice(index) {
      const item = this.poDetails.items[index];
      if (item.tempPrice !== item.cost) {
        // Price changed, require justification
        this.currentItemIndex = index;
        this.showJustificationModal = true;
      } else {
        // No change, just save
        item.unitPrice = item.tempPrice;
        item.editing = false;
      }
    },
    async findInventoryFromRequisition(requisition) {
      const inventoryList = this.$store.state.inventory.inventory;
      const dispatchPromises = [];

      let hasValidItems = false;

      requisition.items.forEach((requisitionItem) => {
        const matchingInventory = inventoryList.find(item => item.id === requisitionItem.id);

        if (!matchingInventory) {
          Swal.fire({
            title: 'Not Found',
            text: `No inventory found with ID ${requisitionItem.id}. Navigate to inventory and add the item first.`,
            icon: 'error'
          });
          return;
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
            quantity: requisitionItem.qty,
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
            Swal.fire({
              title: 'Data Error',
              text: `Inventory exists but could not extract stock info.`,
              icon: 'error'
            });
          }
        }
      });

      // Run updateRequisition and feedback if at least one item succeeded
      if (hasValidItems) {
        const updatedRequisition = { ...requisition, status: 'delivered' };
        dispatchPromises.push(this.$store.dispatch('requisitions/updateRequisition', updatedRequisition));
      }

      // Execute all store actions
      if (dispatchPromises.length > 0) {
        Promise.all(dispatchPromises).then(() => {
          Swal.fire({
            title: 'Inventory Updated',
            text: 'Requisition items have been received into the inventory.',
            icon: 'success'
          });
        });
      }
    },

    acceptDelivery(id) {
      // changing status to delivered.
      // provide swal to collect information to run stockin command, like: 
      // this.updateInventory(stockData.id, stockData, item.location, item.vessel, 'stockin')
      /*
            const requisition = this.requisitions.find(r => r.id === id);
      if (!requisition) return;

      const updatedRequisition = { ...requisition, status: 'delivered'};
      this.$store.dispatch('requisitions/updateRequisition', updatedRequisition).then(() => {
        Swal.fire({
          title: 'Info Submitted',
          text: `Your response has been submitted for requisition ${req.id}.`,
          icon: 'success'
        });
      })
      updateInventory(id, stockData, location, vessel, action) {
            let actionType = {
                action: action,
                quantity: stockData.quantityReceived
            };
            const payload = { id, location, vessel, stockData, actionType };
            this.$store.dispatch('inventory/updateInventory', payload);
        },
       */
      const requisition = this.requisitions.find(r => r.id === id);
      requisition.location = 'Engine Room';
      requisition.vessel = 'MV Possiedon'
      const inventory = this.findInventoryFromRequisition(requisition);

      if (inventory && inventory.minStock !== undefined) {
        console.log(inventory)
        console.log('Min Stock:', inventory.minStock);
        console.log('Max Stock:', inventory.maxStock);
      }

    },
    async createPO(id) {
      let reqId = id;
      const { value: vendor } = await Swal.fire({
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
          const id = reqId;
          const poDate = new Date();
          const poApproved = 'Po Owner';
          // Validation
          if (!company || !contact || !email || !phone || !address) {
            Swal.showValidationMessage('Please fill in all required fields (*)');
            return false;
          }

          return { company, contact, email, phone, address, tax, shipping, id, poDate, poApproved };
        }
      });

      if (vendor) {
        this.vendorInfo = vendor;
        this.activeTab = 'po';
        const requisition = this.requisitions.find(r => r.id === id);
        this.$store.dispatch('requisitions/updateVendor', vendor)
        this.poDetails = requisition;
        this.getNumber();
        for (let item of this.poDetails.items) {
          item.tempPrice = item.cost;
          item.unitPrice = item.cost;
          item.subTotal += item.unitPrice * item.qty;
        }
      }
    },

    async openPO(id) {
      // switch to printing mode
      this.isPrinting = true;
      // Switch to PO tab
      this.activeTab = 'po';

      // Find the requisition
      const requisition = this.requisitions.find(r => r.id === id);
      this.poDetails = requisition;
      this.getNumber();

      // Process item prices
      for (let item of this.poDetails.items) {
        item.tempPrice = item.cost;
        item.unitPrice = item.cost;
        item.subTotal = item.unitPrice * item.qty;
      }

      // Wait for DOM to render with $nextTick
      this.$nextTick(async () => {
        const element = document.getElementById('po-content');

        if (!element) {
          console.error('PO element not found');
          this.isLoadingPO = false;
          return;
        }

        const options = {
          margin: 0.5,
          filename: `PO-${this.poDetails.id}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        try {
          await html2pdf().set(options).from(element).save();
        } catch (error) {
          console.error('Error generating PDF:', error);
          alert('Error generating PDF. Please try again.');
        } finally {
          // Hide loading
          this.isLoadingPO = false;
        }
      });
    }
    ,

    finishPO(id) {
      const requisition = this.requisitions.find(r => r.id === id);
      const updatedRequisition = { ...requisition, status: 'po-created' };
      this.$store.dispatch('requisitions/updateRequisition', updatedRequisition);
      this.activeTab = 'purchasing';
    },

    addItem() {
      this.form.items.push({
        id: '',
        desc: '',
        qty: 1,
        unit: 'Pieces',
        cost: 0
      })
    },

    submitInfoResponse(req) {
      const response = this.form.justification;
      if (!response || response.trim() === '') {
        Swal.fire({
          title: 'Response Required',
          text: 'Please enter a response before submitting.',
          icon: 'warning'
        });
        return;
      }

      const updatedRequisition = { ...req, status: 'under-review', justification: response };
      this.$store.dispatch('requisitions/updateRequisition', updatedRequisition).then(() => {
        Swal.fire({
          title: 'Info Submitted',
          text: `Your response has been submitted for requisition ${req.id}.`,
          icon: 'success'
        });
      })

      this.form.justification = '';
    },


    getRequisitionFields(req) {
      const statusFields = this.requisitionFieldsMap[req.status] || [];
      return [...(this.requisitionFields || []), ...statusFields];
    },

    approveRequisition(id) {
      const requisition = this.requisitions.find(r => r.id === id);
      if (requisition) {
        const updatedRequisition = { ...requisition, status: 'approved' };
        this.$store.dispatch('requisitions/updateRequisition', updatedRequisition).then(() => {
          Swal.fire({
            title: "Request Approved",
            text: `You have approved ${updatedRequisition.id}, it has moved to stage 5 (Purchase Order Generation)`,
            icon: "success"
          });
        })
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
          const updatedRequisition = { ...requisition, status: 'declined', declinedBy: this.userProfile.role, rejectionReason: result.value };
          this.$store.dispatch('requisitions/updateRequisition', updatedRequisition).then(() => {
            Swal.fire({
              title: "Request Declined",
              text: `Requisition ${id} was declined for: ${result.value}`,
              icon: "info"
            });
          })
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
          const updatedRequisition = { ...requisition, status: 'info-requested', infoRequestedBy: this.userProfile.role, requestedInfo: result.value };
          this.$store.dispatch('requisitions/updateRequisition', updatedRequisition).then(() => {
            Swal.fire({
              title: "Info Request Sent",
              text: `You requested: "${result.value}" from the requester for requisition ${id}.`,
              icon: "success"
            });
          })
        }
      });
    },

    removeItem(index) {
      this.form.items.splice(index, 1)
    },

    submitRequisition() {
      const requisition = this.collectFormData('under-review')
      this.$store.dispatch('requisitions/addRequisition', requisition);
      this.resetForm()
    },

    collectFormData(status) {
      return {
        id: 'REQ-' + Date.now(),
        requestor: this.userProfile.full_name,
        department: this.form.department,
        project: this.form.project,
        neededDate: this.form.neededDate,
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
        neededDate: '',
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

.status-under-review {
  background: #dbeafe;
  color: #1e40af;
}

.status-approved {
  background: #dcfce7;
  color: #166534;
}

.status-declined {
  background: #fee2e2;
  color: #dc2626;
}

.status-info-requested {
  background: #e8cf12;
  color: #da7212;
}

.status-po-created {
  background: #e0e7ff;
  color: #4bca38;
}

.status-pending-supply {
  background: #113fd8;
  color: #4bca38;
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

.po-content {
  padding: 40px;
}

.po-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.company-info,
.po-details {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 15px;
  border-left: 5px solid #3498db;
}

.company-info h3,
.po-details h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.info-row {
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
}

.info-label {
  font-weight: 600;
  color: #555;
}

.info-value {
  color: #2c3e50;
}

.items-section {
  margin-top: 30px;
}

.section-title {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 20px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.items-table th {
  background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
  color: white;
  padding: 15px;
  text-align: left;
  font-weight: 600;
}

.items-table td {
  padding: 15px;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
}

.items-table tr:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
  transition: all 0.3s ease;
}

.price-input {
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  width: 100px;
  transition: all 0.3s ease;
}

.price-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.price-changed {
  background: #fff3cd;
  border-color: #ffc107;
}

.edit-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.save-btn {
  background: #27ae60;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 5px;
}

.cancel-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}

.justification-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 15px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.justification-textarea {
  width: 100%;
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
}

.justification-textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.modal-buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.totals {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 25px;
  border-radius: 15px;
  margin-top: 20px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.total-row.grand-total {
  border-top: 2px solid #3498db;
  padding-top: 15px;
  margin-top: 15px;
  font-weight: bold;
  font-size: 1.3rem;
  color: #2c3e50;
}

.justification-note {
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 10px;
  margin-top: 10px;
  font-size: 12px;
  color: #856404;
}

.price-change-indicator {
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
}

@media (max-width: 768px) {
  .po-header {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .items-table {
    font-size: 14px;
  }

  .items-table th,
  .items-table td {
    padding: 10px 8px;
  }

  .price-input {
    width: 80px;
  }
}
</style>