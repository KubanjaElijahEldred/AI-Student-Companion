// AI Student Companion - Pure JavaScript Application
// No HTML files needed - everything rendered via JavaScript

class AIStudentCompanionApp {
    constructor() {
        this.authManager = new AuthManager();
        this.profileManager = new ProfilePictureManager();
        this.chatManager = new ChatManager();
        this.uiBuilder = new UIBuilder();
        this.currentView = 'auth';
        
        this.init();
    }

    init() {
        // Create root container
        document.body.innerHTML = '';
        document.body.style.cssText = `
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        `;

        const appContainer = this.uiBuilder.createElement('div', {
            id: 'app-container',
            style: {
                width: '100%',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        });

        document.body.appendChild(appContainer);

        // Load FontAwesome
        this.loadFontAwesome();

        // Check if user is logged in
        if (this.authManager.isLoggedIn()) {
            this.showChatInterface();
        } else {
            this.showAuthInterface();
        }
    }

    loadFontAwesome() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(link);
    }

    showAuthInterface() {
        this.currentView = 'auth';
        const container = document.getElementById('app-container');
        container.innerHTML = '';

        const authContainer = this.uiBuilder.createElement('div', {
            style: {
                background: 'white',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                width: '90%',
                maxWidth: '400px',
                textAlign: 'center'
            }
        });

        // Header
        const header = this.uiBuilder.createElement('div', {
            innerHTML: `
                <h1 style="color: #4f46e5; margin-bottom: 10px; font-size: 2rem;">
                    <i class="fas fa-graduation-cap"></i> Mr. Elijah
                </h1>
                <p style="color: #666; margin-bottom: 30px;">AI Student Companion</p>
            `
        });

        // Auth forms container
        const formsContainer = this.uiBuilder.createElement('div', { id: 'auth-forms' });

        authContainer.appendChild(header);
        authContainer.appendChild(formsContainer);
        container.appendChild(authContainer);

        this.showLoginForm();
    }

    showLoginForm() {
        const formsContainer = document.getElementById('auth-forms');
        formsContainer.innerHTML = '';

        const loginForm = this.uiBuilder.createElement('form', {
            id: 'login-form',
            style: { textAlign: 'left' }
        });

        loginForm.innerHTML = `
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; color: #333; font-weight: 500;">Email</label>
                <input type="email" id="login-email" required style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 14px;">
            </div>
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; color: #333; font-weight: 500;">Password</label>
                <input type="password" id="login-password" required style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 14px;">
            </div>
            <button type="submit" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; margin-bottom: 15px;">
                <i class="fas fa-sign-in-alt"></i> Login
            </button>
            <div style="text-align: center;">
                <p style="color: #666; margin-bottom: 10px;">Don't have an account?</p>
                <button type="button" id="show-register" style="background: none; border: none; color: #4f46e5; cursor: pointer; text-decoration: underline;">
                    Create Account
                </button>
            </div>
        `;

        loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        
        const showRegisterBtn = loginForm.querySelector('#show-register');
        showRegisterBtn.addEventListener('click', () => this.showRegisterForm());

        formsContainer.appendChild(loginForm);
    }

