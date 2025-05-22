<template>
    <div class="page-header d-flex justify-content-between align-items-center">
        <h2 style="margin-left: 20px;">{{ name }}</h2>
        <div class="d-flex">
            <button class="btn btn-outline-primary" @click="loggedIn()">
                <i class="bi bi-person-circle"></i>
            </button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'DashHeader',
  props: ['name'],

  computed: {
    ...mapGetters('user', ['userRoleDescription']),
  },

  methods: {
    ...mapActions('user', ['fetchUserProfile']),

    async loggedIn() {
      await this.fetchUserProfile();

      if (this.userRoleDescription) {
        Swal.fire({
          title: "Logged in",
          text: this.userRoleDescription,
          icon: "info"
        });
      }
    }
  }
}
</script>