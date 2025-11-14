const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3002');

ws.on('open', () => {
  console.log('Connected to WebSocket server');
  ws.send(JSON.stringify({ message: 'Hello, Ollama!' }));
});

ws.on('message', (data) => {
  console.log('Received:', JSON.parse(data).message);
  process.exit(0);
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
  process.exit(1);
});
