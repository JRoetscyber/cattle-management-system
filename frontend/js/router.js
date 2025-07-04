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
                        const response = await axios.post('/auth/login', {
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
            template: `
                <div>
                    <h1>Dashboard</h1>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-header">Animals</div>
                                <div class="card-body">
                                    <h3>{{ animalCount }}</h3>
                                    <p>Total animals in the system</p>
                                    <router-link to="/animals" class="btn btn-primary">View Animals</router-link>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-header">Health Records</div>
                                <div class="card-body">
                                    <h3>{{ healthRecordCount }}</h3>
                                    <p>Total health records</p>
                                    <router-link to="/health-records" class="btn btn-primary">View Records</router-link>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-header">Upcoming Vaccinations</div>
                                <div class="card-body">
                                    <h3>{{ upcomingVaccinationCount }}</h3>
                                    <p>Due in the next 30 days</p>
                                    <router-link to="/health-records" class="btn btn-primary">View Schedule</router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row mt-4">
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-header">Recent Animals</div>
                                <div class="card-body">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>Tag ID</th>
                                                <th>Name</th>
                                                <th>Birth Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="animal in recentAnimals" :key="animal.id">
                                                <td>{{ animal.tag_id }}</td>
                                                <td>{{ animal.name }}</td>
                                                <td>{{ animal.birth_date }}</td>
                                                <td>
                                                    <router-link :to="'/animals/' + animal.id" class="btn btn-sm btn-primary">View</router-link>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-header">Recent Health Records</div>
                                <div class="card-body">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>Animal</th>
                                                <th>Date</th>
                                                <th>Type</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="record in recentHealthRecords" :key="record.id">
                                                <td>{{ record.animal_tag }}</td>
                                                <td>{{ record.date }}</td>
                                                <td>{{ record.record_type }}</td>
                                                <td>
                                                    <router-link :to="'/health-records/' + record.id" class="btn btn-sm btn-primary">View</router-link>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            data() {
                return {
                    animalCount: 0,
                    healthRecordCount: 0,
                    upcomingVaccinationCount: 0,
                    recentAnimals: [],
                    recentHealthRecords: []
                };
            },
            created() {
                this.fetchDashboardData();
            },
            methods: {
                async fetchDashboardData() {
                    try {
                        // Fetch animals
                        const animalsResponse = await axios.get('/animals');
                        this.animalCount = animalsResponse.data.length;
                        this.recentAnimals = animalsResponse.data.slice(0, 5);
                        
                        // Fetch health records
                        const recordsResponse = await axios.get('/health/records');
                        this.healthRecordCount = recordsResponse.data.length;
                        this.recentHealthRecords = recordsResponse.data.slice(0, 5);
                        
                        // Calculate upcoming vaccinations (simplified)
                        this.upcomingVaccinationCount = 3; // Placeholder
                    } catch (error) {
                        console.error('Error fetching dashboard data:', error);
                    }
                }
            }
        },
        meta: {
            requiresAuth: true
        }
    },
    // Add additional routes for animals, health records, etc.
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

export default router;