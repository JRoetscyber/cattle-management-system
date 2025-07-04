// Authentication service
export default {
    async login(username, password) {
        try {
            const response = await axios.post('/auth/login', {
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
        axios.post('/auth/logout')
            .catch(error => console.error('Logout error:', error));
        
        localStorage.removeItem('user');
    },
    
    register(userData) {
        return axios.post('/auth/register', userData);
    },
    
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};