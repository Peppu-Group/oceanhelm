<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="setup-card">
                    <div class="spinner-wrapper">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>

                    <h1>Hold on, we're finishing your setup</h1>
                    <p>Click on the button below if this doesn't redirect after sometime</p>

                    <button class="btn btn-primary btn-lg">Continue Setup</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import supabase from '../supabase'

export default {
    name: 'Redirect',

    methods: {
    redirectDash() {
        return this.$router.push({ name: 'dashboard' });
    },
},

    async mounted() {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            const user = session.user;
            // Step 5: Create the user's profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    full_name: user.user_metadata.fullName,
                    company_id: user.user_metadata.company_id,
                    role: user.user_metadata.role,
                    vessel: user.user_metadata.vessel,
                    categories: user.user_metadata.categories
                });

            // redirect dashboard
            this.redirectDash()
        }
    }

}

</script>

<style scoped>
template {
    font-family: 'Poppins', sans-serif;
    background-color: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
}

.container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.setup-card {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 40px;
    margin-top: 25vh;
    max-width: 550px;
    width: 100%;
    text-align: center;
}

h1 {
    font-weight: 600;
    font-size: 1.8rem;
    margin-bottom: 20px;
    color: #333;
}

p {
    color: #666;
    margin-bottom: 30px;
    font-size: 1.1rem;
    line-height: 1.6;
}

.spinner-wrapper {
    margin-bottom: 30px;
}

.spinner-border {
    width: 3rem;
    height: 3rem;
    color: #4c6ef5;
}

.btn-primary {
    background-color: #4c6ef5;
    border-color: #4c6ef5;
    padding: 12px 30px;
    font-weight: 500;
    font-size: 1rem;
    transition: all 0.3s;
}

.btn-primary:hover {
    background-color: #3b5cf6;
    border-color: #3b5cf6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 110, 245, 0.3);
}
</style>