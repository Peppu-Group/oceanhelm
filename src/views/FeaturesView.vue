<template>
    <NavBar />

    <!-- Hero Section -->
    <section class="features-hero">
        <div class="container">
            <h1>Our Offering</h1>
            <p>Discover how OceanHelm's comprehensive suite of features helps maritime companies streamline operations,
                reduce costs, and maintain compliance.</p>
        </div>
    </section>

    <!-- Quick Navigation -->
    <section class="features-nav">
        <div class="container">
            <div class="nav-grid">
                <a href="#maintenance" class="nav-card">
                    <div class="nav-icon">
                        <svg viewBox="0 0 24 24">
                            <path
                                d="M19.5 12c0-.34-.03-.66-.07-.99l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.51-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0014 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.33-.07.66-.07.99s.03.66.07.99l-2.11 1.63c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.51.39 1.06.73 1.69.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.25 1.17-.59 1.69-.98l2.49 1c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.63c.04-.33.07-.65.07-.99zm-7.5 4c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                        </svg>
                    </div>
                    <h3>Maintenance</h3>
                </a>
                <a href="#inventory" class="nav-card">
                    <div class="nav-icon">
                        <svg viewBox="0 0 24 24">
                            <path
                                d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z" />
                        </svg>
                    </div>
                    <h3>Inventory</h3>
                </a>
                <a href="#requisition" class="nav-card">
                    <div class="nav-icon">
                        <svg viewBox="0 0 24 24">
                            <path
                                d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
                        </svg>
                    </div>
                    <h3>Requisitions</h3>
                </a>
                <a href="#crew" class="nav-card">
                    <div class="nav-icon">
                        <svg viewBox="0 0 24 24">
                            <path
                                d="M16 1H8C6.34 1 5 2.34 5 4v16c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V4c0-1.66-1.34-3-3-3zm-2 20h-4v-1h4v1zm3.25-3H6.75V4h10.5v14z" />
                        </svg>
                    </div>
                    <h3>Crew</h3>
                </a>
                <a href="#voyage" class="nav-card">
                    <div class="nav-icon">
                        <svg viewBox="0 0 64 64" width="24" height="24">
                            <path
                                d="M2 42l4 8h52l4-8-8-4v-8H10v8l-8 4zM32 10c-1.1 0-2 .9-2 2v6H14v4h36v-4H34v-6c0-1.1-.9-2-2-2zm0-6c-2.2 0-4 1.8-4 4v2h8v-2c0-2.2-1.8-4-4-4z" />
                        </svg>
                    </div>
                    <h3>Voyage</h3>
                </a>
                <a href="#compliance" class="nav-card">
                    <div class="nav-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path
                                d="M20 2H4C2.9 2 2 2.9 2 4v17.17c0 .53.21 1.04.59 1.41.38.38.89.59 1.41.59.26 0 .51-.05.75-.15L12 20.25l7.25 2.77c.24.1.49.15.75.15.52 0 1.03-.21 1.41-.59.38-.37.59-.88.59-1.41V4c0-1.1-.9-2-2-2zm0 17.17l-6.25-2.39a1.01 1.01 0 0 0-.75 0L4 19.17V4h16v15.17z" />
                        </svg>
                    </div>
                    <h3>Compliance</h3>
                </a>
            </div>
        </div>
    </section>

    <!-- Maintenance Management -->
    <section class="feature-detail" id="maintenance">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <div class="feature-badge">Maintenance Management</div>
                    <h2>Preventive Maintenance System for Maritime Operations</h2>
                    <p class="lead">Reduce unplanned downtime by up to 42% with our comprehensive maintenance management
                        system designed specifically for maritime fleets.</p>

                    <p>OceanHelm's maintenance management module helps you plan, schedule, and track all maintenance
                        activities across your entire fleet. Our preventive maintenance system (PMS) ensures that critical
                        equipment and systems are maintained according to manufacturer specifications, class requirements,
                        and your company's operational procedures.</p>

                    <h3>Key Maintenance Features</h3>
                    <ul class="feature-list">
                        <li><strong>Planned Maintenance Scheduling:</strong> Create and manage comprehensive maintenance
                            schedules based on running hours, calendar intervals, or operational conditions. Set up
                            recurring tasks and receive automated reminders before maintenance is due.</li>
                        <li><strong>Work Order Management:</strong> Generate, assign, and track work orders from creation to
                            completion. Include detailed instructions, safety procedures, required spare parts, and
                            estimated time for each task.</li>
                        <li><strong>Equipment History Tracking:</strong> Maintain complete maintenance history for every
                            piece of equipment on every vessel. Track repairs, replacements, and modifications to identify
                            patterns and predict future maintenance needs.</li>
                        <li><strong>Spare Parts Integration:</strong> Automatically link maintenance tasks to required spare
                            parts. When a work order is created, the system checks inventory availability and can trigger
                            requisitions for parts that need to be ordered.</li>
                        <li><strong>Mobile Access:</strong> Engineers and crew can access maintenance schedules, complete
                            work orders, and update equipment status directly from their mobile devices, even when offline.
                        </li>
                        <li><strong>Reporting and Analytics:</strong> Generate comprehensive reports on maintenance costs,
                            equipment reliability, mean time between failures (MTBF), and maintenance backlog. Identify
                            trends and optimize your maintenance strategy.</li>
                    </ul>

                    <h3>Benefits of Digital Maintenance Management</h3>
                    <ul class="benefit-list">
                        <li>Reduce maintenance costs by 37% through better planning and resource allocation</li>
                        <li>Decrease unplanned vessel downtime by 42% with proactive maintenance</li>
                        <li>Improve crew productivity with mobile work order management</li>
                        <li>Ensure regulatory compliance with automated maintenance tracking</li>
                        <li>Extend equipment lifespan through proper preventive maintenance</li>
                        <li>Make data-driven decisions with comprehensive maintenance analytics</li>
                    </ul>
                </div>
                <div class="col-lg-6">
                    <div class="feature-image">
                        <img src="https://drive.google.com/thumbnail?id=1rNjyOMILpTrkL-q-1T-gKL-aEpKjBn1s&sz=w1000"
                            alt="OceanHelm maintenance management dashboard showing scheduled maintenance tasks and equipment history"
                            class="img-fluid rounded shadow" loading="lazy">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Inventory Management -->
    <section class="feature-detail alt" id="inventory">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 order-lg-2">
                    <div class="feature-badge">Inventory Management</div>
                    <h2>Real-Time Spare Parts and Inventory Control</h2>
                    <p class="lead">Optimize inventory levels and reduce carrying costs by 29% while ensuring critical spare
                        parts are always available when needed.</p>

                    <p>Managing spare parts inventory across multiple vessels is complex. OceanHelm's inventory management
                        system provides real-time visibility into stock levels across your entire fleet, helps you maintain
                        optimal inventory levels, and ensures that critical spare parts are available when maintenance is
                        due.</p>

                    <h3>Inventory Management Capabilities</h3>
                    <ul class="feature-list">
                        <li><strong>Multi-Location Inventory Tracking:</strong> Track spare parts and consumables across all
                            vessels, warehouses, and shore facilities. Know exactly where every item is located in
                            real-time.</li>
                        <li><strong>Automatic Reorder Alerts:</strong> Set minimum and maximum stock levels for each item.
                            The system automatically alerts you when stock falls below minimum levels and suggests optimal
                            reorder quantities.</li>
                        <li><strong>Barcode and QR Code Support:</strong> Speed up inventory counts and issue/receipt
                            transactions with barcode scanning. Generate and print labels for all inventory items.</li>
                        <li><strong>Integration with Maintenance:</strong> When maintenance tasks are scheduled, the system
                            checks spare parts availability and reserves items for upcoming work orders. This prevents
                            stock-outs during critical maintenance activities.</li>
                        <li><strong>Supplier Management:</strong> Maintain a database of approved suppliers with pricing
                            history, lead times, and quality ratings. Automatically select the best supplier when generating
                            purchase requisitions.</li>
                        <li><strong>Inventory Valuation:</strong> Track inventory value using FIFO, LIFO, or weighted
                            average methods. Generate inventory valuation reports for accounting and financial reporting.
                        </li>
                        <li><strong>Usage Analytics:</strong> Analyze consumption patterns to identify fast-moving and
                            slow-moving items. Optimize stock levels based on actual usage data rather than estimates.</li>
                        <li><strong>Expiry Date Tracking:</strong> Monitor items with expiration dates (lubricants,
                            chemicals, medical supplies) and receive alerts before items expire to prevent waste.</li>
                    </ul>

                    <h3>Inventory Optimization Benefits</h3>
                    <ul class="benefit-list">
                        <li>Reduce inventory carrying costs by 29% through better stock optimization</li>
                        <li>Prevent stockouts of critical spare parts with automated reorder alerts</li>
                        <li>Minimize emergency purchases and expedited shipping costs</li>
                        <li>Improve cash flow by reducing excess inventory</li>
                        <li>Ensure audit readiness with complete transaction history</li>
                        <li>Streamline inventory counts with barcode scanning</li>
                    </ul>
                </div>
                <div class="col-lg-6 order-lg-1">
                    <div class="feature-image">
                        <img src="../assets/spare.jpg"
                            alt="Real-time inventory management system showing stock levels across multiple vessels"
                            class="img-fluid rounded shadow" loading="lazy">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Requisition Processing -->
    <section class="feature-detail" id="requisition">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <div class="feature-badge">Requisition Processing</div>
                    <h2>Digital Procurement and Requisition Workflow</h2>
                    <p class="lead">Eliminate paperwork and streamline your procurement process with digital requisition
                        management and automated approval workflows.</p>

                    <p>Traditional paper-based requisition processes are slow, error-prone, and difficult to track.
                        OceanHelm's digital requisition system transforms procurement by enabling crews to submit requests
                        electronically, automating approval workflows, and providing complete visibility into the status of
                        every requisition from submission to delivery.</p>

                    <h3>Requisition Management Features</h3>
                    <ul class="feature-list">
                        <li><strong>Digital Requisition Forms:</strong> Crews can submit requisitions electronically from
                            their mobile devices or computers. The system automatically populates item details from the
                            inventory database to ensure accuracy and consistency.</li>
                        <li><strong>Multi-Level Approval Workflow:</strong> Configure customizable approval workflows based
                            on requisition type, value, or item category. Route requisitions automatically to the
                            appropriate approvers (Chief Engineer, Superintendent, Procurement Manager).</li>
                        <li><strong>Budget Control:</strong> Set budget limits for different vessels, departments, or cost
                            centers. The system prevents requisitions that exceed allocated budgets and provides real-time
                            budget vs. actual spending reports.</li>
                        <li><strong>Vendor Quote Management:</strong> Request quotes from multiple suppliers directly
                            through the system. Compare quotes side-by-side and select the best option based on price,
                            delivery time, and quality.</li>
                        <li><strong>Purchase Order Generation:</strong> Once requisitions are approved, automatically
                            generate purchase orders and send them to suppliers via email. Track order status and expected
                            delivery dates.</li>
                        <li><strong>Receiving and Matching:</strong> When items are delivered, easily match receipts against
                            purchase orders and requisitions. The system automatically updates inventory levels and closes
                            completed requisitions.</li>
                        <li><strong>Urgent Requisition Handling:</strong> Flag urgent requisitions for priority processing.
                            Send automated notifications to approvers for items needed immediately to minimize vessel
                            downtime.</li>
                        <li><strong>Complete Audit Trail:</strong> Every action is logged with timestamp and user
                            information. Generate comprehensive audit reports showing who requested, approved, and received
                            each item.</li>
                    </ul>

                    <h3>Procurement Efficiency Benefits</h3>
                    <ul class="benefit-list">
                        <li>Reduce requisition processing time from days to hours</li>
                        <li>Eliminate lost or delayed paper requisitions</li>
                        <li>Improve budget control with real-time spending visibility</li>
                        <li>Reduce procurement costs through better vendor management</li>
                        <li>Ensure compliance with procurement policies and procedures</li>
                        <li>Provide complete transparency into requisition status</li>
                        <li>Minimize emergency purchases through better planning</li>
                    </ul>
                </div>
                <div class="col-lg-6">
                    <div class="feature-image">
                        <img src="../assets/app.jpg"
                            alt="Digital requisition processing system with approval workflow"
                            class="img-fluid rounded shadow" loading="lazy">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Crew Management -->
    <section class="feature-detail alt" id="crew">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 order-lg-2">
                    <div class="feature-badge">Crew Management</div>
                    <h2>Comprehensive Crew Records and Certification Tracking</h2>
                    <p class="lead">Manage crew assignments, track certifications, and ensure regulatory compliance across
                        your entire fleet.</p>

                    <p>Maintaining accurate crew records and ensuring all certifications are current is critical for
                        maritime operations. OceanHelm's crew management module provides a centralized database for all crew
                        information, automated alerts for expiring certificates, and seamless synchronization between
                        vessels and shore offices.</p>

                    <h3>Crew Management Capabilities</h3>
                    <ul class="feature-list">
                        <li><strong>Crew Database:</strong> Maintain comprehensive records for all seafarers including
                            personal information, contact details, next of kin, emergency contacts, and employment history.
                        </li>
                        <li><strong>Certification Tracking:</strong> Track all required certificates including STCW, medical
                            certificates, national certificates, and company-specific training. Receive alerts before
                            certificates expire.</li>
                        <li><strong>Crew Assignments:</strong> Assign crew to vessels and track current positions. Manage
                            crew changes and maintain historical records of all assignments.</li>
                        <li><strong>Document Management:</strong> Store digital copies of all crew documents including
                            certificates, passport copies, seaman books, and training records. Access documents instantly
                            from anywhere.</li>
                        <li><strong>Training Records:</strong> Track completed training courses, safety drills, and
                            competency assessments. Ensure crew members meet all training requirements for their positions.
                        </li>
                        <li><strong>Rest Hours Compliance:</strong> Monitor crew working hours and rest periods to ensure
                            compliance with MLC 2006 requirements. Generate rest hours reports for inspections.</li>
                        <li><strong>Offline Synchronization:</strong> Update crew records onboard vessels even without
                            internet connectivity. Changes automatically sync when connection is restored.</li>
                    </ul>
                </div>
                <div class="col-lg-6 order-lg-1">
                    <div class="feature-image">
                        <img src="../assets/crew.png"
                            alt="Crew management system showing certification tracking and assignments"
                            class="img-fluid rounded shadow" loading="lazy">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Voyage Management -->
    <section class="feature-detail" id="voyage">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <div class="feature-badge">Voyage Management</div>
                    <h2>Fleet Positioning and Voyage Tracking</h2>
                    <p class="lead">Manage vessel logistics, track voyages, and generate comprehensive operational reports
                        for your entire fleet.</p>

                    <p>Effective fleet management requires real-time visibility into vessel locations, voyage progress, and
                        operational status. OceanHelm's voyage management module provides tools to track vessel movements,
                        manage sign-in/sign-out procedures, and generate detailed timesheet reports for billing and
                        operational analysis.</p>

                    <h3>Voyage Management Features</h3>
                    <ul class="feature-list">
                        <li><strong>Fleet Overview:</strong> View the current status and location of all vessels in your
                            fleet on a single dashboard. Quickly identify vessels that are operational, in port, under
                            maintenance, or off-hire.</li>
                        <li><strong>Voyage Planning:</strong> Create voyage plans including departure port, destination,
                            expected arrival time, cargo details, and operational requirements.</li>
                        <li><strong>Sign-In/Sign-Out Management:</strong> Track when vessels sign in and out of service.
                            Record reasons for off-hire periods and maintain detailed operational logs.</li>
                        <li><strong>Timesheet Generation:</strong> Automatically generate timesheet reports showing
                            operational hours, off-hire periods, and billable time. Export reports for invoicing and client
                            reporting.</li>
                        <li><strong>Position Reporting:</strong> Crews can submit position reports including coordinates,
                            weather conditions, fuel consumption, and operational status. Track voyage progress in
                            real-time.</li>
                        <li><strong>Charter Management:</strong> Manage charter agreements, track hire periods, and
                            calculate hire payments based on operational time.</li>
                        <li><strong>Operational Dashboards:</strong> View key performance indicators including fleet
                            utilization, average voyage duration, on-hire percentage, and revenue per day.</li>
                    </ul>
                </div>
                <div class="col-lg-6">
                    <div class="feature-image">
                        <img src="../assets/features.jpg"
                            alt="Voyage management dashboard showing fleet positioning and operational status"
                            class="img-fluid rounded shadow" loading="lazy">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Compliance Management -->
    <section class="feature-detail alt" id="compliance">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 order-lg-2">
                    <div class="feature-badge">Compliance Management</div>
                    <h2>Regulatory Compliance and Certificate Tracking</h2>
                    <p class="lead">Maintain 98%+ compliance rates with automated tracking of vessel certificates, crew
                        qualifications, and regulatory requirements.</p>

                    <p>Maritime operations face extensive regulatory requirements from international conventions (SOLAS,
                        MARPOL, MLC), flag state regulations, port state control, and class societies. OceanHelm's
                        compliance management module helps you stay ahead of all requirements by tracking certificates,
                        scheduling surveys, and providing timely alerts before deadlines.</p>

                    <h3>Compliance Management Features</h3>
                    <ul class="feature-list">
                        <li><strong>Certificate Tracking:</strong> Track all vessel statutory certificates including safety
                            certificates, class certificates, insurance documents, and permits. Store digital copies and
                            receive alerts before expiration.</li>
                        <li><strong>Survey Scheduling:</strong> Plan and schedule annual, intermediate, special, and renewal
                            surveys. Track survey findings and ensure corrective actions are completed before deadlines.
                        </li>
                        <li><strong>ISM Code Compliance:</strong> Manage your Safety Management System (SMS) procedures,
                            conduct internal audits, track non-conformities, and maintain complete records for ISM
                            compliance.</li>
                        <li><strong>Port State Control Preparation:</strong> Maintain audit-ready documentation for PSC
                            inspections. Track deficiencies from previous inspections and verify corrective actions have
                            been completed.</li>
                        <li><strong>Environmental Compliance:</strong> Track MARPOL compliance including oil record book
                            entries, garbage management, ballast water treatment, and emissions monitoring.</li>
                        <li><strong>Safety Drills and Training:</strong> Schedule and document required safety drills (fire,
                            abandon ship, security) and training sessions. Ensure all crew members participate as required
                            by regulations.</li>
                        <li><strong>Incident Reporting:</strong> Document accidents, injuries, near misses, and
                            environmental incidents. Conduct investigations, implement corrective actions, and maintain
                            reports for regulatory submissions.</li>
                        <li><strong>Regulatory Updates:</strong> Stay informed about changes to maritime regulations and
                            ensure your fleet remains compliant with new requirements.</li>
                    </ul>

                    <h3>Compliance Benefits</h3>
                    <ul class="benefit-list">
                        <li>Maintain 98%+ compliance rates across your fleet</li>
                        <li>Avoid costly penalties from expired certificates or non-compliance</li>
                        <li>Pass port state control inspections with audit-ready documentation</li>
                        <li>Reduce time spent preparing for audits and surveys</li>
                        <li>Demonstrate due diligence to clients, insurers, and regulators</li>
                        <li>Improve safety culture through systematic incident tracking</li>
                    </ul>
                </div>
                <div class="col-lg-6 order-lg-1">
                    <div class="feature-image">
                        <img src="../assets/cert.png"
                            alt="Compliance management system tracking vessel certificates and regulatory requirements"
                            class="img-fluid rounded shadow" loading="lazy">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Additional Features -->
    <section class="additional-features">
        <div class="container">
            <h2 class="section-title">Additional Platform Capabilities</h2>
            <div class="capability-grid">
                <div class="capability-card teal">
                    <div class="card-content">
                        <h3>Data Security</h3>
                        <p>Your data is protected with high-level encryption both in transit and at rest. Regular automated
                            backups ensure data is never lost, and our infrastructure meets international security standards
                            including ISO 27001 compliance.</p>
                    </div>
                    <div class="card-image-wrapper">
                        <div class="card-image-circle">
                            <img src="../assets/secure.jpg" alt="Data Security" />
                        </div>
                    </div>
                </div>

                <div class="capability-card navy">
                    <div class="card-content">
                        <h3>Offline Functionality</h3>
                        <p>OceanHelm works seamlessly offline. All data is stored locally on devices and automatically syncs
                            with the cloud when internet connectivity is restored. This ensures operations continue
                            uninterrupted even in remote locations with limited connectivity.</p>
                    </div>
                    <div class="card-image-wrapper">
                        <div class="card-image-circle">
                            <img src="../assets/offline.jpg" alt="Offline Functionality" />
                        </div>
                    </div>
                </div>

                <div class="capability-card teal">
                    <div class="card-content">
                        <h3>Mobile Applications</h3>
                        <p>Access OceanHelm from any device including smartphones, tablets, laptops, and desktop computers.
                            Our responsive design ensures optimal user experience regardless of screen size, and native
                            mobile apps provide enhanced offline capabilities.</p>
                    </div>
                    <div class="card-image-wrapper">
                        <div class="card-image-circle">
                            <img src="../assets/app.jpg" alt="Mobile Applications" />
                        </div>
                    </div>
                </div>

                <div class="capability-card slate">
                    <div class="card-content">
                        <h3>Customizable Dashboards</h3>
                        <p>Create personalized dashboards showing the metrics most important to your role. Fleet managers,
                            superintendents, engineers, and administrators can each configure their dashboard to display
                            relevant KPIs and quick access to frequently used features.</p>
                    </div>
                    <div class="card-image-wrapper">
                        <div class="card-image-circle">
                            <img src="../assets/dashboard.jpg" alt="Customizable Dashboards" />
                        </div>
                    </div>
                </div>

                <div class="capability-card navy">
                    <div class="card-content">
                        <h3>Comprehensive Reporting</h3>
                        <p>Generate detailed reports on maintenance activities, inventory consumption, procurement spending,
                            crew performance, vessel utilization, and compliance status. Export reports to Excel, PDF, or
                            CSV formats for further analysis.</p>
                    </div>
                    <div class="card-image-wrapper">
                        <div class="card-image-circle">
                            <img src="../assets/features.jpg" alt="Comprehensive Reporting" />
                        </div>
                    </div>
                </div>

                <div class="capability-card slate">
                    <div class="card-content">
                        <h3>Role-Based Access Control</h3>
                        <p>Secure your data with granular permission settings. Define user roles and assign specific
                            permissions to control who can view, edit, or delete different types of information. Maintain
                            complete audit trails of all user actions.</p>
                    </div>
                    <div class="card-image-wrapper">
                        <div class="card-image-circle">
                            <img src="../assets/secure.jpg" alt="Role-Based Access Control" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <FooterView />
