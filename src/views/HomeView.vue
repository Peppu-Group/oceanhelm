<template>
  <!-- Header -->
  <NavBar />
  <!-- Hero Section -->
  <section class="hero">
    <div class="container">
      <h2>Smart Maritime Software<br>For Modern Fleets</h2>
      <p>Streamline maintenance, optimize inventory, and enhance vessel communication with our maritime management
        platform.</p>
      <div class="hero-buttons">
        <a @click="contactDemo()" class="primary-button">Request
          Demo</a><!-- Add swal button that sends email to marine.peppubuild.com -->
        <a href="#features" class="secondary-button">Explore Features</a>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section class="features" id="features">
    <div class="container">
      <div class="section-header">
        <h3>Core Capabilities</h3>
        <h2>Comprehensive Maritime Management</h2>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24">
              <path
                d="M19.5 12c0-.34-.03-.66-.07-.99l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.51-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0014 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.33-.07.66-.07.99s.03.66.07.99l-2.11 1.63c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.51.39 1.06.73 1.69.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.25 1.17-.59 1.69-.98l2.49 1c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.63c.04-.33.07-.65.07-.99zm-7.5 4c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
            </svg>
          </div>
          <h3>Maintenance Management</h3>
          <p>Plan, track, and optimize maintenance workflows with our intuitive system. Get alerts, schedule tasks, and
            keep detailed maintenance histories for all equipment.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24">
              <path
                d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
            </svg>
          </div>
          <h3>Requisition Processing</h3>
          <p>Simplify procurement with digital requisition forms, approval workflows, and order tracking. Eliminate
            paperwork and streamline your supply chain.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24">
              <path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z" />
            </svg>
          </div>
          <h3>Inventory Management</h3>
          <p>Track parts, supplies, and equipment with real-time inventory control. Set minimum stock levels, receive
            automatic alerts, and generate detailed reports.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24">
              <path
                d="M16 1H8C6.34 1 5 2.34 5 4v16c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V4c0-1.66-1.34-3-3-3zm-2 20h-4v-1h4v1zm3.25-3H6.75V4h10.5v14z" />
            </svg>
          </div>
          <h3>Cross-Vessel Data Sharing</h3>
          <p>Seamlessly share information between vessels and shore offices. Synchronize data automatically when
            connectivity is available.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Platform Overview -->
  <section class="platform" id="platform">
    <div class="container">
      <div class="platform-grid">
        <div class="platform-content">
          <h3>Our Platform</h3>
          <h2>Designed For Maritime Operations</h2>
          <p>MarineTech provides a comprehensive, easy-to-use platform that connects all aspects of your fleet management
            into one unified system. Our software works seamlessly both online and offline, ensuring you have access to
            critical information wherever you are.</p>
          <p>Built by maritime professionals for maritime professionals, our solution addresses the unique challenges of
            vessel operations.</p>
          <div class="platform-features">
            <div class="platform-feature">
              <div class="check-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              </div>
              <p>Works offline with automatic synchronization</p>
            </div>
            <div class="platform-feature">
              <div class="check-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              </div>
              <p>Secure cloud-based data storage with encryption</p>
            </div>
            <div class="platform-feature">
              <div class="check-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              </div>
              <p>Mobile-friendly interface for on-the-go access</p>
            </div>
            <div class="platform-feature">
              <div class="check-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              </div>
              <p>Customizable dashboards and reporting tools</p>
            </div>
          </div>
        </div>
        <div class="platform-image">
          <img src="https://drive.google.com/thumbnail?id=15I9OUgG-X0EU7hlj-4mJn496tYhA9SxE&sz=w1000"
            alt="Marine Nexus Platform Dashboard">
        </div>
      </div>
    </div>
  </section>

  <!-- Benefits Section -->
  <section class="benefits" id="benefits">
    <div class="container">
      <div class="section-header">
        <h3>Why Choose Us</h3>
        <h2>Results That Matter</h2>
      </div>
      <div class="benefits-wrapper">
        <div class="benefits-content">
          <h2>Transform Your Maritime Operations</h2>
          <p>Our clients experience significant improvements in operational efficiency, cost savings, and compliance.
            MarineNexus helps you reduce downtime, optimize inventory, and make data-driven decisions.</p>
          <div class="stat-grid">
            <div class="stat-item">
              <div class="stat-number">37%</div>
              <div class="stat-label">Reduction in Maintenance Costs</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">42%</div>
              <div class="stat-label">Decrease in Unplanned Downtime</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">29%</div>
              <div class="stat-label">Inventory Cost Savings</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">98%</div>
              <div class="stat-label">Compliance Rate</div>
            </div>
          </div>
        </div>
        <div class="benefits-image">
          <img src="https://drive.google.com/thumbnail?id=1rNjyOMILpTrkL-q-1T-gKL-aEpKjBn1s&sz=w1000"
            alt="Marine vessel operations">
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="testimonials" id="testimonials">
    <div class="container">
      <div class="section-header">
        <h3>Testimonials</h3>
        <h2>What Our Clients Say</h2>
      </div>
      <div class="testimonial-card">
        <div class="testimonial-text">
          "MarineTech has revolutionized how we manage our fleet. The maintenance scheduling and inventory tracking
          features have saved us countless hours and significantly reduced our operational costs. The ability to share
          data between vessels and our shore office has been a game-changer for our operations."
        </div>
        <div class="testimonial-author">
          <div class="author-image">
            <img src="https://drive.google.com/thumbnail?id=15I9OUgG-X0EU7hlj-4mJn496tYhA9SxE&sz=w1000"
              alt="Captain James Miller">
          </div>
          <div class="author-info">
            <h4>Engr. Emmanuel Ukoh</h4>
            <p>Marine Superintendent Oromena.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta" id="demo">
    <div class="container">
      <h2>Ready to Transform Your Maritime Operations?</h2>
      <p>Schedule a personalized demo today and discover how MarineTech can help your fleet operate more efficiently.</p>
      <a @click="contactDemo()" class="primary-button">Request Demo</a>
    </div>
  </section>

  <!-- Footer -->
  <FooterView />
