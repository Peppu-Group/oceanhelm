<template>
    <!-- Wave background -->
    <div class="wave-bg"></div>

    <!-- Sidebar Toggle Button -->
    <button class="toggle-btn" id="sidebarToggle">
        <i class="bi bi-list"></i>
    </button>

    <!-- Sidebar -->
    <nav id="sidebar">
        <div class="logo d-flex align-items-center left">
            <i class="bi bi-water me-2"></i>
            <span>MarineTech Solutions</span>
        </div>
        <ul class="list-unstyled components mt-4">
            <li class="active">
                <a href="#"><i class="bi bi-speedometer2"></i> Dashboard</a>
            </li>
            <li>
                <a href="#"><i class="bi bi-ship"></i> Fleet Management</a>
            </li>
            <li>
                <a href="#"><i class="bi bi-tools"></i> Maintenance</a>
            </li>
            <li>
                <a href="#"><i class="bi bi-calendar-check"></i> Scheduling</a>
            </li>
            <li>
                <a href="#"><i class="bi bi-clipboard-data"></i> Reports</a>
            </li>
            <li>
                <a href="#"><i class="bi bi-people"></i> Crew Management</a>
            </li>
            <li>
                <a href="#"><i class="bi bi-geo-alt"></i> Tracking</a>
            </li>
            <li>
                <a href="#"><i class="bi bi-gear"></i> Settings</a>
            </li>
            <li>
                <a href="#"><i class="bi bi-question-circle"></i> Help & Support</a>
            </li>
        </ul>
    </nav>

    <!-- Page Content -->
    <div id="content">
        <div class="container-fluid">
            <div class="page-header d-flex justify-content-between align-items-center">
                <h2 style="margin-left: 20px;">Fleet Dashboard</h2>
                <div class="d-flex">
                    <button class="btn btn-outline-primary">
                        <i class="bi bi-person-circle"></i>
                    </button>
                </div>
            </div>

            <!-- Company Details -->
            <div class="company-card">
                <div class="row">
                    <div class="col-md-2">
                        <div class="company-logo">
                            <i class="bi bi-building"></i>
                        </div>
                    </div>
                    <div class="col-md-10">
                        <h3>MarineOps Solutions Inc.</h3>
                        <div class="row mt-3">
                            <div class="col-md-4">
                                <p><strong>Location:</strong> Port Harbor, CA 92614</p>
                                <p><strong>Established:</strong> 2005</p>
                            </div>
                            <div class="col-md-4">
                                <p><strong>Contact:</strong> (555) 123-4567</p>
                                <p><strong>Email:</strong> info@marineops.com</p>
                            </div>
                            <div class="col-md-4">
                                <p><strong>Fleet Size:</strong> 8 Vessels</p>
                                <p><strong>License:</strong> MCL-273845</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Fleet Summary -->
            <div class="row mb-4">
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body d-flex align-items-center">
                            <div class="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                                <i class="bi bi-check-circle-fill text-primary fs-4"></i>
                            </div>
                            <div>
                                <h6 class="mb-0">Active Vessels</h6>
                                <h3 class="mt-2 mb-0">5</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body d-flex align-items-center">
                            <div class="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                                <i class="bi bi-tools text-warning fs-4"></i>
                            </div>
                            <div>
                                <h6 class="mb-0">Under Maintenance</h6>
                                <h3 class="mt-2 mb-0">2</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body d-flex align-items-center">
                            <div class="rounded-circle bg-secondary bg-opacity-10 p-3 me-3">
                                <i class="bi bi-pause-circle-fill text-secondary fs-4"></i>
                            </div>
                            <div>
                                <h6 class="mb-0">Inactive</h6>
                                <h3 class="mt-2 mb-0">1</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h4 class="mb-4"><i class="bi bi-ship me-2"></i>Registered Vessels</h4>

            <!-- Vessel Cards -->
            <div class="row">
                <!-- Vessel 1 -->
                <div class="col-lg-6">
                    <div class="vessel-card">
                        <div class="card-body d-flex align-items-center">
                            <div class="vessel-icon left">
                                <i class="bi bi-ship"></i>
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h5 class="card-title mb-0">Ocean Pioneer</h5>
                                    <span class="vessel-status status-active">Active</span>
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <small class="text-muted">Registration #:</small>
                                        <p class="mb-0">MV-23456</p>
                                    </div>
                                    <div class="col-6">
                                        <small class="text-muted">Next Maintenance:</small>
                                        <p class="mb-0">Jul 15, 2025</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Vessel 2 -->
                <div class="col-lg-6">
                    <div class="vessel-card">
                        <div class="card-body d-flex align-items-center">
                            <div class="vessel-icon left">
                                <i class="bi bi-ship"></i>
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h5 class="card-title mb-0">Atlantic Voyager</h5>
                                    <span class="vessel-status status-active">Active</span>
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <small class="text-muted">Registration #:</small>
                                        <p class="mb-0">MV-34567</p>
                                    </div>
                                    <div class="col-6">
                                        <small class="text-muted">Next Maintenance:</small>
                                        <p class="mb-0">Jun 22, 2025</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Vessel 3 -->
                <div class="col-lg-6">
                    <div class="vessel-card">
                        <div class="card-body d-flex align-items-center">
                            <div class="vessel-icon left">
                                <i class="bi bi-ship"></i>
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h5 class="card-title mb-0">Pacific Explorer</h5>
                                    <span class="vessel-status status-maintenance">Maintenance</span>
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <small class="text-muted">Registration #:</small>
                                        <p class="mb-0">MV-45678</p>
                                    </div>
                                    <div class="col-6">
                                        <small class="text-muted">Est. Completion:</small>
                                        <p class="mb-0">May 25, 2025</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Vessel 4 -->
                <div class="col-lg-6">
                    <div class="vessel-card">
                        <div class="card-body d-flex align-items-center">
                            <div class="vessel-icon left">
                                <i class="bi bi-ship"></i>
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h5 class="card-title mb-0">Northern Star</h5>
                                    <span class="vessel-status status-active">Active</span>
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <small class="text-muted">Registration #:</small>
                                        <p class="mb-0">MV-56789</p>
                                    </div>
                                    <div class="col-6">
                                        <small class="text-muted">Next Maintenance:</small>
                                        <p class="mb-0">Aug 10, 2025</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Vessel 5 -->
                <div class="col-lg-6">
                    <div class="vessel-card">
                        <div class="card-body d-flex align-items-center">
                            <div class="vessel-icon left">
                                <i class="bi bi-ship"></i>
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h5 class="card-title mb-0">Southern Cross</h5>
                                    <span class="vessel-status status-active">Active</span>
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <small class="text-muted">Registration #:</small>
                                        <p class="mb-0">MV-67890</p>
                                    </div>
                                    <div class="col-6">
                                        <small class="text-muted">Next Maintenance:</small>
                                        <p class="mb-0">Sep 05, 2025</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Vessel 6 -->
                <div class="col-lg-6">
                    <div class="vessel-card">
                        <div class="card-body d-flex align-items-center">
                            <div class="vessel-icon left">
                                <i class="bi bi-ship"></i>
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h5 class="card-title mb-0">Eastern Wind</h5>
                                    <span class="vessel-status status-inactive">Inactive</span>
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <small class="text-muted">Registration #:</small>
                                        <p class="mb-0">MV-78901</p>
                                    </div>
                                    <div class="col-6">
                                        <small class="text-muted">Status Since:</small>
                                        <p class="mb-0">Mar 12, 2025</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Vessel 7 -->
                <div class="col-lg-6">
                    <div class="vessel-card">
                        <div class="card-body d-flex align-items-center">
                            <div class="vessel-icon left">
                                <i class="bi bi-ship"></i>
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h5 class="card-title mb-0">Western Horizon</h5>
                                    <span class="vessel-status status-maintenance">Maintenance</span>
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <small class="text-muted">Registration #:</small>
                                        <p class="mb-0">MV-89012</p>
                                    </div>
                                    <div class="col-6">
                                        <small class="text-muted">Est. Completion:</small>
                                        <p class="mb-0">May 30, 2025</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Vessel 8 -->
                <div class="col-lg-6">
                    <div class="vessel-card">
                        <div class="card-body d-flex align-items-center">
                            <div class="vessel-icon left">
                                <i class="bi bi-ship"></i>
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h5 class="card-title mb-0">Coastal Guardian</h5>
                                    <span class="vessel-status status-active">Active</span>
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <small class="text-muted">Registration #:</small>
                                        <p class="mb-0">MV-90123</p>
                                    </div>
                                    <div class="col-6">
                                        <small class="text-muted">Next Maintenance:</small>
                                        <p class="mb-0">Jul 28, 2025</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardView',
    mounted() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const content = document.getElementById('content');

        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
            content.classList.toggle('active');
        });

        // Handle clicks outside sidebar to close it on mobile
        document.addEventListener('click', function (event) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnToggleBtn = sidebarToggle.contains(event.target);

            if (!isClickInsideSidebar && !isClickOnToggleBtn && window.innerWidth < 768 && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                content.classList.remove('active');
            }
        });
    }
}
</script>