</template>
  
<script>
import NavBar from '../components/NavBar.vue'
import FooterView from '../components/FooterView.vue'
import { useHead } from '@vueuse/head'

export default {
    name: 'FeaturesView',
    components: { NavBar, FooterView },

    setup() {
    useHead({
      title: 'Features',
      meta: [
        {
          name: 'description',
          content: 'Explore OceanHelm\'s comprehensive features: maintenance management, inventory control, requisition processing, crew management, voyage tracking, and compliance management for maritime fleets.'
        },
        {
          property: 'og:title',
          content: 'Features | OceanHelm'
        },
        {
          property: 'og:description',
          content: 'Comprehensive maritime management features including maintenance, inventory, requisitions, crew management, and compliance tracking.'
        }
      ]
    })
  }
}
</script>
  
<style scoped>
/* Hero Section */
.features-hero {
    background: linear-gradient(135deg, rgba(13, 92, 145, 0.9) 0%, rgba(4, 57, 94, 0.8) 100%), url("../assets/features.jpg") center/cover no-repeat;
    color: white;
    padding: 150px 0 80px;
    min-height: 80vh;

    /* Center vertically & horizontally */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    text-align: center;
}

.features-hero h1 {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 20px;
}

.features-hero p {
    font-size: 20px;
    max-width: 800px;
    margin: 0 auto;
}

