const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// AI Resume Analysis
// Uses OpenAI API to analyze resumes and provide suggestions
router.post('/analyze-resume', protect, async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({ success: false, message: 'Resume text is required' });
    }

    // Check if OpenAI key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      // Return mock analysis if no API key
      return res.json({
        success: true,
        data: {
          score: 72,
          summary: 'Your resume shows good experience but could be improved in several areas.',
          strengths: [
            'Clear work experience section',
            'Good use of action verbs',
            'Education section is well-formatted'
          ],
          improvements: [
            'Add more quantifiable achievements',
            'Include relevant keywords for ATS optimization',
            'Add a professional summary section',
            'List technical skills prominently'
          ],
          extractedSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'CSS', 'HTML'],
          missingKeywords: ['TypeScript', 'AWS', 'Docker', 'CI/CD', 'Agile'],
          atsScore: 65
        }
      });
    }

    const { OpenAI } = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert resume analyzer. Analyze the given resume and return a JSON response with:
            - score (0-100)
            - summary (brief analysis)
            - strengths (array of 3-5 strengths)
            - improvements (array of 3-5 suggestions)
            - extractedSkills (array of skills found)
            - missingKeywords (array of common skills missing)
            - atsScore (0-100, ATS compatibility score)`
        },
        { role: 'user', content: `Analyze this resume:\n\n${resumeText}` }
      ],
      response_format: { type: 'json_object' }
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// AI Job Recommendations
router.post('/recommend-jobs', protect, async (req, res) => {
  try {
    const { skills, experience, preferences } = req.body;
    const Job = require('../models/Job');

    // Find jobs matching user skills
    let query = { status: 'open' };
    if (skills && skills.length > 0) {
      query.skillsRequired = { $in: skills };
    }

    const jobs = await Job.find(query)
      .populate('recruiterId', 'name company')
      .sort('-createdAt')
      .limit(10);

    // Score each job based on skill match
    const scoredJobs = jobs.map(job => {
      const matchedSkills = job.skillsRequired.filter(skill =>
        skills.some(s => s.toLowerCase() === skill.toLowerCase())
      );
      const matchScore = job.skillsRequired.length > 0
        ? Math.round((matchedSkills.length / job.skillsRequired.length) * 100)
        : 50;

      return {
        ...job.toObject(),
        matchScore,
        matchedSkills
      };
    });

    // Sort by match score
    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ success: true, data: scoredJobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
