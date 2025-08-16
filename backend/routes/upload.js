const express = require('express');
const router = express.Router();
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const Transcript = require('../models/Transcript');

// Upload transcript endpoint
router.post('/upload', async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('req.files:', req.files);
    console.log('req.files type:', typeof req.files);
    
    if (!req.files || !req.files.transcript) {
      console.log('No files found in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.transcript;
    console.log('File object:', file);
    console.log('File data type:', typeof file.data);
    console.log('File data length:', file.data ? file.data.length : 'null');
    const allowedTypes = ['.txt', '.docx'];
    const fileExtension = path.extname(file.name).toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      return res.status(400).json({ 
        error: 'Invalid file type. Only .txt and .docx files are allowed.' 
      });
    }

    let content = '';

    console.log('Processing file:', file.name, 'Extension:', fileExtension, 'Size:', file.size);

    if (fileExtension === '.txt') {
      // Read text file
      content = file.data.toString('utf8');
      console.log('Text file content length:', content.length);
      console.log('First 100 characters:', content.substring(0, 100));
    } else if (fileExtension === '.docx') {
      // Read DOCX file
      try {
        const result = await mammoth.extractRawText({ buffer: file.data });
        content = result.value;
        console.log('DOCX file content length:', content.length);
        console.log('First 100 characters:', content.substring(0, 100));
      } catch (docxError) {
        console.error('Error reading DOCX file:', docxError);
        return res.status(400).json({ 
          error: 'Error reading DOCX file. Please ensure it is a valid Word document.' 
        });
      }
    }

    console.log('Content after processing - Length:', content.length, 'Trimmed length:', content.trim().length);

    if (!content.trim()) {
      return res.status(400).json({ 
        error: 'File appears to be empty or unreadable' 
      });
    }

    // Save transcript to database
    const transcript = new Transcript({
      filename: file.name,
      content: content.trim(),
      fileSize: file.size,
      fileType: fileExtension
    });

    const savedTranscript = await transcript.save();

    res.json({
      success: true,
      message: 'File uploaded successfully',
      transcript: {
        id: savedTranscript._id,
        filename: savedTranscript.filename,
        content: savedTranscript.content,
        uploadDate: savedTranscript.uploadDate,
        fileSize: savedTranscript.fileSize,
        fileType: savedTranscript.fileType
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload file',
      message: error.message 
    });
  }
});

// Get transcript by ID
router.get('/transcript/:id', async (req, res) => {
  try {
    const transcript = await Transcript.findById(req.params.id);
    
    if (!transcript) {
      return res.status(404).json({ error: 'Transcript not found' });
    }

    res.json({ transcript });
  } catch (error) {
    console.error('Get transcript error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve transcript',
      message: error.message 
    });
  }
});

// Get all transcripts
router.get('/transcripts', async (req, res) => {
  try {
    const transcripts = await Transcript.find()
      .sort({ uploadDate: -1 })
      .select('filename uploadDate fileSize fileType');
    
    res.json({ transcripts });
  } catch (error) {
    console.error('Get transcripts error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve transcripts',
      message: error.message 
    });
  }
});

module.exports = router;
