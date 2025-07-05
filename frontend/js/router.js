// Import components
import AnimalsList from './components/AnimalsList.js';
import AnimalDetail from './components/AnimalDetail.js';
import HealthRecordsList from './components/HealthRecordsList.js';
import HealthRecordDetail from './components/HealthRecordDetail.js';

// Vue Router configuration
// Vue Router configuration
const routes = [
    { 
        path: '/', 
        redirect: '/dashboard' 
    },
    {
        path: '/login',
        component: {
            template: `
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">Login</div>
                            <div class="card-body">
                                <form @submit.prevent="handleLogin">
                                    <div class="mb-3">
                                        <label for="username" class="form-label">Username</label>
                                        <input type="text" class="form-control" id="username" v-model="username" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="password" class="form-label">Password</label>
                                        <input type="password" class="form-control" id="password" v-model="password" required>
                                    </div>
                                    <div class="mb-3" v-if="errorMessage">
                                        <div class="alert alert-danger">{{ errorMessage }}</div>
                                    </div>
                                    <button type="submit" class="btn btn-primary">Login</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            data() {
                return {
                    username: '',
                    password: '',
                    errorMessage: ''
                };
            },
            methods: {
                async handleLogin() {
                    try {
                        const response = await axios.post('/api/auth/login', {
                            username: this.username,
                            password: this.password
                        });
                        
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                        this.$root.currentUser = response.data.user;
                        this.$root.isLoggedIn = true;
                        this.$router.push('/dashboard');
                    } catch (error) {
                        this.errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
                    }
                }
            }
        }
    },
    {
        path: '/dashboard',
        component: {
            // Dashboard component code
        },
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/animals',
        component: AnimalsList,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/animals/:id',
        component: AnimalDetail,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/health-records',
        component: HealthRecordsList,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/health-records/:id',
        component: HealthRecordDetail,
        meta: {
            requiresAuth: true
        }
    },
    // 404 route
    {
        path: '*',
        component: {
            template: `
                <div class="alert alert-danger">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you are looking for does not exist.</p>
                    <router-link to="/" class="btn btn-primary">Go Home</router-link>
                </div>
            `
        }
    }
];

const router = new VueRouter({
    routes
});

// Navigation guards
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta?.requiresAuth);
    const isLoggedIn = localStorage.getItem('user') !== null;
    
    if (requiresAuth && !isLoggedIn) {
        next('/login');
    } else {
        next();
    }
});