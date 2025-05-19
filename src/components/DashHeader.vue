<template>
    <div class="page-header d-flex justify-content-between align-items-center">
        <h2 style="margin-left: 20px;">{{ name }}</h2>
        <div class="d-flex">
            <button class="btn btn-outline-primary" @click="loggedIn()">
                <i class="bi bi-person-circle"></i>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashHeader',
    props: ['name'],

    methods:{
        loggedIn() {
            Swal.fire({
                title: "Logged in",
                text: "You're logged as Emeka, with an employee access. You have limited access, everyone with owner access can see the changes you make.",
                icon: "info"
            });
        },
    }
}
</script>