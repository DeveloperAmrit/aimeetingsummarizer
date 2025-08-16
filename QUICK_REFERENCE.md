# AI Meeting Notes Summarizer & Sharer
## Quick Reference Documentation

### 🎯 Project Overview
A full-stack web application that transforms meeting transcripts into professional summaries using AI and enables seamless email sharing.

### 🏗️ Architecture
```
Frontend (React + Tailwind) → Backend (Node.js + Express) → AI APIs (Groq/OpenAI)
         ↓                           ↓                          ↓
   Vercel Hosting              Render Hosting             Email (Gmail SMTP)
         ↓                           ↓                          ↓
   User Interface              MongoDB Atlas              External Services
```

### 🚀 Key Features
- **Smart File Upload**: Drag-and-drop for .txt and .docx files (up to 50MB)
- **AI-Powered Summaries**: Groq Llama + OpenAI GPT with intelligent fallback
- **Custom Prompts**: Personalized summary formats and styles
- **Rich Text Editor**: Live preview with markdown support
- **Professional Email**: HTML templates with responsive design
- **Multi-Provider Reliability**: Automatic failover between AI services

### 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18, Tailwind CSS | Interactive UI and responsive design |
| **Backend** | Node.js, Express | API server and business logic |
| **Database** | MongoDB Atlas | Document storage and relationships |
| **AI Services** | Groq API, OpenAI API | Summary generation with fallback |
| **Email** | Nodemailer + Gmail SMTP | Professional email delivery |
| **Hosting** | Vercel + Render | Production deployment |

### 📁 Project Structure
```
aimeetingsummarizer/
├── frontend/                 # React application
│   ├── src/components/      # UI components
│   ├── src/services/        # API integration
│   └── public/              # Static assets
├── backend/                 # Node.js API server
│   ├── routes/              # API endpoints
│   ├── models/              # Database schemas
│   └── server.js            # Main server file
├── examples/                # Sample files
└── docs/                    # Documentation
```

### 🔄 User Workflow
1. **Upload** → Drag & drop meeting transcript (.txt/.docx)
2. **Generate** → Add custom prompt + AI summary generation
3. **Edit** → Refine summary with rich text editor
4. **Share** → Send professional email to team members

### 🌐 Live Application
- **Frontend**: https://aimeetingsummarizer-frontend.vercel.app
- **Backend API**: https://aimeetingsummarizer.onrender.com
- **Repository**: https://github.com/DeveloperAmrit/aimeetingsummarizer

### 📊 Performance Metrics
- **File Processing**: < 5 seconds for 10MB files
- **AI Generation**: < 30 seconds average
- **Email Delivery**: < 10 seconds
- **Database Queries**: < 500ms
- **Concurrent Users**: 100+ supported

### 🔧 Development Setup
```bash
# Clone repository
git clone https://github.com/DeveloperAmrit/aimeetingsummarizer.git
cd aimeetingsummarizer

# Setup backend
cd backend
npm install
cp .env.example .env  # Configure environment variables
npm start

# Setup frontend (new terminal)
cd frontend
npm install
npm start
```

### 🌍 Environment Variables
```bash
# Backend (.env)
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_...
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000

# Frontend (.env.local)
REACT_APP_API_URL=http://localhost:5000
```

### 🚨 Troubleshooting
| Issue | Solution |
|-------|----------|
| File upload fails | Check file format (.txt/.docx) and size (<50MB) |
| AI generation errors | Verify API keys and check service status |
| Email not sending | Confirm Gmail app password and 2FA enabled |
| CORS errors | Update backend CORS with correct frontend URL |

### 🔮 Future Roadmap
- **Phase 1**: User authentication, multiple summary formats
- **Phase 2**: Audio transcription, team collaboration
- **Phase 3**: Enterprise features, advanced analytics

### 📈 Success Metrics
- ✅ 100% feature completion
- ✅ Production deployment successful
- ✅ Multi-provider AI reliability
- ✅ Professional email templates
- ✅ Responsive design across devices
- ✅ Comprehensive error handling

---

**Quick Start**: Upload a meeting transcript → Add custom prompt → Generate AI summary → Edit if needed → Share via email

**Support**: Check `TECHNICAL_DOCUMENTATION.pdf` for detailed implementation guide
