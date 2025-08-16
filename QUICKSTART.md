# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js (v16+)
- MongoDB (local installation or MongoDB Atlas account)
- OpenAI API key
- Gmail account with app password

### Step 1: Environment Setup

1. **Backend Configuration** - Edit `backend/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/aimeetingsummarizer
   OPENAI_API_KEY=your_openai_api_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```

2. **Frontend Configuration** - `frontend/.env` should work as-is:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Step 2: Start the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Or use the single command from the root directory:
```bash
npm run dev
```

### Step 3: Test the Application

1. Open http://localhost:3000 in your browser
2. Upload one of the sample files from `examples/` folder
3. Try generating a summary
4. Test the email sharing feature

## 📋 Sample Test Flow

1. **Upload**: Use `examples/sample-meeting-transcript.txt`
2. **Custom Prompt**: Try "Summarize in bullet points for executives"
3. **Generate**: Click "Generate AI Summary"
4. **Edit**: Make some changes to the generated summary
5. **Share**: Send to your own email address

## 🔧 Troubleshooting

### Common Issues

**Backend won't start:**
- Check if MongoDB is running
- Verify environment variables in `backend/.env`
- Check if port 5000 is available

**Frontend won't start:**
- Verify `frontend/.env` has correct API URL
- Check if port 3000 is available

**Summary generation fails:**
- Verify OpenAI API key is correct
- Check OpenAI account has credits/billing set up
- Look at backend console for detailed error messages

**Email sharing fails:**
- Use Gmail app password, not regular password
- Enable 2-factor authentication first
- Test with `/api/test-email` endpoint

### Getting API Keys

1. **OpenAI API Key**:
   - Go to https://platform.openai.com/api-keys
   - Create new secret key
   - Set up billing (required for API usage)

2. **Gmail App Password**:
   - Enable 2-factor authentication on your Google account
   - Go to https://myaccount.google.com/apppasswords
   - Generate app password for "Mail"

### Database Options

**Option 1: Local MongoDB**
```bash
# Install MongoDB locally and start it
mongod --dbpath /path/to/data/directory
```

**Option 2: MongoDB Atlas (Cloud)**
- Create free account at https://www.mongodb.com/atlas
- Create cluster and get connection string
- Use connection string in `MONGODB_URI`

## 🎯 Next Steps

Once everything is working:

1. **Customize**: Modify prompts and UI to fit your needs
2. **Deploy**: Follow `DEPLOYMENT.md` for production deployment
3. **Extend**: Add features like user authentication, file history, etc.

## 📞 Support

- Check `README.md` for detailed setup instructions
- Review `DEPLOYMENT.md` for production deployment
- Look at example files in `examples/` folder
- Check browser console and backend logs for errors
