// Note: This is a frontend implementation for demo purposes
// In a production environment, these API calls should be made from a backend service
// to protect your API key

const API_KEY = "AIzaSyDbxiFF0qGePDRQqXdffeZuJSYqcp5tYaY";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

// Generate interview questions based on resume and job details
export const generateQuestions = async (resumeText, jobTitle, companyName) => {
  const prompt = `
    You are an expert AI interview coach. 
    
    I'm applying for a "${jobTitle}" position at "${companyName}".
    
    Here is my resume: 
    
    ${resumeText}
    
    Based on my resume and the job I'm applying for, please generate:
    1. 3 behavioral interview questions that are tailored to my experience
    2. 3 technical interview questions that are relevant to the position and my background
    
    For each question, include:
    - The question text
    - The question type (behavioral or technical)
    - A brief context explaining why this question is important
    
    Format your response as a JSON object with this structure:
    {
      "questions": [
        {
          "id": 1,
          "type": "behavioral", 
          "text": "Question text here",
          "context": "Context about the question"
        }
      ]
    }
  `;

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          response_mime_type: "application/json",
        }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini API error:", data.error);
      throw new Error(data.error.message);
    }

    const responseText = data.candidates[0].content.parts[0].text;

    try {
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}') + 1;
      const jsonString = responseText.substring(jsonStart, jsonEnd);
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Error parsing JSON from response:", parseError);
      return { questions: [] };
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

// Generate feedback for an interview answer
export const generateFeedback = async (question, transcript, questionType) => {
  // Handle empty transcripts to prevent API errors
  if (!transcript || transcript.trim().length < 5) {
    return {
      confidenceScore: 3,
      feedbackText: "Your answer was too brief to provide detailed feedback. Try to provide a more complete response.",
      strengths: ["You attempted to answer the question"],
      improvementTips: [
        {
          category: "content",
          tip: "Provide a more detailed and structured answer",
          example: "Consider using the STAR method (Situation, Task, Action, Result)"
        }
      ]
    };
  }

  const prompt = `
    You are an expert AI interview coach providing feedback on interview answers.
    
    Question (${questionType}): "${question}"
    
    Candidate's Answer: "${transcript}"
    
    IMPORTANT: You must analyze the answer and provide feedback in VALID JSON format ONLY. 
    No explanations, no extra text, just a valid JSON object with these exact fields and structure:
    
    {
      "confidenceScore": number between 1-10,
      "feedbackText": "detailed analysis of the overall answer",
      "strengths": [
        "specific strength 1",
        "specific strength 2",
        "specific strength 3"
      ],
      "improvementTips": [
        {
          "category": "clarity",
          "tip": "specific advice to improve",
          "example": "concrete example of how to implement the tip"
        },
        {
          "category": "content",
          "tip": "specific advice about content",
          "example": "concrete example"
        },
        {
          "category": "delivery",
          "tip": "specific advice about delivery",
          "example": "concrete example"
        }
      ]
    }
    
    IMPORTANT INSTRUCTIONS:
    1. Return ONLY a valid JSON object - no markdown, no extra text
    2. Always include ALL fields in the exact structure shown above
    3. The "confidenceScore" must be a number between 1-10
    4. Include at least 2 strengths (3 if possible)
    5. Include at least 2 improvement tips
    6. Use only these categories for tips: "clarity", "content", "delivery", "structure"
    7. Keep the "feedbackText" under 200 words
    8. Make the feedback specific to the answer content
  `;

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2, // Lower temperature for more consistent output
          maxOutputTokens: 800,
          response_mime_type: "application/json", // Request JSON response
        }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini API error:", data.error);
      throw new Error(data.error.message);
    }

    // Extract the text from the response
    const responseText = data.candidates[0].content.parts[0].text;
    
    // Try to parse the JSON from the response text
    try {
      // First try to parse directly in case we got clean JSON
      try {
        return JSON.parse(responseText);
      } catch (directParseError) {
        // If direct parsing fails, try to extract JSON from the text
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}') + 1;
        
        if (jsonStart === -1 || jsonEnd <= jsonStart) {
          throw new Error("Could not find valid JSON in response");
        }
        
        const jsonString = responseText.substring(jsonStart, jsonEnd);
        const parsedData = JSON.parse(jsonString);
        
        // Validate the required fields exist
        validateFeedbackStructure(parsedData);
        
        return parsedData;
      }
    } catch (parseError) {
      console.error("Error parsing JSON from response:", parseError);
      console.log("Raw response:", responseText);
      
      // Return a fallback feedback object
      return createFallbackFeedback(transcript, questionType);
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return createFallbackFeedback(transcript, questionType);
  }
};

// Helper function to validate feedback structure
function validateFeedbackStructure(feedback) {
  const requiredFields = ['confidenceScore', 'feedbackText', 'strengths', 'improvementTips'];
  
  for (const field of requiredFields) {
    if (feedback[field] === undefined) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  // Ensure confidenceScore is a number between 1-10
  if (typeof feedback.confidenceScore !== 'number' || 
      feedback.confidenceScore < 1 || 
      feedback.confidenceScore > 10) {
    feedback.confidenceScore = Math.min(Math.max(Math.round(feedback.confidenceScore) || 5, 1), 10);
  }
  
  // Ensure strengths is an array with at least one item
  if (!Array.isArray(feedback.strengths) || feedback.strengths.length === 0) {
    feedback.strengths = ["The answer addressed the question"];
  }
  
  // Ensure improvementTips is an array with at least one item
  if (!Array.isArray(feedback.improvementTips) || feedback.improvementTips.length === 0) {
    feedback.improvementTips = [
      {
        category: "content",
        tip: "Structure your answer more clearly",
        example: "Consider using the STAR method"
      }
    ];
  }
  
  // Ensure each improvementTip has the required fields
  feedback.improvementTips = feedback.improvementTips.map(tip => {
    if (!tip.category || !tip.tip) {
      return {
        category: tip.category || "content",
        tip: tip.tip || "Improve the structure of your answer",
        example: tip.example || "No specific example provided"
      };
    }
    return tip;
  });
  
  return feedback;
}

// Helper function to create fallback feedback when API fails
function createFallbackFeedback(transcript, questionType) {
  // Calculate a basic confidence score based on transcript length
  const wordCount = transcript.split(/\s+/).length;
  let confidenceScore = 5; // Default score
  
  if (wordCount < 10) {
    confidenceScore = 3;
  } else if (wordCount > 50) {
    confidenceScore = 7;
  }
  
  const feedback = {
    confidenceScore: confidenceScore,
    feedbackText: "Your answer provided some relevant information, but could be improved with more structure and specific examples. Try to elaborate more on your experiences and align your answer more directly with the question.",
    strengths: [
      "You attempted to address the question",
      "You provided some relevant information"
    ],
    improvementTips: [
      {
        category: "structure",
        tip: "Use a clear structure like the STAR method",
        example: "Begin with the Situation, then explain the Task, Action you took, and the Result"
      },
      {
        category: "content",
        tip: "Include specific examples and metrics",
        example: "Instead of saying 'I improved performance', say 'I improved system performance by 30%'"
      }
    ]
  };
  
  // Add question-type specific feedback
  if (questionType === 'behavioral') {
    feedback.improvementTips.push({
      category: "content",
      tip: "Connect your personal experience to the situation",
      example: "Explain how your actions personally impacted the outcome"
    });
  } else if (questionType === 'technical') {
    feedback.improvementTips.push({
      category: "content",
      tip: "Demonstrate technical depth and problem-solving approach",
      example: "Explain your thought process when approaching the problem"
    });
  }
  
  return feedback;
}
