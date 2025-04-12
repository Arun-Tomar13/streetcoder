import React, { useState, useEffect } from 'react';
import './QuestionPanel.css';

const QuestionPanel = ({ 
  questions, 
  currentQuestionIndex, 
  onNextQuestion, 
  onPrevQuestion,
  isRecording,
  timeRemaining,
  questionType,
  transcript,
  typedAnswer,
  onTypedAnswerChange
}) => {
  const [timerProgress, setTimerProgress] = useState(100);
  
  // Calculate timer progress percentage
  useEffect(() => {
    if (!isRecording || !timeRemaining) return;
    
    // Assuming each question has 2 minutes (120 seconds) to answer
    const maxTime = 120;
    const progress = (timeRemaining / maxTime) * 100;
    setTimerProgress(progress);
  }, [timeRemaining, isRecording]);
  
  const currentQuestion = questions && questions.length > 0 ? 
    questions[currentQuestionIndex] : null;

  if (!currentQuestion) {
    return (
      <div className="question-panel empty">
        <p>No questions available yet. Please upload your resume and job details first.</p>
      </div>
    );
  }

  return (
    <div className="question-panel">
      <div className="question-header">
        <div className="question-type">
          <span className={`type-badge ${currentQuestion.type === 'behavioral' ? 'behavioral' : 'technical'}`}>
            {currentQuestion.type === 'behavioral' ? 'Behavioral' : 'Technical'}
          </span>
          <span className="question-number">Question {currentQuestionIndex + 1} of {questions.length}</span>
        </div>
        
        {isRecording && (
          <div className="timer">
            <div className="timer-bar">
              <div 
                className="timer-progress" 
                style={{ width: `${timerProgress}%` }}
              ></div>
            </div>
            <span className="timer-text">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
          </div>
        )}
      </div>
      
      <div className="question-content">
        <h3>{currentQuestion.text}</h3>
        {currentQuestion.context && (
          <p className="question-context">{currentQuestion.context}</p>
        )}
      </div>
      
      {/* Text input for manual answers */}
      <textarea
        placeholder="Type your answer here (optional)..."
        value={typedAnswer || ''}
        onChange={(e) => onTypedAnswerChange(e.target.value)}
        className="w-full p-2 border rounded mt-4"
        disabled={isRecording}
      />
      
      {/* Transcript display */}
      {transcript && (
        <div className="transcript-container mt-4">
          <h4 className="transcript-title">Real-time Transcript:</h4>
          <p className="transcript-text">{transcript}</p>
        </div>
      )}
      
      <div className="question-navigation">
        <button 
          className="nav-button prev"
          onClick={onPrevQuestion}
          disabled={currentQuestionIndex === 0 || isRecording}
        >
          Previous
        </button>
        <button 
          className="nav-button next"
          onClick={onNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1 || isRecording}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionPanel; 