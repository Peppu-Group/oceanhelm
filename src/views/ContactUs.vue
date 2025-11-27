<template>
    <!-- Navbar -->
    <NavBar />

    <!-- Contact Section -->
    <section class="contact-section">
        <div class="container">
            <div class="contact-wrapper">
                <!-- Left Side - Info Card -->
                <div class="info-card">
                    <h1 class="info-title">Let's Talk</h1>
                    <h2 class="info-subtitle">Got questions about OceanHelm?</h2>
                    <p class="info-text">Contact us and one of our team members will be happy to help.</p>

                    <div class="contact-details">
                        <a href="mailto:marine@peppubuild.com" class="contact-link">
                            <span class="contact-icon">📧</span>
                            marine@peppubuild.com
                        </a>
                        <a href="tel:+2347071162732" class="contact-link">
                            <span class="contact-icon">📱</span>
                            +234 907 699 3818
                        </a>
                    </div>

                    <div class="social-links">
                        <a href="#" class="social-icon" aria-label="LinkedIn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                        </a>
                        <a href="#" class="social-icon" aria-label="Twitter">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        <a href="#" class="social-icon" aria-label="Instagram">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Right Side - Contact Form -->
                <div class="form-card">
                    <form @submit.prevent="handleSubmit" class="contact-form">
                        <div class="form-group">
                            <label for="email" class="form-label">
                                Email<span class="required">*</span>
                            </label>
                            <input type="email" id="email" v-model="formData.email" class="form-input" required>
                        </div>

                        <div class="form-group">
                            <label for="firstName" class="form-label">
                                First name
                            </label>
                            <input type="text" id="firstName" v-model="formData.firstName" class="form-input">
                        </div>

                        <div class="form-group">
                            <label for="lastName" class="form-label">
                                Last name
                            </label>
                            <input type="text" id="lastName" v-model="formData.lastName" class="form-input">
                        </div>

                        <div class="form-group">
                            <label for="phone" class="form-label">
                                Phone number<span class="required">*</span>
                            </label>
                            <input type="tel" id="phone" v-model="formData.phone" class="form-input" required>
                        </div>

                        <div class="form-group">
                            <label for="message" class="form-label">
                                Message<span class="required">*</span>
                            </label>
                            <textarea id="message" v-model="formData.message" class="form-textarea" rows="4"
                                required></textarea>
                        </div>

                        <button type="submit" class="submit-btn" :disabled="isSubmitting">
                            {{ isSubmitting ? 'Sending...' : 'Submit' }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <FooterView/>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import FooterView from '../components/FooterView.vue'
import axios from 'axios';

export default {
    name: 'ContactView',
    components: { NavBar, FooterView },
    data() {
        return {
            formData: {
                email: '',
                firstName: '',
                lastName: '',
                phone: '',
                message: '',
                recaptcha: false
            },
            isSubmitting: false
        };
    },
    methods: {
        async handleSubmit() {


            this.isSubmitting = true;

            try {
                // Simulate API call - Replace with your actual API endpoint

                // Example API call:
                // const response = await this.$axios.post('/api/contact', this.formData);

                // Simulate delay
                const notificationData = {
                    fullname: `${this.formData.firstName} ${this.formData.lastName}`,
                    email: `${this.formData.email}, ${this.formData.phone}`,
                    message: this.formData.message
                };
                this.sendMssg(notificationData)

                // Show success message
                await Swal.fire({
                    icon: 'success',
                    title: 'Message Sent!',
                    text: 'Thank you for contacting us. We\'ll get back to you soon.',
                    confirmButtonColor: '#00b4b4',
                    confirmButtonText: 'Great!'
                });

                // Reset form
                this.resetForm();

            } catch (error) {
                console.error('Error submitting form:', error);

                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: 'Something went wrong. Please try again later.',
                    confirmButtonColor: '#00b4b4'
                });
            } finally {
                this.isSubmitting = false;
            }
        },

        resetForm() {
            this.formData = {
                email: '',
                firstName: '',
                lastName: '',
                phone: '',
                message: '',
                recaptcha: false
            };
        },

        sendMssg(notificationData) {

            axios.post('https://proctoredserver.peppubuild.com/contact', notificationData)
                .then(response => {
                    // Show success message
                    Swal.fire({
                        icon: 'success',
                        title: 'Thank You!',
                        text: 'Your message has been sent successfully. We will get back to you soon.',
                        confirmButtonText: 'Close',
                        customClass: {
                            confirmButton: 'swal2-confirm'
                        }
                    });
                })
                .catch(error => {
                    // Show success message
                    Swal.fire({
                        icon: 'error',
                        text: 'An error occurred, message could not be sent',
                        confirmButtonText: 'Close',
                        customClass: {
                            confirmButton: 'swal2-confirm'
                        }
                    });
                });
        }
    }
}
</script>

