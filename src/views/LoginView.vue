<template>
  <body>
    <div class="login-container">
      <div class="logo-section">
        <div class="logo">OceanHelm</div>
        <div class="tagline">Maritime Operations Management</div>
      </div>

      <!-- Forgot Password Form -->
      <form v-if="isForgotPassword" @submit.prevent="handleForgotPasswordSubmit" class="auth-form">
        <div class="form-header">
          <p class="form-subtitle">Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        <div class="form-group">
          <label for="resetEmail" class="form-label">Email Address</label>
          <input type="email" id="resetEmail" v-model="resetEmail" class="form-input" placeholder="Enter your email" required>
        </div>

        <button type="submit" class="auth-btn" :disabled="isLoading">
          <span v-if="isLoading">Sending...</span>
          <span v-else>Send Reset Link</span>
        </button>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

        <div class="toggle-link">
          <a @click="backToLogin">← Back to Sign In</a>
        </div>
      </form>

      <!-- Sign In/Sign Up Form -->
      <form v-else @submit.prevent="handleSubmit" class="auth-form">
        <transition name="form">
          <div v-if="isSignUp" class="form-group">
            <label for="fullName" class="form-label">Full Name</label>
            <input type="text" id="fullName" v-model="form.fullName" class="form-input" placeholder="Enter your full name"
              required>
            <label for="companyName" class="form-label">Company Name</label>
            <input type="text" id="companyName" v-model="form.companyName" class="form-input"
              placeholder="Enter your company's name" required>
          </div>
        </transition>

        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input type="email" id="email" v-model="form.email" class="form-input" placeholder="Enter your email" required>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input type="password" id="password" v-model="form.password" class="form-input"
            placeholder="Enter your password" required>
        </div>

        <div v-if="!isSignUp" class="forgot-password">
          <a @click="showForgotPassword">Forgot your password?</a>
        </div>

        <button type="submit" class="auth-btn" :disabled="isLoading">
          <span v-if="isLoading">Processing...</span>
          <span v-else>{{ isSignUp ? 'Create Account' : 'Sign In' }}</span>
        </button>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

        <div class="toggle-link">
          <span v-if="!isSignUp">Don't have an account? </span>
          <span v-else>Already have an account? </span>
          <a @click="toggleForm">{{ isSignUp ? 'Sign in' : 'Sign up' }}</a>
        </div>
      </form>
    </div>
  </body>
</template>

<script>
import supabase from '../supabase'

export default {
  name: 'Login',

  data() {
    return {
      isSignUp: false,
      isForgotPassword: false,
      isLoading: false,
      errorMessage: '',
      successMessage: '',
      resetEmail: '',
      form: {
        fullName: '',
        email: '',
        password: '',
        companyName: ''
      }
    }
  },

  methods: {
    toggleForm() {
      this.isSignUp = !this.isSignUp;
      this.clearMessages();
      this.resetForm();
    },
    showForgotPassword() {
      this.isForgotPassword = true;
      this.clearMessages();
      this.resetEmail = '';
    },
    backToLogin() {
      this.isForgotPassword = false;
      this.clearMessages();
      this.resetEmail = '';
    },
    resetForm() {
      this.form = {
        fullName: '',
        email: '',
        password: '',
        companyName: ''
      };
    },
    clearMessages() {
      this.errorMessage = '';
      this.successMessage = '';
    },
    async handleForgotPasswordSubmit() {
      this.clearMessages();
      this.isLoading = true;

      try {
        const { error } = await supabase.auth.resetPasswordForEmail(this.resetEmail, {
          redirectTo: 'https://marine.peppubuild.com/reset-password'
        });

        this.isLoading = false;

        if (error) {
          this.errorMessage = error.message;
          return;
        }

        this.successMessage = 'Password reset link sent! If an account with this email exists, we have sent a password reset link.';
        
        // Optionally redirect back to login after a delay
        setTimeout(() => {
          this.backToLogin();
        }, 3000);

      } catch (err) {
        this.isLoading = false;
        this.errorMessage = 'An error occurred. Please try again.';
      }
    },
    async handleSubmit() {
      this.clearMessages();
      this.isLoading = true;

      // Simulate API call
      setTimeout(async () => {
        this.isLoading = false;

        if (this.isSignUp) {
          try {
            const { data: signUpData, error } = await supabase.auth.signUp({
              email: this.form.email,
              password: this.form.password,
              options: {
                data: {
                  fullName: this.form.fullName,
                  company_name: this.form.companyName 
                },
                emailRedirectTo: 'https://marine.peppubuild.com/redirect'
              }
            });

            if (error) {
              Swal.fire({
                title: "Signup Failed",
                text: error.message,
                icon: "error"
              });
              this.resetForm();
              return { success: false, error };
            }

            if (signUpData.user && !signUpData.session) {
              // Email confirmation is required
              Swal.fire({
                title: "Check Your Email",
                text: "We've sent you a confirmation link. Please check your email to complete registration.",
                icon: "info"
              });

              this.toggleForm();
            } else if (data.session) {
              // User is signed in immediately (if email confirmation is not required)
              this.$router.push({ name: 'dashboard' });
            }

            return { success: true, data };
          } catch (err) {
            return { success: false, error: err };
          }
        } else {
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: this.form.email,
              password: this.form.password
            });

            if (error) {
              Swal.fire({
                title: "An error ocurred",
                text: error,
                icon: "error"
              });
              this.resetForm();
              return { success: false, error };
            }
            this.$router.push({ name: 'dashboard' })
            return { success: true, data };
          } catch (err) {
            // console.log(err)
          }
        }

        // Reset form after success
        setTimeout(() => {
          this.resetForm();
          this.clearMessages();
        }, 2000);
      }, 1500);
    },
    handleForgotPassword() {
      this.showForgotPassword();
    },
    handleGoogleAuth() {
      this.comingSoon()
    },
    handleMicrosoftAuth() {
      this.comingSoon()
    },
    comingSoon() {
      Swal.fire({
        title: "Coming soon",
        text: 'This is WIP, login with email/password',
        icon: "info"
      });
    }
  },
  watch: {
    isSignUp() {
      // Add slight delay for smooth transition
      this.$nextTick(() => {
        const container = document.querySelector('.auth-container');
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
  background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 440px;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #0c4a6e, #0369a1, #0284c7);
}

.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  font-size: 32px;
  font-weight: bold;
  color: #0c4a6e;
  margin-bottom: 8px;
}

.tagline {
  color: #64748b;
  font-size: 14px;
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  color: #0c4a6e;
  margin-bottom: 8px;
}

.form-subtitle {
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #334155;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.form-input:focus {
  outline: none;
  border-color: #0369a1;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(3, 105, 161, 0.1);
}

.forgot-password {
  text-align: right;
  margin-bottom: 24px;
}

.forgot-password a {
  color: #0369a1;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.auth-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #0c4a6e, #0369a1);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 24px;
}

.auth-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #164e63, #075985);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(3, 105, 161, 0.3);
}

.auth-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  border: 1px solid #fecaca;
}

.success-message {
  background: #f0fdf4;
  color: #16a34a;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  border: 1px solid #bbf7d0;
}

.toggle-link {
  text-align: center;
  margin-top: 32px;
  color: #64748b;
  font-size: 14px;
}

.toggle-link a {
  color: #0369a1;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
}

.toggle-link a:hover {
  text-decoration: underline;
}

.form-enter-active, .form-leave-active {
  transition: all 0.3s ease;
}

.form-enter-from, .form-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 480px) {
  .login-container {
    padding: 24px;
  }

  .logo {
    font-size: 28px;
  }
}
</style>