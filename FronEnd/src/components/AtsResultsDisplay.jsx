import React from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  LightBulbIcon,
  ArrowPathIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const AtsResultsDisplay = ({ results, fileName, onStartNew }) => {
  if (!results) return null;
  
  const { atsScore, feedback, summary } = results;
  const { strengths, weaknesses, suggestions } = feedback || {};
  
  // Determine score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Determine progress bar color
  const getProgressColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="space-y-8">
      {/* Score Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col items-center justify-center mb-6">
          <h2 className="text-2xl font-bold mb-2">ATS Compatibility Score</h2>
          <p className="text-gray-600 text-center max-w-lg">
            This score indicates how well your resume is optimized for Applicant Tracking Systems (ATS).
          </p>
        </div>
        
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center justify-center w-40 h-40 rounded-full border-8 border-gray-100 mb-4">
            <span className={`text-5xl font-bold ${getScoreColor(atsScore)}`}>
              {atsScore}
            </span>
          </div>
          
          <div className="w-full max-w-md h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getProgressColor(atsScore)} transition-all duration-1000 ease-out`}
              style={{ width: `${atsScore}%` }}
            ></div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-lg font-medium">{fileName}</p>
            <p className="text-sm text-gray-500">Analyzed on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mt-4">
          <p className="text-gray-800">{summary}</p>
        </div>
      </div>
      
      {/* Detailed Feedback */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">Detailed Feedback</h2>
        
        <div className="space-y-6">
          {/* Strengths */}
          <div>
            <h3 className="text-lg font-medium flex items-center text-green-700 mb-3">
              <CheckCircleIcon className="h-6 w-6 mr-2" />
              Strengths
            </h3>
            <ul className="space-y-2 pl-8 list-disc">
              {strengths && strengths.map((strength, index) => (
                <li key={index} className="text-gray-800">{strength}</li>
              ))}
            </ul>
          </div>
          
          {/* Weaknesses */}
          <div>
            <h3 className="text-lg font-medium flex items-center text-orange-700 mb-3">
              <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
              Areas for Improvement
            </h3>
            <ul className="space-y-2 pl-8 list-disc">
              {weaknesses && weaknesses.map((weakness, index) => (
                <li key={index} className="text-gray-800">{weakness}</li>
              ))}
            </ul>
          </div>
          
          {/* Suggestions */}
          <div>
            <h3 className="text-lg font-medium flex items-center text-blue-700 mb-3">
              <LightBulbIcon className="h-6 w-6 mr-2" />
              Suggestions
            </h3>
            <ul className="space-y-2 pl-8 list-disc">
              {suggestions && suggestions.map((suggestion, index) => (
                <li key={index} className="text-gray-800">{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <button
            onClick={onStartNew}
            className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition duration-200"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Analyze Another Resume
          </button>
        </div>
      </div>
      
      {/* Job Recommendations */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <ArrowTrendingUpIcon className="h-6 w-6 mr-2 text-purple-600" />
          Jobs Matching Your Profile
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dummy job cards */}
          {[1, 2, 3, 4].map((job) => (
            <div key={job} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">
                    {["Senior Software Engineer", "Frontend Developer", "Full Stack Developer", "Product Engineer"][job-1]}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {["TechGiant Inc.", "Innovate Solutions", "Digital Dynamics", "FutureTech"][job-1]}
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {["94% Match", "89% Match", "85% Match", "82% Match"][job-1]}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-700 line-clamp-2">
                  {["Leading development of cloud-based applications using React and Node.js", 
                   "Creating responsive UI components and implementing state management", 
                   "Developing full-stack solutions with modern JavaScript frameworks",
                   "Building innovative products with cutting-edge technologies"][job-1]}
                </p>
              </div>
              <div className="mt-3 flex items-center text-sm">
                <span className="text-gray-600">{["Remote", "Hybrid", "On-site", "Flexible"][job-1]}</span>
                <span className="mx-2">•</span>
                <span className="text-gray-600">{["$120K-$150K", "$100K-$130K", "$110K-$140K", "$90K-$120K"][job-1]}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <button className="text-blue-600 hover:underline text-sm font-medium">
            View All Matching Jobs →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AtsResultsDisplay; 