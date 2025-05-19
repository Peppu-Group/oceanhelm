<template>
    <!-- Wave background -->
    <div class="wave-bg"></div>

    <!-- Sidebar Toggle Button -->
    <button class="toggle-btn" id="sidebarToggle">
        <i class="bi bi-list"></i>
    </button>

    <!-- Sidebar -->
    <Sidebar/>
    <div id="content" class="container">
        <!-- Header -->
        <div class="header">
            <div>
                <h1>
                    MarineTech Inventory Management
                </h1>
                <div class="header-stats">
                    <div class="stat-card">
                        <div class="stat-value">{{ totalItems }}</div>
                        <div class="stat-label">Total Items</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">{{ lowStockCount }}</div>
                        <div class="stat-label">Low Stock</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${{ totalValue.toLocaleString() }}</div>
                        <div class="stat-label">Total Value</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Low Stock Alerts -->
        <div v-if="lowStockItems.length > 0" class="low-stock-alerts">
            <div class="alert-header">
                <i class="fas fa-exclamation-triangle"></i>
                Low Stock Alerts ({{ lowStockItems.length }} items)
            </div>
            <ul class="alert-list">
                <li v-for="item in lowStockItems" :key="item.id">
                    <strong>{{ item.itemName }}</strong> - {{ item.vessel }} ({{ item.currentStock }}/{{ item.minStock }} {{
                        item.unit }})
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
                    <option v-for="vessel in vessels" :key="vessel" :value="vessel">{{ vessel }}</option>
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
            <button class="tab" :class="{ active: selectedTab === 'reports' }" @click="selectedTab = 'reports'">
                <i class="fas fa-chart-line"></i>
                Reports
            </button>
        </div>

        <!-- Inventory Table -->
        <div class="inventory-table" v-if="selectedTab === 'inventory'">
            <div class="table-responsive">
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
                        <tr v-for="item in filteredInventory" :key="item.id">
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
                                    <span>{{ item.currentStock }}/{{ item.maxStock }} {{ item.unit }}</span>
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
                            <td>${{ item.value.toLocaleString() }}</td>
                            <td>
                                <div class="action-btns">
                                    <button class="action-btn btn-view" @click="viewItem(item)">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="action-btn btn-edit" @click="editItem(item)">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="action-btn btn-delete" @click="deleteItem(item)">
                                        <i class="fas fa-trash"></i>
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
                <i class="fas fa-chart-bar" style="font-size: 48px; color: var(--dashprimary-color); margin-bottom: 20px;"></i>
                <h2>Inventory Overview</h2>
                <p style="color: #6b7280; margin-top: 10px;">Dashboard and analytics coming soon...</p>
            </div>
        </div>

        <!-- Vessels Tab Content -->
        <div v-if="selectedTab === 'vessels'" class="inventory-table">
            <div style="padding: 40px; text-align: center;">
                <i class="fas fa-ship" style="font-size: 48px; color: var(--dashprimary-color); margin-bottom: 20px;"></i>
                <h2>Vessel Inventory</h2>
                <p style="color: #6b7280; margin-top: 10px;">Vessel-specific inventory management coming soon...</p>
            </div>
        </div>

        <!-- Reports Tab Content -->
        <div v-if="selectedTab === 'reports'" class="inventory-table">
            <div style="padding: 40px; text-align: center;">
                <i class="fas fa-chart-line" style="font-size: 48px; color: var(--dashprimary-color); margin-bottom: 20px;"></i>
                <h2>Inventory Reports</h2>
                <p style="color: #6b7280; margin-top: 10px;">Detailed reports and analytics coming soon...</p>
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';

