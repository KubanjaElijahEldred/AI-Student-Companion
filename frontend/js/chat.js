class ChatManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.pendingMessages = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
    this.typingTimeout = null;
    
    this.initElements();
    this.initEventListeners();
    this.connectWebSocket();
  }

  initElements() {
    this.chatMessages = document.getElementById('chatMessages');
    this.messageInput = document.getElementById('messageInput');
    this.sendButton = document.getElementById('sendButton');
    this.typingIndicator = document.getElementById('typingIndicator');
    this.connectionStatus = document.getElementById('connectionStatus') || this.createConnectionStatus();
    this.uploadButton = document.getElementById('uploadButton') || this.createUploadButton();
    this.imageInput = document.getElementById('imageInput') || this.createImageInput();
    this.imagePreview = document.getElementById('imagePreview');
    this.previewContainer = document.getElementById('previewContainer');
  }

  createConnectionStatus() {
    const status = document.createElement('div');
    status.id = 'connectionStatus';
    status.className = 'status-disconnected';
    document.querySelector('.chat-header').appendChild(status);
    return status;
  }

  createUploadButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'upload-button';
    button.id = 'uploadButton';
    button.innerHTML = '📷';
    button.title = 'Upload Image';
    document.querySelector('.chat-input-form').prepend(button);
    return button;
  }

  createImageInput() {
    const input = document.createElement('input');
    input.type = 'file';
    input.id = 'imageInput';
    input.accept = 'image/*';
    input.style.display = 'none';
    document.body.appendChild(input);
    return input;
  }

  initEventListeners() {
    // Message input
    this.messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Form submission
    document.getElementById('chatForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.sendMessage();
    });

    // Upload button
    this.uploadButton.addEventListener('click', () => {
      this.imageInput.click();
    });

    // Image selection
    this.imageInput.addEventListener('change', (e) => {
      this.handleImageUpload(e);
    });

    // Remove image button
    document.getElementById('removeImage').addEventListener('click', (e) => {
      e.preventDefault();
      this.removeImagePreview();
    });

    // Typing indicator
    this.messageInput.addEventListener('input', () => {
      this.sendTypingIndicator(true);
      this.debounceTypingIndicator();
    });
  }

  debounceTypingIndicator() {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    
    this.typingTimeout = setTimeout(() => {
      this.sendTypingIndicator(false);
    }, 1000);
  }

  // Handle image upload and preview
  handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPG, PNG, GIF)');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.showImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  // Show image preview
  showImagePreview(imageData) {
    this.imagePreview.src = imageData;
    this.previewContainer.style.display = 'block';
    // Scroll to bottom to show the preview
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  // Remove image preview
  removeImagePreview() {
    this.previewContainer.style.display = 'none';
    this.imageInput.value = ''; // Reset file input
  }

  // Send message with optional image
  async sendMessage() {
    const message = this.messageInput.value.trim();
    const imageFile = this.imageInput.files[0];

    // Don't send empty messages
    if (!message && !imageFile) return;

    // Create message object
    const messageObj = {
      id: Date.now().toString(),
      text: message,
      timestamp: new Date().toISOString(),
      type: imageFile ? 'image' : 'text',
      image: imageFile ? await this.getImageBase64(imageFile) : null
    };

    // Add message to chat
    this.addMessage('user', messageObj);

    // Clear input fields
    this.messageInput.value = '';
    this.removeImagePreview();

    // Send to server if connected
    if (this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'message',
        data: messageObj
      }));
    }

    // Show typing indicator for AI response
    this.showTypingIndicator();
  }

  // Convert image file to base64
  getImageBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // Add message to chat
  addMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    
    let content = '';
    if (message.type === 'image' && message.image) {
      content = `<div class="message-image"><img src="${message.image}" alt="Uploaded image"></div>`;
    }
    if (message.text) {
      content += `<div class="message-content">${message.text}</div>`;
    }
    
    messageElement.innerHTML = `
      <div class="message-sender">${sender === 'user' ? 'You' : 'AI'}</div>
      ${content}
      <div class="message-time">${new Date(message.timestamp).toLocaleTimeString()}</div>
    `;
    
    this.chatMessages.appendChild(messageElement);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  connectWebSocket() {
    try {
      // Use dynamic WebSocket URL based on current host
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsHost = window.location.hostname === 'localhost' ? 'localhost:3002' : window.location.host;
      this.socket = new WebSocket(`${wsProtocol}//${wsHost}`);
      
      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.updateConnectionStatus(true);
      };
      
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleWebSocketMessage(data);
      };
      
      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.updateConnectionStatus(false);
        this.attemptReconnect();
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.updateConnectionStatus(false);
      };
      
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      this.attemptReconnect();
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // Exponential backoff, max 30s
      
      console.log(`Attempting to reconnect in ${delay}ms (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connectWebSocket();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  handleWebSocketMessage(data) {
    console.log('Received message:', data);
    
    switch (data.type) {
      case 'connected':
        this.handleConnectionEstablished(data);
        break;
      case 'typing':
        this.handleTypingIndicator(data);
        break;
      case 'response':
        this.handleResponse(data);
        break;
      case 'error':
        this.handleError(data);
        break;
      default:
        console.warn('Unknown message type:', data.type);
    }
  }

  handleConnectionEstablished(data) {
    console.log('Connection established with session ID:', data.sessionId);
    this.addSystemMessage('Connected to chat server');
  }

  handleTypingIndicator(data) {
    if (data.isTyping) {
      this.showTypingIndicator();
    } else {
      this.hideTypingIndicator();
    }
  }

  handleResponse(data) {
    this.hideTypingIndicator();
    
    if (data.inResponseTo) {
      const pending = this.pendingMessages.get(data.inResponseTo);
      if (pending) {
        pending.resolve();
        this.pendingMessages.delete(data.inResponseTo);
      }
    }
    
    this.addMessage('assistant', data.content);
  }

  handleError(data) {
    console.error('Server error:', data);
    this.addSystemMessage(`Error: ${data.error || 'An unknown error occurred'}`);
    
    if (data.messageId) {
      const pending = this.pendingMessages.get(data.messageId);
      if (pending) {
        pending.reject(new Error(data.error));
        this.pendingMessages.delete(data.messageId);
      }
    }
  }

  async sendMessage() {
    const message = this.messageInput.value.trim();
    const hasImage = this.imagePreview?.src;
    
    if (!message && !hasImage) return;
    
    const messageId = `msg-${Date.now()}`;
    
    try {
      // Show message immediately in the UI
      if (message) {
        this.addMessage('user', message, messageId);
      }
      
      if (hasImage) {
        await this.uploadImage(message, messageId);
      } else {
        await this.sendTextMessage(message, messageId);
      }
      
      // Clear input
      this.messageInput.value = '';
      this.clearImagePreview();
      
    } catch (error) {
      console.error('Error sending message:', error);
      this.addSystemMessage(`Failed to send message: ${error.message}`);
    }
  }

  async uploadImage(caption, messageId) {
    const formData = new FormData();
    formData.append('image', this.imageInput.files[0]);
    
    try {
      const response = await fetch('http://localhost:3002/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }
      
      const result = await response.json();
      
      // Show image in chat
      this.addMessage('user', caption || 'Image:', messageId, result.filePath);
      
      // Send message with image URL
      return this.sendSocketMessage({
        type: 'message',
        messageId,
        message: caption || 'Tell me about this image',
        imageUrl: result.filePath
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  sendTextMessage(message, messageId) {
    return this.sendSocketMessage({
      type: 'message',
      messageId,
      message
    });
  }

  sendSocketMessage(data) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error('Not connected to server'));
        return;
      }
      
      this.pendingMessages.set(data.messageId, { resolve, reject });
      
      // Set a timeout for the message
      setTimeout(() => {
        if (this.pendingMessages.has(data.messageId)) {
          this.pendingMessages.delete(data.messageId);
          reject(new Error('Request timed out'));
        }
      }, 30000); // 30 second timeout
      
      this.socket.send(JSON.stringify(data));
    });
  }

  sendTypingIndicator(isTyping) {
    if (this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'typing',
        isTyping
      }));
    }
  }

  addMessage(sender, content, messageId = null, imageUrl = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    if (messageId) messageDiv.id = messageId;
    
    let contentHtml = '';
    if (imageUrl) {
      contentHtml += `<img src="${imageUrl}" class="message-image" alt="Uploaded content">`;
    }
    if (content) {
      contentHtml += `<div class="message-content">${this.escapeHtml(content)}</div>`;
    }
    
    messageDiv.innerHTML = contentHtml;
    this.chatMessages.appendChild(messageDiv);
    this.scrollToBottom();
  }

  addSystemMessage(content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system-message';
    messageDiv.textContent = content;
    this.chatMessages.appendChild(messageDiv);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.style.display = 'block';
      this.scrollToBottom();
    }
  }

  hideTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.style.display = 'none';
    }
  }

  updateConnectionStatus(connected) {
    if (!this.connectionStatus) return;
    
    this.connectionStatus.textContent = connected ? '🟢 Connected' : '🔴 Disconnected';
    this.connectionStatus.className = connected ? 'status-connected' : 'status-disconnected';
  }

  async handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (!this.imagePreview) {
        this.imagePreview = document.createElement('img');
        this.imagePreview.id = 'imagePreview';
        this.imagePreview.className = 'message-image';
        
        this.previewContainer = document.createElement('div');
        this.previewContainer.id = 'previewContainer';
        this.previewContainer.className = 'preview-container';
        
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'remove-image';
        removeButton.innerHTML = '×';
        removeButton.onclick = () => this.clearImagePreview();
        
        this.previewContainer.appendChild(this.imagePreview);
        this.previewContainer.appendChild(removeButton);
        
        const chatInput = document.querySelector('.chat-input-form');
        chatInput.parentNode.insertBefore(this.previewContainer, chatInput);
      }
      
      this.imagePreview.src = e.target.result;
      this.previewContainer.style.display = 'block';
    };
    
    reader.readAsDataURL(file);
  }

  clearImagePreview() {
    if (this.imagePreview) {
      this.imagePreview.src = '';
      this.previewContainer.style.display = 'none';
      this.imageInput.value = '';
    }
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Initialize chat when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const chat = new ChatManager();
  window.chatManager = chat; // Make it globally available if needed
});
