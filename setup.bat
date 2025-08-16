@echo off
echo 🚀 Setting up AI Meeting Summarizer development environment...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm is installed
npm --version

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed

REM Create environment files from examples
echo ⚙️ Setting up environment files...

cd ..\backend
if not exist .env (
    copy .env.example .env
    echo ✅ Created backend\.env from template
    echo ⚠️  Please edit backend\.env with your actual values
) else (
    echo ℹ️  backend\.env already exists
)

cd ..\frontend
if not exist .env (
    copy .env.example .env
    echo ✅ Created frontend\.env from template
    echo ℹ️  Frontend .env should work with default backend URL
) else (
    echo ℹ️  frontend\.env already exists
)

cd ..

echo.
echo 🎉 Setup complete!
echo.
echo 📝 Next steps:
echo 1. Edit backend\.env with your API keys and database connection
echo 2. Start MongoDB (local) or use MongoDB Atlas (cloud)
echo 3. Start the backend: cd backend ^&^& npm run dev
echo 4. Start the frontend: cd frontend ^&^& npm start
echo.
echo 📚 Required environment variables (backend\.env):
echo    - MONGODB_URI (your MongoDB connection string)
echo    - OPENAI_API_KEY (your OpenAI API key)
echo    - EMAIL_USER (your Gmail address)
echo    - EMAIL_PASS (your Gmail app password)
echo.
echo 🔗 Useful links:
echo    - OpenAI API Keys: https://platform.openai.com/api-keys
echo    - MongoDB Atlas: https://www.mongodb.com/atlas
echo    - Gmail App Passwords: https://myaccount.google.com/apppasswords
echo.
echo 🐛 For troubleshooting, see README.md

pause
