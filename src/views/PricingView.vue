<template>
  <!-- Header -->
  <NavBar />
  <!-- Hero Section -->
  <section class="hero">
    <div class="container">
      <h2>Pricing<br>That Works For You</h2>
      <p>Our flexible pricing allows you to pay for what you need. Get multiple vessels in your fleet all in one place or
        group them.</p>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta" id="demo">
    <div class="container">
      <h2>Ready to Transform Your Maritime Operations?</h2>
      <p>Schedule a personalized demo today and discover how OceanHelm can help your fleet operate more efficiently.</p>
      <a href="/contact" class="primary-button">Request Demo</a>
    </div>
  </section>

  <!-- Footer -->
  <FooterView />
</template>
  
<script>
import NavBar from '../components/NavBar.vue'
import FooterView from '../components/FooterView.vue'
import { useHead } from '@vueuse/head'

export default {
  name: 'PricingView',
  components: { NavBar, FooterView },
  setup() {
    useHead({
      title: 'Pricing Plans - Affordable Maritime Software | OceanHelm',
      meta: [
        {
          name: 'description',
          content: 'Transparent pricing for OceanHelm maritime fleet management software. Flexible plans for vessel operators, ship managers, and maritime companies in Nigeria and West Africa.'
        }
      ]
    })
  }

}
</script>
  
<style scoped>
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

/* These Bootstrap overrides are optional but help match your color scheme */
.text-primary {
  color: var(--primary) !important;
}

.text-info {
  color: var(--secondary) !important;
}

.btn-primary {
  background-color: var(--primary);
  border-color: var(--primary);
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  color: var(--dark);
  line-height: 1.6;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header & Navigation */
header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  z-index: 1000;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 40px;
  margin-right: 10px;
}

.logo h1 {
  color: var(--primary-dark);
  font-size: 24px;
  font-weight: 700;
}

.logo span {
  color: var(--secondary);
}

nav ul {
  display: flex;
  list-style: none;
}

nav li {
  margin-left: 25px;
}

nav a {
  text-decoration: none;
  color: var(--dark);
  font-weight: 600;
  font-size: 16px;
  transition: color 0.3s;
}

nav a:hover {
  color: var(--primary);
}

.cta-button {
  background-color: var(--primary);
  color: white;
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: var(--primary-dark);
  color: white;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, rgba(13, 92, 145, 0.9) 0%, rgba(4, 57, 94, 0.8) 100%), url("https://drive.google.com/thumbnail?id=15I9OUgG-X0EU7hlj-4mJn496tYhA9SxE&sz=w1000") center/cover no-repeat;
  color: white;
  padding: 180px 0 100px;
  text-align: center;
}

.hero h2 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.hero p {
  font-size: 20px;
  max-width: 700px;
  margin: 0 auto 40px;
}

.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.primary-button {
  background-color: var(--accent);
  color: white;
  padding: 14px 32px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 18px;
  text-decoration: none;
  transition: transform 0.3s, background-color 0.3s;
}

.primary-button:hover {
  transform: translateY(-3px);
  background-color: #0f5e04;
}

.secondary-button {
  background-color: transparent;
  color: white;
  border: 2px solid white;
  padding: 14px 32px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 18px;
  text-decoration: none;
  transition: transform 0.3s, background-color 0.3s;
}

.secondary-button:hover {
  transform: translateY(-3px);
  background-color: rgba(255, 255, 255, 0.1);
}

/* Features Section */
.features {
  padding: 100px 0;
  background-color: var(--light);
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-header h3 {
  color: var(--primary);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.section-header h2 {
  font-size: 36px;
  font-weight: 700;
  color: var(--dark);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 30px;
}

.feature-card {
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(13, 92, 145, 0.1);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-icon {
  background-color: rgba(98, 181, 229, 0.15);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
}

.feature-icon svg {
  width: 35px;
  height: 35px;
  fill: var(--secondary);
}

.feature-card h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: var(--primary-dark);
}

/* Platform Overview */
.platform {
  padding: 100px 0;
}



.platform-content h3 {
  color: var(--primary);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.platform-content h2 {
  font-size: 36px;
  margin-bottom: 25px;
  color: var(--dark);
}

.platform-content p {
  margin-bottom: 30px;
  font-size: 18px;
  color: var(--gray);
}

.platform-features {
  margin-top: 30px;
}

.platform-feature {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.check-icon {
  width: 24px;
  height: 24px;
  background-color: rgba(98, 181, 229, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.check-icon svg {
  width: 14px;
  height: 14px;
  fill: var(--secondary);
}

.platform-feature p {
  margin-bottom: 0;
  font-size: 16px;
}

.platform-image {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(13, 92, 145, 0.15);
}

.platform-image img {
  width: 100%;
  height: auto;
  display: block;
}

/* Benefits Section */
.benefits {
  padding: 100px 0;
  background-color: var(--light);
}

.benefits-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 60px;
}

.benefits-content {
  flex: 1;
}

.benefits-image {
  flex: 1;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(13, 92, 145, 0.15);
}

.benefits-image img {
  width: 100%;
  height: auto;
  display: block;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-top: 40px;
}

.stat-item {
  text-align: center;
  background-color: white;
  padding: 30px 20px;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(13, 92, 145, 0.08);
  margin: 0 10px 10px 10px;
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 5px;
}

.stat-label {
  font-size: 16px;
  color: var(--gray);
}

/* Testimonials */
.testimonials {
  padding: 100px 0;
  text-align: center;
}

.testimonial-card {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 15px 30px rgba(13, 92, 145, 0.1);
}

.testimonial-text {
  font-size: 20px;
  font-style: italic;
  margin-bottom: 30px;
  color: var(--dark);
  line-height: 1.8;
}

.testimonial-author {
  display: flex;
  align-items: center;
  justify-content: center;
}

.author-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
}

.author-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info h4 {
  font-size: 18px;
  margin-bottom: 5px;
  color: var(--dark);
}

.author-info p {
  font-size: 14px;
  color: var(--gray);
}

/* CTA Section */
.cta {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  padding: 80px 0;
  color: white;
  text-align: center;
}

.cta h2 {
  font-size: 36px;
  margin-bottom: 20px;
}

.cta p {
  font-size: 18px;
  max-width: 600px;
  margin: 0 auto 40px;
}

.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 40px 20px;
  margin: 20px auto;
  max-width: 1200px;
}

.video-wrapper {
  position: relative;
  width: 100%;
  max-width: 800px;
  padding-bottom: 45%;
  /* 16:9 aspect ratio (9/16 * 100) */
  height: 0;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

@media (max-width: 768px) {
  .video-container {
    padding: 20px 15px;
    margin: 10px;
  }

  .video-wrapper {
    padding-bottom: 56.25%;
    /* Maintain 16:9 on mobile */
  }
}
</style>