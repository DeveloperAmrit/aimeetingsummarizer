const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const Groq = require('groq-sdk');
const Transcript = require('../models/Transcript');
const Summary = require('../models/Summary');

// Initialize AI clients
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

const groq = process.env.GROQ_API_KEY ? new Groq({
  apiKey: process.env.GROQ_API_KEY,
}) : null;

// Log available AI services
console.log('AI Services initialized:');
console.log('- OpenAI:', openai ? 'Available' : 'Not configured');
console.log('- Groq:', groq ? 'Available' : 'Not configured');

// Generate summary using OpenAI
async function generateOpenAISummary(content, customPrompt) {
  const systemPrompt = `You are an AI assistant specialized in creating clear, concise meeting summaries. 
Your task is to analyze meeting transcripts and provide structured summaries that are easy to read and actionable.

Default format:
- **Key Topics Discussed**: Main subjects covered in the meeting
- **Action Items**: Specific tasks assigned with responsible parties
- **Decisions Made**: Important conclusions or resolutions
- **Next Steps**: Follow-up actions or future meetings planned

If the user provides custom instructions, follow those instead of the default format.`;

  const userPrompt = customPrompt 
    ? `Custom instructions: ${customPrompt}\n\nMeeting transcript to summarize:\n${content}`
    : `Please summarize this meeting transcript:\n${content}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    max_tokens: 2000,
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

// Generate summary using Groq
async function generateGroqSummary(content, customPrompt) {
  const systemPrompt = `You are an AI assistant specialized in creating clear, concise meeting summaries. 
Your task is to analyze meeting transcripts and provide structured summaries that are easy to read and actionable.

Default format:
- **Key Topics Discussed**: Main subjects covered in the meeting
- **Action Items**: Specific tasks assigned with responsible parties
- **Decisions Made**: Important conclusions or resolutions
- **Next Steps**: Follow-up actions or future meetings planned

If the user provides custom instructions, follow those instead of the default format.`;

  const userPrompt = customPrompt 
    ? `Custom instructions: ${customPrompt}\n\nMeeting transcript to summarize:\n${content}`
    : `Please summarize this meeting transcript:\n${content}`;

  // Try different Groq models in order of preference
  const models = [
    "llama3-8b-8192",
    "llama3-70b-8192", 
    "mixtral-8x7b-32768",
    "gemma-7b-it"
  ];

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      console.log(`Trying Groq model: ${model}`);
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        model: model,
        max_tokens: 2000,
        temperature: 0.7,
      });

      console.log(`Successfully used Groq model: ${model}`);
      return completion.choices[0].message.content;
    } catch (modelError) {
      console.log(`Groq model ${model} failed:`, modelError.message);
      if (i === models.length - 1) {
        // If this was the last model, throw the error
        throw modelError;
      }
      // Otherwise, continue to the next model
    }
  }
}

// Summarize endpoint
router.post('/summarize', async (req, res) => {
  try {
    const { transcriptId, customPrompt = '' } = req.body;

    if (!transcriptId) {
      return res.status(400).json({ error: 'Transcript ID is required' });
    }

    // Get transcript from database
    const transcript = await Transcript.findById(transcriptId);
    if (!transcript) {
      return res.status(404).json({ error: 'Transcript not found' });
    }

    let summary;
    let aiProvider;

    // Try Groq first (since OpenAI has quota issues), then fallback to OpenAI
    try {
      if (groq) {
        console.log('Attempting to generate summary with Groq...');
        summary = await generateGroqSummary(transcript.content, customPrompt);
        aiProvider = 'groq';
        console.log('Groq summary generated successfully');
      } else if (openai) {
        console.log('Groq not available, using OpenAI...');
        summary = await generateOpenAISummary(transcript.content, customPrompt);
        aiProvider = 'openai';
        console.log('OpenAI summary generated successfully');
      } else {
        return res.status(500).json({ 
          error: 'No AI service available. Please configure OpenAI or Groq API keys.' 
        });
      }
    } catch (primaryError) {
      console.error(`${aiProvider || 'Primary AI'} error:`, primaryError.message);
      
      // Try the other AI service as fallback
      if (aiProvider === 'groq' && openai) {
        try {
          console.log('Groq failed, falling back to OpenAI...');
          summary = await generateOpenAISummary(transcript.content, customPrompt);
          aiProvider = 'openai';
          console.log('OpenAI fallback successful');
        } catch (openaiError) {
          console.error('OpenAI fallback error:', openaiError.message);
          return res.status(500).json({ 
            error: 'Failed to generate summary with available AI services',
            details: `Groq: ${primaryError.message}, OpenAI: ${openaiError.message}`
          });
        }
      } else if (aiProvider === 'openai' && groq) {
        try {
          console.log('OpenAI failed, falling back to Groq...');
          summary = await generateGroqSummary(transcript.content, customPrompt);
          aiProvider = 'groq';
          console.log('Groq fallback successful');
        } catch (groqError) {
          console.error('Groq fallback error:', groqError.message);
          return res.status(500).json({ 
            error: 'Failed to generate summary with available AI services',
            details: `OpenAI: ${primaryError.message}, Groq: ${groqError.message}`
          });
        }
      } else {
        return res.status(500).json({ 
          error: 'Failed to generate summary. No alternative AI service available.',
          message: primaryError.message 
        });
      }
    }

    // Save summary to database
    const summaryDoc = new Summary({
      transcriptId: transcriptId,
      originalContent: transcript.content,
      customPrompt: customPrompt,
      generatedSummary: summary,
      aiProvider: aiProvider
    });

    const savedSummary = await summaryDoc.save();

    res.json({
      success: true,
      summary: {
        id: savedSummary._id,
        content: summary,
        customPrompt: customPrompt,
        aiProvider: aiProvider,
        createdDate: savedSummary.createdDate
      }
    });

  } catch (error) {
    console.error('Summarize error:', error);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      message: error.message 
    });
  }
});

// Update summary endpoint
router.put('/summary/:id', async (req, res) => {
  try {
    const { editedSummary } = req.body;
    const summaryId = req.params.id;

    if (!editedSummary) {
      return res.status(400).json({ error: 'Edited summary content is required' });
    }

    const summary = await Summary.findByIdAndUpdate(
      summaryId,
      { editedSummary: editedSummary },
      { new: true }
    );

    if (!summary) {
      return res.status(404).json({ error: 'Summary not found' });
    }

    res.json({
      success: true,
      message: 'Summary updated successfully',
      summary: {
        id: summary._id,
        content: summary.editedSummary || summary.generatedSummary,
        lastModified: summary.lastModified
      }
    });

  } catch (error) {
    console.error('Update summary error:', error);
    res.status(500).json({ 
      error: 'Failed to update summary',
      message: error.message 
    });
  }
});

// Get summary by ID
router.get('/summary/:id', async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id).populate('transcriptId');
    
    if (!summary) {
      return res.status(404).json({ error: 'Summary not found' });
    }

    res.json({ 
      summary: {
        id: summary._id,
        content: summary.editedSummary || summary.generatedSummary,
        originalContent: summary.generatedSummary,
        customPrompt: summary.customPrompt,
        aiProvider: summary.aiProvider,
        transcript: summary.transcriptId,
        createdDate: summary.createdDate,
        lastModified: summary.lastModified
      }
    });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve summary',
      message: error.message 
    });
  }
});

module.exports = router;
