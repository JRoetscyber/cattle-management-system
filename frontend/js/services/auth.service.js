// Authentication service
const AuthService = {
    async login(username, password) {
        try {
            const response = await axios.post('/api/auth/login', {
                username,
                password
            });
            
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                return response.data.user;
            }
            
            return null;
        } catch (error) {
            throw error;
        }
    },
    
    logout() {
        axios.post('/api/auth/logout')
            .catch(error => console.error('Logout error:', error));
        
        localStorage.removeItem('user');
    },
    
    register(userData) {
        return axios.post('/api/auth/register', userData);
    },
    
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};