<template>
    <div id="app" class="d-flex">
        <!-- Sidebar -->
        <ConfigurableSidebar :menuItems="menuItems" :userProfile="userProfile" brandName="OceanHelm" logoIcon="bi bi-water"
            customClasses="bg-dark text-white" @navigate="onNavigate" @action="onAction" @item-click="onItemClick">
        </ConfigurableSidebar>
    </div>
</template>
  
<script>
import { mapGetters, mapActions } from 'vuex';
import supabase from '../supabase';
import { ConfigurableSidebar, defaultMenuItems } from 'oceanhelm'

export default {
    name: 'SideBar',
    components: { ConfigurableSidebar },

    data() {
        return {
            menuItems: defaultMenuItems
        }
    },

    computed: {
        ...mapGetters('user', ['userProfile', 'userRoleDescription']),
    },

    methods: {
        ...mapActions('user', ['fetchUserProfile']),
        onNavigate(item) {
        },
        onAction(item) {
        },
        onItemClick(item) {
        }
    }
}
</script>

<style scoped>
.left {
    margin-left: 20px;
}

.black {
    color: black !important;
}
</style>