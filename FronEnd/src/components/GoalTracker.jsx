import React, { useState, useEffect } from 'react';
import { generateGoalInsights } from '../services/geminiService';

const GoalTracker = () => {
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('goals');
    return savedGoals ? JSON.parse(savedGoals) : [
      { 
        id: 1, 
        title: 'Complete React project', 
        description: 'Finish the dashboard application with all features',
        category: 'short-term',
        deadline: '2023-12-15',
        tags: ['coding', 'frontend'],
        priority: 'high',
        progress: 35
      }
    ];
  });
  
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'short-term',
    deadline: '',
    tags: '',
    priority: 'medium',
  });
  
  const [reflections, setReflections] = useState(() => {
    const savedReflections = localStorage.getItem('reflections');
    return savedReflections ? JSON.parse(savedReflections) : [];
  });
  
  const [newReflection, setNewReflection] = useState({
    activity: '',
    learnings: '',
    blockers: '',
    mood: 5,
  });
  
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('goals');
  
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);
  
  useEffect(() => {
    localStorage.setItem('reflections', JSON.stringify(reflections));
  }, [reflections]);
  
  const handleGoalChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({ ...prev, [name]: value }));
  };
  
  const handleReflectionChange = (e) => {
    const { name, value } = e.target;
    setNewReflection(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddGoal = (e) => {
    e.preventDefault();
    const goal = {
      ...newGoal,
      id: Date.now(),
      tags: newGoal.tags.split(',').map(tag => tag.trim()),
      progress: 0,
      createdAt: new Date().toISOString()
    };
    
    setGoals(prev => [...prev, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: 'short-term',
      deadline: '',
      tags: '',
      priority: 'medium',
    });
  };
  
  const handleAddReflection = (e) => {
    e.preventDefault();
    const reflection = {
      ...newReflection,
      id: Date.now(),
      date: new Date().toISOString()
    };
    
    setReflections(prev => [reflection, ...prev]);
    setNewReflection({
      activity: '',
      learnings: '',
      blockers: '',
      mood: 5,
    });
  };
  
  const updateGoalProgress = (id, progress) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, progress } : goal
    ));
  };
  
  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };
  
  const generateInsights = async () => {
    setIsLoading(true);
    try {
      const data = await generateGoalInsights(goals, reflections.slice(0, 5));
      setInsights(data);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-[#333333]">Goal Setting & Tracking</h3>
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${activeTab === 'goals' ? 'bg-[#41A6B2] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('goals')}
            >
              Goals
            </button>
            <button 
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${activeTab === 'reflections' ? 'bg-[#41A6B2] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('reflections')}
            >
              Reflections
            </button>
            <button 
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${activeTab === 'insights' ? 'bg-[#41A6B2] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              onClick={() => {
                setActiveTab('insights');
                if (!insights) generateInsights();
              }}
            >
              AI Insights
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        {activeTab === 'goals' && (
          <div>
            <div className="mb-6">
              <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#41A6B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Create New Goal
              </h4>
              <form onSubmit={handleAddGoal} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                {/* Title Input */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Goal Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newGoal.title}
                    onChange={handleGoalChange}
                    placeholder="What do you want to achieve?"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#41A6B2] focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                {/* Description Input */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea
                    name="description"
                    value={newGoal.description}
                    onChange={handleGoalChange}
                    placeholder="Why is this goal important? What will success look like?"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#41A6B2] focus:border-transparent transition-all"
                    rows="3"
                  />
                </div>
                
                {/* 2-column layout for select inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                    <div className="relative">
                      <select
                        name="category"
                        value={newGoal.category}
                        onChange={handleGoalChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#41A6B2] focus:border-transparent transition-all"
                      >
                        <option value="short-term">Short-term</option>
                        <option value="long-term">Long-term</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                    <div className="relative">
                      <select
                        name="priority"
                        value={newGoal.priority}
                        onChange={handleGoalChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#41A6B2] focus:border-transparent transition-all"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 2-column layout for date and tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Deadline</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="date"
                        name="deadline"
                        value={newGoal.deadline}
                        onChange={handleGoalChange}
                        className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#41A6B2] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="tags"
                        value={newGoal.tags}
                        onChange={handleGoalChange}
                        placeholder="coding, career, health..."
                        className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#41A6B2] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Submit Button with Animation */}
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-gradient-to-r from-[#41A6B2] to-[#8FD3C9] text-white font-medium rounded-xl shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Goal
                  </button>
                </div>
              </form>
            </div>
            
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#41A6B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Your Goals
              </h4>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {goals.map(goal => (
                  <div key={goal.id} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-semibold text-gray-800 text-lg mb-1">{goal.title}</h5>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                      <div className="flex space-x-1.5">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          goal.priority === 'high' ? 'bg-red-100 text-red-600' : 
                          goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {goal.priority}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          goal.category === 'short-term' ? 'bg-blue-100 text-blue-600' : 
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {goal.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {goal.tags.map((tag, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium text-gray-700">Progress: {goal.progress}%</span>
                        {goal.deadline && (
                          <span className="text-sm text-gray-600 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Due: {new Date(goal.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#41A6B2] to-[#8FD3C9] h-2 rounded-full transition-all duration-300 ease-in-out" 
                          style={{width: `${goal.progress}%`}}
                        ></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => updateGoalProgress(goal.id, Math.max(0, goal.progress - 10))}
                            className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                            10%
                          </button>
                          <button 
                            onClick={() => updateGoalProgress(goal.id, Math.min(100, goal.progress + 10))}
                            className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            10%
                          </button>
                        </div>
                        <button 
                          onClick={() => deleteGoal(goal.id)}
                          className="text-sm bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {goals.length === 0 && (
                  <div className="bg-white rounded-xl p-10 text-center border border-dashed border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 mb-2">No goals yet.</p>
                    <p className="text-sm text-gray-400">Create your first goal using the form above!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'reflections' && (
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Daily Reflection</h4>
              <form onSubmit={handleAddReflection} className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">What did you do today?</label>
                  <textarea
                    name="activity"
                    value={newReflection.activity}
                    onChange={handleReflectionChange}
                    placeholder="Describe your activities"
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                    rows="2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">What did you learn?</label>
                  <textarea
                    name="learnings"
                    value={newReflection.learnings}
                    onChange={handleReflectionChange}
                    placeholder="Share your learnings"
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                    rows="2"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Any blockers?</label>
                  <textarea
                    name="blockers"
                    value={newReflection.blockers}
                    onChange={handleReflectionChange}
                    placeholder="Describe any challenges or blockers"
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                    rows="2"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Mood (1-10)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      name="mood"
                      min="1"
                      max="10"
                      value={newReflection.mood}
                      onChange={handleReflectionChange}
                      className="w-full"
                    />
                    <span className="text-sm font-medium">{newReflection.mood}</span>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#41A6B2] text-white rounded-lg text-sm hover:bg-opacity-90 transition-colors"
                >
                  Save Reflection
                </button>
              </form>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Reflections</h4>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                {reflections.map(reflection => (
                  <div key={reflection.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-800">
                        {new Date(reflection.date).toLocaleDateString()}
                      </h5>
                      <div className="flex items-center">
                        <span className="text-xs mr-1">Mood:</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          reflection.mood >= 8 ? 'bg-green-100 text-green-600' : 
                          reflection.mood >= 5 ? 'bg-yellow-100 text-yellow-600' : 
                          'bg-red-100 text-red-600'
                        }`}>
                          {reflection.mood}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <h6 className="text-xs font-medium text-gray-500">Activities:</h6>
                        <p className="text-gray-700">{reflection.activity}</p>
                      </div>
                      
                      {reflection.learnings && (
                        <div>
                          <h6 className="text-xs font-medium text-gray-500">Learnings:</h6>
                          <p className="text-gray-700">{reflection.learnings}</p>
                        </div>
                      )}
                      
                      {reflection.blockers && (
                        <div>
                          <h6 className="text-xs font-medium text-gray-500">Blockers:</h6>
                          <p className="text-gray-700">{reflection.blockers}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {reflections.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <p>No reflections yet. Add your first reflection above!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'insights' && (
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 rounded-full border-2 border-t-[#41A6B2] border-r-[#41A6B2] border-b-transparent border-l-transparent animate-spin"></div>
              </div>
            ) : insights ? (
              <div>
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Suggested Micro-Goals</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {insights.microGoals.map((goal, i) => (
                      <div key={i} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                        <h5 className="font-medium text-gray-800 mb-1">{goal.title}</h5>
                        <p className="text-xs text-gray-500 mb-2">{goal.description}</p>
                        <div className="flex justify-between">
                          <span className="text-xs bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full">
                            Est. time: {goal.estimatedTime}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            Related to: {goal.relatedMainGoal}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Personalized Tips</h4>
                  <div className="space-y-3">
                    {insights.tips.map((tip, i) => (
                      <div key={i} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                        <h5 className="font-medium text-gray-800 mb-1">{tip.tip}</h5>
                        <p className="text-xs text-gray-500">{tip.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-[#41A6B2] to-[#8FD3C9] rounded-xl p-4 text-white">
                  <h4 className="text-sm font-medium mb-2">Your Personalized Motivation</h4>
                  <p>{insights.motivationalMessage}</p>
                </div>
                
                <div className="mt-4 text-center">
                  <button 
                    onClick={generateInsights}
                    className="px-4 py-2 bg-[#41A6B2] text-white rounded-lg text-sm hover:bg-opacity-90 transition-colors"
                  >
                    Refresh Insights
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">Generate AI insights based on your goals and reflections</p>
                <button 
                  onClick={generateInsights}
                  className="px-4 py-2 bg-[#41A6B2] text-white rounded-lg text-sm hover:bg-opacity-90 transition-colors"
                >
                  Generate Insights
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalTracker; 