export default {
    name: 'inventory',
    components: { Sidebar },

    data() {
        return {
            selectedTab: 'inventory',
            searchTerm: '',
            selectedVessel: '',
            selectedCategory: '',
            currentPage: 1,
            itemsPerPage: 10,
            inventoryData: [
                {
                    id: 'INV-001',
                    itemName: 'Marine Engine Oil SAE 40',
                    category: 'Lubricants',
                    vessel: 'MV Atlantic Star',
                    location: 'Engine Room Store',
                    currentStock: 15,
                    minStock: 20,
                    maxStock: 50,
                    unit: 'Liters',
                    lastUpdated: '2025-05-18',
                    status: 'Low Stock',
                    value: 750.00
                },
                {
                    id: 'INV-002',
                    itemName: 'Navigation Light Bulbs',
                    category: 'Electrical',
                    vessel: 'MV Pacific Dawn',
                    location: 'Bridge Store',
                    currentStock: 45,
                    minStock: 10,
                    maxStock: 60,
                    unit: 'Pieces',
                    lastUpdated: '2025-05-17',
                    status: 'In Stock',
                    value: 225.00
                },
                {
                    id: 'INV-003',
                    itemName: 'Life Jacket Adult Type I',
                    category: 'Safety Equipment',
                    vessel: 'MV Atlantic Star',
                    location: 'Safety Locker #3',
                    currentStock: 0,
                    minStock: 50,
                    maxStock: 100,
                    unit: 'Pieces',
                    lastUpdated: '2025-05-16',
                    status: 'Out of Stock',
                    value: 0
                },
                {
                    id: 'INV-004',
                    itemName: 'Hydraulic Hose 1/2 inch',
                    category: 'Hydraulics',
                    vessel: 'MV Ocean Explorer',
                    location: 'Deck Equipment Store',
                    currentStock: 25,
                    minStock: 15,
                    maxStock: 40,
                    unit: 'Meters',
                    lastUpdated: '2025-05-15',
                    status: 'In Stock',
                    value: 500.00
                },
                {
                    id: 'INV-005',
                    itemName: 'Fire Extinguisher CO2 5kg',
                    category: 'Safety Equipment',
                    vessel: 'MV Pacific Dawn',
                    location: 'Main Deck',
                    currentStock: 8,
                    minStock: 12,
                    maxStock: 20,
                    unit: 'Units',
                    lastUpdated: '2025-05-14',
                    status: 'Low Stock',
                    value: 1200.00
                },
                {
                    id: 'INV-006',
                    itemName: 'Main Engine Coolant',
                    category: 'Lubricants',
                    vessel: 'MV Ocean Explorer',
                    location: 'Engine Room Store',
                    currentStock: 30,
                    minStock: 20,
                    maxStock: 60,
                    unit: 'Liters',
                    lastUpdated: '2025-05-13',
                    status: 'In Stock',
                    value: 450.00
                },
                {
                    id: 'INV-007',
                    itemName: 'Radar Antenna Assembly',
                    category: 'Electronics',
                    vessel: 'MV Atlantic Star',
                    location: 'Bridge Equipment',
                    currentStock: 1,
                    minStock: 2,
                    maxStock: 3,
                    unit: 'Units',
                    lastUpdated: '2025-05-12',
                    status: 'Critical',
                    value: 15000.00
                },
                {
                    id: 'INV-008',
                    itemName: 'Deck Paint Marine Grade',
                    category: 'Maintenance',
                    vessel: 'MV Pacific Dawn',
                    location: 'Paint Store',
                    currentStock: 12,
                    minStock: 8,
                    maxStock: 25,
                    unit: 'Liters',
                    lastUpdated: '2025-05-11',
                    status: 'In Stock',
                    value: 300.00
                }
            ]
        }
    },
    computed: {
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
            return [...new Set(this.inventoryData.map(item => item.vessel))];
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
        }
    },
    methods: {
        getStatusClass(status) {
            switch (status) {
                case 'In Stock':
                    return 'status-in-stock';
                case 'Low Stock':
                    return 'status-low-stock';
                case 'Out of Stock':
                    return 'status-out-of-stock';
                case 'Critical':
                    return 'status-critical';
                default:
                    return 'status-in-stock';
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
        addNewItem() {
            alert('Add new item functionality will be implemented');
        },
        exportData() {
            alert('Export functionality will be implemented');
        },
        importData() {
            alert('Import functionality will be implemented');
        },
        viewItem(item) {
            alert(`Viewing item: ${item.itemName}`);
        },
        editItem(item) {
            alert(`Editing item: ${item.itemName}`);
        },
        deleteItem(item) {
            if (confirm(`Are you sure you want to delete ${item.itemName}?`)) {
                alert('Item deleted (not implemented in demo)');
            }
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
    display: flex;
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
</style>