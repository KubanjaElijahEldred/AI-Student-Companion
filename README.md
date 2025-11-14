# AI Student Companion

![GitHub language count](https://img.shields.io/github/languages/count/yourusername/ai-student-companion)
![GitHub top language](https://img.shields.io/github/languages/top/yourusername/ai-student-companion)

A powerful AI-powered student companion application built with Node.js and Java, designed to enhance learning and productivity.

## 🚀 Features

- Real-time chat with AI assistant
- Seamless integration with Ollama's language models
- WebSocket-based communication
- Clean, modern architecture
- Cross-platform compatibility

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, WebSocket
- **AI Integration**: Ollama
- **Build Tools**: npm, Maven
- **Version Control**: Git

## 📦 Prerequisites

- Node.js 16+
- Java 11+
- Ollama server running locally
- npm or yarn

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-student-companion.git
   cd ai-student-companion
   ```

2. **Install dependencies**
   ```bash
   # Install Node.js dependencies
   npm install
   
   # Install Java dependencies
   mvn install
   ```

3. **Start the backend server**
   ```bash
   node server.js
   ```

4. **Start the frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3002

## 🔧 Configuration

Create a `.env` file in the root directory with the following variables:

```env
PORT=3002
OLLAMA_URL=http://localhost:11434
MODEL=llama3.2:1b
```

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai/) for the powerful AI models
- All contributors who have helped shape this project
A smart AI assistant for students
