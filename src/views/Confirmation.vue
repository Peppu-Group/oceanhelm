<template>
    <div class="container">
        <div class="icon">📧</div>
        <h1>Resend Confirmation</h1>
        <p>Didn't receive your confirmation email? Click the button below to resend it to your registered email address.</p>

        <button class="resend-btn" @click="resendConfirmationEmail" :disabled="isLoading">
            {{ buttonText }}
        </button>

        <div class="success-message" :class="{ show: showSuccess }" v-if="showSuccess">
            ✅ Confirmation email has been sent successfully! Please check your inbox and spam folder.
        </div>
    </div>
</template>

<script>
import supabase from '../supabase'

export default {
    data() {
        return {
            isLoading: false,
            showSuccess: false,
            buttonText: 'Resend Confirmation'

        }
    },
    methods: {
        async resendConfirmationEmail() {
            // Set loading state
            this.isLoading = true;
            this.buttonText = 'Sending...';
            this.showSuccess = false;
            try {
                const { data, error } = await supabase.auth.resend({
                    email: '',
                    type: 'signup',
                    options: {
                        emailRedirectTo: ''
                    }
                });

                if (data) {
                    // Show success message
                    this.showSuccess = true;
                    this.isLoading = false;
                    this.buttonText = 'Resend Confirmation';
                }

                if (error) {
                    console.error('Error resending confirmation email:', error.message);
                    this.isLoading = false;
                    this.buttonText = 'Resend Confirmation';
                } else {
                    console.log('Confirmation email resent successfully!');
                }
            } catch (err) {
                console.error('An unexpected error occurred:', err.message);
                this.isLoading = false;
                this.buttonText = 'Resend Confirmation';
            }
        }
    }
}

</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.container {
    background: white;
    padding: 60px 40px;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 500px;
    width: 100%;
}

.icon {
    font-size: 4rem;
    margin-bottom: 30px;
    color: #667eea;
}

h1 {
    font-size: 2rem;
    color: #2c3e50;
    margin-bottom: 15px;
    font-weight: 600;
}

p {
    color: #6c757d;
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 40px;
}

.resend-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 16px 40px;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.resend-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

.resend-btn:active {
    transform: translateY(0);
}

.resend-btn:disabled {
    background: #95a5a6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.success-message {
    background: #d4edda;
    color: #155724;
    padding: 15px;
    border-radius: 8px;
    margin-top: 20px;
    border: 1px solid #c3e6cb;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
}

.success-message.show {
    opacity: 1;
    transform: translateY(0);
}

@media (max-width: 768px) {
    .container {
        padding: 40px 30px;
    }

    h1 {
        font-size: 1.5rem;
    }

    p {
        font-size: 1rem;
    }

    .resend-btn {
        padding: 14px 35px;
        font-size: 1rem;
    }
}
</style>