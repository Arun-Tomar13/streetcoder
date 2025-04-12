import React, { useState, useEffect } from 'react';
import Sidebar from '../components/siderbar';
import { 
  DocumentTextIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  MapIcon,
  BellIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import ResumeAtsUploader from '../components/ResumeAtsUploader';
import AtsResultsDisplay from '../components/AtsResultsDisplay';
import { analyzeResume } from '../services/geminiService';
import { motion } from 'framer-motion';

const PathFinder = () => {
  // Application state
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);
  const [processingMessage, setProcessingMessage] = useState('');
  
  // Processing animation
  const [progressValue, setProgressValue] = useState(0);
  
  useEffect(() => {
    let interval;
    
    if (isLoading) {
      // Fake progress animation during loading
      interval = setInterval(() => {
        setProgressValue((prev) => {
          // Cap at 90% until we actually get results
          const next = prev + (Math.random() * 5);
          return next > 90 ? 90 : next;
        });
        
        // Update processing message based on progress
        if (progressValue < 30) {
          setProcessingMessage('Extracting resume content...');
        } else if (progressValue < 60) {
          setProcessingMessage('Analyzing ATS compatibility...');
        } else {
          setProcessingMessage('Generating feedback...');
        }
      }, 500);
    } else {
      // Complete progress when loading is finished
      setProgressValue(100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, progressValue]);

  // Handle resume upload and generate analysis
  const handleResumeSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    setFileName(data.fileName);
    setProgressValue(0);
    
    try {
      // If resume text is very short, show an error
      if (data.resumeText.length < 100) {
        throw new Error(
          "Not enough text content was extracted from your resume. This could be a scanned PDF or have security restrictions. " +
          "Please try uploading a text-based PDF or TXT file instead."
        );
      }
      
      // Call Gemini API to analyze resume
      const results = await analyzeResume(
        data.resumeText, 
        data.jobCategory
      );
      
      setAnalysisResults(results);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setError(error.message || "An error occurred while analyzing your resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNew = () => {
    setAnalysisResults(null);
    setFileName('');
    setProgressValue(0);
  };

  return (
    <div className="flex h-screen bg-[#F5F5F7] font-sans">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-20 overflow-auto">
        {/* Top Navigation */}
        <div className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-gray-800">Elevate OS</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-black w-64"
              />
              <DocumentTextIcon className="h-5 w-5 text-gray-500 absolute left-3 top-2.5" />
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center cursor-pointer">
                <BellIcon className="h-5 w-5 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <MapIcon className="h-6 w-6 mr-2 text-blue-600" />
                PathFinder
              </h1>
              <p className="text-gray-600 mt-1">Optimize your career path and job search strategy</p>
            </div>
          </div>
          
          {/* Info Card */}
          {!analysisResults && !isLoading && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start">
              <InformationCircleIcon className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">ATS Resume Analyzer</h3>
                <p className="text-sm text-blue-700 mt-1">
                  This tool analyzes your resume for ATS compatibility and provides feedback to improve your chances of getting past automated screening systems. For best results, upload a text-based PDF or TXT file.
                </p>
              </div>
            </div>
          )}
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Uploader or Results */}
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-full max-w-md mb-6">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-300" 
                        style={{ width: `${progressValue}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-gray-600">{processingMessage}</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                </div>
              ) : analysisResults ? (
                <AtsResultsDisplay 
                  results={analysisResults} 
                  fileName={fileName}
                  onStartNew={handleStartNew}
                />
              ) : (
                <ResumeAtsUploader 
                  onSubmit={handleResumeSubmit} 
                  isLoading={isLoading} 
                />
              )}
              
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <span className="text-red-800">{error}</span>
                </div>
              )}
            </div>
            
            {/* Right Column - Career Resources */}
            <div className="space-y-6">
              {/* Career Resources Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Career Resources
                </h2>
                
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Resume Templates</h3>
                      <p className="text-sm text-gray-600">Professional templates for different roles</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <BriefcaseIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Interview Guides</h3>
                      <p className="text-sm text-gray-600">Prepare for your next interview</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <AcademicCapIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Skill Assessments</h3>
                      <p className="text-sm text-gray-600">Test your skills and get feedback</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-lg mr-3">
                      <MapIcon className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Career Roadmaps</h3>
                      <p className="text-sm text-gray-600">Plan your career progression</p>
                    </div>
                  </li>
                </ul>
                
                <button className="mt-4 w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200">
                  View All Resources
                </button>
              </div>
              
              {/* Upcoming Events */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Upcoming Events</h2>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-3 py-1">
                    <p className="text-sm text-gray-500">Today</p>
                    <h3 className="font-medium">Resume Workshop</h3>
                    <p className="text-sm text-gray-600">3:00 PM - 4:30 PM</p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-3 py-1">
                    <p className="text-sm text-gray-500">Tomorrow</p>
                    <h3 className="font-medium">Mock Interviews</h3>
                    <p className="text-sm text-gray-600">1:00 PM - 5:00 PM</p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-3 py-1">
                    <p className="text-sm text-gray-500">Fri, Jul 12</p>
                    <h3 className="font-medium">Career Fair</h3>
                    <p className="text-sm text-gray-600">10:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathFinder; 