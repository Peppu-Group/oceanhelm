<template>
  <div class="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="row w-100 justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-lg border-0">
          <div class="card-body p-5">
            <!-- Header -->
            <div class="text-center mb-4">
              <i class="bi bi-shield-lock text-primary" style="font-size: 3rem;"></i>
              <h2 class="card-title mt-3 mb-2">Reset Password</h2>
              <p class="text-muted">Enter your new password below</p>
            </div>

            <!-- Password Reset Form -->
            <form @submit.prevent="updatePassword">
              <!-- New Password Field -->
              <div class="mb-3">
                <label for="newPassword" class="form-label">New Password</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-lock"></i>
                  </span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    id="newPassword"
                    v-model="newPassword"
                    placeholder="Enter your new password"
                    required
                    minlength="6"
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="togglePasswordVisibility"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div class="form-text">Password must be at least 6 characters long</div>
              </div>

              <!-- Confirm Password Field -->
              <div class="mb-4">
                <label for="confirmPassword" class="form-label">Confirm New Password</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-lock-fill"></i>
                  </span>
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-control"
                    id="confirmPassword"
                    v-model="confirmPassword"
                    placeholder="Confirm your new password"
                    required
                    :class="{ 'is-invalid': confirmPassword && !passwordsMatch }"
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="toggleConfirmPasswordVisibility"
                  >
                    <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div v-if="confirmPassword && !passwordsMatch" class="invalid-feedback">
                  Passwords do not match
                </div>
              </div>

              <!-- Password Strength Indicator -->
              <div v-if="newPassword" class="mb-3">
                <label class="form-label">Password Strength</label>
                <div class="progress" style="height: 8px;">
                  <div
                    class="progress-bar"
                    :class="passwordStrengthClass"
                    :style="{ width: passwordStrengthWidth }"
                    role="progressbar"
                  ></div>
                </div>
                <small class="text-muted">{{ passwordStrengthText }}</small>
              </div>

              <!-- Submit Button -->
              <div class="d-grid mb-3">
                <button
                  type="submit"
                  class="btn btn-primary btn-lg"
                  :disabled="!canSubmit || isLoading"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ isLoading ? 'Updating...' : 'Update Password' }}
                </button>
              </div>
            </form>

            <!-- Back to Login Link -->
            <div class="text-center">
              <router-link to="/login" class="text-decoration-none">
                <i class="bi bi-arrow-left"></i> Back to Login
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import supabase from '../supabase'

export default {
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false
    }
  },
  computed: {
    passwordsMatch() {
      return this.newPassword === this.confirmPassword;
    },
    canSubmit() {
      return this.newPassword.length >= 6 && 
             this.confirmPassword && 
             this.passwordsMatch;
    },
    passwordStrength() {
      const password = this.newPassword;
      let score = 0;
      
      if (password.length >= 6) score++;
      if (password.length >= 8) score++;
      if (/[a-z]/.test(password)) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;
      
      return score;
    },
    passwordStrengthClass() {
      const strength = this.passwordStrength;
      if (strength <= 2) return 'bg-danger';
      if (strength <= 4) return 'bg-warning';
      return 'bg-success';
    },
    passwordStrengthWidth() {
      return `${(this.passwordStrength / 6) * 100}%`;
    },
    passwordStrengthText() {
      const strength = this.passwordStrength;
      if (strength <= 2) return 'Weak';
      if (strength <= 4) return 'Medium';
      return 'Strong';
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    async updatePassword() {
      if (!this.canSubmit) return;
      
      this.isLoading = true;
      
      try {
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
            text: 'Your password has been successfully updated. You can now log in with your new password.'
          }).then(() => {
            this.$router.push('/login');
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Unexpected Error',
          text: 'Something went wrong. Please try again.'
        });
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>