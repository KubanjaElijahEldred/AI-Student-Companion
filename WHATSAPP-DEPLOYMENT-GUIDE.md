# WhatsApp Business API Deployment Guide

## Overview
This guide covers deploying your AI Student Companion with WhatsApp Business API integration across multiple platforms.

## Prerequisites

### 1. WhatsApp Business API Setup
- Meta Developer Account
- WhatsApp Business Account (Phone: +256 788577092)
- WhatsApp Business API Access Token
- Phone Number ID
- Webhook Verify Token

### 2. Environment Variables
Copy `.env.whatsapp` to `.env` and configure:
```bash
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_custom_webhook_verify_token_here
```

## Deployment Options

### Option 1: Railway (Recommended)
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Deploy: `railway up`
4. Configure environment variables in Railway dashboard
5. Webhook URL: `https://your-app.railway.app/webhook/whatsapp`

### Option 2: Render
1. Connect GitHub repository to Render
2. Use `render.yaml` configuration
3. Configure environment variables
4. Webhook URL: `https://your-app.onrender.com/webhook/whatsapp`

### Option 3: Docker
1. Build: `docker build -t ai-student-companion .`
2. Run: `docker-compose up -d`
3. Webhook URL: `http://localhost:3002/webhook/whatsapp`

## WhatsApp Webhook Configuration

### 1. Set Webhook URL
In Meta Developer Dashboard:
```
https://your-domain.com/webhook/whatsapp
```

### 2. Webhook Fields
Subscribe to:
- `messages`
- `message_delivery` (optional)

### 3. Verify Token
Use the same token as `WHATSAPP_WEBHOOK_VERIFY_TOKEN`

## Testing

### Local Testing
1. Start server: `node whatsapp-server.js`
2. Use ngrok for webhook: `ngrok http 3002`
3. Set webhook URL to ngrok URL

### WhatsApp Testing
Send messages to +256 788577092:
- Text messages
- Interactive buttons
- Location sharing

## Features

### 1. AI Chatbot Integration
- Conversational AI responses
- Context-aware conversations
- Study assistance

### 2. Interactive Messages
- Button responses
- List messages
- Quick replies

### 3. Notifications
- Send notifications from web app
- Study reminders
- Assignment alerts

### 4. Multi-platform Support
- Web chat interface
- WhatsApp integration
- Real-time synchronization

## Monitoring

### Health Check
```
GET /health
```

### Logs
- Server logs
- WhatsApp message logs
- Error tracking

## Troubleshooting

### Common Issues
1. **Webhook not verified**: Check verify token
2. **Messages not sending**: Verify access token
3. **No responses**: Check Ollama connection
4. **Deployment fails**: Check environment variables

### Debug Mode
Set `NODE_ENV=development` for detailed logs

## Security

### Best Practices
- Use HTTPS for webhook URL
- Validate webhook messages
- Secure access tokens
- Rate limiting

### Environment Security
- Never commit `.env` files
- Use platform-specific secret management
- Rotate access tokens regularly

## Scaling

### Horizontal Scaling
- Load balancer setup
- Session management
- Database integration

### Performance
- Caching strategies
- Message queuing
- CDN for static assets

## Support

### Documentation
- API Documentation: `API-DOCUMENTATION.md`
- Advanced Features: `ADVANCED-FEATURES.md`

### Community
- GitHub Issues
- Discord Community
- Email Support

## Next Steps

1. Deploy to your preferred platform
2. Configure WhatsApp webhook
3. Test all features
4. Set up monitoring
5. Scale as needed

## Quick Start Commands

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.whatsapp .env

# Start locally
node whatsapp-server.js

# Deploy to Railway
railway up

# Deploy with Docker
docker-compose up -d
```

Your AI Student Companion with WhatsApp integration is now ready for deployment! 🚀
