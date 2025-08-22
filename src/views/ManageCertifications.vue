<template>
    <!-- Wave background -->
    <div class="wave-bg"></div>

    <!-- Sidebar Toggle Button -->
    <button class="toggle-btn" id="sidebarToggle">
        <i class="bi bi-list"></i>
    </button>

    <!-- Sidebar -->
    <Sidebar />
    <div id="content">
        <div class="container">
            <div class="header">
                <h1>Certification Management</h1>
                <p>Manage all certifications for your vessel here.</p>
            </div>
            <div class="info-section" style="margin-top: 20px;" id="certifications-app">
                <div class="section-title">
                    Certifications
                    <button @click="showAddModal = true" class="add-cert-btn">
                        <span class="add-icon">+</span> Add Certification
                    </button>
                </div>

                <div class="certifications-grid">
                    <div v-for="(cert, index) in certifications" :key="index" class="certification-card">
                        <div class="cert-image-container">
                            <img :src="cert.image" :alt="cert.name" class="cert-image">
                            <button @click="removeCertification(index)" class="remove-cert-btn"
                                title="Remove certification">×</button>
                        </div>
                        <div class="cert-details">
                            <div class="cert-name">{{ cert.name }}</div>
                            <div class="cert-info">
                                <div class="cert-row">
                                    <span class="cert-label">Expiry Date:</span>
                                    <span class="cert-value">{{ cert.expiry_date }}</span>
                                </div>
                                <div class="cert-row">
                                    <span class="cert-label">Days to Expiry:</span>
                                    <span class="cert-value cert-expiry-days" :class="getExpiryClass(cert.expiry_date)">
                                        {{ getDaysToExpiry(cert.expiry_date) }} days
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="!certifications || certifications.length === 0" class="no-certifications">
                        <p>No certifications added yet.</p>
                    </div>
                </div>

                <!-- Add Certification Modal -->
                <div v-if="showAddModal" class="cert-modal-overlay">
                    <div class="cert-modal">
                        <div class="modal-header">
                            <h3>Add New Certification</h3>
                            <button @click="closeModal" class="modal-close-btn">×</button>
                        </div>

                        <form @submit.prevent="addCertification" class="cert-form">
                            <div class="form-group">
                                <label for="certName">Certificate Name:</label>
                                <input type="text" id="certName" v-model="newCert.name" required class="form-input"
                                    placeholder="Enter certificate name">
                            </div>

                            <div class="form-group">
                                <label for="certExpiry">Expiry Date:</label>
                                <input type="date" id="certExpiry" v-model="newCert.expiry_date" required
                                    class="form-input">
                            </div>

                            <div class="form-group">
                                <label for="certImage">Certificate Image:</label>
                                <div class="image-input-container">
                                    <input type="file" id="certImage" @change="handleImageUpload" accept="image/*"
                                        class="form-input-file">
                                    <div class="image-preview" v-if="newCert.image">
                                        <img :src="newCert.image" alt="Preview" class="preview-image">
                                    </div>
                                    <div v-else class="image-placeholder">
                                        <span>No image selected</span>
                                    </div>
                                </div>
                            </div>

                            <div class="modal-buttons">
                                <button type="button" @click="closeModal" class="btn-cancel">Cancel</button>
                                <button type="submit" class="btn-add" :disabled="saving">
                                    {{ saving ? 'Saving...' : 'Add Certificate' }}
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import supabase from '../supabase';


