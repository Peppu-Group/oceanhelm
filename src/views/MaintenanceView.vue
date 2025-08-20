<template>
    <div class="container">
        <header>
            <h1>OceanHelm</h1>
        </header>

        <OceanHelmMaintenance :vessel-info="vesselInfo" :tasks="tasks" :vessel-crew="vesselCrew" :company-info="companyInfo"
            :user-profile="userProfile" @dashboard-navigate="handleDashboardNavigate" @save-schedule="handleSaveSchedule"
            @update-task="handleUpdateTask" @upload-file="handleUploadFile" @delete-evidence="handleDeleteEvidence"
            @access-denied="handleAccessDenied" @show-message="handleShowMessage"
            @generate-checklist="handleGenerateChecklist" />
    </div>
</template>
  
<script>
import axios from 'axios';
import supabase from '../supabase';
import { mapGetters, mapActions } from 'vuex';
import { OceanHelmMaintenance } from 'oceanhelm'

export default {
    data() {
        return {
            vesselInfo: []
        };
    },
    components: { OceanHelmMaintenance },
    computed: {
        ...mapGetters('user', ['userProfile', 'userRoleDescription']),
        ...mapGetters('company', ['company']),
        ...mapGetters('tasks', ['getTasksByVessel']),
        ...mapGetters('crew', ['getCrewByVessel']),
        vessels() {
            return this.$store.getters['vessel/allVessels'];
        },
        tasks() {
            return this.getTasksByVessel(this.$route.params.id);
        },
        vesselCrew() {
            return this.getCrewByVessel(this.vesselInfo.name);
        },
        companyInfo() {
            return this.company;
        }
    },
    async mounted() {
        const vesselId = this.$route.params.id;

        // Load required data
        await this.loadTasks(vesselId);

        // load vesselInfo
        let vesselInfo = this.vessels.find(v => v.registrationNumber === vesselId);
        this.vesselInfo = vesselInfo;
    },
    methods: {
        ...mapActions('tasks', ['loadTasks', 'addTask', 'updateTask']),

        handleDashboardNavigate() {
            this.$router.push('/app/dashboard');
        },
        showError(message) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: message,
                confirmButtonText: 'OK',
                confirmButtonColor: '#d33'
            });
        },
        showSuccess(message) {
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: message,
                confirmButtonText: 'OK',
                confirmButtonColor: '#d33'
            });
        },
        handleLoadChecklist(component) {
            this.handleGenerateChecklist(component);
        },
        async handleGenerateChecklist({ component, callback }) {
            try {
                this.checklist(component).then((checklist) => {
                    callback(checklist);
                })
            } catch (error) {
                console.error('Error generating checklist:', error);
                callback([]);
                this.showError('Failed to generate checklist. Please try again or create manually.');
            }
        },
        validateForm() {
            const requiredFields = [
                'taskName',
                'description',
                'maintenanceType',
                'component',
                'priority',
                'estimatedHours',
                'recurrence',
                'lastPerformed',
                'assignedTo'
            ];

            for (const field of requiredFields) {
                if (!this.form[field]) {
                    Swal.fire({
                        title: "Missing info",
                        text: `Please fill in the required field: ${field}`,
                        icon: "error"
                    });
                    return false;
                }
            }

            return true;
        },
        async handleSaveSchedule({ taskData, file, callback }) {
            try {
                // Save task to store
                await this.addTask({
                    vesselId: this.$route.params.id,
                    task: taskData
                });

                // Handle file upload if present
                if (file) {
                    await this.handleFileUpload(file, taskData.component);
                }

                callback(true);
                this.showSuccess('Schedule saved successfully');
            } catch (error) {
                console.error('Error saving schedule:', error);
                callback(false);
                this.showError('Failed to save schedule');
            }
        },

        async handleUpdateTask({ updateData, file, callback, tasks }) {
            try {
                await this.updateTask({
                    vesselId: this.$route.params.id,
                    updateTask: updateData,
                    tasks
                });

                let updatedAfter = null;
                if (file) {
                    updatedAfter = await this.handleFileUpload(file, updateData.component);
                }

                callback(true, updatedAfter);
                this.showSuccess('Task updated successfully');
            } catch (error) {
                console.error('Error updating task:', error);
                callback(false);
                this.showError('Failed to update task');
            }
        },

        async handleUploadFile({ file, callback }) {
            // Push Image 
            const randomText = Math.random().toString(36).substring(2, 8);
            let companyId = localStorage.getItem('company_id');
            const { data, error } = await supabase.storage
                .from('company-files')
                .upload(`tasks/${companyId}-${randomText}.png`, file, {
                    cacheControl: '3600',
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

                // Update the task's logo with the public URL
                const { error: updateError } = await supabase
                    .from('tasks')
                    .update({ after: publicUrl })
                    .eq('company_id', companyId)
                    .eq('vessel', this.$route.params.id)
                    .eq('component', currentTask);

                this.tasks[taskIndex].after = publicUrl;

                if (updateError) console.error('Update failed', error);
            }
        },

        cleanAndParseAIResponse(text) {
            // Step 1: Replace smart quotes with straight quotes
            text = text
                .replace(/[‘’]/g, "'")   // smart apostrophes
                .replace(/[“”]/g, '"');  // smart double quotes

            // Step 2: Convert single quotes around keys to double quotes
            text = text.replace(/([{,]\s*)'([^']+?)'\s*:/g, '$1"$2":');

            // Step 3: Convert single quotes around string values to double quotes
            // only when the value doesn't contain inner single quotes (to avoid breaking apostrophes)
            text = text.replace(/:\s*'([^']*?)'/g, (match, p1) => {
                if (p1.includes('"')) return match; // skip if it already contains double quotes
                if (p1.includes("'")) return match; // skip if value contains apostrophes
                return `: "${p1}"`;
            });

            // Step 4: Attempt parsing
            try {
                return JSON.parse(text);
            } catch (err) {
                console.error("Failed to parse cleaned response:", err.message);
                return null;
            }
        },

        async checklist(mainType) {
            try {
                const res = await axios.post(`https://proctoredserver.peppubuild.com/promptai`, {
                    userReq: mainType
                });
                let result = res.data.result;
                let content = '';

                try {
                    const match = result.match(/```(?:\w*\n)?([\s\S]*?)```/);
                    content = match ? match[1] : result; // If no match, fallback to using the full result
                } catch (error) {
                    console.error("Failed to extract code block:", error);
                    content = result;
                }

                const theContent = this.cleanAndParseAIResponse(content)
                return theContent;
            } catch (err) {
                Swal.fire({
                    title: "An error occurred",
                    text: `We ran into an error while generating the checklist. Try again, or generate checklist manually.`,
                    icon: "error"
                });
            }
        },
        handleAccessDenied(message) {
            Swal.fire({
                title: title,
                text: message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        },
        handleShowMessage({ type, title, message, callback }) {
            if (type === 'prompt') {
                Swal.fire({
                    title: title,
                    text: message,
                    input: 'text',
                    showCancelButton: true,
                    confirmButtonText: 'Add',
                    cancelButtonText: 'Cancel',
                    inputValidator: (value) => {
                        if (!value) {
                            return 'Please enter a task';
                        }
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (callback) callback(result.value);
                    } else {
                        if (callback) callback(null);
                    }
                });

            } else if (type === 'error') {
                Swal.fire({
                    title: title,
                    text: message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });

            } else {
                Swal.fire({
                    title: title || '',
                    text: message,
                    icon: type || 'info',
                    confirmButtonText: 'OK'
                });
            }
        },
        async handleDeleteEvidence({ currentTask, callback }) {
            let taskIndex = this.tasks.findIndex(task => task.component === currentTask);

            if (taskIndex !== -1) {
                const url = this.after;
                const match = url.match(/tasks\/.+$/);

                if (match) {
                    const filePath = match;
                    const { data, error: deleteError } = await supabase
                        .storage
                        .from('company-files')
                        .remove([filePath]);

                    if (deleteError) {
                        console.error('Error deleting file:', deleteError);
                    } else {
                        this.after = null;
                        this.tasks[taskIndex].after = null;
                        this.fileText = 'Drag and drop files here or',
                            this.fileattachments = {};
                        this.refreshKey += 1;
                        // this.$refs.fileInput.value = ''; // reset file input
                        // update supabase
                        // this.updateVesselCert(this.certifications);
                    }
                }
            }
        }
    }

};
</script>
  
<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}
</style>