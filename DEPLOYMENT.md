# Deployment Guide

This guide covers deploying the AI Meeting Notes Summarizer & Sharer to various cloud platforms.

## Overview

- **Frontend**: React app (deploy to Vercel/Netlify)
- **Backend**: Node.js API (deploy to Render/Heroku)
- **Database**: MongoDB (use MongoDB Atlas for cloud)

## Prerequisites

1. GitHub account (for code deployment)
2. API keys (OpenAI and/or Groq)
3. Email service credentials (Gmail recommended)
4. MongoDB Atlas account (for cloud database)

## Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the free tier)

### 2. Configure Database Access
1. Create a database user:
   - Go to Database Access → Add New Database User
   - Choose Password authentication
   - Set username and password (save these for later)
   - Grant read/write access to any database

2. Configure network access:
   - Go to Network Access → Add IP Address
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for simplicity
   - Or add specific IP addresses for better security

### 3. Get Connection String
1. Go to Clusters → Connect → Connect your application
2. Copy the connection string
3. Replace `<password>` with your database user password
4. Replace `<dbname>` with your database name (e.g., `aimeetingsummarizer`)

Example: `mongodb+srv://username:password@cluster0.abc123.mongodb.net/aimeetingsummarizer?retryWrites=true&w=majority`

## Backend Deployment

### Option 1: Deploy to Render

1. **Create Render Account**
   - Go to [Render](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the backend folder or root directory
   - Configure:
     - **Name**: `ai-meeting-summarizer-api`
     - **Environment**: Node
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && npm start`

3. **Set Environment Variables**
   ```
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   OPENAI_API_KEY=your_openai_api_key
   GROQ_API_KEY=your_groq_api_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the service URL (e.g., `https://your-app.onrender.com`)

### Option 2: Deploy to Heroku

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   
   heroku create your-app-name
   heroku config:set MONGODB_URI="your_mongodb_connection_string"
   heroku config:set OPENAI_API_KEY="your_openai_api_key"
   heroku config:set GROQ_API_KEY="your_groq_api_key"
   heroku config:set EMAIL_USER="your_email@gmail.com"
   heroku config:set EMAIL_PASS="your_gmail_app_password"
   heroku config:set FRONTEND_URL="https://your-frontend-url.vercel.app"
   
   git push heroku main
   ```

## Frontend Deployment

### Option 1: Deploy to Vercel

1. **Create Vercel Account**
   - Go to [Vercel](https://vercel.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click "New Project"
   - Import your GitHub repository
   - Select the frontend folder
   - Configure:
     - **Framework Preset**: Create React App
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`

3. **Set Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note the deployment URL

### Option 2: Deploy to Netlify

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `build` folder
   - Or connect GitHub repository

3. **Set Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.onrender.com/api`

## Email Setup (Gmail)

### 1. Enable 2-Factor Authentication
1. Go to Google Account settings
2. Security → 2-Step Verification
3. Follow the setup process

### 2. Generate App Password
1. Go to Security → 2-Step Verification → App passwords
2. Select "Mail" and generate password
3. Use this password in `EMAIL_PASS` environment variable

## Testing Deployment

### 1. Test Backend
```bash
curl https://your-backend-url.onrender.com/api/health
```

### 2. Test Frontend
1. Open your frontend URL in browser
2. Try uploading a sample transcript
3. Test summary generation
4. Test email sharing

## Environment Variables Summary

### Backend Environment Variables
```
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/aimeetingsummarizer
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_...
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend Environment Variables
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` is set correctly in backend
   - Check that frontend API URL matches backend URL

2. **Database Connection Errors**
   - Verify MongoDB Atlas connection string
   - Check database user permissions
   - Ensure network access is configured

3. **Email Not Sending**
   - Verify Gmail app password (not regular password)
   - Check 2-factor authentication is enabled
   - Test with `curl https://your-backend-url/api/test-email`

4. **AI API Errors**
   - Verify API keys are correct
   - Check API rate limits
   - Ensure billing is set up (for OpenAI)

5. **File Upload Issues**
   - Check file size limits (50MB max)
   - Verify file types (.txt, .docx)
   - Ensure backend can handle multipart/form-data

### Logs and Debugging

1. **Render Logs**
   - Go to your service dashboard
   - Click "Logs" tab

2. **Vercel Logs**
   - Go to your project dashboard
   - Click "Functions" tab for serverless logs

3. **Browser Console**
   - Open developer tools
   - Check console for JavaScript errors
   - Check network tab for API call failures

## Performance Optimization

### Backend
- Enable gzip compression
- Implement API rate limiting
- Add request logging
- Set up health checks

### Frontend
- Enable build optimization
- Use CDN for static assets
- Implement lazy loading
- Add error boundaries

### Database
- Create indexes for frequently queried fields
- Implement connection pooling
- Set up database monitoring

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to version control
   - Use platform-specific secret management

2. **API Security**
   - Implement rate limiting
   - Add request validation
   - Use HTTPS only

3. **Database Security**
   - Use strong passwords
   - Limit network access
   - Enable authentication

4. **Email Security**
   - Use app passwords, not account passwords
   - Implement email rate limiting
   - Validate email addresses

## Monitoring and Maintenance

1. **Set Up Monitoring**
   - Monitor API response times
   - Track error rates
   - Monitor database performance

2. **Regular Updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Update API keys as needed

3. **Backup Strategy**
   - Regular database backups
   - Code repository backups
   - Environment configuration backups

## Support

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Review platform-specific documentation:
   - [Render Docs](https://render.com/docs)
   - [Vercel Docs](https://vercel.com/docs)
   - [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
3. Check the GitHub issues for known problems
4. Create a new issue with detailed error logs
