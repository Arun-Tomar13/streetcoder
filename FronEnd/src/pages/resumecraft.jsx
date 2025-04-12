import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  DocumentArrowUpIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  GlobeAltIcon,
  CodeBracketIcon,
  HomeIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  CogIcon, 
  BellIcon, 
  QuestionMarkCircleIcon,
  AcademicCapIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { LightBulbIcon as LightBulbSolid } from '@heroicons/react/24/solid';
import themes from '../theme';
import Sidebar from '../components/siderbar';

export const ResumeCraft = () => {
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleCVUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Here you can add logic to handle the file upload
      // For now, we'll just navigate to the CV path
      navigate('/dashboard/resumecraft/cv', { state: { file } });
    }
  };

  // No need to create a motion component wrapper anymore
  
  return (
    <div className="flex min-h-screen bg-[#F5F5F7]">
      <Sidebar />
      
      <div className="flex-1 ml-20 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Resume Builder</h1>
          
          {/* Main Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CV Upload Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              <div 
                className="p-8 h-full"
                style={{ background: themes.gradients.pageBackground }}
              >
                <div className="flex items-start mb-6">
                  <div className="p-3 bg-black bg-opacity-10 backdrop-blur-lg rounded-xl">
                    <DocumentArrowUpIcon className="h-8 w-8 text-black" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-semibold text-black mb-4">Upload & Evaluate CV</h2>
                <p className="text-black/80 mb-8">
                  Upload your CV and get instant AI-powered feedback on how to improve it.
                  Our system will analyze your resume against industry standards.
                </p>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleCVUpload}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center justify-between w-full px-6 py-4 bg-black text-white rounded-xl font-medium"
                  >
                    <span className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 mr-2" />
                      Upload CV
                    </span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                </motion.div>
              </div>
            </motion.div>

            {/* Portfolio Builder Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              <div 
                className="p-8 h-full"
                style={{ background: themes.gradients.pageBackground }}
              >
                <div className="flex items-start mb-6">
                  <div className="p-3 bg-black bg-opacity-10 backdrop-blur-lg rounded-xl">
                    <GlobeAltIcon className="h-8 w-8 text-black" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-semibold text-black mb-4">Portfolio Builder</h2>
                <p className="text-black/80 mb-6">
                  Connect your professional profiles to create a comprehensive portfolio
                  that showcases your skills and experience.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="flex items-center text-black/80 text-sm font-medium mb-2">
                      <CodeBracketIcon className="h-4 w-4 mr-2" />
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username"
                      className="w-full px-4 py-3 rounded-xl bg-black/5 border-2 border-transparent focus:border-black/10 focus:bg-black/10 transition-all placeholder:text-black/40 text-black"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-black/80 text-sm font-medium mb-2">
                      <GlobeAltIcon className="h-4 w-4 mr-2" />
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-4 py-3 rounded-xl bg-black/5 border-2 border-transparent focus:border-black/10 focus:bg-black/10 transition-all placeholder:text-black/40 text-black"
                    />
                  </div>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/dashboard/portfolio"
                    className="flex items-center justify-between w-full px-6 py-4 bg-black text-white rounded-xl font-medium"
                  >
                    <span>Continue to Portfolio Builder</span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
