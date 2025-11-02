// UI Builder - Pure JavaScript DOM manipulation utility
class UIBuilder {
    constructor() {
        this.themes = {
            light: {
                primary: '#4f46e5',
                secondary: '#7c3aed',
                success: '#10b981',
                error: '#ef4444',
                warning: '#f59e0b',
                background: '#ffffff',
                surface: '#f8fafc',
                text: '#1f2937',
                textSecondary: '#6b7280'
            },
            dark: {
                primary: '#6366f1',
                secondary: '#8b5cf6',
                success: '#34d399',
                error: '#f87171',
                warning: '#fbbf24',
                background: '#111827',
                surface: '#1f2937',
                text: '#f9fafb',
                textSecondary: '#d1d5db'
            }
        };
        
        this.currentTheme = 'light';
    }

    createElement(tag, options = {}) {
        const element = document.createElement(tag);
        
        // Set attributes
        if (options.id) element.id = options.id;
        if (options.className) element.className = options.className;
        if (options.innerHTML) element.innerHTML = options.innerHTML;
        if (options.textContent) element.textContent = options.textContent;
        
        // Set styles
        if (options.style) {
            if (typeof options.style === 'string') {
                element.style.cssText = options.style;
            } else {
                Object.assign(element.style, options.style);
            }
        }
        
        // Set other attributes
        if (options.attributes) {
            Object.entries(options.attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }
        
        // Add event listeners
        if (options.events) {
            Object.entries(options.events).forEach(([event, handler]) => {
                element.addEventListener(event, handler);
            });
        }
        
        return element;
    }

    createButton(text, options = {}) {
        const defaultStyle = {
            padding: '12px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
        };

        const variants = {
            primary: {
                background: `linear-gradient(135deg, ${this.themes[this.currentTheme].primary} 0%, ${this.themes[this.currentTheme].secondary} 100%)`,
                color: 'white'
            },
            success: {
                background: this.themes[this.currentTheme].success,
                color: 'white'
            },
            error: {
                background: this.themes[this.currentTheme].error,
                color: 'white'
            },
            secondary: {
                background: this.themes[this.currentTheme].surface,
                color: this.themes[this.currentTheme].text,
                border: `2px solid ${this.themes[this.currentTheme].primary}`
            }
        };

        const variant = options.variant || 'primary';
        const style = {
            ...defaultStyle,
            ...variants[variant],
            ...options.style
        };

        return this.createElement('button', {
            innerHTML: text,
            style,
            ...options
        });
    }

    createInput(type = 'text', options = {}) {
        const defaultStyle = {
            width: '100%',
            padding: '12px',
            border: `2px solid ${this.themes[this.currentTheme].surface}`,
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s ease'
        };

        const input = this.createElement('input', {
            style: { ...defaultStyle, ...options.style },
            attributes: { type, ...options.attributes },
            ...options
        });

        // Add focus effects
        input.addEventListener('focus', () => {
            input.style.borderColor = this.themes[this.currentTheme].primary;
        });

        input.addEventListener('blur', () => {
            input.style.borderColor = this.themes[this.currentTheme].surface;
        });

        return input;
    }

    createCard(options = {}) {
        const defaultStyle = {
            background: this.themes[this.currentTheme].background,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${this.themes[this.currentTheme].surface}`
        };

        return this.createElement('div', {
            style: { ...defaultStyle, ...options.style },
            ...options
        });
    }

    createModal(content, options = {}) {
        const overlay = this.createElement('div', {
            style: {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '10000',
                ...options.overlayStyle
            }
        });

        const modal = this.createCard({
            style: {
                maxWidth: '500px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto',
                ...options.modalStyle
            }
        });

        if (typeof content === 'string') {
            modal.innerHTML = content;
        } else {
            modal.appendChild(content);
        }

        overlay.appendChild(modal);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay && options.closeOnOverlayClick !== false) {
                overlay.remove();
                if (options.onClose) options.onClose();
            }
        });

        // Close on escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', handleEscape);
                if (options.onClose) options.onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);

        return overlay;
    }

    createNotification(message, type = 'info', duration = 3000) {
        const colors = {
            info: this.themes[this.currentTheme].primary,
            success: this.themes[this.currentTheme].success,
            error: this.themes[this.currentTheme].error,
            warning: this.themes[this.currentTheme].warning
        };

        const notification = this.createElement('div', {
            style: {
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '16px 20px',
                borderRadius: '8px',
                background: colors[type] || colors.info,
                color: 'white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                zIndex: '10001',
                transform: 'translateX(400px)',
                transition: 'transform 0.3s ease',
                maxWidth: '300px',
                wordWrap: 'break-word'
            },
            innerHTML: message
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, duration);

        return notification;
    }

    createLoader(text = 'Loading...') {
        return this.createElement('div', {
            style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '20px',
                color: this.themes[this.currentTheme].textSecondary
            },
            innerHTML: `
                <div style="
                    width: 20px;
                    height: 20px;
                    border: 2px solid ${this.themes[this.currentTheme].surface};
                    border-top: 2px solid ${this.themes[this.currentTheme].primary};
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
                <span>${text}</span>
            `
        });
    }

    setTheme(theme) {
        if (this.themes[theme]) {
            this.currentTheme = theme;
            this.updateDocumentTheme();
        }
    }

    updateDocumentTheme() {
        const theme = this.themes[this.currentTheme];
        document.documentElement.style.setProperty('--primary-color', theme.primary);
        document.documentElement.style.setProperty('--secondary-color', theme.secondary);
        document.documentElement.style.setProperty('--success-color', theme.success);
        document.documentElement.style.setProperty('--error-color', theme.error);
        document.documentElement.style.setProperty('--background-color', theme.background);
        document.documentElement.style.setProperty('--surface-color', theme.surface);
        document.documentElement.style.setProperty('--text-color', theme.text);
        document.documentElement.style.setProperty('--text-secondary-color', theme.textSecondary);
    }

    injectGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            * {
                box-sizing: border-box;
            }
            
            body {
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            button:hover {
                opacity: 0.9;
                transform: translateY(-1px);
            }
            
            input:focus {
                box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
            }
            
            .fade-in {
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
}