</template>

<script>
import NavBar from '../components/NavBar.vue'
import FooterView from '../components/FooterView.vue'
export default {
  name: 'HomeView',
  components: { NavBar, FooterView },

  methods: {
    contactDemo() {
      Swal.fire({
        title: 'Contact Us',
        html: `
                  <p>(Request Demo or General Enquiries)</p>
                    <div class="custom-swal-content">
                        <label class="custom-input-label" for="fullname">Full Name *</label>
                        <input id="fullname" class="custom-input" placeholder="Enter your full name">
                        <div id="fullname-error" class="error-message">Please enter your full name</div>
                        
                        <label class="custom-input-label" for="email">Email Address *</label>
                        <input id="email" class="custom-input" placeholder="Enter your email address">
                        <div id="email-error" class="error-message">Please enter a valid email address</div>
                        
                        <label class="custom-input-label" for="message">Message *</label>
                        <textarea id="message" class="custom-input custom-textarea" placeholder="Type your message here..."></textarea>
                        <div id="message-error" class="error-message">Please enter your message</div>
                    </div>
                `,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        customClass: {
          container: 'custom-swal-container',
          popup: 'custom-swal-popup',
          title: 'custom-swal-title'
        },
        preConfirm: () => {
          // Validate inputs
          let isValid = true;
          const fullname = document.getElementById('fullname').value.trim();
          const email = document.getElementById('email').value.trim();
          const message = document.getElementById('message').value.trim();

          // Reset error messages
          document.getElementById('fullname-error').style.display = 'none';
          document.getElementById('email-error').style.display = 'none';
          document.getElementById('message-error').style.display = 'none';

          // Validate full name
          if (!fullname) {
            document.getElementById('fullname-error').style.display = 'block';
            isValid = false;
          }

          // Validate email with regex
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!email || !emailRegex.test(email)) {
            document.getElementById('email-error').style.display = 'block';
            isValid = false;
          }

          // Validate message
          if (!message) {
            document.getElementById('message-error').style.display = 'block';
            isValid = false;
          }

          if (!isValid) {
            return false; // Prevent the modal from closing
          }

          // Return the form data if valid
          return { fullname, email, message };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          // Process the form data
          const { fullname, email, message } = result.value;

          // Here you would typically send this data to your server
          console.log('Form submitted:', { fullname, email, message });

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
        }
      });
    }
  }
}
</script>

<style>
button {
  background-color: #349940;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0f5e04;
}

/* SweetAlert custom styling */
.custom-swal-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.custom-swal-popup {
  padding: 2rem;
  border-radius: 15px;
}

.custom-swal-title {
  color: #349940;
  font-weight: 600;
  margin-bottom: 1rem;
}

.custom-swal-content {
  margin-top: 1.5rem;
}

.custom-input-label {
  text-align: left;
  display: block;
  margin-bottom: 5px;
  color: #1d3244;
  font-weight: 500;
  font-size: 0.9rem;
}

.custom-input {
  width: 100%;
  padding: 10px 15px;
  margin-bottom: 15px;
  border: 1px solid #d1d9e6;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.custom-input:focus {
  border-color: #349940;
  outline: none;
  box-shadow: 0 0 0 3px rgba(98, 181, 229, 0.2);
}

.custom-textarea {
  min-height: 120px;
  resize: vertical;
}

.swal2-confirm {
  background-color: #0f5e04 !important;
  border-radius: 8px !important;
  padding: 12px 30px !important;
  font-weight: 600 !important;
  transition: background-color 0.3s !important;
}

.swal2-confirm:hover {
  background-color: #062e01 !important;
}

.swal2-cancel {
  background-color: #f5f5f5 !important;
  color: #333 !important;
  border-radius: 8px !important;
  padding: 12px 30px !important;
  font-weight: 600 !important;
  transition: background-color 0.3s !important;
}

.swal2-cancel:hover {
  background-color: #e5e5e5 !important;
}

.error-message {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: -10px;
  margin-bottom: 10px;
  text-align: left;
  display: none;
}
</style>