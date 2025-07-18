<template>
    <!-- Wave background -->
    <div class="wave-bg"></div>

    <!-- Sidebar Toggle Button -->
    <button class="toggle-btn" id="sidebarToggle">
        <i class="bi bi-list"></i>
    </button>

    <!-- Sidebar -->
    <Sidebar />
    <div id="content" class="container">
        <!-- Vessels Header -->
        <div class="header">
            <div>
                <h1><i class="fas fa-ship"></i>MarineTech Inventory Management</h1>
                <div class="header-stats">
                    <div class="stat-card">
                        <div class="stat-value">{{ vessels.length }}</div>
                        <div class="stat-label">Total Vessels</div>
                    </div>
                    <div class="stat-card" v-if="selectedTab === 'inventory'">
                        <div class="stat-value">{{ totalItems }}</div>
                        <div class="stat-label">Total Items</div>
                    </div>
                    <div class="stat-card" v-if="selectedTab === 'inventory'">
                        <div class="stat-value">{{ lowStockCount }}</div>
                        <div class="stat-label">Low Stock</div>
                    </div>
                    <div class="stat-card" v-if="selectedTab === 'inventory'">
                        <div class="stat-value">₦{{ totalValue.toLocaleString() }}</div>
                        <div class="stat-label">Total Value</div>
                    </div>
                </div>
            </div>
            <div class="header-actions">
                <!-- Tabs -->
                <div class="tabs">
                    <button class="tab" :class="{ active: selectedTab === 'overview' }" @click="selectedTab = 'overview'">
                        <i class="fas fa-chart-bar"></i>
                        Overview
                    </button>
                    <button class="tab" :class="{ active: selectedTab === 'inventory' }" @click="selectedTab = 'inventory'">
                        <i class="fas fa-boxes"></i>
                        Inventory
                    </button>
                    <button class="tab" :class="{ active: selectedTab === 'vessels' }" @click="selectedTab = 'vessels'">
                        <i class="fas fa-ship"></i>
                        Vessels
                    </button>
                </div>
            </div>
        </div>
        <!-- Inventory Table -->
        <div class="inventory-table" v-if="selectedTab === 'inventory'">

            <!-- Low Stock Alerts -->
            <div v-if="lowStockItems.length > 0" class="low-stock-alerts">
                <div class="alert-header">
                    <i class="fas fa-exclamation-triangle"></i>
                    Low Stock Alerts ({{ lowStockItems.length }} items)
                </div>
                <ul class="alert-list">
                    <li v-for="item in lowStockItems" :key="item.id">
                        <strong>{{ item.itemName }}</strong> - {{ item.vessel }} ({{ item.currentStock }}/{{ item.minStock
                        }} {{ item.unit }})
                    </li>
                </ul>
            </div>

            <!-- Controls -->
            <div class="controls">
                <div class="controls-row">
                    <div class="search-box">
                        <input type="text" placeholder="Search items, vessels, or categories..." v-model="searchTerm">
                        <i class="fas fa-search"></i>
                    </div>
                    <select v-model="selectedVessel" class="filter-select">
                        <option value="">All Vessels</option>
                        <option v-for="vessel in vessels" :key="vessel" :value="vessel.name">{{ vessel.name }}</option>
                    </select>
                    <select v-model="selectedCategory" class="filter-select">
                        <option value="">All Categories</option>
                        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                    </select>
                    <button class="btn btn-primary" @click="addNewItem">
                        <i class="fas fa-plus"></i>
                        Add Item
                    </button>
                    <button class="btn btn-secondary" @click="exportData">
                        <i class="fas fa-download"></i>
                        Export
                    </button>
                    <button class="btn btn-secondary" @click="importData">
                        <i class="fas fa-upload"></i>
                        Import
                    </button>
                </div>
            </div>
            <div class="table-responsive item-row">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>Category</th>
                            <th>Vessel</th>
                            <th>Location</th>
                            <th>Stock Level</th>
                            <th>Status</th>
                            <th>Last Updated</th>
                            <th>Value</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in filteredInventory" :key="item.id" :class="{ 'inactive-item': !item.active }">
                            <td><strong>{{ item.id }}</strong></td>
                            <td>{{ item.itemName }}</td>
                            <td>{{ item.category }}</td>
                            <td>{{ item.vessel }}</td>
                            <td>
                                <i class="fas fa-map-marker-alt"></i>
                                {{ item.location }}
                            </td>
                            <td>
                                <div class="stock-level">
                                    <span>{{ item.currentStock }}</span>
                                    <div class="stock-bar">
                                        <div class="stock-fill" :class="getStockClass(item)"
                                            :style="{ width: getStockPercentage(item) + '%' }"></div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge" :class="getStatusClass(item.status)">
                                    {{ item.status }}
                                </span>
                            </td>
                            <td>
                                <i class="fas fa-calendar"></i>
                                {{ formatDate(item.lastUpdated) }}
                            </td>
                            <td>₦{{ item.value.toLocaleString() }}</td>
                            <td>
                                <div class="action-btns">
                                    <button class="action-btn btn-view" @click="stockIn(item)" title="Stock In">
                                        <i class="fa-solid fa-arrow-trend-up"></i>
                                    </button>
                                    <button class="action-btn btn-view" @click="stockOut(item)" title="Stock Out">
                                        <i class="fa-solid fa-arrow-trend-down"></i>
                                    </button>
                                    <button class="action-btn btn-view" @click="transferItem(item)" title="Transfer Item">
                                        <i class="fa-solid fa-arrow-up-from-bracket"></i>
                                    </button>
                                    <button class="action-btn btn-edit" @click="editItem(item)" title="Edit Item">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="action-btn btn-delete" @click="deleteItem(item)"
                                        :title="item.active ? 'Mark as Inactive' : 'Mark as Active'">
                                        <i :class="[
                                            'fa',
                                            item.active ? 'fa-trash' : 'fa-check-circle',
                                            'icon-button'
                                        ]" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="filteredInventory.length === 0" class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>No items found</h3>
                <p>Try adjusting your search or filters</p>
            </div>

            <!-- Pagination -->
            <div class="pagination" v-if="filteredInventory.length > 0">
                <button @click="prevPage" :disabled="currentPage === 1">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button v-for="page in totalPages" :key="page" @click="currentPage = page"
                    :class="{ active: currentPage === page }">
                    {{ page }}
                </button>
                <button @click="nextPage" :disabled="currentPage === totalPages">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>

        <!-- Overview Tab Content -->
        <div v-if="selectedTab === 'overview'" class="inventory-table">
            <div style="padding: 40px; text-align: center;">
                <div class="dashboard div-responsive">

                    <div class="charts-grid">
                        <div class="chart-card">
                            <h3 class="chart-title">Inventory by Category</h3>
                            <div class="chart-container">
                                <canvas ref="categoryChart"></canvas>
                            </div>
                        </div>

                        <div class="chart-card">
                            <h3 class="chart-title">Stock Status Distribution</h3>
                            <div class="chart-container">
                                <canvas ref="stockChart"></canvas>
                            </div>
                        </div>

                        <div class="chart-card full-width">
                            <h3 class="chart-title">Stock In/Out/Transfer (Last 6 Months)</h3>
                            <div class="">
                                <canvas ref="activityChart"></canvas>
                            </div>
                        </div>

                        <div class="chart-card full-width">
                            <h3 class="chart-title">Inventory Value Trend (Last 6 Months)</h3>
                            <div class="chart-container">
                                <canvas ref="trendChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Vessels Tab Content -->
        <div v-if="selectedTab === 'vessels'" class="inventory-table">
            <!-- Vessels Grid -->
            <div class="vessels-grid">
                <div class="vessel-card" v-for="vessel in vessels" :key="vessel.id" @click="inventoryVessel(vessel.name)">
                    <div class="vessel-header">
                        <div class="vessel-icon">
                            <i class="fas fa-ship"></i>
                        </div>
                        <div class="vessel-status">
                            {{ vessel.status || 'Active' }}
                        </div>
                    </div>
                    <div class="vessel-info">
                        <h3 class="vessel-name">{{ vessel.name }}</h3>
                        <p class="vessel-reg">{{ vessel.registrationNumber }}</p>
                        <div class="vessel-stats">
                            <div class="vessel-stat">
                                <i class="fas fa-boxes"></i>
                                <span>{{ getVesselItemCount(vessel.name) }} Inventory Items</span>
                            </div>
                        </div>
                    </div>
                    <div class="vessel-actions">
                        <div class="vessel-btn" :class="getVesselLowStockCount(vessel.name) === 0 ? 'green-btn' : 'red-btn'"
                            title="Edit Vessel">
                            {{ getVesselLowStockCount(vessel.name) }}
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- Inventory Tab by Vessels -->
        <div v-if="showModal && vesselInventory.length === 0 && this.selectedTab == 'vessels'" class="empty-state">
            <i class="fas fa-box-open"></i>
            <h3>No items found</h3>
            <p>Try adjusting your search or filters</p>
        </div>
        <div v-if="showModal && vesselInventory.length > 0 && this.selectedTab == 'vessels'" class="table-responsive">
            <!-- Controls -->
            <div class="controls">
                <div class="controls-row">
                    <button class="btn btn-primary" @click="addNewItem">
                        <i class="fas fa-plus"></i>
                        Add Item
                    </button>
                    <button class="btn btn-secondary" @click="exportData">
                        <i class="fas fa-download"></i>
                        Export
                    </button>
                    <button class="btn btn-secondary" @click="importData">
                        <i class="fas fa-upload"></i>
                        Import
                    </button>
                </div>
            </div>
            <div class="table-responsive item-row">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>Category</th>
                            <th>Vessel</th>
                            <th>Location</th>
                            <th>Stock Level</th>
                            <th>Status</th>
                            <th>Last Updated</th>
                            <th>Value</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in vesselInventory" :key="item.id" :class="{ 'inactive-item': !item.active }">
                            <td><strong>{{ item.id }}</strong></td>
                            <td>{{ item.itemName }}</td>
                            <td>{{ item.category }}</td>
                            <td>{{ item.vessel }}</td>
                            <td>
                                <i class="fas fa-map-marker-alt"></i>
                                {{ item.location }}
                            </td>
                            <td>
                                <div class="stock-level">
                                    <span>{{ item.currentStock }}</span>
                                    <div class="stock-bar">
                                        <div class="stock-fill" :class="getStockClass(item)"
                                            :style="{ width: getStockPercentage(item) + '%' }"></div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge" :class="getStatusClass(item.status)">
                                    {{ item.status }}
                                </span>
                            </td>
                            <td>
                                <i class="fas fa-calendar"></i>
                                {{ formatDate(item.lastUpdated) }}
                            </td>
                            <td>₦{{ item.value.toLocaleString() }}</td>
                            <td>
                                <div class="action-btns">
                                    <button class="action-btn btn-view" @click="stockIn(item)" title="Stock In">
                                        <i class="fa-solid fa-arrow-trend-up"></i>
                                    </button>
                                    <button class="action-btn btn-view" @click="stockOut(item)" title="Stock Out">
                                        <i class="fa-solid fa-arrow-trend-down"></i>
                                    </button>
                                    <button class="action-btn btn-view" @click="transferItem(item)" title="Transfer Item">
                                        <i class="fa-solid fa-arrow-up-from-bracket"></i>
                                    </button>
                                    <button class="action-btn btn-edit" @click="editItem(item)" title="Edit Item">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="action-btn btn-delete" @click="deleteItem(item)"
                                        :title="item.active ? 'Archive Item' : 'Restore Item'">
                                        <i :class="[
                                            'fa',
                                            item.active ? 'fa-box-archive' : 'fa-undo',
                                            'icon-button'
                                        ]" aria-hidden="true"></i>
                                    </button>

                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import VesselList from '../components/VesselList.vue';
