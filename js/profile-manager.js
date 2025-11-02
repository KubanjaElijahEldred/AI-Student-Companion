// Profile Picture Manager - Pure JavaScript
class ProfilePictureManager {
    constructor() {
        this.canvas = null;
        this.video = null;
        this.stream = null;
    }

    async captureFromCamera() {
        return new Promise((resolve, reject) => {
            const modal = this.createCameraModal(resolve, reject);
            document.body.appendChild(modal);
        });
    }

    createCameraModal(resolve, reject) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const container = document.createElement('div');
        container.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            max-width: 500px;
            width: 90%;
        `;

        const title = document.createElement('h3');
        title.textContent = 'Take Profile Picture';
        title.style.cssText = `
            margin: 0 0 20px 0;
            color: #333;
            font-size: 1.5rem;
        `;

        const video = document.createElement('video');
        video.style.cssText = `
            width: 100%;
            max-width: 300px;
            height: 225px;
            border-radius: 10px;
            background: #f0f0f0;
            margin-bottom: 20px;
        `;
        video.autoplay = true;
        video.playsInline = true;

        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 225;
        canvas.style.display = 'none';

        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            gap: 10px;
            justify-content: center;
        `;

        const captureBtn = document.createElement('button');
        captureBtn.innerHTML = '<i class="fas fa-camera"></i> Capture';
        captureBtn.style.cssText = `
            background: #10b981;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        `;

        const cancelBtn = document.createElement('button');
        cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
        cancelBtn.style.cssText = `
            background: #ef4444;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        `;

        buttonsContainer.appendChild(captureBtn);
        buttonsContainer.appendChild(cancelBtn);

        container.appendChild(title);
        container.appendChild(video);
        container.appendChild(canvas);
        container.appendChild(buttonsContainer);
        modal.appendChild(container);

        // Start camera
        this.startCamera(video).then(() => {
            this.video = video;
            this.canvas = canvas;
        }).catch((error) => {
            reject(error);
            modal.remove();
        });

        // Event listeners
        captureBtn.addEventListener('click', () => {
            const imageData = this.captureImage();
            this.stopCamera();
            modal.remove();
            resolve(imageData);
        });

        cancelBtn.addEventListener('click', () => {
            this.stopCamera();
            modal.remove();
            reject(new Error('Camera capture cancelled'));
        });

        return modal;
    }

    async startCamera(video) {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: 300, 
                    height: 225,
                    facingMode: 'user'
                } 
            });
            video.srcObject = this.stream;
        } catch (error) {
            throw new Error('Camera access denied or not available');
        }
    }

    captureImage() {
        if (!this.canvas || !this.video) return null;

        const ctx = this.canvas.getContext('2d');
        ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        return this.canvas.toDataURL('image/jpeg', 0.8);
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }

    selectFromGallery() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        resolve(e.target.result);
                    };
                    reader.onerror = () => {
                        reject(new Error('Failed to read file'));
                    };
                    reader.readAsDataURL(file);
                } else {
                    reject(new Error('No file selected'));
                }
            };
            
            input.click();
        });
    }

    resizeImage(imageData, maxWidth = 200, maxHeight = 200) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Calculate new dimensions
                let { width, height } = img;
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.src = imageData;
        });
    }
}
