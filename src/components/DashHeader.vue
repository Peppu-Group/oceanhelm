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
import supabase from '../supabase'
export default {
    name: 'DashHeader',
    props: ['name'],

    methods: {
        loggedIn() {
            this.getUser().then((text) => {
                Swal.fire({
                title: "Logged in",
                text: text,
                icon: "info"
            });
            })
        },
        async getUser() {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                const user = session.user;
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                if (profile.role == 'owner') {
                    return `You're logged as ${profile.full_name}, with owner access. You have full access, you can see the changes everyone makes.`
                } else if (profile.role == 'captain') {
                    return `You're logged as ${profile.full_name}, with captain access. You have full access for your vessel's information, you can see the changes everyone makes to your vessel.`
                } else if (profile.role == 'staff') {
                    return `You're logged as ${profile.full_name}, with an employee access. You have limited access, everyone with owner or captain access can see the changes you make.`
                }
            }
        }
    }
}
</script>