import Chart from 'chart.js/auto';

export default {
    name: 'inventory',
    components: { Sidebar, VesselList },

    data() {
        return {
            selectedTab: 'vessels',
            showModal: false,
            searchTerm: '',
            selectedVessel: '',
            selectedCategory: '',
            currentPage: 1,
            itemsPerPage: 10,
            categories: [
                'Engine Parts',
                'Safety Equipment',
                'Electronics',
                'Deck Equipment',
                'Navigation',
                'Communication',
                'Tools',
                'Consumables',
                'Other'
            ],
            locations: [
                'Engine Room',
                'Bridge',
                'Main Deck',
                'Cargo Hold',
                'Workshop',
                'Storage Room',
                'Galley',
                'Other'
            ],
            statusOptions: [
                'Available',
                'Low',
                'Out',
                'Reserved',
                'Maintenance',
                'Damaged'
            ]
        }
    },
    computed: {
        vesselInventory() {
            if (!this.selectedVessel) return [];
            return this.inventoryData.filter(item => item.vessel === this.selectedVessel);
        },

        filteredInventory() {
            let filtered = this.inventoryData;

            // Search filter
            if (this.searchTerm) {
                const search = this.searchTerm.toLowerCase();
                filtered = filtered.filter(item =>
                    item.itemName.toLowerCase().includes(search) ||
                    item.category.toLowerCase().includes(search) ||
                    item.vessel.toLowerCase().includes(search) ||
                    item.id.toLowerCase().includes(search)
                );
            }

            // Vessel filter
            if (this.selectedVessel) {
                filtered = filtered.filter(item => item.vessel === this.selectedVessel);
            }

            // Category filter
            if (this.selectedCategory) {
                filtered = filtered.filter(item => item.category === this.selectedCategory);
            }

            return filtered;
        },
        vessels() {
            return this.$store.getters['vessel/allVessels'];
        },
        inventoryData() {
            return this.$store.getters['inventory/allInventory'];
        },
        categories() {
            return [...new Set(this.inventoryData.map(item => item.category))];
        },
        totalItems() {
            return this.inventoryData.length;
        },
        lowStockItems() {
            return this.inventoryData.filter(item =>
                item.currentStock <= item.minStock || item.status === 'Low Stock' || item.status === 'Out of Stock'
            );
        },
        lowStockCount() {
            return this.lowStockItems.length;
        },
        activeVessels() {
            return this.vessels.length;
        },
        totalValue() {
            return this.inventoryData.reduce((sum, item) => sum + item.value, 0);
        },
        totalPages() {
            return Math.ceil(this.filteredInventory.length / this.itemsPerPage);
        },
        categoryData() {
            const categories = {};
            this.filteredInventory.forEach(item => {
                categories[item.category] = (categories[item.category] || 0) + item.currentStock;
            });
            return categories;
        },
        stockStatusData() {
            const status = { Available: 0, Over: 0, Low: 0, Out: 0 };
            this.filteredInventory.forEach(item => {
                status[item.status]++;
            });
            return status;
        },
    },
    watch: {
        selectedTab(newTab) {
            if (newTab === 'overview') {
                this.$nextTick(() => {
                    this.createCharts();
                });
            }
        },
        filteredInventory: {
            handler() {
                if (this.$refs.categoryChart) {
                    this.updateCharts();
                }
            },
            deep: true
        }
    },
    mounted() {
        // fetch vessels.
        this.$store.dispatch('vessel/fetchVessels');
        // fetch inventory
        this.$store.dispatch('inventory/fetchInventory');
    },
    methods: {
        inventoryVessel(vesselName) {
            this.selectedVessel = vesselName;
            this.showModal = true;
        },
        getVesselLowStockCount(vesselName) {
            return this.inventoryData.filter(item =>
                item.vessel === vesselName &&
                item.currentStock <= item.minStock
            ).length;
        },
        getVesselItemCount(vesselName) {
            return this.inventoryData.filter(item => item.vessel === vesselName).length;
        },
        getStatusClass(status) {
            switch (status) {
                case 'In Stock':
                    return 'status-in-stock';
                case 'Low':
                    return 'status-low-stock';
                case 'Out':
                    return 'status-out-of-stock';
                case 'Over':
                    return 'status-critical';
                default:
                    return 'status-in-stock';
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
        getStockClass(item) {
            const percentage = (item.currentStock / item.maxStock) * 100;
            if (percentage <= 25) return 'stock-danger';
            if (percentage <= 50) return 'stock-warning';
            return 'stock-good';
        },
        getStockPercentage(item) {
            return Math.min(100, (item.currentStock / item.maxStock) * 100);
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        },
        exportData() {
            alert('Export functionality will be implemented');
        },
        importData() {
            alert('Import functionality will be implemented');
        },
        updateInventory(id, stockData, location, vessel, action) {
            let actionType = {
                action: action,
                quantity: stockData.quantityReceived
            };
            const payload = { id, location, vessel, stockData, actionType };
            this.$store.dispatch('inventory/updateInventory', payload);
        },
        stockIn(item) {
            Swal.fire({
                title: 'Stock-In Entry',
                html: `
                    <p style="color: #6c757d; margin-bottom: 25px; font-size: 16px;">
                        Add new inventory items to your stock
                    </p>
                    <div class="form-group">
                        <label class="custom-input-label" for="quantityReceived">Quantity Received <span class="required">*</span></label>
                        <input class="custom-input" type="number" id="quantityReceived" placeholder="Enter quantity received" min="1" required>
                    </div>
                    <div class="form-group">
                        <label class="custom-input-label" for="unitPrice">Unit Price <span class="required">*</span></label>
                        <input class="custom-input" type="number" id="unitPrice" placeholder="Enter unit price" step="0.01" min="0" required>
                    </div>
                    <div class="form-group">
                        <label class="custom-input-label" for="dateReceived">Date Received</label>
                        <input class="custom-input" type="date" id="dateReceived">
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Add Stock',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#6c757d',
                width: '500px',
                customClass: {
                    popup: 'swal-custom-popup'
                },
                preConfirm: () => {
                    const quantityReceived = document.getElementById('quantityReceived').value;
                    const unitPrice = document.getElementById('unitPrice').value;
                    const dateReceived = document.getElementById('dateReceived').value;

                    if (!quantityReceived || quantityReceived <= 0) {
                        Swal.showValidationMessage('Valid quantity received is required');
                        return false;
                    }
                    if (!unitPrice || unitPrice < 0) {
                        Swal.showValidationMessage('Valid unit price is required');
                        return false;
                    }
                    const currentStock = parseInt(quantityReceived) + item.currentStock;
                    return {
                        currentStock: currentStock,
                        // unitPrice: parseFloat(unitPrice),
                        // supplier: supplier.trim(),
                        // dateReceived: dateReceived || new Date().toISOString().split('T')[0],
                        status: this.getStockStatus(currentStock, item.minStock, item.maxStock),
                        maxStock: item.maxStock,
                        minStock: item.minStock,
                        value: parseInt(quantityReceived) * parseFloat(unitPrice) + item.value,
                        id: item.id
                    };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const stockData = result.value;
                    this.updateInventory(stockData.id, stockData, item.location, item.vessel, 'stockin')
                }
            })
        },
        stockOut(item) {
            Swal.fire({
                title: 'Stock-Out Entry',
                html: `
                    <p style="color: #6c757d; margin-bottom: 25px; font-size: 16px;">
                        Remove inventory items to your stock
                    </p>
                    <div class="form-group">
                        <label class="custom-input-label" for="quantityReceived">Quantity Removed <span class="required">*</span></label>
                        <input class="custom-input" type="number" id="quantityReceived" placeholder="Enter quantity removed" min="1" required>
                    </div>
                    <div class="form-group">
                        <label class="custom-input-label" for="dateReceived">Date Received</label>
                        <input class="custom-input" type="date" id="dateReceived">
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Remove Stock',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#6c757d',
                width: '500px',
                customClass: {
                    popup: 'swal-custom-popup'
                },
                preConfirm: () => {
                    const quantityReceived = document.getElementById('quantityReceived').value;
                    const dateReceived = document.getElementById('dateReceived').value;

                    if (!quantityReceived || quantityReceived <= 0) {
                        Swal.showValidationMessage('Valid quantity received is required');
                        return false;
                    }

                    const currentStock = item.currentStock - parseInt(quantityReceived);
                    const unitPrice = this.getUnitPriceForItem(item.id);
                    return {
                        currentStock: currentStock,
                        // unitPrice: parseFloat(unitPrice),
                        // supplier: supplier.trim(),
                        // dateReceived: dateReceived || new Date().toISOString().split('T')[0],
                        status: this.getStockStatus(currentStock, item.minStock, item.maxStock),
                        maxStock: item.maxStock,
                        minStock: item.minStock,
                        value: item.value - parseInt(quantityReceived) * parseFloat(unitPrice),
                        id: item.id
                    };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const stockData = result.value;
                    this.updateInventory(stockData.id, stockData, item.location, item.vessel, 'stockout')
                }
            })
        },
        transferItemAction(item, newLocation, transferQuantity, location, vessel) {
            const existingItem = this.inventoryData.find(entry =>
                entry.id === item.id && entry.location === location && entry.vessel === vessel
            );
            if (existingItem && existingItem.location === newLocation && existingItem.vessel === item.vessel) {
                Swal.fire({
                    title: 'Chose a different product',
                    text: 'You cannot move an item to the same location. Either you change location, vessel, or try the stock in action.',
                    icon: 'info',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                // Create full new item with copied fields
                let inventory = {
                    itemId: item.id,
                    itemname: existingItem.itemName,
                    value: parseInt(item.value),
                    status: this.getStockStatus(transferQuantity, existingItem.minStock, existingItem.maxStock),
                    category: existingItem.category,
                    vessel: item.vessel,
                    currentstock: parseFloat(transferQuantity),
                    lastupdated: new Date().toISOString().split('T')[0],
                    location: newLocation,
                    maxStock: existingItem.maxStock,
                    minStock: existingItem.minStock,
                }

                this.$store.dispatch('inventory/addInventory', inventory);

                let id = item.id;
                let stockData = {
                    status: this.getStockStatus(existingItem.currentStock - transferQuantity, existingItem.minStock, existingItem.maxStock),
                    currentStock: existingItem.currentStock - transferQuantity,
                    value: existingItem.value - parseInt(item.value)
                }
                let action = 'transfer';

                let actionType = {
                    action: action,
                    quantity: transferQuantity
                };

                const payload = { id, location, vessel, stockData, actionType };
                this.$store.dispatch('inventory/updateInventory', payload);
            }

            // Optionally recalculate `status` for both entries
        },
        transferItem(item) {
            Swal.fire({
                title: 'Transfer Entry',
                html: `
                    <p style="color: #6c757d; margin-bottom: 25px; font-size: 16px;">
                        Transfer inventory item from one location to another. If the item is already part of your stock, it will be added. Else,
                        a new entry will be created.
                    </p>
                    <div class="form-group">
                        <label class="custom-input-label" for="quantityReceived">Quantity to Transfer <span class="required">*</span></label>
                        <input class="custom-input" type="number" id="quantityReceived" placeholder="Enter quantity to transfer" min="1" required>
                    </div>
                    <div class="form-group">
                        <label class="custom-input-label" for="location">Location</label>
                        <select id="location" required>
                            <option value="">-- Select Location --</option>
                            ${this.locations.map(loc => `<option value="${loc}">${loc}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="vessel">Vessel <span class="required">*</span></label>
                        <select id="vessel" required>
                            <option value="">-- Select Vessel --</option>
                            ${this.vessels.map(vessel => `<option value="${vessel.name}">${vessel.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="custom-input-label" for="dateReceived">Date Transfered</label>
                        <input class="custom-input" type="date" id="dateReceived">
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Transfer Stock',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#6c757d',
                width: '500px',
                customClass: {
                    popup: 'swal-custom-popup'
                },
                preConfirm: () => {
                    const quantityReceived = document.getElementById('quantityReceived').value;
                    const location = document.getElementById('location').value;
                    const vessel = document.getElementById('vessel').value;
                    const dateReceived = document.getElementById('dateReceived').value;

                    if (!quantityReceived || quantityReceived <= 0) {
                        Swal.showValidationMessage('Valid quantity received is required');
                        return false;
                    }
                    if (!location) {
                        Swal.showValidationMessage('Valid location is required');
                        return false;
                    }
                    const unitPrice = this.getUnitPriceForItem(item.id);
                    return {
                        quantity: parseInt(quantityReceived),
                        // unitPrice: parseFloat(unitPrice),
                        // supplier: supplier.trim(),
                        // dateReceived: dateReceived || new Date().toISOString().split('T')[0],
                        value: parseInt(quantityReceived) * parseFloat(unitPrice),
                        id: item.id,
                        vessel: vessel,
                        location: location
                    };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const stockData = result.value;
                    this.transferItemAction(stockData, stockData.location, stockData.quantity, item.location, item.vessel)
                }
            })
        },
        editItem(item) {
            Swal.fire({
                title: 'Adjust your Stock Entry',
                html: `
                    <p style="color: #6c757d; margin-bottom: 25px; font-size: 16px;">
                        Stock Adjustment is used to manually correct inventory levels when there’s a discrepancy between the actual physical stock and the recorded stock in your system.
                        This can happen due to counting errors, theft, breakage, or unrecorded usage.
                    </p>
                    <div class="form-group">
                        <label class="custom-input-label" for="quantityReceived">Quantity<span class="required">*</span></label>
                        <input class="custom-input" type="number" id="quantityReceived" placeholder="Enter quantity" min="1" required>
                    </div>
                    <div class="form-group">
                        <label class="custom-input-label" for="adjustmentType">Adjustment Type</label>
                        <select id="category" required>
                            <option value="increase">Increase</option>
                            <option value="decrease">Decrease</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="custom-input-label" for="dateReceived">Date Received</label>
                        <input class="custom-input" type="datetime-local" id="dateReceived">
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Adjust Stock',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#6c757d',
                width: '500px',
                customClass: {
                    popup: 'swal-custom-popup'
                },
                preConfirm: () => {
                    const quantityReceived = document.getElementById('quantityReceived').value;
                    const dateReceived = document.getElementById('dateReceived').value;
                    const adjustmentType = document.getElementById('category').value;
                    const unitPrice = this.getUnitPriceForItem(item.id);

                    if (!quantityReceived || quantityReceived <= 0) {
                        Swal.showValidationMessage('Valid quantity received is required');
                        return false;
                    }

                    if (adjustmentType == 'increase') {
                        const currentStock = item.currentStock + parseInt(quantityReceived);
                        return {
                            currentStock: currentStock,
                            // unitPrice: parseFloat(unitPrice),
                            // supplier: supplier.trim(),
                            // dateReceived: dateReceived || new Date().toISOString().split('T')[0],
                            status: this.getStockStatus(currentStock, item.minStock, item.maxStock),
                            maxStock: item.maxStock,
                            minStock: item.minStock,
                            value: item.value + parseInt(quantityReceived) * parseFloat(unitPrice),
                            id: item.id
                        };
                    } else {
                        const currentStock = item.currentStock - parseInt(quantityReceived);
                        return {
                            currentStock: currentStock,
                            // unitPrice: parseFloat(unitPrice),
                            // supplier: supplier.trim(),
                            // dateReceived: dateReceived || new Date().toISOString().split('T')[0],
                            status: this.getStockStatus(currentStock, item.minStock, item.maxStock),
                            maxStock: item.maxStock,
                            minStock: item.minStock,
                            value: item.value - parseInt(quantityReceived) * parseFloat(unitPrice),
                            id: item.id
                        };
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const stockData = result.value;
                    this.updateInventory(stockData.id, stockData, item.location, item.vessel, 'edit')
                }
            })
        },
        deleteItem(item) {
            const isArchiving = item.active;

            Swal.fire({
                title: isArchiving ? 'Archive this stock?' : 'Unarchive this stock?',
                text: isArchiving
                    ? "We will archive this stock and you can retrieve it anytime."
                    : "We will restore this stock to active inventory.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: isArchiving ? '#d33' : '#3085d6',
                cancelButtonColor: '#aaa',
                confirmButtonText: isArchiving ? 'Yes, archive it!' : 'Yes, unarchive it!',
            }).then((result) => {
                if (result.isConfirmed) {
                    item.active = !item.active;

                    Swal.fire({
                        icon: 'success',
                        title: isArchiving ? 'Archived!' : 'Restored!',
                        text: isArchiving
                            ? 'The stock has been archived.'
                            : 'The stock has been restored.',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            });
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        async addNewItem() {
            const { value: formValues } = await Swal.fire({
                title: 'Add Inventory Item',
                html: `
                    <div class="inventory-form-container">
                        <style>
                            .inventory-form-container {
                                text-align: left;
                                max-height: 500px;
                                overflow-y: auto;
                            }
                            .form-row {
                                display: flex;
                                gap: 15px;
                                margin-bottom: 15px;
                            }
                            .form-group {
                                flex: 1;
                                display: flex;
                                flex-direction: column;
                            }
                            .form-group label {
                                font-weight: 600;
                                margin-bottom: 5px;
                                color: #333;
                                font-size: 14px;
                            }
                            .form-group input,
                            .form-group select,
                            .form-group textarea {
                                padding: 8px 12px;
                                border: 1px solid #ddd;
                                border-radius: 4px;
                                font-size: 14px;
                                box-sizing: border-box;
                            }
                            .form-group input:focus,
                            .form-group select:focus,
                            .form-group textarea:focus {
                                outline: none;
                                border-color: #007bff;
                                box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
                            }
                            .full-width {
                                width: 100%;
                            }
                            .required {
                                color: #dc3545;
                            }
                        </style>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="itemCode">Item Code <span class="required">*</span></label>
                                <input type="text" id="itemCode" placeholder="e.g., ENG-001" required>
                            </div>
                            <div class="form-group">
                                <label for="itemName">Item Name <span class="required">*</span></label>
                                <input type="text" id="itemName" placeholder="Enter item name" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="category">Category <span class="required">*</span></label>
                                <select id="category" required>
                                    <option value="">-- Select Category --</option>
                                    ${this.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                                </select>
                                <input type="text" id="customCategory" placeholder="Enter custom category" style="margin-top: 8px; display: none;">
                            </div>
                            <div class="form-group">
                                <label for="vessel">Vessel <span class="required">*</span></label>
                                <select id="vessel" required>
                                    <option value="">-- Select Vessel --</option>
                                    ${this.vessels.map(vessel => `<option value="${vessel.name}">${vessel.name}</option>`).join('')}
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="location">Location <span class="required">*</span></label>
                                <select id="location" required>
                                    <option value="">-- Select Location --</option>
                                    ${this.locations.map(loc => `<option value="${loc}">${loc}</option>`).join('')}
                                </select>
                                <input type="text" id="customLocation" placeholder="Enter custom location" style="margin-top: 8px; display: none;">
                            </div>
                            <div class="form-group">
                                <label for="stockLevel">Stock Level <span class="required">*</span></label>
                                <input type="number" id="stockLevel" placeholder="0" min="0" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="minStock">Minimum Stock Value <span class="required">*</span></label>
                                <input type="number" id="minStock" placeholder="0" min="0" step="1">
                            </div>
                            <div class="form-group">
                                <label for="maxStock">Maximum Stock Value <span class="required">*</span></label>
                                <input type="number" id="maxStock" placeholder="1" min="1" step="2">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group full-width">
                                <label for="value">Value (₦) Unit Price</label>
                                <input type="number" id="value" placeholder="0.00" min="0" step="0.01">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group full-width">
                                <label for="lastUpdated">Last Updated</label>
                                <input type="datetime-local" id="lastUpdated">
                            </div>
                        </div>
                    </div>
                `,
                width: '600px',
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Add Item',
                cancelButtonText: 'Cancel',
                preConfirm: () => {
                    // Get form values
                    const itemCode = document.getElementById('itemCode').value;
                    const itemName = document.getElementById('itemName').value;
                    const category = document.getElementById('category').value;
                    const customCategory = document.getElementById('customCategory').value;
                    const vessel = document.getElementById('vessel').value;
                    const location = document.getElementById('location').value;
                    const customLocation = document.getElementById('customLocation').value;
                    const stockLevel = document.getElementById('stockLevel').value;
                    const minStock = document.getElementById('minStock').value;
                    const maxStock = document.getElementById('maxStock').value;
                    const value = document.getElementById('value').value;
                    const lastUpdated = document.getElementById('lastUpdated').value;

                    // Validation
                    if (!itemCode.trim()) {
                        Swal.showValidationMessage('Item Code is required');
                        return false;
                    }
                    if (!itemName.trim()) {
                        Swal.showValidationMessage('Item Name is required');
                        return false;
                    }
                    if (!category) {
                        Swal.showValidationMessage('Category is required');
                        return false;
                    }
                    if (category === 'Other' && !customCategory.trim()) {
                        Swal.showValidationMessage('Please specify custom category');
                        return false;
                    }
                    if (!vessel) {
                        Swal.showValidationMessage('Vessel is required');
                        return false;
                    }
                    if (!location) {
                        Swal.showValidationMessage('Location is required');
                        return false;
                    }
                    if (location === 'Other' && !customLocation.trim()) {
                        Swal.showValidationMessage('Please specify custom location');
                        return false;
                    }
                    if (!stockLevel || stockLevel < 0) {
                        Swal.showValidationMessage('Valid stock level is required');
                        return false;
                    }
                    if (!minStock || minStock < 0) {
                        Swal.showValidationMessage('Minimum stock is required to calculate status');
                        return false;
                    }
                    if (!maxStock || maxStock < 0) {
                        Swal.showValidationMessage('Maximum stock is required to calculate status');
                        return false;
                    }

                    // Return processed data
                    return {
                        id: itemCode.trim(),
                        itemName: itemName.trim(),
                        category: category === 'Other' ? customCategory.trim() : category,
                        vessel: vessel,
                        location: location === 'Other' ? customLocation.trim() : location,
                        currentStock: parseInt(stockLevel),
                        status: this.getStockStatus(stockLevel, minStock, maxStock),
                        maxStock: maxStock,
                        minStock: minStock,
                        value: value ? parseFloat(value) * parseInt(stockLevel) : null,
                        active: true,
                        lastUpdated: lastUpdated || new Date().toISOString()
                    };
                },
                didOpen: () => {
                    // Set default last updated to current datetime
                    const now = new Date();
                    const localDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
                    document.getElementById('lastUpdated').value = localDateTime;

                    // Handle "Other" option for category
                    const categorySelect = document.getElementById('category');
                    const customCategoryInput = document.getElementById('customCategory');
                    categorySelect.addEventListener('change', () => {
                        if (categorySelect.value === 'Other') {
                            customCategoryInput.style.display = 'block';
                            customCategoryInput.required = true;
                        } else {
                            customCategoryInput.style.display = 'none';
                            customCategoryInput.required = false;
                            customCategoryInput.value = '';
                        }
                    });

                    // Handle "Other" option for location
                    const locationSelect = document.getElementById('location');
                    const customLocationInput = document.getElementById('customLocation');
                    locationSelect.addEventListener('change', () => {
                        if (locationSelect.value === 'Other') {
                            customLocationInput.style.display = 'block';
                            customLocationInput.required = true;
                        } else {
                            customLocationInput.style.display = 'none';
                            customLocationInput.required = false;
                            customLocationInput.value = '';
                        }
                    });
                }
            });

            if (formValues) {
                // Process the form data
                await this.addInventoryItem(formValues);
            }
        },

        async addInventoryItem(itemData) {
            try {
                // Add to your data store, API, etc.
                // this.inventoryData.push(itemData)

                // Example: Add to Vuex store
                // await this.$store.dispatch('inventory/addItem', itemData);

                // Example: Save to localStorage
                // const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
                // inventory.push({ ...itemData, id: Date.now() });
                // localStorage.setItem('inventory', JSON.stringify(inventory));
                let inventory = {
                    itemId: itemData.id,
                    itemname: itemData.itemName,
                    value: itemData.value,
                    status: itemData.status,
                    category: itemData.category,
                    vessel: itemData.vessel,
                    currentstock: itemData.currentStock,
                    lastupdated: itemData.lastUpdated,
                    location: itemData.location,
                    maxStock: itemData.maxStock,
                    minStock: itemData.minStock
                }

                this.$store.dispatch('inventory/addInventory', inventory);

            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to add inventory item. Please try again.',
                    icon: 'error'
                });
                console.error('Error adding inventory item:', error);
            }
        },
        // useful for calculating unit price in stockout, transfer, and edit.
        getUnitPriceForItem(id) {
            const matchingItems = this.inventoryData.filter(item => item.id === id);

            const totalValue = matchingItems.reduce((sum, item) => sum + (item.value), 0);
            const totalStock = matchingItems.reduce((sum, item) => sum + item.currentStock, 0);

            if (totalStock === 0) {
                return 0;
            }

            const unitPrice = totalValue / totalStock;

            return unitPrice;
        },
        getInventoryChartData() {
            const now = new Date();
            const months = [];
            const monthLabels = [];
            const actionTypes = ['stockin', 'stockout', 'transfer'];

            // Step 1: Get last 6 months
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // e.g. "2025-06"
                months.push(key);
                monthLabels.push(d.toLocaleString('default', { month: 'short', year: 'numeric' })); // e.g. "Jun 2025"
            }

            // Step 2: Initialize counters
            const dataMap = {
                stockin: Array(6).fill(0),
                stockout: Array(6).fill(0),
                transfer: Array(6).fill(0)
            };

            // Step 3: Loop through inventoryData
            this.inventoryData.forEach(item => {
                const actions = Array.isArray(item.actionType) ? item.actionType : [item.actionType];

                actions.forEach(action => {
                    if (!action || !action.date || !action.action) return;

                    const date = new Date(action.date);
                    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    const monthIndex = months.indexOf(key);

                    if (monthIndex !== -1 && dataMap[action.action?.toLowerCase()]) {
                        dataMap[action.action.toLowerCase()][monthIndex]++;
                    }
                });
            });

            // Step 4: Build chart config
            return {
                labels: monthLabels,
                datasets: [
                    {
                        label: 'Stock In',
                        data: dataMap.stockin,
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        tension: 0.4
                    },
                    {
                        label: 'Stock Out',
                        data: dataMap.stockout,
                        borderColor: '#F44336',
                        backgroundColor: 'rgba(244, 67, 54, 0.2)',
                        tension: 0.4
                    },
                    {
                        label: 'Transfer',
                        data: dataMap.transfer,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        tension: 0.4
                    }
                ]
            };
        },

        createCharts() {
            this.createCategoryChart();
            this.createStockChart();
            this.createTrendChart();
            this.createStocksChart();
        },
        createStocksChart() {
            // 3️⃣ Stock In / Out Activity Line Chart
            const activityCtx = this.$refs.activityChart.getContext('2d');
            const chartData = this.getInventoryChartData();
            this.stocksChartInstance = new Chart(activityCtx, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: chartData.datasets
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        },
        createCategoryChart() {
            const ctx = this.$refs.categoryChart.getContext('2d');
            const data = this.categoryData;

            this.categoryChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(data),
                    datasets: [{
                        data: Object.values(data),
                        backgroundColor: [
                            '#3b82f6', '#06b6d4', '#8b5cf6', '#10b981',
                            '#f59e0b', '#ef4444', '#84cc16', '#f97316'
                        ],
                        borderWidth: 0,
                        hoverBorderWidth: 2,
                        hoverBorderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#171819',
                                padding: 15,
                                usePointStyle: true
                            }
                        }
                    }
                }
            });
        },
        createStockChart() {
            const ctx = this.$refs.stockChart.getContext('2d');
            const data = this.stockStatusData;

            this.stockChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Available Stock', 'Over Stock', 'Low Stock', 'Out Stock'],
                    datasets: [{
                        data: [data.Available, data.Over, data.Low, data.Out],
                        backgroundColor: ['#22c55e', '#5b21b6', '#f59e0b', '#ef4444'],
                        borderWidth: 0,
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: '#94a3b8'
                            },
                            grid: {
                                color: 'rgba(59, 130, 246, 0.1)'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#94a3b8'
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        },
        getTrendDataFromInventory() {
            const now = new Date();
            const monthMap = new Map();

            // Generate last 6 month labels (e.g., "Jan 2025") and set initial null value
            for (let i = 5; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i);
                const label = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                monthMap.set(label, null);
            }

            // Process inventoryData
            this.inventoryData.forEach(item => {
                if (!Array.isArray(item.actionType)) return;

                item.actionType.forEach(action => {
                    const actionDate = new Date(action.date);
                    const label = actionDate.toLocaleString('default', { month: 'short', year: 'numeric' });

                    if (!monthMap.has(label)) return;

                    const existing = monthMap.get(label);
                    if (!existing || new Date(existing.date) < actionDate) {
                        // Replace with the latest action for the month
                        monthMap.set(label, {
                            month: label,
                            date: action.date,
                            value: action.value || 0
                        });
                    }
                });
            });

            // Final array of 6 records with latest value for each month
            const trendData = Array.from(monthMap.values()).map(entry => ({
                month: entry?.month || '',
                value: entry?.value || 0
            }));

            return trendData;
        },
        createTrendChart() {
            const ctx = this.$refs.trendChart.getContext('2d');

            // Trend data for the last 6 months
            const trendData = this.getTrendDataFromInventory()

            this.trendChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: trendData.map(d => d.month),
                    datasets: [{
                        label: 'Inventory Value ($)',
                        data: trendData.map(d => d.value),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: {
                                color: '#94a3b8',
                                callback: function (value) {
                                    return '$' + (value / 1000) + 'K';
                                }
                            },
                            grid: {
                                color: 'rgba(59, 130, 246, 0.1)'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#94a3b8'
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        },
        updateCharts() {
            // Destroy and recreate charts
            this.categoryChartInstance?.destroy();
            this.stockChartInstance?.destroy();
            this.trendChartInstance?.destroy();
            this.stocksChartInstance?.destroy();

            this.$nextTick(() => {
                this.createCharts();
            });
        }

    }

}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    background-color: #f5f7fa;
    color: #333;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    background: linear-gradient(135deg, var(--dashprimary-color), #0f172a);
    color: white;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 30px;
    display: flex;
    justify-content: between;
    align-items: center;
}

.header h1 {
    font-size: 28px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 12px;
}

.header-stats {
    display: flex;
    gap: 20px;
    margin-top: 10px;
}

.stat-card {
    background: rgba(255, 255, 255, 0.1);
    padding: 10px 15px;
    border-radius: 8px;
    text-align: center;
    backdrop-filter: blur(10px);
}

.stat-card .stat-value {
    font-size: 20px;
    font-weight: bold;
}

.stat-card .stat-label {
    font-size: 12px;
    opacity: 0.9;
}

.controls {
    background: white;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.controls-row {
    display: flex;
    gap: 15px;
    align-items: center;
    flex-wrap: wrap;
}

.search-box {
    position: relative;
    flex: 1;
    min-width: 250px;
}

.search-box input {
    width: 100%;
    padding: 10px 40px 10px 15px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
}

.search-box i {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
}

.filter-select {
    padding: 10px 15px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    font-size: 14px;
    min-width: 150px;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
}

.btn-primary {
    background: var(--dashprimary-color);
    color: white;
}

.btn-primary:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
}

.btn-secondary {
    background: #6b7280;
    color: white;
}

.btn-secondary:hover {
    background: #4b5563;
}

.tabs {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tab {
    flex: 1;
    padding: 15px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    background: transparent;
    font-size: 14px;
    font-weight: 500;
}

.tab.active {
    background: var(--dashprimary-color);
    color: white;
}

.tab:hover:not(.active) {
    background: #f3f4f6;
}

.inventory-table {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table th,
.table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
}

.table th {
    background: #f9fafb;
    font-weight: 600;
    color: #374151;
}

.table tr:hover {
    background: #f9fafb;
}

.status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
}

.status-in-stock {
    background: #d1fae5;
    color: #065f46;
}

.status-low-stock {
    background: #fed7aa;
    color: #9a3412;
}

.status-out-of-stock {
    background: #fecaca;
    color: #991b1b;
}

.status-critical {
    background: #ddd6fe;
    color: #5b21b6;
}

.stock-level {
    display: flex;
    align-items: center;
    gap: 10px;
}

.stock-bar {
    width: 80px;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
}

.stock-fill {
    height: 100%;
    transition: width 0.3s ease;
}

.stock-good {
    background: #10b981;
}

.stock-warning {
    background: #f59e0b;
}

.stock-danger {
    background: #ef4444;
}

.action-btns {
    display: flex;
    gap: 8px;
}

.action-btn {
    padding: 6px 10px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.3s ease;
}

.action-btn:hover {
    transform: translateY(-1px);
}

.btn-edit {
    background: #3b82f6;
    color: white;
}

.btn-view {
    background: #6b7280;
    color: white;
}

.btn-delete {
    background: #ef4444;
    color: white;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #6b7280;
}

.empty-state i {
    font-size: 48px;
    margin-bottom: 20px;
    opacity: 0.5;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
}

.pagination button {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
}

.pagination button:hover {
    background: #f3f4f6;
}

.pagination button.active {
    background: var(--dashprimary-color);
    color: white;
    border-color: var(--dashprimary-color);
}

.low-stock-alerts {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
}

.alert-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    color: #991b1b;
    font-weight: 600;
}

.alert-list {
    list-style: none;
    color: #7f1d1d;
}

.alert-list li {
    padding: 5px 0;
    font-size: 14px;
}

@media (max-width: 768px) {
    .controls-row {
        flex-direction: column;
        align-items: stretch;
    }

    .search-box {
        min-width: auto;
    }

    .header-stats {
        justify-content: center;
    }

    .table-responsive {
        overflow-x: auto;
    }
}

#content.active {
    margin-left: var(--sidebar-width);
    width: calc(100% - var(--sidebar-width));
}

.item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
}

.inactive-item {
    color: grey;
    opacity: 0.6;
}

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

/* Header Actions */
.header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 20px;
}

.header-actions {
    display: flex;
    gap: 10px;
    align-items: center;
}

.header-actions .btn {
    white-space: nowrap;
}

/* Vessels Grid */
.vessels-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
    padding: 20px;
}

.vessel-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    overflow: hidden;
    border-left: 4px solid var(--dashprimary-color);
    position: relative;
}

.vessel-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.vessel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px 10px;
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(15, 23, 42, 0.1));
}

