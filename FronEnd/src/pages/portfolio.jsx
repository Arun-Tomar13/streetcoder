import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CodeBracketIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  PaintBrushIcon,
  ChevronRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import Sidebar from '../components/siderbar';

export default function Portfolio() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({
    portfolioName: '',
    fullName: '',
    title: '',
    colorPalette: 'blue-pink'
  });
  
  const portfolioTemplates = [
    {
      id: 'developer',
      title: 'Developer Portfolio',
      icon: CodeBracketIcon,
      description: 'Perfect for software engineers and developers to showcase technical projects.',
    },
    {
      id: 'designer',
      title: 'Designer Portfolio',
      icon: PaintBrushIcon,
      description: 'Ideal for UI/UX designers and visual artists to display creative work.',
    },
    {
      id: 'professional',
      title: 'Professional Resume',
      icon: BriefcaseIcon,
      description: 'Clean and professional format to present your work experience.',
    },
    {
      id: 'academic',
      title: 'Academic Portfolio',
      icon: AcademicCapIcon,
      description: 'Showcase your research and academic achievements.',
    }
  ];

  // Define static color palettes
  const colorPalettes = [
    {
      id: 'blue-pink',
      name: 'Blue Pink',
      gradient: 'from-blue-200 via-indigo-100 to-pink-200'
    },
    {
      id: 'green-teal',
      name: 'Green Teal',
      gradient: 'from-teal-200 via-emerald-100 to-green-200'
    },
    {
      id: 'purple-pink',
      name: 'Purple Pink',
      gradient: 'from-purple-200 via-fuchsia-100 to-pink-200'
    },
    {
      id: 'orange-yellow',
      name: 'Orange Yellow',
      gradient: 'from-orange-200 via-amber-100 to-yellow-200'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleGeneratePortfolio = (templateId) => {
    const portfolioData = {
      ...formData,
      templateId
    };
    
    // Save data to localStorage
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    
    // Navigate to preview with resumecraft path
    navigate(`/dashboard/resumecraft/portfolio/${templateId}/preview`);
  };

  useEffect(() => {
    if (type) {
      const template = portfolioTemplates.find(t => t.id === type);
      if (template) {
        setSelectedTemplate(template);
        
        // Load saved data if available
        const savedData = localStorage.getItem('portfolioData');
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            if (parsedData.templateId === template.id) {
              setFormData(parsedData);
            }
          } catch (error) {
            console.error('Error parsing saved data', error);
          }
        }
      } else {
        navigate('/dashboard/resumecraft/portfolio');
      }
    }
  }, [type, navigate]);

  if (selectedTemplate) {
    return (
      <div className="flex min-h-screen bg-[#F5F5F7]">
        <Sidebar />
        
        <div className="flex-1 ml-20 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex items-center">
              <button
                onClick={() => navigate('/dashboard/resumecraft/portfolio')}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">{selectedTemplate.title}</h1>
            </div>

            <motion.div
              className="rounded-2xl overflow-hidden shadow-lg"
              whileHover={{ y: -5 }}
            >
              <div className={`p-8 bg-gradient-to-r ${colorPalettes.find(p => p.id === formData.colorPalette)?.gradient || 'from-blue-200 via-indigo-100 to-pink-200'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">Portfolio Name</label>
                      <input 
                        type="text"
                        name="portfolioName"
                        value={formData.portfolioName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm border border-transparent focus:border-black/10 focus:bg-white/70 transition-all placeholder:text-gray-500 text-gray-800"
                        placeholder="My Amazing Portfolio"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">Your Name</label>
                      <input 
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm border border-transparent focus:border-black/10 focus:bg-white/70 transition-all placeholder:text-gray-500 text-gray-800"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">Professional Title</label>
                      <input 
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm border border-transparent focus:border-black/10 focus:bg-white/70 transition-all placeholder:text-gray-500 text-gray-800"
                        placeholder="Full Stack Developer"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">Color Palette</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                        {colorPalettes.map(palette => (
                          <div 
                            key={palette.id}
                            onClick={() => {
                              setFormData({...formData, colorPalette: palette.id});
                            }}
                            className={`cursor-pointer rounded-xl p-1 ${formData.colorPalette === palette.id ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200'}`}
                          >
                            <div className={`h-12 rounded-lg bg-gradient-to-r ${palette.gradient} mb-1`}></div>
                            <p className="text-xs text-center font-medium text-gray-700">{palette.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 rounded-xl text-white font-medium flex items-center justify-center bg-black"
                    onClick={() => handleGeneratePortfolio(selectedTemplate.id)}
                  >
                    Generate Portfolio
                    <ChevronRightIcon className="w-5 h-5 ml-1" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F5F5F7]">
      <Sidebar />
      
      <div className="flex-1 ml-20 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">Portfolio Templates</h1>
            <p className="text-gray-600">Choose a template that best represents your work and style.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioTemplates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ y: -5 }}
                className="rounded-2xl overflow-hidden shadow-md"
              >
                <div className="p-6 bg-gradient-to-r from-blue-200 via-indigo-100 to-pink-200">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white/30 backdrop-blur-sm">
                    <template.icon className="w-6 h-6 text-gray-800" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{template.title}</h3>
                  <p className="text-gray-800 mb-8 h-14">{template.description}</p>
                  
                  <Link
                    to={`/dashboard/resumecraft/portfolio/${template.id}`}
                    className="inline-flex items-center px-5 py-2.5 rounded-xl bg-black text-white font-medium"
                  >
                    Select template
                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}