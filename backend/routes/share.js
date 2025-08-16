const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Summary = require('../models/Summary');

// Create email transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials not configured');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Share summary via email
router.post('/share', async (req, res) => {
  try {
    const { summaryId, recipients, subject, message } = req.body;

    // Validation
    if (!summaryId) {
      return res.status(400).json({ error: 'Summary ID is required' });
    }

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'At least one recipient email is required' });
    }

    // Validate email addresses
    const invalidEmails = recipients.filter(email => !validateEmail(email));
    if (invalidEmails.length > 0) {
      return res.status(400).json({ 
        error: 'Invalid email addresses found',
        invalidEmails: invalidEmails
      });
    }

    // Get summary from database
    const summary = await Summary.findById(summaryId).populate('transcriptId');
    if (!summary) {
      return res.status(404).json({ error: 'Summary not found' });
    }

    // Create email transporter
    const transporter = createTransporter();

    // Prepare email content
    const summaryContent = summary.editedSummary || summary.generatedSummary;
    const emailSubject = subject || `Meeting Summary: ${summary.transcriptId.filename}`;
    
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Meeting Summary</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
            }
            .container {
                background-color: white;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                border-bottom: 2px solid #e2e8f0;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #2d3748;
                margin: 0;
                font-size: 24px;
            }
            .meta-info {
                background-color: #f7fafc;
                padding: 15px;
                border-radius: 6px;
                margin-bottom: 25px;
                border-left: 4px solid #4299e1;
            }
            .meta-info p {
                margin: 5px 0;
                font-size: 14px;
                color: #4a5568;
            }
            .summary-content {
                line-height: 1.8;
                white-space: pre-wrap;
            }
            .summary-content h2, .summary-content h3 {
                color: #2d3748;
                margin-top: 25px;
                margin-bottom: 10px;
            }
            .summary-content strong {
                color: #2d3748;
            }
            .custom-message {
                background-color: #edf2f7;
                padding: 15px;
                border-radius: 6px;
                margin-bottom: 25px;
                font-style: italic;
                border-left: 4px solid #68d391;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e2e8f0;
                font-size: 12px;
                color: #718096;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📋 Meeting Summary</h1>
            </div>
            
            <div class="meta-info">
                <p><strong>Original File:</strong> ${summary.transcriptId.filename}</p>
                <p><strong>Generated:</strong> ${summary.createdDate.toLocaleDateString()} at ${summary.createdDate.toLocaleTimeString()}</p>
                <p><strong>AI Provider:</strong> ${summary.aiProvider.toUpperCase()}</p>
                ${summary.customPrompt ? `<p><strong>Custom Instructions:</strong> ${summary.customPrompt}</p>` : ''}
            </div>

            ${message ? `
            <div class="custom-message">
                <strong>Message from sender:</strong><br>
                ${message}
            </div>
            ` : ''}

            <div class="summary-content">
                ${summaryContent.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
            </div>

            <div class="footer">
                <p>This summary was generated using AI Meeting Notes Summarizer & Sharer</p>
                <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Send emails
    const emailPromises = recipients.map(async (email) => {
      const mailOptions = {
        from: `"AI Meeting Summarizer" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: emailSubject,
        html: emailHtml,
        text: `Meeting Summary: ${summary.transcriptId.filename}\n\n${summaryContent}`
      };

      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);

    res.json({
      success: true,
      message: `Summary shared successfully with ${recipients.length} recipient(s)`,
      recipients: recipients,
      emailSubject: emailSubject
    });

  } catch (error) {
    console.error('Share error:', error);
    
    if (error.message.includes('Email credentials not configured')) {
      return res.status(500).json({ 
        error: 'Email service not configured',
        message: 'Please configure EMAIL_USER and EMAIL_PASS environment variables'
      });
    }

    res.status(500).json({ 
      error: 'Failed to share summary',
      message: error.message 
    });
  }
});

// Test email configuration
router.get('/test-email', async (req, res) => {
  try {
    const transporter = createTransporter();
    
    // Verify email configuration
    await transporter.verify();
    
    res.json({
      success: true,
      message: 'Email configuration is valid',
      emailUser: process.env.EMAIL_USER
    });
  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({ 
      error: 'Email configuration test failed',
      message: error.message 
    });
  }
});

module.exports = router;
