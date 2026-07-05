# PressHouse Vercel

[![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/press-house/ph-ye.org)

## 🚀 Overview

PressHouse Vercel is a modern, scalable content management system built for the PressHouse media platform. It features AI-powered content generation, real-time analytics, and seamless deployment on Vercel.

## ✨ Features

- **AI-Powered Content**: Integrated with NVIDIA AI for intelligent content generation
- **Real-time Analytics**: Live dashboard with visitor statistics
- **Telegram Bot**: Admin notifications and control via Telegram
- **Vercel Blob Storage**: Scalable file storage solution
- **Neon PostgreSQL**: Serverless database for optimal performance
- **Multi-language Support**: Arabic and English interfaces

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Express.js, Vercel Serverless Functions
- **Database**: Neon PostgreSQL
- **Storage**: Vercel Blob
- **AI**: NVIDIA API (GLM-5.2)
- **Deployment**: Vercel

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Vercel CLI (optional)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/press-house/ph-ye.org.git
cd ph-ye.org

# Run installation script
chmod +x install.sh
./install.sh

# Or manually:
npm install
npm run build
```

### Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in all required environment variables
3. Never commit `.env` to version control

## 🔧 Configuration

### Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `NVIDIA_API_KEY` | NVIDIA API key for AI features | Yes |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | Yes |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token | Yes |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `VITE_API_URL` | API base URL | `https://ph-ye.org` |
| `REDIS_URL` | Redis connection string | - |

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Manual Deployment

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables
4. Deploy

## 📁 Project Structure

```
ph-ye.org/
├── api/                    # Serverless API routes
│   ├── index.ts           # Main API entry
│   ├── ai.ts              # AI chat endpoint
│   └── telegram.ts        # Telegram bot webhook
├── src/                   # Frontend source
│   ├── components/        # React components
│   ├── pages/            # Page components
│   └── services/         # API services
├── dist/                  # Build output
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies
└── .env.example          # Environment template
```

## 🤖 AI Integration

The project uses NVIDIA's GLM-5.2 model for AI-powered features:

- Content generation
- Translation
- Summarization
- Chat assistance

## 📱 Telegram Bot

Admin bot for notifications and control:

- `/status` - Check website status
- `/stats` - View statistics
- `/help` - Show help

## 🔒 Security

- JWT authentication
- Helmet.js security headers
- Rate limiting
- CORS protection
- Environment variable isolation

## 📝 License

MIT License - see LICENSE file

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📧 Support

For support, email support@ph-ye.org or join our Telegram channel.

---

Built with ❤️ by PressHouse Team
