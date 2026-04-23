// Authentication Functions (with local storage simulation for demo)
const USERS_KEY = 'portfolio_users';
const CURRENT_USER_KEY = 'portfolio_current_user';

// Initialize demo user if not exists
function initDemoUser() {
    let users = localStorage.getItem(USERS_KEY);
    if (!users) {
        const demoUser = {
            id: 1,
            name: "Demo User",
            email: "demo@portfolio.com",
            password: "demo123" // In production, this would be hashed
        };
        localStorage.setItem(USERS_KEY, JSON.stringify([demoUser]));
    }
}

// Register Function
function registerUser(name, email, password) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
        return { success: false, message: "Email already registered. Please login instead." };
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        password: password // In production, hash this!
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    return { success: true, message: "Registration successful! Please login." };
}

// Login Function
function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store current user (excluding password)
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        return { success: true, message: "Login successful!", user: userWithoutPassword };
    }
    
    return { success: false, message: "Invalid email or password." };
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem(CURRENT_USER_KEY) !== null;
}

// Logout function
function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = 'index.html';
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
}

// REGISTER PAGE LOGIC
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    initDemoUser();
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        const name = document.getElementById('regName');
        const email = document.getElementById('regEmail');
        const password = document.getElementById('regPassword');
        const confirmPassword = document.getElementById('regConfirmPassword');
        const termsCheckbox = document.getElementById('termsCheckbox');
        const feedback = document.getElementById('registerFeedback');
        
        // Name validation
        if (name.value.trim().length < 2) {
            document.getElementById('regNameError').textContent = 'Full name is required';
            isValid = false;
        } else {
            document.getElementById('regNameError').textContent = '';
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            document.getElementById('regEmailError').textContent = 'Valid email is required';
            isValid = false;
        } else {
            document.getElementById('regEmailError').textContent = '';
        }
        
        // Password validation
        if (password.value.length < 6) {
            document.getElementById('regPasswordError').textContent = 'Password must be at least 6 characters';
            isValid = false;
        } else {
            document.getElementById('regPasswordError').textContent = '';
        }
        
        // Confirm password validation
        if (password.value !== confirmPassword.value) {
            document.getElementById('regConfirmError').textContent = 'Passwords do not match';
            isValid = false;
        } else {
            document.getElementById('regConfirmError').textContent = '';
        }
        
        // Terms validation
        if (!termsCheckbox.checked) {
            feedback.textContent = 'You must agree to the Terms of Service';
            feedback.className = 'form-feedback error';
            feedback.style.display = 'block';
            isValid = false;
        }
        
        if (isValid) {
            const result = registerUser(name.value, email.value, password.value);
            
            feedback.textContent = result.message;
            feedback.className = result.success ? 'form-feedback success' : 'form-feedback error';
            feedback.style.display = 'block';
            
            if (result.success) {
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                setTimeout(() => {
                    feedback.style.display = 'none';
                }, 3000);
            }
        } else {
            feedback.textContent = 'Please fix the errors above';
            feedback.className = 'form-feedback error';
            feedback.style.display = 'block';
        }
    });
}

// LOGIN PAGE LOGIC
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    initDemoUser();
    
    // Check if already logged in, redirect to index
    if (isLoggedIn()) {
        window.location.href = 'index.html';
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail');
        const password = document.getElementById('loginPassword');
        const rememberMe = document.getElementById('rememberMe');
        const feedback = document.getElementById('loginFeedback');
        
        let isValid = true;
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            document.getElementById('loginEmailError').textContent = 'Valid email is required';
            isValid = false;
        } else {
            document.getElementById('loginEmailError').textContent = '';
        }
        
        // Password validation
        if (password.value.length === 0) {
            document.getElementById('loginPasswordError').textContent = 'Password is required';
            isValid = false;
        } else {
            document.getElementById('loginPasswordError').textContent = '';
        }
        
        if (isValid) {
            const result = loginUser(email.value, password.value);
            
            feedback.textContent = result.message;
            feedback.className = result.success ? 'form-feedback success' : 'form-feedback error';
            feedback.style.display = 'block';
            
            if (result.success) {
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                setTimeout(() => {
                    feedback.style.display = 'none';
                }, 3000);
            }
        } else {
            feedback.textContent = 'Please fix the errors above';
            feedback.className = 'form-feedback error';
            feedback.style.display = 'block';
        }
    });
}

// Check login status on main pages and update UI
document.addEventListener('DOMContentLoaded', () => {
    if (isLoggedIn() && !window.location.pathname.includes('login') && !window.location.pathname.includes('register')) {
        const user = getCurrentUser();
        const dashboardNav = document.querySelector('.dashboard-nav');
        
        if (dashboardNav) {
            // Find the login link and replace with user info
            const loginLink = dashboardNav.querySelector('a[href="login.html"]');
            if (loginLink) {
                const li = loginLink.parentElement;
                li.innerHTML = `
                    <div class="user-menu" style="padding: 0.8rem 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <i class="fas fa-user-circle"></i>
                            <span style="font-size: 0.9rem;">${user.name}</span>
                        </div>
                        <a href="#" id="logoutBtn" style="color: var(--text-muted); text-decoration: none; font-size: 0.8rem;">Logout</a>
                    </div>
                `;
                
                document.getElementById('logoutBtn').addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            }
        }
    }
});