<style scoped>
/* Sidebar */
#sidebar {
    position: fixed;
    width: var(--sidebar-width);
    height: 100%;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    transition: all 0.3s;
    z-index: 1000;
    left: -280px;
}

#sidebar.active {
    left: 0;
}

#sidebar .logo {
    padding: 20px;
    color: white;
    font-weight: bold;
    font-size: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

#sidebar ul li a {
    padding: 15px 20px;
    display: block;
    color: #fff;
    text-decoration: none;
    transition: all 0.3s;
    border-left: 3px solid transparent;
}

#sidebar ul li a:hover {
    background: rgba(255, 255, 255, 0.1);
    border-left: 3px solid #00acc1;
}

#sidebar ul li a i {
    margin-right: 10px;
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

/* Header */
.page-header {
    margin-bottom: 30px;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 15px;
}

/* Company Card */
.company-card {
    background: white;
    border-radius: 10px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    padding: 25px;
    margin-bottom: 30px;
}

.company-logo {
    width: 80px;
    height: 80px;
    background-color: #e6f2ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    color: var(--dashprimary-color);
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

/* Responsive adjustments */
@media (max-width: 768px) {
    #content.active {
        margin-left: 0;
        width: 100%;
    }

    #sidebar {
        width: 100%;
        max-width: 280px;
    }
}

.toggle-btn {
    position: fixed;
    left: 15px;
    top: 15px;
    z-index: 1100;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--dashprimary-color);
    color: white;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    border: none;
    cursor: pointer;
    transition: all 0.3s;
}

.toggle-btn:hover {
    background-color: var(--dashsecondary-color);
}

/* Wave effect for marine theme */
.wave-bg {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 200px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%230d6efd" fill-opacity="0.1" d="M0,160L48,165.3C96,171,192,181,288,176C384,171,480,149,576,154.7C672,160,768,192,864,181.3C960,171,1056,117,1152,101.3C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') repeat-x;
    background-size: cover;
    z-index: -1;
}
</style>