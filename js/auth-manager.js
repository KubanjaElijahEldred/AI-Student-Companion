// Authentication Manager - Pure JavaScript
class AuthManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.apiBase = 'http://localhost:5001/api';
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    async register(userData) {
        try {
            const response = await fetch(`${this.apiBase}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Store user data locally as backup
            const newUser = {
                id: Date.now().toString(),
                ...userData,
                createdAt: new Date().toISOString(),
                token: data.token
            };
            
            this.users.push(newUser);
            localStorage.setItem('users', JSON.stringify(this.users));
            this.currentUser = newUser;
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            return newUser;
        } catch (error) {
            // Fallback to local storage if server is unavailable
            console.warn('Server unavailable, using local storage:', error.message);
            return this.registerLocally(userData);
        }
    }

    registerLocally(userData) {
        const existingUser = this.users.find(u => u.email === userData.email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return newUser;
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.apiBase}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            const user = {
                ...data.user,
                token: data.token
            };
            
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        } catch (error) {
            // Fallback to local storage if server is unavailable
            console.warn('Server unavailable, using local storage:', error.message);
            return this.loginLocally(email, password);
        }
    }

    loginLocally(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    updateProfile(updates) {
        if (!this.currentUser) return;
        
        this.currentUser = { ...this.currentUser, ...updates };
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = this.currentUser;
        }
        
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    getAuthToken() {
        return this.currentUser?.token || null;
    }
}
