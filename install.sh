#!/bin/bash
# ============================================
# PressHouse Vercel - Installation Script
# Version: 2026.07.01
# ============================================

set -e

echo "🚀 PressHouse Vercel Installation Script"
echo "=========================================="

# Check Node.js version
node_version=$(node -v 2>/dev/null || echo "not installed")
if [ "$node_version" == "not installed" ]; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $node_version"

# Check npm version
npm_version=$(npm -v 2>/dev/null || echo "not installed")
if [ "$npm_version" == "not installed" ]; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $npm_version"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env 2>/dev/null || echo "⚠️  .env.example not found. Please create .env manually."
fi

# Build the project
echo "🔨 Building the project..."
npm run build

echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your credentials"
echo "2. Run 'npm run dev' to start development server"
echo "3. Deploy to Vercel with 'vercel --prod'"
