import React, { useState } from 'react';
import './FeedbackReport.css';

const FeedbackReport = ({ 
  feedbackData,
  emotionData,
  questionData,
  answerRecordings,
  typedAnswers,
  onStartNewInterview
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  if (!feedbackData || feedbackData.length === 0) {
    return (
      <div className="feedback-report empty">
        <p>No feedback data available yet. Complete interview questions to see your feedback.</p>
      </div>
    );
  }
  
  // Calculate overall confidence score (average of all questions)
  const overallScore = Math.round(
    feedbackData
      .filter(item => item && typeof item.confidenceScore === 'number')
      .reduce((sum, item) => sum + item.confidenceScore, 0) / 
    (feedbackData.filter(item => item && typeof item.confidenceScore === 'number').length || 1)
  );
  
  // Count dominant emotions across all recordings
  const emotionCounts = {};
  if (emotionData && emotionData.length > 0) {
    emotionData.forEach(data => {
      if (data && data.dominant) {
        emotionCounts[data.dominant] = (emotionCounts[data.dominant] || 0) + 1;
      }
    });
  }
  
  // Get most frequent emotion
  const mostFrequentEmotion = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .shift();
  
  const dominantEmotionName = mostFrequentEmotion ? mostFrequentEmotion[0] : 'neutral';
  
  // Get all improvement tips
  const allTips = feedbackData
    .filter(item => item && Array.isArray(item.improvementTips))
    .flatMap(item => item.improvementTips);
  
  // Get unique categories of tips
  const tipCategories = [...new Set(allTips.filter(tip => tip && tip.category).map(tip => tip.category))];

  // Helper function for rating colors
  const getRatingColor = (score) => {
    // Convert 10-point scale to 5-point scale
    const normalizedScore = Math.ceil(score / 2);
    
    if (normalizedScore >= 4) return 'bg-green-100 text-green-800';
    if (normalizedScore >= 2) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };
  
  // Pagination handlers
  const goToNextQuestion = () => {
    if (currentQuestionIndex < feedbackData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  return (
    <div className="feedback-report">
      <div className="report-header">
        <h2>Interview Performance Report</h2>
        <button className="new-interview-button" onClick={onStartNewInterview}>
          Start New Interview
        </button>
      </div>
      
      <div className="report-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'questions' ? 'active' : ''}`} 
          onClick={() => setActiveTab('questions')}
        >
          Question Analysis
        </button>
        <button 
          className={`tab-button ${activeTab === 'emotions' ? 'active' : ''}`} 
          onClick={() => setActiveTab('emotions')}
        >
          Emotion Analysis
        </button>
        <button 
          className={`tab-button ${activeTab === 'tips' ? 'active' : ''}`} 
          onClick={() => setActiveTab('tips')}
        >
          Improvement Tips
        </button>
      </div>
      
      <div className="report-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="score-card">
              <div className="score-value">
                <span className="score">{overallScore}</span>
                <span className="max">/10</span>
              </div>
              <div className="score-label">Overall Confidence</div>
            </div>
            
            <div className="summary-stats">
              <div className="stat-item">
                <div className="stat-value">{feedbackData.length}</div>
                <div className="stat-label">Questions Answered</div>
              </div>
              <div className="stat-item">
                <div className="stat-value emotion-stat">
                  {dominantEmotionName.charAt(0).toUpperCase() + dominantEmotionName.slice(1)}
                </div>
                <div className="stat-label">Dominant Emotion</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {tipCategories.length}
                </div>
                <div className="stat-label">Improvement Areas</div>
              </div>
            </div>
            
            <div className="top-strengths-weaknesses">
              <div className="strengths">
                <h4>Top Strengths</h4>
                <ul>
                  {feedbackData
                    .filter(item => item.strengths && item.strengths.length > 0)
                    .flatMap(item => item.strengths)
                    .slice(0, 3)
                    .map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                </ul>
              </div>
              <div className="weaknesses">
                <h4>Areas to Improve</h4>
                <ul>
                  {allTips
                    .slice(0, 3)
                    .map((tip, index) => (
                      <li key={index}>{tip.tip}</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'questions' && (
          <div className="questions-tab">
            {/* Pagination controls - top */}
            <div className="pagination-controls">
              <div className="question-counter">
                Question {currentQuestionIndex + 1} of {feedbackData.length}
              </div>
              <div className="pagination-buttons">
                <button 
                  className={`pagination-button prev ${currentQuestionIndex === 0 ? 'disabled' : ''}`}
                  onClick={goToPrevQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  ← Previous
                </button>
                <button 
                  className={`pagination-button next ${currentQuestionIndex === feedbackData.length - 1 ? 'disabled' : ''}`}
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === feedbackData.length - 1}
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Single question feedback display */}
            {feedbackData.length > 0 && (
              <div className="question-feedback-display">
                {(() => {
                  const feedback = feedbackData[currentQuestionIndex] || {};
                  const question = questionData?.[currentQuestionIndex] || {};
                  const recording = answerRecordings?.[currentQuestionIndex];
                  const typedAnswer = typedAnswers?.[currentQuestionIndex];
                  const ratingColor = feedback.confidenceScore ? getRatingColor(feedback.confidenceScore) : '';
                  
                  return (
                    <div className="question-feedback-item" key={currentQuestionIndex}>
                      <div className="question-header">
                        <div className="question-info">
                          <span className={`question-type ${question.type || 'behavioral'}`}>
                            {question.type === 'behavioral' ? '🧠 Behavioral' : '💻 Technical'}
                          </span>
                        </div>
                        <div className={`question-score ${ratingColor}`}>
                          Rating: <span className="score-value">{Math.ceil((feedback.confidenceScore || 0)/2)}/5</span>
                        </div>
                      </div>
                      
                      <div className="question-content">
                        <h3 className="question-text text-xl font-bold mb-4">{question.text || 'Question unavailable'}</h3>
                        
                        <div className="answer-section p-4 bg-gray-50 rounded-lg mb-6">
                          <h4 className="text-lg font-semibold mb-3">📝 Your Answer:</h4>
                          
                          {/* Show typed answer if available */}
                          {typedAnswer && (
                            <div className="typed-answer mb-4">
                              <h5 className="font-medium text-gray-700 mb-1">Typed Response:</h5>
                              <p className="font-mono text-gray-800 p-3 bg-white rounded border">{typedAnswer}</p>
                            </div>
                          )}
                          
                          {/* Show transcript if available */}
                          {recording && recording.transcript && (
                            <div className="transcript mb-4">
                              <h5 className="font-medium text-gray-700 mb-1">Spoken Response:</h5>
                              <p className="font-mono text-gray-800 p-3 bg-white rounded border">{recording.transcript}</p>
                            </div>
                          )}
                          
                          {/* Show audio if available */}
                          {recording && recording.audio && (
                            <div className="audio-playback mt-3">
                              <audio src={recording.audio.url} controls className="audio-player w-full" />
                            </div>
                          )}
                          
                          {/* Show message if no answer available */}
                          {!typedAnswer && (!recording || !recording.transcript) && (
                            <p className="text-gray-500 italic">No answer provided</p>
                          )}
                        </div>
                        
                        <div className="feedback-details font-serif">
                          <h4 className="text-lg font-semibold mb-3">💬 Feedback Analysis:</h4>
                          <p className="feedback-text text-gray-700 mb-4 leading-relaxed">{feedback.feedbackText || 'No feedback available'}</p>
                          
                          <div className="feedback-strengths mb-5">
                            <h5 className="font-semibold text-green-700 mb-2">✅ Strengths:</h5>
                            {feedback.strengths && feedback.strengths.length > 0 ? (
                              <ul className="list-disc pl-5 space-y-1">
                                {feedback.strengths.map((strength, i) => (
                                  <li key={i} className="text-gray-700">{strength}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500 italic">No strengths identified</p>
                            )}
                          </div>
                          
                          <div className="feedback-improvements">
                            <h5 className="font-semibold text-orange-700 mb-2">🔧 Areas for Improvement:</h5>
                            {feedback.improvementTips && feedback.improvementTips.length > 0 ? (
                              <div className="space-y-4">
                                {feedback.improvementTips.map((tip, i) => (
                                  <div className="improvement-tip bg-white p-3 rounded shadow-sm" key={i}>
                                    <div className="tip-category font-semibold text-gray-800 uppercase text-sm mb-1">{tip.category}</div>
                                    <div className="tip-content">
                                      <div className="tip-text font-medium mb-1">{tip.tip}</div>
                                      <div className="tip-example text-sm text-gray-600 italic">Example: {tip.example}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 italic">No improvement tips available</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            
            {/* Pagination controls - bottom */}
            <div className="pagination-controls mt-6">
              <div className="pagination-buttons">
                <button 
                  className={`pagination-button prev ${currentQuestionIndex === 0 ? 'disabled' : ''}`}
                  onClick={goToPrevQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  ← Previous
                </button>
                <button 
                  className={`pagination-button next ${currentQuestionIndex === feedbackData.length - 1 ? 'disabled' : ''}`}
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === feedbackData.length - 1}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'emotions' && (
          <div className="emotions-tab">
            <div className="emotion-summary">
              <h4>Emotional Expression Summary</h4>
              <p>Based on facial expressions during your responses</p>
              
              <div className="emotion-distribution">
                {Object.entries(emotionCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([emotion, count]) => {
                    const percentage = Math.round((count / (emotionData?.length || 1)) * 100);
                    
                    return (
                      <div className="emotion-item" key={emotion}>
                        <div className="emotion-name">
                          {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                        </div>
                        <div className="emotion-bar-container">
                          <div 
                            className={`emotion-bar ${emotion}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="emotion-percentage">{percentage}%</div>
                      </div>
                    );
                  })}
              </div>
            </div>
            
            <div className="emotion-insights">
              <h4>Emotional Insights</h4>
              <div className="insights-list">
                {dominantEmotionName === 'happy' && (
                  <div className="insight-item">
                    <h5>Positive Expression</h5>
                    <p>You displayed confidence and enthusiasm during your interview, which is generally perceived positively by interviewers.</p>
                  </div>
                )}
                
                {dominantEmotionName === 'neutral' && (
                  <div className="insight-item">
                    <h5>Measured Expression</h5>
                    <p>You maintained a composed demeanor throughout the interview, which shows professionalism and focus.</p>
                  </div>
                )}
                
                {(dominantEmotionName === 'sad' || dominantEmotionName === 'fearful') && (
                  <div className="insight-item">
                    <h5>Uncertainty Signals</h5>
                    <p>Your expressions suggest some nervousness or uncertainty. This is natural, but practicing more can help build confidence.</p>
                  </div>
                )}
                
                {dominantEmotionName === 'surprised' && (
                  <div className="insight-item">
                    <h5>Reaction Patterns</h5>
                    <p>You showed surprise during several questions, which might indicate you need more preparation for unexpected questions.</p>
                  </div>
                )}
                
                <div className="insight-item">
                  <h5>Recommendations</h5>
                  <ul>
                    <li>Practice maintaining appropriate facial expressions</li>
                    <li>Record yourself answering questions to become more aware of your expressions</li>
                    <li>Focus on projecting confidence through both verbal and non-verbal cues</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'tips' && (
          <div className="tips-tab">
            <h4>Improvement Tips by Category</h4>
            
            <div className="tips-categories">
              {tipCategories.map(category => (
                <div className="tip-category" key={category}>
                  <h5>{category.charAt(0).toUpperCase() + category.slice(1)}</h5>
                  <ul className="tips-list">
                    {allTips
                      .filter(tip => tip.category === category)
                      .map((tip, index) => (
                        <li key={index}>
                          <span className="tip-text">{tip.tip}</span>
                          {tip.example && (
                            <span className="tip-example">Example: "{tip.example}"</span>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="practice-suggestions">
              <h4>Practice Suggestions</h4>
              <ul>
                <li>Schedule regular mock interviews with friends or mentors</li>
                <li>Record and review your practice sessions</li>
                <li>Join interview preparation groups or workshops</li>
                <li>Research common questions for your target role</li>
                <li>Prepare structured answers using the STAR method (Situation, Task, Action, Result)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      
      <div className="report-footer">
        <button className="download-report-button">
          Download Full Report (PDF)
        </button>
        <p className="report-disclaimer">
          This report is generated based on AI analysis and should be used as a guide for improvement.
        </p>
      </div>
    </div>
  );
};

export default FeedbackReport; 