/* Quick Navigation */
.features-nav {
    padding: 60px 0;
    background-color: var(--light);
}

.nav-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
}

.nav-card {
    background: var(--light);
    padding: 30px 20px;
    border-radius: 10px;
    text-align: center;
    text-decoration: none;
    color: #333;
    transition: transform 0.3s, box-shadow 0.3s;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(13, 92, 145, 0.2);
}

.nav-icon {
    width: 60px;
    height: 60px;
    background: rgba(98, 181, 229, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
}

.nav-icon svg {
    width: 30px;
    height: 30px;
    fill: #62B5E5;
}

.nav-card h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
}

/* Feature Details */
.feature-detail {
    padding: 100px 0;
}

.feature-detail.alt {
    background: var(--light)
}

.feature-badge {
    display: inline-block;
    background: rgba(98, 181, 229, 0.15);
    color: #0D5C91;
    padding: 8px 20px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 20px;
}

.feature-detail h2 {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 20px;
    color: #04395E;
}

.feature-detail h3 {
    font-size: 24px;
    font-weight: 600;
    margin: 30px 0 20px 0;
    color: #0D5C91;
}

.additional-features {
    padding: 5rem 0;
    background-color: hsl(210 20% 98%);
}

.additional-features .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
}

.additional-features h2.section-title {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.25rem;
    font-weight: 700;
    color: hsl(200 50% 15%);
}