    showRegisterForm() {
        const formsContainer = document.getElementById('auth-forms');
        formsContainer.innerHTML = '';

        const registerForm = this.uiBuilder.createElement('form', {
            id: 'register-form',
            style: { textAlign: 'left' }
        });

        registerForm.innerHTML = `
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #333; font-weight: 500;">Full Name</label>
                <input type="text" id="register-name" required style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 14px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #333; font-weight: 500;">Email</label>
                <input type="email" id="register-email" required style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 14px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #333; font-weight: 500;">Password</label>
                <input type="password" id="register-password" required style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 14px;">
            </div>
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; color: #333; font-weight: 500;">Profile Picture</label>
                <div style="display: flex; gap: 10px;">
                    <button type="button" id="camera-capture" style="flex: 1; padding: 10px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fas fa-camera"></i> Camera
                    </button>
                    <button type="button" id="gallery-select" style="flex: 1; padding: 10px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fas fa-image"></i> Gallery
                    </button>
                </div>
                <div id="profile-preview" style="margin-top: 10px; text-align: center;"></div>
            </div>
            <button type="submit" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; margin-bottom: 15px;">
                <i class="fas fa-user-plus"></i> Create Account
            </button>
            <div style="text-align: center;">
                <p style="color: #666; margin-bottom: 10px;">Already have an account?</p>
                <button type="button" id="show-login" style="background: none; border: none; color: #4f46e5; cursor: pointer; text-decoration: underline;">
                    Login Here
                </button>
            </div>
        `;

        registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        
        const showLoginBtn = registerForm.querySelector('#show-login');
        showLoginBtn.addEventListener('click', () => this.showLoginForm());

        const cameraBtn = registerForm.querySelector('#camera-capture');
        const galleryBtn = registerForm.querySelector('#gallery-select');
        
        cameraBtn.addEventListener('click', () => this.handleCameraCapture());
        galleryBtn.addEventListener('click', () => this.handleGallerySelect());

        formsContainer.appendChild(registerForm);
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            await this.authManager.login(email, password);
            this.showChatInterface();
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const userData = { name, email, password };
            await this.authManager.register(userData);
            this.showChatInterface();
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    async handleCameraCapture() {
        try {
            const imageData = await this.profileManager.captureFromCamera();
            this.showProfilePreview(imageData);
        } catch (error) {
            this.showNotification('Camera access denied or unavailable', 'error');
        }
    }

    handleGallerySelect() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.showProfilePreview(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    showProfilePreview(imageData) {
        const preview = document.getElementById('profile-preview');
        preview.innerHTML = `
            <img src="${imageData}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #4f46e5;">
            <p style="color: #10b981; font-size: 12px; margin-top: 5px;">✓ Profile picture selected</p>
        `;
        // Store image data for registration
        this.selectedProfilePicture = imageData;
    }

    showChatInterface() {
        this.currentView = 'chat';
        const container = document.getElementById('app-container');
        container.innerHTML = '';
        container.style.alignItems = 'stretch';
        container.style.padding = '20px';

        const chatContainer = this.uiBuilder.createElement('div', {
            style: {
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '800px',
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                margin: '0 auto'
            }
        });

        // Chat header
        const header = this.uiBuilder.createElement('div', {
            style: {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: 'white',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            },
            innerHTML: `
                <div>
                    <h1 style="margin: 0; font-size: 1.8rem;">
                        <i class="fas fa-graduation-cap"></i> Mr. Elijah
                    </h1>
                    <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 0.9rem;">AI Student Companion</p>
                </div>
                <button id="logout-btn" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 12px; border-radius: 6px; cursor: pointer;">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            `
        });

        // Chat messages area
        const messagesArea = this.uiBuilder.createElement('div', {
            id: 'chat-messages',
            style: {
                flex: '1',
                padding: '20px',
                overflowY: 'auto',
                backgroundColor: '#f8fafc'
            }
        });

        // Chat input area
        const inputArea = this.uiBuilder.createElement('div', {
            style: {
                padding: '20px',
                borderTop: '1px solid #e2e8f0',
                background: 'white'
            },
            innerHTML: `
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="message-input" placeholder="Ask me anything about your studies..." 
                           style="flex: 1; padding: 12px; border: 2px solid #e2e8f0; border-radius: 25px; font-size: 14px; outline: none;">
                    <button id="send-btn" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer; font-weight: 600;">
                        <i class="fas fa-paper-plane"></i> Send
                    </button>
                </div>
            `
        });

        chatContainer.appendChild(header);
        chatContainer.appendChild(messagesArea);
        chatContainer.appendChild(inputArea);
        container.appendChild(chatContainer);

        // Event listeners
        document.getElementById('logout-btn').addEventListener('click', () => this.handleLogout());
        document.getElementById('send-btn').addEventListener('click', () => this.sendMessage());
        document.getElementById('message-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Load chat history
        this.loadChatHistory();
    }

    async sendMessage() {
        const input = document.getElementById('message-input');
        const message = input.value.trim();
        if (!message) return;

        input.value = '';
        this.addMessageToChat(message, 'user');

        try {
            const response = await this.chatManager.sendMessage(message);
            this.addMessageToChat(response, 'ai');
        } catch (error) {
            this.addMessageToChat('Sorry, I encountered an error. Please try again.', 'ai');
        }
    }

    addMessageToChat(message, sender) {
        const messagesArea = document.getElementById('chat-messages');
        const messageDiv = this.uiBuilder.createElement('div', {
            style: {
                marginBottom: '15px',
                display: 'flex',
                justifyContent: sender === 'user' ? 'flex-end' : 'flex-start'
            }
        });

        const messageBubble = this.uiBuilder.createElement('div', {
            style: {
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '18px',
                background: sender === 'user' 
                    ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' 
                    : '#e2e8f0',
                color: sender === 'user' ? 'white' : '#1f2937',
                wordWrap: 'break-word'
            },
            innerHTML: message
        });

        messageDiv.appendChild(messageBubble);
        messagesArea.appendChild(messageDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    loadChatHistory() {
        // Add welcome message
        this.addMessageToChat('Hello! I\'m Mr. Elijah, your AI study companion. How can I help you today?', 'ai');
    }

    handleLogout() {
        this.authManager.logout();
        this.showAuthInterface();
    }

    showNotification(message, type = 'info') {
        const notification = this.uiBuilder.createElement('div', {
            style: {
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '12px 20px',
                borderRadius: '8px',
                color: 'white',
                background: type === 'error' ? '#ef4444' : '#10b981',
                zIndex: '10000',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            },
            innerHTML: message
        });

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIStudentCompanionApp();
});
