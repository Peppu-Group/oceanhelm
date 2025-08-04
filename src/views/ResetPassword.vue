<template>

</template>

<script>
import { supabase } from '../supabase'

export default {
  data() {
    return {
      newPassword: ''
    }
  },
  methods: {
    async updatePassword() {
      const { data, error } = await supabase.auth.updateUser({
        password: this.newPassword
      });

      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Password Updated',
          text: 'You can now log in with your new password.'
        });
        this.$router.push('/login');
      }
    }
  }
}

</script>