.capability-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
}

@media (max-width: 1024px) {
    .capability-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .capability-grid {
        grid-template-columns: 1fr;
    }
}

.capability-card {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 500px;
    border-radius: 1rem;
    overflow: hidden;
}

.capability-card.navy {
    background-color: hsl(195 50% 22%);
}

.capability-card.teal {
    background-color: hsl(165 35% 30%);
}

.capability-card.slate {
    background-color: hsl(200 15% 45%);
}

.capability-card .card-content {
    position: relative;
    z-index: 10;
    padding: 2rem;
    padding-bottom: 0;
}

.capability-card h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.2;
    color: #ffffff;
}

.capability-card p {
    font-size: 0.875rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.85);
}

.capability-card .card-image-wrapper {
    position: relative;
    margin-top: auto;
    height: 280px;
    width: 100%;
}

.capability-card .card-image-circle {
    position: absolute;
    left: 50%;
    top: 2rem;
    transform: translateX(-50%);
    width: 400px;
    height: 400px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid rgba(255, 255, 255, 0.1);
}

.capability-card .card-image-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Benefit List Styles */
.benefit-list {
    list-style: none;
    padding: 0;
    margin: 1.5rem 0;
}

.benefit-list li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 1.25rem;
    font-size: 1rem;
    line-height: 1.7;
    color: hsl(210 10% 30%);
}

