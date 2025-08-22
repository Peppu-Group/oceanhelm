<template>
    <div id="app" class="d-flex">
        <!-- Sidebar -->
        <ConfigurableSidebar :menuItems="menuItems" :userProfile="userProfile" brandName="OceanHelm" logoIcon="bi bi-water"
            customClasses="bg-dark text-white" @navigate="onNavigate" @action="onAction" @item-click="onItemClick">
        </ConfigurableSidebar>
    </div>
</template>
  
<script>
import { mapGetters, mapActions } from 'vuex';
import supabase from '../supabase';
import { ConfigurableSidebar, defaultMenuItems } from 'oceanhelm'

export default {
    name: 'SideBar',
    components: { ConfigurableSidebar },

    data() {
        return {
            menuItems: defaultMenuItems
        }
    },

    computed: {
        ...mapGetters('user', ['userProfile', 'userRoleDescription']),
        ...mapGetters('company', ['company']),
    },

    methods: {
        ...mapActions('user', ['fetchUserProfile']),
        crewManage(action) {
            // console.log(action)
            if (action == 'crew-all') {
                this.$router.push({ name: 'crew' });
            } else if (action == 'crew-by-vessel') {
                this.$router.push({ name: 'crewroute' });
            }
        },
        getMaintenance(action) {
            if (action == 'maintenance') {
                this.$router.push({ name: 'maintenanceroute' })
            }
        },
        onNavigate(item) {
            // console.log(item)
        },
        onAction(item) {
            let action = item.action;
            this.crewManage(action);
            this.helpSupport(action);
            this.updateCompanyInfo(action);
            this.getMaintenance(action);
        },
        onItemClick(item) {

        },
        helpSupport(action) {
            if (action == 'help') {
                Swal.fire({
                    title: 'Contact Information',
                    html: `
                <p><strong>Company:</strong> OceanHelm (Peppu Ventures Limited)</p>
                <p><strong>Email:</strong> marine@peppubuild.com</p>
                <p><strong>Phone:</strong> +234 907 699 3818</p>
                `,
                    showCancelButton: true,
                    confirmButtonText: 'Documentation',
                    cancelButtonText: 'OK',
                    reverseButtons: true, // so OK appears on the right
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Open documentation link
                        window.open('https://OceanHelm.gitbook.io/OceanHelm-docs/', '_blank');
                    }
                    // If cancelled, Swal automatically closes
                });
            }
        },
        async updateCompanyInfo(action, currentData = this.company) {
            if (action == 'settings') {
                const { value: formValues } = await Swal.fire({
                    title: 'Update Company Information',
                    html: `
                        <div style="text-align: left; max-width: 400px; margin: 0 auto;">
                        <div style="margin-bottom: 20px;">
                            <label class="file-upload">
                            <i class="bi bi-upload"></i> Change Logo
                            <input type="file" id="swal-logo-input" accept="image/*" />
                            <small id="file-name-display" style="display:block; margin-top: 5px; font-size: 12px; color: gray;"></small>
                            </label>
                        </div>

                        <div style="margin-bottom: 20px;">
                            <label for="swal-location" style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">
                            📍 Location
                            </label>
                            <input id="swal-location" class="swal2-input" placeholder="Enter company location" 
                                value="${currentData.location || ''}" style="margin: 0; width: 100%;">
                        </div>

                        <div style="margin-bottom: 20px;">
                            <label for="swal-estyear" style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">
                            📅 Established Year
                            </label>
                            <input id="swal-estyear" class="swal2-input" type="number" 
                                placeholder="Enter establishment year" min="1800" max="2025"
                                value="${currentData.estYear || ''}" style="margin: 0; width: 100%;">
                        </div>

                        <div style="margin-bottom: 20px;">
                            <label for="swal-phone" style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">
                            📞 Phone Number
                            </label>
                            <input id="swal-phone" class="swal2-input" type="tel" 
                                placeholder="Enter phone number" 
                                value="${currentData.phoneNumber || ''}" style="margin: 0; width: 100%;">
                        </div>

                        <div style="margin-bottom: 20px;">
                            <label for="swal-email" style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">
                            📧 Email Address
                            </label>
                            <input id="swal-email" class="swal2-input" type="email" 
                                placeholder="Enter email address" 
                                value="${currentData.email || ''}" style="margin: 0; width: 100%;">
                        </div>

                        <div style="margin-bottom: 20px;">
                            <label for="swal-license" style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">
                            🏷️ License Number
                            </label>
                            <input id="swal-license" class="swal2-input" placeholder="Enter license number" 
                                value="${currentData.license || ''}" style="margin: 0; width: 100%;">
                        </div>

                        <p style="font-size: 12px; color: #666; margin-top: 20px; text-align: center;">
                            💡 Don't edit the fields if you don't want to change them
                        </p>
                        </div>
                    `,
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonText: 'Update Information',
                    cancelButtonText: 'Cancel',
                    confirmButtonColor: '#0d6efd',
                    cancelButtonColor: '#6c757d',
                    width: '500px',
                    customClass: {
                        popup: 'company-info-popup',
                        title: 'company-info-title'
                    },

                    didOpen: async () => {
                        const fileInput = document.getElementById('swal-logo-input');
                        const fileNameDisplay = document.getElementById('file-name-display');

                        if (fileInput && fileNameDisplay) {
                            fileInput.addEventListener('change', async (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    fileNameDisplay.textContent = `Selected file: ${file.name}`;
                                    this.selectedLogoFile = file;
                                    await this.handleLogoChange(file)
                                } else {
                                    fileNameDisplay.textContent = '';
                                    this.selectedLogoFile = null;
                                }
                            });
                        }
                    },

                    preConfirm: () => {
                        const location = document.getElementById('swal-location').value.trim();
                        const estYear = document.getElementById('swal-estyear').value;
                        const phoneNumber = document.getElementById('swal-phone').value.trim();
                        const email = document.getElementById('swal-email').value.trim();
                        const license = document.getElementById('swal-license').value.trim();

                        if (email && !this.isValidEmail(email)) {
                            Swal.showValidationMessage('Please enter a valid email address');
                            return false;
                        }

                        if (estYear && (estYear < 1800 || estYear > 2025)) {
                            Swal.showValidationMessage('Please enter a valid year between 1800 and 2025');
                            return false;
                        }

                        const result = {};
                        if (location) result.location = location;
                        if (estYear) result.estYear = estYear;
                        if (phoneNumber) result.phoneNumber = phoneNumber;
                        if (email) result.email = email;
                        if (license) result.license = license;

                        return result;
                    }
                });

                if (formValues) {
                    // formValues.logo = this.company.logo;
                    const changedFields = {};

                    for (const key in formValues) {
                        if (formValues[key] !== currentData[key]) {
                            changedFields[key] = {
                                from: currentData[key],
                                to: formValues[key]
                            };
                        }
                    }

                    if (Object.keys(changedFields).length === 0) {
                        await Swal.fire({
                            title: 'No Changes Detected',
                            text: 'We have updated your logo, no other fields were changed.',
                            icon: 'info',
                            confirmButtonColor: '#0d6efd'
                        });
                        return null;
                    }

                    await this.$store.dispatch('company/updateCompanyInfo', {
                        formValues,
                        changedFields
                    });

                    await Swal.fire({
                        title: 'Success!',
                        text: 'Company information has been updated successfully. Image update may take as much as 1 hour to update in your local system due to caching',
                        icon: 'success',
                        confirmButtonColor: '#0d6efd',
                        timer: 2000,
                        timerProgressBar: true
                    });

                    return formValues;
                }
            }
        },

        // Email validation helper function
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        async handleLogoChange(file) {

            if (file) {
                this.selectedLogoFile = file;
                // Generate a temporary preview
                // You can now use this.selectedLogoFile in your Supabase upload
                // Example: this.uploadLogoToSupabase(this.selectedLogoFile);
                let companyId = localStorage.getItem('company_id');
                const { data, error } = await supabase.storage
                    .from('company-files')
                    .upload(`logos/${companyId}.png`, file, {
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

                    // Update the company's logo with the public URL
                    const { error: updateError } = await supabase
                        .from('companies')
                        .update({ logo: publicUrl })
                        .eq('id', companyId);

                    this.company.logo = URL.createObjectURL(file);

                    if (updateError) console.error('Update failed', error);
                }
            }

        }
    }
}
</script>

<style scoped>
.left {
    margin-left: 20px;
}

.black {
    color: black !important;
}
</style>