export default {
    name: 'ManageCertifications',
    components: { Sidebar },

    data() {
        return {
            showAddModal: false,
            certifications: [],
            saving: false,
            imgFile: '',
            newCert: {
                name: '',
                expiry_date: '',
                image: ''
            }
        }
    },
    computed: {
        vessels() {
            return this.$store.getters['vessel/allVessels'];
        },
        company() {
            return {
                vessels: this.vessels,
            };
        }
    },
    mounted() {
        const id = this.$route.params.id;

        this.$store.dispatch('vessel/fetchVessels').then(() => {
            const vesselInfo = this.vessels.find(v => v.registrationNumber === id);
            if (vesselInfo) {
                this.certifications = vesselInfo.certifications;
            }
        });
    },
    methods: {
        getDaysToExpiry(expiry_date) {
            const today = new Date();
            const expiry = new Date(expiry_date);
            const diffTime = expiry - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        },

        getExpiryClass(expiry_date) {
            const days = this.getDaysToExpiry(expiry_date);
            if (days < 30) return 'cert-critical';
            if (days < 90) return 'cert-warning';
            return '';
        },

        updateVesselCert(cert) {
            return this.$store.dispatch('vessel/updateVesselCert', {
                cert,
                id: this.$route.params.id
            });
        },

        generateUUIDv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        async addCertification() {
            if (this.newCert.name && this.newCert.expiry_date) {
                this.saving = true;
                const file = this.imgFile;
                // Set default image if none provided
                if (!this.newCert.image) {
                    Swal.fire({
                        title: "Missing info",
                        text: `Please add image proof`,
                        icon: "error"
                    });
                    this.saving = false;
                    return;
                }

                let cert_id = this.generateUUIDv4();

                const { data, error } = await supabase.storage
                    .from('company-files')
                    .upload(`certifications/${cert_id}.png`, file, {
                        cacheControl: 0,
                        upsert: true
                    });

                if (data) {
                    const filePath = data.path;

                    const { data: publicUrlData, error: urlError } = supabase
                        .storage
                        .from('company-files')
                        .getPublicUrl(filePath);

                    if (urlError) {
                        console.error('Failed to get public URL', urlError);
                        return;
                    }

                    const publicUrl = publicUrlData.publicUrl;
                    this.certifications.push({
                        id: cert_id,
                        name: this.newCert.name,
                        expiry_date: this.newCert.expiry_date,
                        image: this.newCert.image
                    });
                    // add the public URL to cert.
                    const updatedCerts = this.certifications.map(cert => ({
                        id: cert_id,
                        name: cert.name,
                        expiry_date: cert.expiry_date,
                        image: publicUrl
                    }));

                    // update supabase
                    this.updateVesselCert(updatedCerts);

                    this.closeModal();
                }
            }
        },

        async removeCertification(index) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You're about to delete your vessel's certification",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let cert_id = this.certifications[index].id;
                    const filePath = `certifications/${cert_id}.png`;

                    const { data, error: deleteError } = await supabase
                        .storage
                        .from('company-files')
                        .remove([filePath]);

                    if (deleteError) {
                        console.error('Error deleting file:', deleteError);
                    } else {
                        this.certifications.splice(index, 1);
                        // update supabase
                        this.updateVesselCert(this.certifications);
                    }
                }
            })
        },

        handleImageUpload(event) {
            const file = event.target.files[0];
            this.imgFile = file;
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.newCert.image = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },

        closeModal() {
            this.showAddModal = false;
            this.saving = false;
            this.newCert = {
                name: '',
                expiry_date: '',
                image: '',
            };
        }
    }
}
</script>

<style scoped>
#content {
    width: 100%;
    min-height: 100vh;
    transition: all 0.3s;
    position: absolute;
    padding: 20px;
    padding-left: 40px;
}

#content.active {
    margin-left: var(--sidebar-width);
    width: calc(100% - var(--sidebar-width));
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    backdrop-filter: blur(10px);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 20px;
}

.header {
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    color: white;
    padding: 30px;
    text-align: center;
    position: relative;
    overflow: visible;
}

.header::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 30px 30px;
    animation: float 20s infinite linear;
}

@keyframes float {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}

.header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    position: relative;
    z-index: 1;
}

.header p {
    font-size: 1.1rem;
    opacity: 0.9;
    position: relative;
    z-index: 1;
}

.cert-modal-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.cert-modal {
    background: white;
    border-radius: 12px;
    padding: 0;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
    background: linear-gradient(135deg, #005792, #00a8e8);
    color: white;
    padding: 20px;
    border-radius: 12px 12px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.3rem;
}

.modal-close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;
}

.modal-close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.cert-form {
    padding: 25px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
}

.form-input {
    width: 100%;
    padding: 12px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s ease;
}

.form-input:focus {
    outline: none;
    border-color: #005792;
    box-shadow: 0 0 0 3px rgba(0, 87, 146, 0.1);
}

.form-input-file {
    width: 100%;
    padding: 8px;
    border: 2px dashed #e9ecef;
    border-radius: 8px;
    background: #f8f9fa;
    cursor: pointer;
}

.image-input-container {
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    background: #f8f9fa;
}

.image-preview {
    margin-top: 10px;
}

.preview-image {
    max-width: 150px;
    max-height: 100px;
    border-radius: 6px;
    border: 2px solid #e9ecef;
}

.image-placeholder {
    color: #6c757d;
    font-style: italic;
    padding: 20px;
}

.modal-buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 25px;
}

.btn-cancel {
    background: #6c757d;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.btn-cancel:hover {
    background: #5a6268;
}

.btn-add {
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-add:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-add:hover {
    background: linear-gradient(135deg, #218838, #1fa085);
    transform: translateY(-1px);
}
</style>