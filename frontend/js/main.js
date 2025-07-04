// Main application script
import router from './router.js';
import AuthService from './services/auth.service.js';

// Global axios configuration
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        Promise.reject(error);
    }
);

// Create Vue app
new Vue({
    el: '#app',
    router,
    data: {
        currentUser: null,
        isLoggedIn: false
    },
    created() {
        // Check if user is logged in
        const user = localStorage.getItem('user');
        if (user) {
            this.currentUser = JSON.parse(user);
            this.isLoggedIn = true;
        }
    },
    methods: {
        logout() {
            AuthService.logout();
            this.currentUser = null;
            this.isLoggedIn = false;
            this.$router.push('/login');
        }
    },
    template: `
        <div>
            <!-- Navigation -->
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <router-link class="navbar-brand" to="/">Cattle Management System</router-link>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav me-auto">
                            <li class="nav-item" v-if="isLoggedIn">
                                <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
                            </li>
                            <li class="nav-item" v-if="isLoggedIn">
                                <router-link class="nav-link" to="/animals">Animals</router-link>
                            </li>
                            <li class="nav-item" v-if="isLoggedIn">
                                <router-link class="nav-link" to="/health-records">Health Records</router-link>
                            </li>
                            <li class="nav-item" v-if="isLoggedIn && currentUser.role === 'admin'">
                                <router-link class="nav-link" to="/users">Users</router-link>
                            </li>
                        </ul>
                        <ul class="navbar-nav">
                            <li class="nav-item" v-if="!isLoggedIn">
                                <router-link class="nav-link" to="/login">Login</router-link>
                            </li>
                            <li class="nav-item" v-if="isLoggedIn">
                                <span class="nav-link">{{ currentUser.username }}</span>
                            </li>
                            <li class="nav-item" v-if="isLoggedIn">
                                <a class="nav-link" href="#" @click.prevent="logout">Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            
            <!-- Main content -->
            <div class="container mt-4">
                <router-view></router-view>
            </div>
            
            <!-- Footer -->
            <footer class="bg-light text-center text-muted py-3 mt-5">
                <div class="container">
                    Cattle Management System &copy; 2025
                </div>
            </footer>
        </div>
    `
});