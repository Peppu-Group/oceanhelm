<template>
  <body>
    <div class="login-container">
      <div class="logo-section">
        <div class="logo">OceanHelm</div>
        <div class="tagline">Maritime Operations Management, Proudly made in Nigeria</div>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
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
          <a @click="handleForgotPassword">Forgot your password?</a>
        </div>

        <button type="submit" class="auth-btn" :disabled="isLoading">
          <span v-if="isLoading">Processing...</span>
          <span v-else>{{ isSignUp ? 'Create Account' : 'Sign In' }}</span>
        </button>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      </form>

      <div class="divider">
        <span class="divider-text">or continue with</span>
      </div>

      <div class="social-login">
        <button class="social-btn google-btn" @click="handleGoogleAuth">
          <svg class="google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>
        <button class="social-btn microsoft-btn" @click="handleMicrosoftAuth">
          <svg class="microsoft-icon" viewBox="0 0 24 24">
            <path fill="#F25022" d="M1 1h10v10H1z" />
            <path fill="#00A4EF" d="M13 1h10v10H13z" />
            <path fill="#7FBA00" d="M1 13h10v10H1z" />
            <path fill="#FFB900" d="M13 13h10v10H13z" />
          </svg>
          Microsoft
        </button>
      </div>

      <div class="toggle-link">
        <span v-if="!isSignUp">Don't have an account? </span>
        <span v-else>Already have an account? </span>
        <a @click="toggleForm">{{ isSignUp ? 'Sign in' : 'Sign up' }}</a>
      </div>
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
      isLoading: false,
      errorMessage: '',
      successMessage: '',
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
      this.comingSoon()
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
        text: 'This is WIP, we are implementing it now',
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
}

.forgot-password a:hover {
  text-decoration: underline;
}

.login-btn {
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

.login-btn:hover {
  background: linear-gradient(135deg, #164e63, #075985);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(3, 105, 161, 0.3);
}

.divider {
  text-align: center;
  margin: 24px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e2e8f0;
}

.divider-text {
  background: white;
  padding: 0 16px;
  color: #64748b;
  font-size: 14px;
}

.social-login {
  display: flex;
  gap: 12px;
}

.social-btn {
  flex: 1;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  font-size: 14px;
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

.social-btn:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.google-btn:hover {
  background: #fef7f0;
  border-color: #ea580c;
}

.microsoft-btn:hover {
  background: #f0f9ff;
  border-color: #0284c7;
}

.google-icon,
.microsoft-icon {
  width: 20px;
  height: 20px;
}

.signup-link {
  text-align: center;
  margin-top: 32px;
  color: #64748b;
  font-size: 14px;
}

.signup-link a {
  color: #0369a1;
  text-decoration: none;
  font-weight: 600;
}

.signup-link a:hover {
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

@media (max-width: 480px) {
  .login-container {
    padding: 24px;
  }

  .social-login {
    flex-direction: column;
  }

  .logo {
    font-size: 28px;
  }
}
</style>