.benefit-list li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.5rem;
    width: 8px;
    height: 8px;
    background-color: var(--primary-dark);
    border-radius: 2px;
}

.benefit-list li strong {
    color: hsl(200 50% 20%);
    font-weight: 700;
}

/* Feature List Styles */
.feature-list {
    list-style: none;
    padding: 0;
    margin: 2rem 0;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.feature-list li {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    background: linear-gradient(135deg, hsl(210 30% 98%) 0%, hsl(200 20% 96%) 100%);
    border-radius: 12px;
    border-left: 4px solid hsl(195 70% 40%);
    box-shadow: 0 2px 8px hsla(200, 30%, 20%, 0.06);
    font-size: 1rem;
    line-height: 1.7;
    color: hsl(210 15% 35%);
    transition: all 0.3s ease;
}

.feature-list li:hover {
    transform: translateX(6px);
    box-shadow: 0 4px 16px hsla(200, 30%, 20%, 0.1);
    border-left-color: var(--primary-dark)
}

.feature-list li::before {
    content: '✓';
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, hsl(195 70% 40%) 0%, hsl(195 60% 35%) 100%);
    color: white;
    font-size: 14px;
    font-weight: 700;
    border-radius: 50%;
    margin-top: 2px;
}

.feature-list li:hover::before {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
}

.feature-list li strong {
    color: hsl(200 50% 20%);
    font-weight: 700;
    display: inline;
}

@media (max-width: 640px) {
    .feature-list li {
        padding: 1rem 1.25rem;
    }

    .feature-list li::before {
        width: 24px;
        height: 24px;
        font-size: 12px;
    }
}</style>