<template>
    <!-- Wave background -->
    <div class="wave-bg"></div>

    <!-- Sidebar Toggle Button -->
    <button class="toggle-btn" id="sidebarToggle">
        <i class="bi bi-list"></i>
    </button>

    <!-- Sidebar -->
    <Sidebar/>
    <!-- Page Content -->
    <div id="content">
        <div class="container-fluid">
            <DashHeader name="Fleet Maintenance"/>

            <VesselList/>
        </div>
    </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import VesselList from '../components/VesselList.vue';
import DashHeader from '../components/DashHeader.vue';

export default {
    name: 'MaintenanceRoute',
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
</style>