import React, { useState, useRef } from 'react';
import ResumeUploader from '../components/ResumeUploader';
import QuestionPanel from '../components/QuestionPanel';
import VideoRecorder from '../components/VideoRecorder';
import EmotionTracker from '../components/EmotionTracker';
import FeedbackReport from '../components/FeedbackReport';
import { generateQuestions, generateFeedback } from '../services/geminiService';
import './InterviewPrep.css';

const InterviewPrep = () => {
  // Application state
  const [currentStep, setCurrentStep] = useState('upload'); // upload, questions, feedback
  const [isLoading, setIsLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [error, setError] = useState(null);
  
  // Questions state
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes
  
  // Recording data
  const [answerRecordings, setAnswerRecordings] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  // Typed answers
  const [typedAnswers, setTypedAnswers] = useState([]);
  
  // Emotion tracking
  const [emotionData, setEmotionData] = useState([]);
  
  // Feedback data
  const [feedbackData, setFeedbackData] = useState([]);
  
  // Refs
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  
  // Handle resume upload and generate questions
  const handleResumeSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    setResumeData(data);
    
    try {
      // Call Gemini API to generate questions
      const result = await generateQuestions(
        data.resumeText, 
        data.jobTitle, 
        data.companyName
      );
      
      if (result.questions && result.questions.length > 0) {
        setQuestions(result.questions);
        setCurrentStep('questions');
      } else {
        throw new Error("Failed to generate interview questions. Please try again.");
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      setError(error.message || "An error occurred while generating questions. Please try again.");
      
      // Fallback to mock questions for demo purposes
      const mockQuestions = [
        {
          id: 1,
          type: 'behavioral',
          text: 'Tell me about a time when you had to work with a difficult team member. How did you handle the situation?',
          context: 'This question helps assess your interpersonal skills and conflict resolution abilities.'
        },
        {
          id: 2,
          type: 'behavioral',
          text: 'Describe a project where you had to meet a tight deadline. How did you ensure the project was completed on time?',
          context: 'This question evaluates your time management and prioritization skills.'
        },
        {
          id: 3,
          type: 'behavioral',
          text: 'Tell me about a time when you failed at something. What did you learn from the experience?',
          context: 'This question assesses your ability to reflect on failures and grow from them.'
        },
        {
          id: 4,
          type: 'behavioral',
          text: 'Give an example of a situation where you had to make a difficult decision with limited information.',
          context: 'This question evaluates your decision-making process under uncertainty.'
        },
        {
          id: 5,
          type: 'behavioral',
          text: 'Describe a situation where you had to adapt to a significant change at work or school.',
          context: 'This question assesses your adaptability and flexibility.'
        },
        {
          id: 6,
          type: 'technical',
          text: `Based on your resume, explain how you would implement a feature that allows users to filter products by multiple criteria simultaneously.`,
          context: 'This question evaluates your technical problem-solving skills.'
        },
        {
          id: 7,
          type: 'technical',
          text: 'How would you optimize a web application that is loading slowly?',
          context: 'This question assesses your performance optimization knowledge.'
        },
        {
          id: 8,
          type: 'technical',
          text: 'Explain how you would design a database schema for a social media platform.',
          context: 'This question evaluates your database design skills.'
        },
        {
          id: 9,
          type: 'technical',
          text: 'How would you ensure that a web application is secure from common vulnerabilities?',
          context: 'This question assesses your security knowledge.'
        },
        {
          id: 10,
          type: 'technical',
          text: 'Describe how you would implement responsive design for a web application that needs to work on multiple device types.',
          context: 'This question evaluates your frontend development skills.'
        }
      ];
      
      alert("Using sample questions due to an API error: " + error.message);
      setQuestions(mockQuestions);
      setCurrentStep('questions');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Navigation between questions
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Recording handlers
  const handleRecordingStart = () => {
    setIsRecording(true);
    
    // Start timer
    setTimeRemaining(120);
    timerRef.current = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          handleRecordingStop();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };
  
  // Handle typed answer changes
  const handleTypedAnswerChange = (text) => {
    const newTypedAnswers = [...typedAnswers];
    newTypedAnswers[currentQuestionIndex] = text;
    setTypedAnswers(newTypedAnswers);
  };
  
  const handleRecordingStop = async (recordingData) => {
    setIsRecording(false);
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (!recordingData) return;
    
    // Save recording data
    const newRecordings = [...answerRecordings];
    newRecordings[currentQuestionIndex] = recordingData;
    setAnswerRecordings(newRecordings);
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get current question
      const currentQuestion = questions[currentQuestionIndex];
      
      // Use typed answer if available, otherwise use transcript
      const answerText = typedAnswers[currentQuestionIndex] || recordingData.transcript;
      
      // Call Gemini API to generate feedback
      const feedback = await generateFeedback(
        currentQuestion.text,
        answerText,
        currentQuestion.type
      );
      
      // Save feedback
      const newFeedback = [...feedbackData];
      newFeedback[currentQuestionIndex] = feedback;
      setFeedbackData(newFeedback);
      
      // If all questions have been answered, move to feedback
      const answeredQuestions = newFeedback.filter(Boolean).length;
      if (answeredQuestions === questions.length) {
        setCurrentStep('feedback');
      } else if (currentQuestionIndex < questions.length - 1) {
        // Automatically move to next question if not the last one
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } catch (error) {
      console.error('Error generating feedback:', error);
      setError(error.message || "An error occurred while generating feedback. Please try again.");
      
      // Fallback to mock feedback
      const mockFeedback = {
        confidenceScore: Math.floor(Math.random() * 3) + 7, // 7-10 range
        feedbackText: "Your answer was well-structured and covered key points. You provided a clear example that demonstrated your skills in handling the situation. Your communication was mostly clear, though there were a few moments where the explanation could have been more concise.",
        strengths: [
          "Good use of the STAR method in structuring your response",
          "Clear explanation of your specific role in the situation",
          "Effective communication of the outcome"
        ],
        improvementTips: [
          {
            category: "clarity",
            tip: "Try to be more concise with your explanations",
            example: "The part about teamwork could be more focused"
          },
          {
            category: "content",
            tip: "Include more specific metrics or results when possible",
            example: "Mention percentage improvements or specific outcomes"
          },
          {
            category: "delivery",
            tip: "Maintain a consistent pace throughout your answer",
            example: "You spoke quickly when describing the challenge"
          }
        ]
      };
      
      // Save feedback
      const newFeedback = [...feedbackData];
      newFeedback[currentQuestionIndex] = mockFeedback;
      setFeedbackData(newFeedback);
      
      alert("Using sample feedback due to an API error: " + error.message);
      
      // If all questions have been answered, move to feedback
      const answeredQuestions = newFeedback.filter(Boolean).length;
      if (answeredQuestions === questions.length) {
        setCurrentStep('feedback');
      } else if (currentQuestionIndex < questions.length - 1) {
        // Automatically move to next question if not the last one
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Transcript update handler
  const handleTranscriptUpdate = (transcript) => {
    setCurrentTranscript(transcript);
  };
  
  // Emotion tracking handler
  const handleEmotionUpdate = (data) => {
    const newEmotionData = [...emotionData];
    newEmotionData[currentQuestionIndex] = data;
    setEmotionData(newEmotionData);
  };
  
  // Restart interview
  const handleStartNewInterview = () => {
    setCurrentStep('upload');
    setResumeData(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswerRecordings([]);
    setFeedbackData([]);
    setEmotionData([]);
    setCurrentTranscript('');
    setError(null);
  };
  
  return (
    <div className="interview-prep">
      <header className="interview-header">
        <h1>AI Interview Coach</h1>
        <p>Practice your interview skills with AI-powered feedback</p>
      </header>
      
      <main className="interview-content">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {currentStep === 'upload' && (
          <ResumeUploader 
            onSubmit={handleResumeSubmit} 
            isLoading={isLoading} 
          />
        )}
        
        {currentStep === 'questions' && (
          <div className="interview-grid">
            <div className="questions-section">
              <QuestionPanel 
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
                questionType={questions[currentQuestionIndex]?.type}
              />
            </div>
            
            <div className="video-section">
              <VideoRecorder 
                onRecordingComplete={handleRecordingStop}
                onRecordingStart={handleRecordingStart}
                onTranscriptUpdate={handleTranscriptUpdate}
                isRecording={isRecording}
                setIsRecording={setIsRecording}
                isQuestionActive={true}
              />
            </div>
            
            <div className="emotion-section">
              <EmotionTracker 
                videoRef={videoRef}
                isRecording={isRecording}
                onEmotionUpdate={handleEmotionUpdate}
              />
            </div>
            
            <div className="transcript-section">
              <h3>Transcribe Audio</h3>
              <p>{currentTranscript || 'Your speech will be transcribed here...'}</p>
            </div>
            
            <div className="progress-section">
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 'feedback' && (
          <FeedbackReport 
            feedbackData={feedbackData}
            emotionData={emotionData}
            questionData={questions}
            answerRecordings={answerRecordings}
            typedAnswers={typedAnswers}
            onStartNewInterview={handleStartNewInterview}
          />
        )}
        
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-text">
              {currentStep === 'upload' ? 'Generating questions...' : 'Analyzing your answer...'}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default InterviewPrep; 