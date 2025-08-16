# AI Meeting Notes Summarizer & Sharer

A full-stack web application that allows users to upload meeting transcripts, generate AI-powered summaries with custom prompts, edit summaries, and share them via email.

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **AI**: OpenAI API (with Groq API fallback)
- **Email**: Nodemailer

## Features

- Upload `.txt` or `.docx` meeting transcripts
- Custom prompt instructions for AI summarization
- Generate AI-powered summaries
- Edit generated summaries
- Share summaries via email

## Project Structure

```
aimeetingsummarizer/
├── frontend/          # React application
├── backend/           # Express API server
└── README.md         # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- OpenAI API key (or Groq API key)
- Email service credentials (Gmail recommended)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/aimeetingsummarizer
   OPENAI_API_KEY=your_openai_api_key_here
   GROQ_API_KEY=your_groq_api_key_here (optional)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

### Environment Variables

#### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `OPENAI_API_KEY`: Your OpenAI API key
- `GROQ_API_KEY`: Your Groq API key (optional fallback)
- `EMAIL_USER`: Email address for sending summaries
- `EMAIL_PASS`: Email app password (for Gmail, generate an app password)

#### Frontend (.env)
- `REACT_APP_API_URL`: Backend API URL

### Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an app password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use this app password in the `EMAIL_PASS` environment variable

### Database Setup

The application will automatically create the required collections in MongoDB. Make sure your MongoDB instance is running and accessible via the `MONGODB_URI`.

## API Endpoints

- `POST /api/upload` - Upload and store transcript
- `POST /api/summarize` - Generate AI summary
- `POST /api/share` - Send summary via email

## Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:
   ```bash
   cd frontend && npm run build
   ```

2. Deploy the `build` folder to Vercel or Netlify
3. Set the environment variable `REACT_APP_API_URL` to your deployed backend URL

### Backend (Render/Heroku)

1. Deploy the backend folder to Render or Heroku
2. Set all required environment variables in the deployment platform
3. Ensure MongoDB is accessible from the deployed backend

## Usage

1. Open the application in your browser
2. Upload a `.txt` or `.docx` meeting transcript
3. Enter custom instructions for the summary (optional)
4. Click "Generate Summary" to create an AI-powered summary
5. Edit the summary as needed
6. Enter recipient email addresses and share the summary

## Development

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`
- CORS is configured to allow frontend-backend communication

## License

MIT License
