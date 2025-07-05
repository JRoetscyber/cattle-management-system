document.addEventListener('DOMContentLoaded', function() {
    // Update current date
    const currentDateElement = document.getElementById('current-date');
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);
    currentDateElement.textContent = formattedDate;
    
    // Toggle between login and register forms
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');
    
    showRegisterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });
    
    showLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });
    
    // Handle login form submission
    const loginFormElement = document.getElementById('loginForm');
    const loginErrorElement = document.getElementById('login-error');
    
    loginFormElement.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        loginErrorElement.style.display = 'none';
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, remember }),
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }
            
            // Store user in localStorage
            localStorage.setItem('user', JSON.stringify({
                id: data.user.id,
                username: data.user.username,
                firstName: data.user.first_name,
                lastName: data.user.last_name,
                email: data.user.email,
                role: data.user.role || 'user'
            }));
            
            // Redirect to dashboard
            window.location.href = 'index.html';
        } catch (error) {
            loginErrorElement.textContent = error.message;
            loginErrorElement.style.display = 'block';
        }
    });
    
    // Handle registration form submission
    const registerFormElement = document.getElementById('registerForm');
    const registerErrorElement = document.getElementById('register-error');
    
    registerFormElement.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        registerErrorElement.style.display = 'none';
        
        // Validate password match
        if (password !== confirmPassword) {
            registerErrorElement.textContent = 'Passwords do not match';
            registerErrorElement.style.display = 'block';
            return;
        }
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    password
                }),
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }
            
            // Show success message and switch to login form
            alert('Registration successful! Please log in with your new account.');
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
            
            // Pre-fill username in login form
            document.getElementById('username').value = username;
        } catch (error) {
            registerErrorElement.textContent = error.message;
            registerErrorElement.style.display = 'block';
        }
    });
    
    // Check if user is already logged in
    const checkAuth = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/check', {
                credentials: 'include'
            });
            
            if (response.ok) {
                // User is already logged in, redirect to dashboard
                window.location.href = 'index.html';
            }
        } catch (error) {
            // Not logged in, stay on login page
            console.log('Not logged in:', error);
        }
    };
    
    // Check authentication status when page loads
    checkAuth();
});