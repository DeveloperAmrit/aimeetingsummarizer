#!/bin/bash

# AI Meeting Summarizer - Development Setup Script
# This script sets up the development environment

echo "🚀 Setting up AI Meeting Summarizer development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm is installed: $(npm --version)"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
echo "✅ Backend dependencies installed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✅ Frontend dependencies installed"

# Create environment files from examples
echo "⚙️ Setting up environment files..."

cd ../backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created backend/.env from template"
    echo "⚠️  Please edit backend/.env with your actual values"
else
    echo "ℹ️  backend/.env already exists"
fi

cd ../frontend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created frontend/.env from template"
    echo "ℹ️  Frontend .env should work with default backend URL"
else
    echo "ℹ️  frontend/.env already exists"
fi

cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit backend/.env with your API keys and database connection"
echo "2. Start MongoDB (local) or use MongoDB Atlas (cloud)"
echo "3. Start the backend: cd backend && npm run dev"
echo "4. Start the frontend: cd frontend && npm start"
echo ""
echo "📚 Required environment variables (backend/.env):"
echo "   - MONGODB_URI (your MongoDB connection string)"
echo "   - OPENAI_API_KEY (your OpenAI API key)"
echo "   - EMAIL_USER (your Gmail address)"
echo "   - EMAIL_PASS (your Gmail app password)"
echo ""
echo "🔗 Useful links:"
echo "   - OpenAI API Keys: https://platform.openai.com/api-keys"
echo "   - MongoDB Atlas: https://www.mongodb.com/atlas"
echo "   - Gmail App Passwords: https://myaccount.google.com/apppasswords"
echo ""
echo "🐛 For troubleshooting, see README.md"
