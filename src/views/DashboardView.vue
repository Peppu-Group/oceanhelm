<template>
    <!-- Wave background -->
    <div class="wave-bg"></div>

    <!-- Sidebar Toggle Button -->
    <button class="toggle-btn" id="sidebarToggle">
        <i class="bi bi-list"></i>
    </button>

    <!-- Sidebar -->
    <Sidebar />
    <!-- Page Content -->
    <div id="content">
        <div class="container-fluid">
            <DashHeader name="Fleet Dashboard" />

            <!-- Company Details -->
            <div class="company-card">
                <div class="row">
                    <div class="col-md-2">
                        <div class="company-logo">
                            <i class="bi bi-building"></i>
                        </div>
                    </div>
                    <div class="col-md-10">
                        <h3>{{ company.name }}</h3>
                        <div class="row mt-3">
                            <div class="col-md-4">
                                <p><strong>Location:</strong> {{ company.location || 'Not Set'}}  </p>
                                <p><strong>Established:</strong> {{ company.estYear || 'Not Set'}}</p>
                            </div>
                            <div class="col-md-4">
                                <p><strong>Contact:</strong> {{ company.phoneNumber || 'Not Set'}}</p>
                                <p><strong>Email:</strong> {{ company.email || 'Not Set'}}</p>
                            </div>
                            <div class="col-md-4">
                                <p><strong>Fleet Size:</strong> {{ getVesselCount() }}</p>
                                <p><strong>License:</strong> {{ company.license || 'Not Set'}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <VesselList />
        </div>
    </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import VesselList from '../components/VesselList.vue';
import DashHeader from '../components/DashHeader.vue';
import supabase from '../supabase';


export default {
    name: 'DashboardView',
    async mounted() {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('company_id')
                .eq('id', session.user.id)
                .single();

            if (profile?.company_id) {
                await this.$store.dispatch('company/fetchCompanyInfo', profile.company_id);
            }
        }

        // fetch vessels.
        this.$store.dispatch('vessel/fetchVessels');
        // this.company.vessels.push(this.vessels);
    },
    computed: {
        company() {
            return this.$store.getters['company/company'];
        },
        vessels() {
            return this.$store.getters['vessel/allVessels'];
        }
    },
    methods: {
        getVesselCount() {
            return this.company.vessels.length;
        },
    },
    components: { Sidebar, VesselList, DashHeader }
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