.vessel-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
    background: linear-gradient(135deg, var(--dashprimary-color), #1e40af);
    border-radius: 10px;
    color: white;
    font-size: 20px;
}

.vessel-status {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.vessel-status.active {
    background: #d1fae5;
    color: #065f46;
}

.vessel-status.maintenance {
    background: #fed7aa;
    color: #9a3412;
}

.vessel-status.inactive {
    background: #fecaca;
    color: #991b1b;
}

.vessel-info {
    padding: 15px 20px;
}

.vessel-name {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 5px;
}

.vessel-reg {
    color: #6b7280;
    font-size: 14px;
    margin-bottom: 15px;
}

.vessel-stats {
    display: flex;
    gap: 20px;
}

.vessel-stat {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #4b5563;
}

.vessel-stat i {
    color: var(--dashprimary-color);
    font-size: 16px;
}

.vessel-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 15px 20px;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
}

.vessel-btn {
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    color: white;
}

.red-btn {
    background: red;
}

.green-btn {
    background: var(--dashprimary-color);
}

/* Responsive Design */
@media (max-width: 768px) {
    .vessels-grid {
        grid-template-columns: 1fr;
        padding: 15px;
    }

    .header {
        flex-direction: column;
        align-items: stretch;
    }

    .header-actions {
        justify-content: center;
    }

    .vessel-stats {
        flex-direction: column;
        gap: 10px;
    }
}
</style>