<style scoped>
:root {
    --primary-gold: hsl(180, 65%, 45%);
    --deep-gold: hsl(180, 70%, 35%);
    --cream: hsl(45, 30%, 96%);
    --text: hsl(240, 20%, 15%);
    --text-light: hsl(240, 10%, 45%);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Contact Section */
.contact-section {
    min-height: calc(100vh - 70px);
    background: linear-gradient(135deg, hsl(240, 20%, 98%) 0%, hsl(180, 65%, 98%) 100%);
    padding: 70px 10px;
    display: flex;
    align-items: center;
    margin-top: 20px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

.contact-wrapper {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 40px;
    align-items: start;
}

/* Info Card */
.info-card {
    background: var(--maitprimary);
    color: white;
    padding: 60px 50px;
    border-radius: 30px;
    box-shadow: 0 20px 60px rgba(37, 99, 235, 0.3);
    position: sticky;
    top: 100px;
}

.info-title {
    font-size: 3em;
    font-weight: 700;
    margin-bottom: 15px;
}

.info-subtitle {
    font-size: 1.5em;
    font-weight: 400;
    margin-bottom: 20px;
    opacity: 0.95;
}

.info-text {
    font-size: 1.1em;
    opacity: 0.9;
    margin-bottom: 40px;
    line-height: 1.6;
}

.contact-details {
    margin-bottom: 40px;
}

.contact-link {
    display: flex;
    align-items: center;
    gap: 15px;
    color: white;
    text-decoration: none;
    font-size: 1.2em;
    margin-bottom: 20px;
    transition: all 0.3s ease;
    padding: 10px;
    border-radius: 12px;
}

.contact-link:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
}

.contact-icon {
    font-size: 1.5em;
}

.social-links {
    display: flex;
    gap: 15px;
}

.social-icon {
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
    border: 2px solid rgba(255, 255, 255, 0.3);
}

.social-icon:hover {
    background: white;
    color: #2563eb;
    transform: translateY(-5px);
}

/* Form Card */
.form-card {
    background: white;
    padding: 30px;
    border-radius: 30px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

.form-title {
    font-size: 2em;
    color: var(--text);
    margin-bottom: 35px;
    font-weight: 700;
}

.contact-form {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-label {
    font-size: 1em;
    font-weight: 500;
    color: var(--text);
    margin-bottom: 8px;
}

.required {
    color: #ef4444;
    margin-left: 2px;
}

.form-input,
.form-textarea {
    padding: 14px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 1em;
    font-family: inherit;
    transition: all 0.3s ease;
    background: white;
}

.form-input:focus,
.form-textarea:focus {
    outline: none;
    border-color: var(--primary-gold);
    box-shadow: 0 0 0 3px rgba(0, 180, 180, 0.1);
}

.form-textarea {
    resize: vertical;
    min-height: 100px;
}

/* reCAPTCHA Placeholder */
.recaptcha-placeholder {
    background: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
}

.recaptcha-box {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 10px;
}

.recaptcha-box input[type="checkbox"] {
    width: 24px;
    height: 24px;
    cursor: pointer;
}

.recaptcha-box label {
    font-size: 1em;
    color: var(--text);
    cursor: pointer;
    flex: 1;
}

.recaptcha-icon {
    font-size: 1.5em;
}

.recaptcha-text {
    font-size: 0.85em;
    color: var(--text-light);
    margin-bottom: 5px;
}

.recaptcha-links {
    font-size: 0.85em;
}

.recaptcha-links a {
    color: #2563eb;
    text-decoration: none;
}

.recaptcha-links a:hover {
    text-decoration: underline;
}

/* Submit Button */
.submit-btn {
    background: linear-gradient(135deg, var(--success) 0%, var(--primary-dark) 100%);
    color: white;
    border: none;
    padding: 16px 40px;
    border-radius: 12px;
    font-size: 1.1em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 71, 87, 0.3);
    margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(255, 71, 87, 0.4);
}

.submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Footer */
.footer {
    background: hsl(240, 20%, 15%);
    color: white;
    padding: 40px 20px;
    text-align: center;
}

.footer p {
    opacity: 0.8;
}

/* Responsive */
@media (max-width: 1024px) {
    .contact-wrapper {
        grid-template-columns: 1fr;
    }

    .info-card {
        position: static;
    }
}

@media (max-width: 768px) {
    .contact-section {
        padding: 40px 20px;
    }

    .info-card {
        padding: 40px 30px;
    }

    .form-card {
        padding: 15px 5px;
    }

    .info-title {
        font-size: 2.2em;
    }

    .info-subtitle {
        font-size: 1.2em;
    }

    .form-title {
        font-size: 1.6em;
    }
}

@media (max-width: 480px) {
    .info-card {
        padding: 30px 20px;
    }

    .form-card {
        padding: 5px 0px;
    }

    .info-title {
        font-size: 1.8em;
    }

    .contact-link {
        font-size: 1em;
    }
}
</style>