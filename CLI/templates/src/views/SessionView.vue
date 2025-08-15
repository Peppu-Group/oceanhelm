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
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Session',

    async mounted() {
        if (this.$route.query.session) {
            const code = this.useSessionFromQuery();
            localStorage.setItem('sb-qltidnqgczccstukalgy-auth-token', JSON.stringify(code));

            // Remove `session` from query without reloading
            const { session, ...rest } = this.$route.query;
            this.$router.replace({ query: rest });

            this.redirectDash();
        }
    },

    methods: {
        useSessionFromQuery() {
            const raw = this.$route.query.session;
            if (!raw) return null;

            try {
                // Decode twice in case it's double URL encoded
                let decoded = decodeURIComponent(decodeURIComponent(raw));

                // Parse normally
                return JSON.parse(decoded);
            } catch (err) {
                console.error('Failed to parse session:', err, raw);
                return null;
            }
        },
        redirectDash() {
            return this.$router.push({ name: 'dashboard' });
        },
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