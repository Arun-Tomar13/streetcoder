import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/sidebar';
import { 
  AcademicCapIcon, 
  ChartBarIcon, 
  LightBulbIcon, 
  DocumentTextIcon,
  ClockIcon,
  ArrowPathIcon,
  BeakerIcon,
  BookOpenIcon,
  VideoCameraIcon,
  NewspaperIcon,
  CubeIcon,
  CodeBracketIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { BookOpenIcon as BookOpenSolidIcon } from '@heroicons/react/24/solid';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, Box, RoundedBox, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import themes from '../theme';

// 3D Skill Stack Component
const SkillBlock = ({ skill, index, totalSkills, isHovered, setHoveredSkill }) => {
  // Calculate position
  const spacing = 1.5;
  const xPos = (index - (totalSkills - 1) / 2) * spacing;
  
  // Calculate height based on skill level (0-100)
  const height = (skill.level / 100) * 3;
  
  // Determine color based on urgency (difference between current and target)
  const gap = skill.target - skill.level;
  let color;
  if (gap > 30) {
    // Red for high urgency (far from target)
    color = "#FF4B4B";
  } else if (gap > 15) {
    // Orange for medium urgency
    color = "#FFA62B";
  } else {
    // Green for low urgency (close to target)
    color = "#4CAF50";
  }

  // Calculate y position (half of height to center at origin)
  const yPos = height / 2;

  // Handle hover events
  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHoveredSkill(skill);
  };

  const handlePointerOut = () => {
    setHoveredSkill(null);
  };
  
  return (
    <group position={[xPos, yPos, 0]} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
      <RoundedBox args={[1, height, 1]} radius={0.05} castShadow receiveShadow>
        <meshStandardMaterial color={color} transparent opacity={isHovered ? 0.8 : 1} />
      </RoundedBox>
      
      {/* Skill name at bottom */}
      <Text
        position={[0, -height/2 - 0.3, 0]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.5}
        textAlign="center"
      >
        {skill.name}
      </Text>
      
      {/* Level indicator at top */}
      <Text
        position={[0, height/2 + 0.2, 0]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {skill.level}%
      </Text>
      
      {/* Skill detail tooltip on hover */}
      {isHovered && (
        <Html position={[0.7, 0, 0]} distanceFactor={10}>
          <div className="bg-white p-3 rounded-lg shadow-lg w-48 text-sm z-50 border border-gray-200">
            <p className="font-bold text-gray-800 mb-2">{skill.name}</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Current:</span>
                <span className="font-medium">{skill.level}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Target:</span>
                <span className="font-medium">{skill.target}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">30-Day Change:</span>
                <span className={`font-medium ${skill.trend > 0 ? 'text-green-600' : skill.trend < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                  {skill.trend > 0 ? '+' : ''}{skill.trend}%
                </span>
              </div>
              <div className="mt-2 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${(skill.level / skill.target) * 100}%`, maxWidth: '100%' }}
                ></div>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

const SkillStack = () => {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const group = useRef();
  
  // Sample skills data
  const skills = [
    { name: 'JavaScript', level: 70, target: 85, trend: 12 },
    { name: 'System Design', level: 40, target: 75, trend: 3 },
    { name: 'React', level: 65, target: 80, trend: 8 },
    { name: 'CSS', level: 75, target: 85, trend: 5 },
    { name: 'Node.js', level: 60, target: 80, trend: 7 },
    { name: 'Communication', level: 85, target: 90, trend: 2 },
    { name: 'TypeScript', level: 55, target: 85, trend: 15 },
    { name: 'Python', level: 30, target: 70, trend: -2 }
  ];
  
  useFrame(() => {
    if (group.current) {
      // Slow automatic rotation
      group.current.rotation.y += 0.002;
    }
  });
  
  return (
    <group ref={group}>
      {/* Skills blocks */}
      {skills.map((skill, index) => (
        <SkillBlock 
          key={skill.name}
          skill={skill}
          index={index}
          totalSkills={skills.length}
          isHovered={hoveredSkill?.name === skill.name}
          setHoveredSkill={setHoveredSkill}
        />
      ))}
      
      {/* Floor grid for visual reference */}
      <gridHelper args={[20, 20, '#CCCCCC', '#EEEEEE']} position={[0, -0.01, 0]} />
    </group>
  );
};

// Roadmap Generator Component
const RoadmapGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRoadmapGenerated, setIsRoadmapGenerated] = useState(false);
  const [weakSpots, setWeakSpots] = useState(['State Management', 'Storytelling']);
  const [targetRole, setTargetRole] = useState('Frontend Engineer at Netflix');
  const [timeCommitment, setTimeCommitment] = useState('1h/day');
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);

  // Function to generate a personalized roadmap
  const generatePersonalizedRoadmap = () => {
    setIsGenerating(true);
    
    // Simulate API call/processing delay
    setTimeout(() => {
      // Generate roadmap based on inputs
      const roadmapData = {
        roadmap: [
          {
            week: 1,
            focus: "State Management Foundations",
            milestones: ["Understand Redux core concepts", "Implement basic Redux store", "Practice Context API"],
            daily_lessons: [
              {day: 1, type: "video", title: "Redux Fundamentals", link: "youtube.com/redux-fundamentals", duration: "14min"},
              {day: 2, type: "article", title: "Context API vs Redux", link: "blog.com/context-vs-redux", duration: "12min"},
              {day: 3, type: "quiz", title: "Redux Principles", mcq_count: 5, duration: "10min"},
              {day: 4, type: "exercise", title: "Build a Counter with Redux", duration: "15min"},
              {day: 5, type: "video", title: "Redux Middleware", link: "youtube.com/redux-middleware", duration: "13min"},
              {day: 6, type: "practice", title: "Implement Redux Thunk", duration: "15min"},
              {day: 7, type: "review", title: "Week 1 Concepts Review", duration: "15min"}
            ],
            resources: [
              {type: "documentation", title: "Redux Official Docs", link: "redux.js.org"},
              {type: "video", title: "Redux Crash Course", link: "youtube.com/redux-crash-course"},
              {type: "github", title: "Redux Examples", link: "github.com/redux-examples"}
            ]
          },
          {
            week: 2,
            focus: "Advanced State Patterns",
            milestones: ["Master React Query", "Learn Zustand", "Explore Jotai/Recoil"],
            daily_lessons: [
              {day: 8, type: "video", title: "React Query Introduction", link: "youtube.com/react-query-intro", duration: "12min"},
              {day: 9, type: "article", title: "React Query vs Redux", link: "blog.com/query-vs-redux", duration: "10min"},
              {day: 10, type: "exercise", title: "Fetching Data with React Query", duration: "15min"},
              {day: 11, type: "video", title: "Zustand State Management", link: "youtube.com/zustand", duration: "11min"},
              {day: 12, type: "practice", title: "Refactor Redux to Zustand", duration: "15min"},
              {day: 13, type: "video", title: "Jotai and Recoil Overview", link: "youtube.com/jotai-recoil", duration: "14min"},
              {day: 14, type: "review", title: "Modern State Libraries Comparison", duration: "15min"}
            ],
            resources: [
              {type: "documentation", title: "React Query Docs", link: "react-query.tanstack.com"},
              {type: "github", title: "Zustand Repo", link: "github.com/pmndrs/zustand"},
              {type: "article", title: "State Management in 2023", link: "medium.com/state-management-2023"}
            ]
          },
          {
            week: 3,
            focus: "Storytelling & Communication",
            milestones: ["Develop your professional story", "Practice STAR technique", "Create portfolio narratives"],
            daily_lessons: [
              {day: 15, type: "video", title: "The Hero's Journey in Tech", link: "youtube.com/tech-story", duration: "10min"},
              {day: 16, type: "exercise", title: "Map Your Career Journey", duration: "15min"},
              {day: 17, type: "article", title: "STAR Interview Technique", link: "blog.com/star-technique", duration: "11min"},
              {day: 18, type: "practice", title: "Record Your Introduction", duration: "15min"},
              {day: 19, type: "video", title: "Portfolio Storytelling", link: "youtube.com/portfolio-story", duration: "13min"},
              {day: 20, type: "exercise", title: "Project Narrative Construction", duration: "15min"},
              {day: 21, type: "review", title: "Feedback on Your Stories", duration: "15min"}
            ],
            resources: [
              {type: "book", title: "Building a StoryBrand", link: "amazon.com/storybrand"},
              {type: "course", title: "Storytelling for Developers", link: "udemy.com/storytelling-dev"},
              {type: "podcast", title: "Stories in Tech", link: "spotify.com/stories-tech"}
            ]
          },
          {
            week: 4,
            focus: "Netflix-Specific Preparation",
            milestones: ["Study Netflix tech stack", "Practice performance optimization", "Prepare for system design questions"],
            daily_lessons: [
              {day: 22, type: "article", title: "Netflix Tech Stack Overview", link: "blog.com/netflix-stack", duration: "12min"},
              {day: 23, type: "video", title: "Netflix UI Performance", link: "youtube.com/netflix-perf", duration: "15min"},
              {day: 24, type: "exercise", title: "Video Player Component", duration: "15min"},
              {day: 25, type: "video", title: "Netflix System Design", link: "youtube.com/netflix-design", duration: "14min"},
              {day: 26, type: "practice", title: "A/B Testing Implementation", duration: "15min"},
              {day: 27, type: "article", title: "Netflix Interview Process", link: "blog.com/netflix-interview", duration: "10min"},
              {day: 28, type: "review", title: "Final Preparation Review", duration: "15min"}
            ],
            resources: [
              {type: "github", title: "Netflix Open Source", link: "github.com/netflix"},
              {type: "blog", title: "Netflix Tech Blog", link: "netflixtechblog.com"},
              {type: "video", title: "Working at Netflix", link: "youtube.com/netflix-culture"}
            ],
            interviews: [
              {day: 29, title: "Mock Technical Interview", focus: "React & State Management", duration: "45min"},
              {day: 30, title: "Mock System Design Interview", focus: "Frontend Architecture", duration: "45min"}
            ]
          }
        ]
      };
      
      setGeneratedRoadmap(roadmapData);
      setIsGenerating(false);
      setIsRoadmapGenerated(true);
    }, 1500);
  };

  // Gantt chart rendering for weekly milestones
  const renderGanttChart = () => {
    if (!generatedRoadmap) return null;
    
    return (
      <div className="mt-6 overflow-x-auto">
        <h3 className="text-md font-semibold mb-3">Weekly Roadmap</h3>
        <div className="relative min-w-[700px]">
          {/* Header */}
          <div className="flex border-b border-gray-200 pb-2">
            <div className="w-1/5 font-medium text-gray-600">Week</div>
            <div className="w-4/5 flex">
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} className="flex-1 text-center text-xs text-gray-500">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          
          {/* Gantt rows */}
          {generatedRoadmap.roadmap.map((week, index) => (
            <div key={index} className="flex py-3 border-b border-gray-100">
              <div className="w-1/5 pr-4">
                <div className="font-medium">Week {week.week}</div>
                <div className="text-sm text-gray-600">{week.focus}</div>
              </div>
              <div className="w-4/5 flex items-center">
                <div 
                  className={`h-7 rounded-md flex items-center justify-center text-xs text-white font-medium shadow-sm ${
                    index === 0 ? 'bg-blue-500' : 
                    index === 1 ? 'bg-purple-500' : 
                    index === 2 ? 'bg-green-500' : 'bg-orange-500'
                  }`}
                  style={{ 
                    width: `${(7 / 30) * 100}%`,
                    marginLeft: `${((week.week - 1) * 7 / 30) * 100}%`
                  }}
                >
                  Week {week.week}
                </div>
              </div>
            </div>
          ))}
          
          {/* Interview markers */}
          <div className="flex py-3">
            <div className="w-1/5 pr-4">
              <div className="font-medium">Interviews</div>
            </div>
            <div className="w-4/5 relative h-7">
              {generatedRoadmap.roadmap[3].interviews.map((interview, idx) => (
                <div 
                  key={idx}
                  className="absolute h-7 w-7 rounded-full bg-red-500 flex items-center justify-center text-xs text-white font-bold shadow-md border-2 border-white"
                  style={{ left: `calc(${((interview.day - 1) / 30) * 100}% - 12px)` }}
                  title={interview.title}
                >
                  I
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Daily lessons listing
  const renderDailyLessons = () => {
    if (!generatedRoadmap) return null;
    
    // Flatten all daily lessons from all weeks
    const allLessons = generatedRoadmap.roadmap.flatMap(week => week.daily_lessons);
    
    return (
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-3">Daily Micro-Lessons (15 min max)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allLessons.slice(0, 6).map((lesson, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="font-medium">Day {lesson.day}: {lesson.title}</div>
                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {lesson.duration}
                </span>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  lesson.type === 'video' ? 'bg-red-500' :
                  lesson.type === 'article' ? 'bg-blue-500' :
                  lesson.type === 'exercise' ? 'bg-green-500' :
                  lesson.type === 'quiz' ? 'bg-purple-500' : 'bg-gray-500'
                }`}></span>
                {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
                
                {lesson.link && (
                  <a href="#" className="ml-auto text-blue-600 hover:underline text-xs">
                    Link →
                  </a>
                )}
              </div>
            </div>
          ))}
          {allLessons.length > 6 && (
            <div className="col-span-full flex justify-center mt-2">
              <button className="text-blue-600 text-sm hover:underline">
                View all {allLessons.length} lessons →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Resources section
  const renderResources = () => {
    if (!generatedRoadmap) return null;

    const allResources = generatedRoadmap.roadmap.reduce((acc, week) => 
      [...acc, ...(week.resources || [])], []
    );
    
    return (
      <div className="mt-8">
        <h3 className="text-md font-semibold mb-3">Recommended Resources</h3>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="grid grid-cols-3 gap-4">
            {allResources.slice(0, 6).map((resource, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-3 flex flex-col">
                <div className="flex items-start">
                  <div className={`p-2 rounded-md ${
                    resource.type === 'documentation' ? 'bg-blue-100 text-blue-600' :
                    resource.type === 'github' ? 'bg-purple-100 text-purple-600' :
                    resource.type === 'article' ? 'bg-green-100 text-green-600' :
                    resource.type === 'video' ? 'bg-red-100 text-red-600' :
                    resource.type === 'book' ? 'bg-yellow-100 text-yellow-600' :
                    resource.type === 'course' ? 'bg-indigo-100 text-indigo-600' :
                    resource.type === 'podcast' ? 'bg-pink-100 text-pink-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {resource.type === 'documentation' && <DocumentTextIcon className="h-5 w-5" />}
                    {resource.type === 'github' && <CodeBracketIcon className="h-5 w-5" />}
                    {resource.type === 'article' && <NewspaperIcon className="h-5 w-5" />}
                    {resource.type === 'video' && <VideoCameraIcon className="h-5 w-5" />}
                    {resource.type === 'book' && <BookOpenIcon className="h-5 w-5" />}
                    {resource.type === 'course' && <AcademicCapIcon className="h-5 w-5" />}
                    {resource.type === 'podcast' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="font-medium text-gray-800 text-sm">{resource.title}</h4>
                    <a href={resource.link} target="_blank" rel="noopener noreferrer" 
                      className="text-xs text-blue-500 hover:text-blue-600 mt-1 inline-block">
                      {resource.link}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {allResources.length > 6 && (
            <div className="mt-3 text-center">
              <button className="text-sm text-blue-500 hover:text-blue-600">
                Show all {allResources.length} resources
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      {!isRoadmapGenerated ? (
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Generate Your 30-Day Career Roadmap</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">What are your weak spots?</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {weakSpots.map((spot, index) => (
                  <div key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                    {spot}
                    <button 
                      className="ml-2 text-blue-500 hover:text-blue-700"
                      onClick={() => setWeakSpots(weakSpots.filter((_, i) => i !== index))}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <input 
                  type="text" 
                  className="flex-grow px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Add a weak spot..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value) {
                      setWeakSpots([...weakSpots, e.target.value]);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target role</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time commitment</label>
              <select 
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={timeCommitment}
                onChange={(e) => setTimeCommitment(e.target.value)}
              >
                <option value="30min/day">30 minutes per day</option>
                <option value="1h/day">1 hour per day</option>
                <option value="2h/day">2 hours per day</option>
                <option value="weekends">Weekends only</option>
              </select>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium flex items-center justify-center ${isGenerating ? 'opacity-70' : ''}`}
              onClick={generatePersonalizedRoadmap}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Generating Your Roadmap...
                </>
              ) : (
                'Generate Personalized Roadmap'
              )}
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Your 30-Day Roadmap to {targetRole}</h3>
            <button 
              className="text-gray-500 hover:text-gray-700 text-sm"
              onClick={() => setIsRoadmapGenerated(false)}
            >
              Edit Inputs
            </button>
          </div>
          
          {renderGanttChart()}
          {renderDailyLessons()}
          {renderResources()}
          
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold mb-2 text-blue-800">Mock Interviews</h3>
            {generatedRoadmap.roadmap[3].interviews.map((interview, idx) => (
              <div key={idx} className="flex items-start mb-2 last:mb-0">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="ml-3">
                  <div className="font-medium">Day {interview.day}: {interview.title}</div>
                  <div className="text-sm text-gray-600">Focus: {interview.focus} • {interview.duration}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium"
            >
              Add to My Learning Plan
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

// MicroLesson Recommender Component
const MicroLessonRecommender = () => {
  const [skill, setSkill] = useState('React Performance');
  const [company, setCompany] = useState('Google');
  const [mistakes, setMistakes] = useState('Re-rendering issues, Poor state management');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLessons, setGeneratedLessons] = useState(null);

  // Skills dropdown options
  const skillOptions = [
    'React Performance',
    'System Design',
    'TypeScript',
    'GraphQL',
    'Data Structures',
    'CSS Layouts',
    'JavaScript Promises',
    'Frontend Testing',
    'Accessibility',
    'Web Security'
  ];

  // Company dropdown options
  const companyOptions = [
    'Google',
    'Microsoft',
    'Amazon',
    'Meta',
    'Apple',
    'Netflix',
    'Uber',
    'Airbnb',
    'Twitter',
    'Shopify'
  ];

  // Function to generate personalized micro-lesson recommendations
  const generateMicroLessons = () => {
    setIsGenerating(true);
    
    // Simulate API call/processing delay
    setTimeout(() => {
      let recommendations;
      
      // Generate different lessons based on the selected skill
      if (skill === 'React Performance') {
        recommendations = {
          lessons: [
            {
              type: "Advanced Tutorial",
              title: "React Memo & useMemo Deep Dive",
              format: "video",
              duration: "12 min",
              keyConcept: "Prevent unnecessary re-renders with proper memoization techniques",
              practice: "Identify and fix 3 re-rendering issues in a sample component",
              link: "youtube.com/react-memo-deep-dive",
              source: "React Core Team",
              relevance: "Based on common Google interview questions about performance optimization",
              imgUrl: "https://i.imgur.com/QkIa5XV.png"
            },
            {
              type: "Code Walkthrough",
              title: "Debugging React Performance with DevTools",
              format: "interactive",
              duration: "15 min",
              keyConcept: "Master the React DevTools Profiler to identify performance bottlenecks",
              practice: "Profile and optimize a slow-rendering dashboard component",
              link: "reactjs.org/devtools-performance",
              source: "React Documentation",
              relevance: "Addresses your past mistake with re-rendering issues",
              imgUrl: "https://i.imgur.com/8cNO4u0.png"
            },
            {
              type: "Best Practices",
              title: "State Management for High-Performance React Apps",
              format: "article",
              duration: "10 min",
              keyConcept: "Implement optimal state architecture patterns for complex React applications",
              practice: "Refactor a Context API implementation to prevent unnecessary re-renders",
              link: "blog.googledevelopers.com/react-state-optimization",
              source: "Google Developer Blog",
              relevance: "Latest industry trend: Micro-state management with Context + useReducer",
              imgUrl: "https://i.imgur.com/pnSA2T9.png"
            }
          ]
        };
      } else if (skill === 'System Design') {
        recommendations = {
          lessons: [
            {
              type: "Case Study",
              title: "Google Maps System Design",
              format: "video",
              duration: "15 min",
              keyConcept: "Design scalable location-based services with efficient data structures",
              practice: "Sketch a high-level system diagram for a location-sharing app",
              link: "youtube.com/google-maps-system-design",
              source: "Ex-Google Engineer",
              relevance: "Based on actual Google system design interview question",
              imgUrl: "https://i.imgur.com/dSrUUm4.png"
            },
            {
              type: "Fundamentals",
              title: "CAP Theorem in Distributed Systems",
              format: "article",
              duration: "8 min",
              keyConcept: "Understanding consistency, availability, and partition tolerance trade-offs",
              practice: "Analyze which CAP properties your current system prioritizes",
              link: "medium.com/system-design-cap-theorem",
              source: "Medium Engineering",
              relevance: "Commonly misunderstood concept in interviews",
              imgUrl: "https://i.imgur.com/Lh3nH9D.png"
            },
            {
              type: "Interactive Tutorial",
              title: "Load Balancing Strategies",
              format: "interactive",
              duration: "12 min",
              keyConcept: "Implement different load balancing algorithms for high-traffic applications",
              practice: "Simulate traffic patterns and select the optimal load balancing strategy",
              link: "systemdesign.io/load-balancing",
              source: "System Design Interview Prep",
              relevance: "Latest trend: Multi-region load balancing for global applications",
              imgUrl: "https://i.imgur.com/QkVNRsS.png"
            }
          ]
        };
      } else {
        // Default recommendations for other skills
        recommendations = {
          lessons: [
            {
              type: "Practical Guide",
              title: `${skill} Best Practices at ${company}`,
              format: "video",
              duration: "14 min",
              keyConcept: `Master essential ${skill} techniques used at ${company}`,
              practice: `Implement a ${skill} feature following ${company}'s architecture`,
              link: `youtube.com/${skill.toLowerCase().replace(/\s/g, '-')}-at-${company.toLowerCase()}`,
              source: `Ex-${company} Engineer`,
              relevance: `Based on actual ${company} interview questions`,
              imgUrl: "https://i.imgur.com/QkIa5XV.png"
            },
            {
              type: "Common Pitfalls",
              title: `Avoiding ${skill} Mistakes`,
              format: "article",
              duration: "10 min",
              keyConcept: `Identify and fix common ${skill} issues found in production`,
              practice: "Review code samples and spot the errors",
              link: `medium.com/${skill.toLowerCase().replace(/\s/g, '-')}-mistakes`,
              source: "Senior Developer Blog",
              relevance: `Addresses your mentioned mistakes: ${mistakes}`,
              imgUrl: "https://i.imgur.com/Lh3nH9D.png"
            },
            {
              type: "New Techniques",
              title: `Modern ${skill} in 2023`,
              format: "interactive",
              duration: "15 min",
              keyConcept: `Explore cutting-edge ${skill} techniques gaining industry adoption`,
              practice: "Implement a small project using the new approach",
              link: `interactive.dev/${skill.toLowerCase().replace(/\s/g, '-')}-modern`,
              source: "Industry Trends",
              relevance: "Based on latest industry trends and best practices",
              imgUrl: "https://i.imgur.com/pnSA2T9.png"
            }
          ]
        };
      }
      
      setGeneratedLessons(recommendations);
      setIsGenerating(false);
    }, 1500);
  };

  const renderLessonCard = (lesson, index) => {
    const formatIcon = {
      video: <VideoCameraIcon className="w-4 h-4" />,
      article: <NewspaperIcon className="w-4 h-4" />,
      interactive: <CubeIcon className="w-4 h-4" />
    };
    
    const formatColor = {
      video: 'bg-red-100 text-red-600',
      article: 'bg-blue-100 text-blue-600',
      interactive: 'bg-purple-100 text-purple-600'
    };
    
    return (
      <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="h-32 bg-gray-100 relative overflow-hidden">
          {lesson.imgUrl ? (
            <img src={lesson.imgUrl} alt={lesson.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
              <CodeBracketIcon className="w-12 h-12 text-indigo-300" />
            </div>
          )}
          <div className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium bg-white bg-opacity-90">
            {lesson.type}
          </div>
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full flex items-center text-xs font-medium ${formatColor[lesson.format]}`}>
            {formatIcon[lesson.format]}
            <span className="ml-1">{lesson.format}</span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-800">{lesson.title}</h3>
            <span className="ml-2 text-xs font-medium py-1 px-2 bg-gray-100 rounded-full">
              {lesson.duration}
            </span>
          </div>
          
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Key Concept:</div>
            <p className="text-sm text-gray-700">{lesson.keyConcept}</p>
          </div>
          
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Practice Task:</div>
            <p className="text-sm text-gray-700">{lesson.practice}</p>
          </div>
          
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <div className="mr-2">Source:</div>
            <div className="font-medium text-gray-700">{lesson.source}</div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-2 text-xs text-blue-700">
            <div className="font-medium mb-1">Why this is relevant:</div>
            <p>{lesson.relevance}</p>
          </div>
          
          <div className="mt-4 flex justify-between">
            <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
              <span>View lesson</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <button className="text-sm text-gray-600 hover:text-gray-800">
              Save for later
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {!generatedLessons ? (
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-4">Generate Micro-Lesson Recommendations</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">What skill do you want to improve?</label>
              <select 
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
              >
                {skillOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target company 
                <span className="text-xs text-gray-500 ml-1">(for interview-specific lessons)</span>
              </label>
              <div className="flex">
                <select 
                  className="flex-grow px-3 py-2 text-sm border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                >
                  {companyOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <div className="px-3 py-2 bg-gray-100 border-y border-r rounded-r-md">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Past mistakes or weaknesses 
                <span className="text-xs text-gray-500 ml-1">(comma separated)</span>
              </label>
              <textarea 
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={2}
                value={mistakes}
                onChange={(e) => setMistakes(e.target.value)}
                placeholder="e.g., Poor state management, Component lifecycle issues"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-medium flex items-center justify-center ${isGenerating ? 'opacity-70' : ''}`}
              onClick={generateMicroLessons}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Finding Perfect Lessons...
                </>
              ) : (
                'Recommend Micro-Lessons'
              )}
            </motion.button>
          </div>
        </div>
      ) : (
        <div>
          <div className="p-5 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recommended Lessons to Improve {skill}</h3>
              <button
                className="text-gray-500 hover:text-gray-700 text-sm"
                onClick={() => setGeneratedLessons(null)}
              >
                Back to Form
              </button>
            </div>
            <div className="mt-1 text-sm text-gray-600">
              Based on {company} interview questions and your identified weaknesses
            </div>
          </div>
          
          <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {generatedLessons.lessons.map((lesson, index) => (
              renderLessonCard(lesson, index)
            ))}
          </div>
          
          <div className="p-5 bg-gray-50 border-t border-gray-100">
            <div className="text-sm text-gray-600 mb-4">
              These micro-lessons are tailored to help you improve your {skill} skills with a focus on addressing common interview questions at {company} and the specific weaknesses you've identified.
            </div>
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium"
              >
                Add All to Learning Plan
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// MCQ Generator Component
const MCQGenerator = () => {
  const [skill, setSkill] = useState('React');
  const [level, setLevel] = useState('Intermediate');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanations, setShowExplanations] = useState({});

  // Available skills for testing
  const skillOptions = [
    'React',
    'JavaScript',
    'TypeScript',
    'CSS',
    'Node.js',
    'GraphQL',
    'Redux',
    'Testing',
    'Accessibility',
    'Performance'
  ];

  // Difficulty levels
  const levelOptions = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert'
  ];

  // Generate MCQs based on the selected skill and level
  const generateMCQs = () => {
    setIsGenerating(true);
    
    // Reset states
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setShowExplanations({});
    
    // Simulate API call/processing delay
    setTimeout(() => {
      // Generate different questions based on skill and level
      let questions;
      
      if (skill === 'React' && level === 'Intermediate') {
        questions = [
          {
            id: 1,
            question: "Which React hook should you use to optimize expensive calculations?",
            options: [
              { id: 1, text: "useMemo", correct: true, explanation: "useMemo memoizes computed values and only recalculates them when dependencies change, making it perfect for expensive calculations." },
              { id: 2, text: "useEffect", correct: false, explanation: "useEffect is for handling side effects after render, not for optimizing calculations." },
              { id: 3, text: "useCallback", correct: false, explanation: "useCallback is for memoizing functions, not calculated values." },
              { id: 4, text: "useState", correct: false, explanation: "useState is for managing state, it doesn't provide any calculation optimization." }
            ],
            docs_link: "https://react.dev/reference/react/useMemo"
          },
          {
            id: 2,
            question: "When does React's useLayoutEffect run compared to useEffect?",
            options: [
              { id: 1, text: "Before the browser paints", correct: true, explanation: "useLayoutEffect runs synchronously after all DOM mutations but before the browser paints, allowing you to make DOM measurements." },
              { id: 2, text: "After the browser paints", correct: false, explanation: "This describes useEffect, which runs after painting, not useLayoutEffect." },
              { id: 3, text: "During the render phase", correct: false, explanation: "Neither hook runs during the render phase - they run after rendering is completed." },
              { id: 4, text: "Only on component unmount", correct: false, explanation: "While both hooks can handle cleanup on unmount, this is not when useLayoutEffect initially runs." }
            ],
            docs_link: "https://react.dev/reference/react/useLayoutEffect"
          },
          {
            id: 3,
            question: "Which statement about React.memo is correct?",
            options: [
              { id: 1, text: "It prevents a component from re-rendering if props haven't changed", correct: true, explanation: "React.memo is a higher-order component that memoizes the rendered output and skips rendering if props are the same." },
              { id: 2, text: "It memoizes expensive calculations inside a component", correct: false, explanation: "This is what useMemo does, not React.memo." },
              { id: 3, text: "It only works with functional components that don't use hooks", correct: false, explanation: "React.memo works with any functional component, whether it uses hooks or not." },
              { id: 4, text: "It automatically deep compares all props", correct: false, explanation: "By default, React.memo only does a shallow comparison of props. Deep comparison requires a custom comparison function." }
            ],
            docs_link: "https://react.dev/reference/react/memo"
          },
          {
            id: 4,
            question: "What happens when you call a state setter function with the same value as the current state?",
            options: [
              { id: 1, text: "React skips re-rendering the component", correct: true, explanation: "If the new state value is identical to the previous value (compared with Object.is()), React will skip re-rendering the component and its children." },
              { id: 2, text: "The component always re-renders", correct: false, explanation: "React is optimized to skip unnecessary re-renders when state doesn't change." },
              { id: 3, text: "React throws an error", correct: false, explanation: "Setting state to its current value is perfectly valid and doesn't cause errors." },
              { id: 4, text: "The state value becomes undefined", correct: false, explanation: "The state value remains unchanged; it doesn't become undefined." }
            ],
            docs_link: "https://react.dev/reference/react/useState#my-component-renders-twice"
          },
          {
            id: 5,
            question: "Which of the following is NOT a recommended pattern for lifting state up?",
            options: [
              { id: 1, text: "Passing the state setter function to child components", correct: false, explanation: "This is a common pattern when lifting state up - parent manages state and passes setter to children." },
              { id: 2, text: "Using context to avoid lifting state altogether", correct: true, explanation: "This is not lifting state up. While context can be useful, overusing it instead of properly lifting state is an anti-pattern." },
              { id: 3, text: "Moving shared state to the closest common ancestor", correct: false, explanation: "This is the core principle of lifting state up - finding the common ancestor that needs access to the state." },
              { id: 4, text: "Converting uncontrolled components to controlled components", correct: false, explanation: "Converting to controlled components often involves lifting state up to parent components, which is a recommended pattern." }
            ],
            docs_link: "https://react.dev/learn/sharing-state-between-components"
          }
        ];
      } else if (skill === 'JavaScript' && level === 'Intermediate') {
        questions = [
          {
            id: 1,
            question: "What is the output of: console.log(typeof null)?",
            options: [
              { id: 1, text: "'object'", correct: true, explanation: "typeof null returns 'object' which is actually a historical bug in JavaScript that was never fixed for backward compatibility." },
              { id: 2, text: "'null'", correct: false, explanation: "'null' is not a valid return value for typeof in JavaScript." },
              { id: 3, text: "'undefined'", correct: false, explanation: "typeof undefined returns 'undefined', but null and undefined are distinct in JavaScript." },
              { id: 4, text: "'string'", correct: false, explanation: "null is not a string type in JavaScript." }
            ],
            docs_link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#typeof_null"
          },
          {
            id: 2,
            question: "Which method creates a new array with the results of calling a provided function on every element in the calling array?",
            options: [
              { id: 1, text: "map()", correct: true, explanation: "map() creates a new array by applying a function to each element of the original array." },
              { id: 2, text: "forEach()", correct: false, explanation: "forEach() executes a function on each element but doesn't create a new array or return anything." },
              { id: 3, text: "filter()", correct: false, explanation: "filter() creates a new array with elements that pass a test, not by transforming elements." },
              { id: 4, text: "reduce()", correct: false, explanation: "reduce() accumulates array elements into a single value, not a new array of the same length." }
            ],
            docs_link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map"
          }
        ];
        
        // Add generic questions to ensure we have 5
        for (let i = questions.length + 1; i <= 5; i++) {
          questions.push({
            id: i,
            question: `Sample JavaScript ${level} question #${i}`,
            options: [
              { id: 1, text: "Correct Answer", correct: true, explanation: "This is the correct answer because it properly implements the JavaScript concept being tested." },
              { id: 2, text: "Incorrect Option 1", correct: false, explanation: "This answer is incorrect because it misunderstands a fundamental concept of JavaScript." },
              { id: 3, text: "Incorrect Option 2", correct: false, explanation: "This answer is incorrect because it applies the wrong method to solve the problem." },
              { id: 4, text: "Incorrect Option 3", correct: false, explanation: "This answer is incorrect because it confuses similar but different JavaScript behaviors." }
            ],
            docs_link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
          });
        }
      } else {
        // Generate generic questions for any other skill/level combination
        questions = [];
        for (let i = 1; i <= 5; i++) {
          questions.push({
            id: i,
            question: `Sample ${skill} ${level} question #${i}`,
            options: [
              { id: 1, text: "Correct Answer", correct: true, explanation: `This is the correct approach for ${skill} at the ${level} level because it follows best practices.` },
              { id: 2, text: "Incorrect Option 1", correct: false, explanation: `This is incorrect because it violates ${skill} principles that are important at the ${level} level.` },
              { id: 3, text: "Incorrect Option 2", correct: false, explanation: `While this might work in some cases, it's not the recommended approach for ${skill} at the ${level} level.` },
              { id: 4, text: "Incorrect Option 3", correct: false, explanation: `This approach confuses concepts from different areas of ${skill} and would not work as expected.` }
            ],
            docs_link: skill === 'React' ? "https://react.dev/reference/react" : 
                      skill === 'JavaScript' ? "https://developer.mozilla.org/en-US/docs/Web/JavaScript" :
                      skill === 'TypeScript' ? "https://www.typescriptlang.org/docs/" :
                      skill === 'CSS' ? "https://developer.mozilla.org/en-US/docs/Web/CSS" :
                      skill === 'Node.js' ? "https://nodejs.org/en/docs/" : "#"
          });
        }
      }
      
      // Only keep the number of questions requested
      questions = questions.slice(0, numQuestions);
      
      setGeneratedQuestions(questions);
      setIsGenerating(false);
    }, 1500);
  };

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionId
    });
  };

  const toggleExplanation = (questionId) => {
    setShowExplanations({
      ...showExplanations,
      [questionId]: !showExplanations[questionId]
    });
  };

  const moveToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setShowExplanations({});
  };

  const calculateScore = () => {
    if (!generatedQuestions) return 0;
    
    let correctCount = 0;
    generatedQuestions.forEach(question => {
      const selectedOption = selectedAnswers[question.id];
      const correctOption = question.options.find(option => option.correct);
      
      if (selectedOption === correctOption.id) {
        correctCount++;
      }
    });
    
    return Math.round((correctCount / generatedQuestions.length) * 100);
  };

  // Render the question card
  const renderQuestion = (question) => {
    const selectedOption = selectedAnswers[question.id];
    const hasAnswered = selectedOption !== undefined;
    const showResultsForQuestion = showResults && hasAnswered;
    
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">{question.question}</h3>
          {question.docs_link && (
            <a 
              href={question.docs_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline flex items-center"
            >
              <BookOpenSolidIcon className="inline h-3 w-3 mr-1" />
              Reference Documentation
            </a>
          )}
        </div>
        
        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const isCorrect = option.correct;
            
            let optionClass = "border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors";
            
            if (showResultsForQuestion) {
              if (isCorrect) {
                optionClass = "border border-green-500 rounded-lg p-4 bg-green-50";
              } else if (isSelected && !isCorrect) {
                optionClass = "border border-red-500 rounded-lg p-4 bg-red-50";
              } else {
                optionClass = "border rounded-lg p-4";
              }
            } else if (isSelected) {
              optionClass = "border border-blue-500 rounded-lg p-4 bg-blue-50";
            }
            
            return (
              <div 
                key={option.id} 
                className={optionClass}
                onClick={() => !showResultsForQuestion && handleOptionSelect(question.id, option.id)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    {showResultsForQuestion ? (
                      isCorrect ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : isSelected ? (
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-gray-300"></div>
                      )
                    ) : (
                      <div className={`h-5 w-5 rounded-full border ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                        {isSelected && (
                          <div className="h-full w-full flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm ${isSelected ? 'font-medium' : ''}`}>{option.text}</div>
                    
                    {(showExplanations[question.id] || (showResultsForQuestion && (isCorrect || isSelected))) && (
                      <div className={`mt-1 text-xs ${isCorrect ? 'text-green-700' : 'text-gray-600'}`}>
                        {option.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 flex justify-between">
          <button
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
            onClick={() => toggleExplanation(question.id)}
          >
            {showExplanations[question.id] ? 'Hide explanations' : 'Show explanations'}
          </button>
          
          <div className="flex space-x-2">
            {currentQuestionIndex > 0 && (
              <button
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => moveToQuestion(currentQuestionIndex - 1)}
              >
                Previous
              </button>
            )}
            
            {currentQuestionIndex < generatedQuestions.length - 1 && (
              <button
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => moveToQuestion(currentQuestionIndex + 1)}
              >
                Next
              </button>
            )}
            
            {currentQuestionIndex === generatedQuestions.length - 1 && !showResults && Object.keys(selectedAnswers).length === generatedQuestions.length && (
              <button
                className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={checkAnswers}
              >
                Submit Answers
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderQuizNavigation = () => {
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-700">Question Navigation</h4>
          <span className="text-xs text-gray-500">
            {currentQuestionIndex + 1} of {generatedQuestions.length}
          </span>
        </div>
        <div className="flex space-x-2">
          {generatedQuestions.map((question, index) => {
            const isActive = index === currentQuestionIndex;
            const isAnswered = selectedAnswers[question.id] !== undefined;
            
            let buttonClass = "w-8 h-8 rounded-full flex items-center justify-center text-sm";
            
            if (isActive) {
              buttonClass += " bg-blue-600 text-white";
            } else if (isAnswered) {
              buttonClass += " bg-gray-200 text-gray-800";
            } else {
              buttonClass += " bg-white border border-gray-300 text-gray-600";
            }
            
            return (
              <button
                key={question.id}
                className={buttonClass}
                onClick={() => moveToQuestion(index)}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const score = calculateScore();
    
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
            <span className="text-2xl font-bold text-blue-700">{score}%</span>
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">Quiz Results</h3>
          <p className="text-gray-600">
            You answered {generatedQuestions.filter(q => {
              const selectedOption = selectedAnswers[q.id];
              const correctOption = q.options.find(option => option.correct);
              return selectedOption === correctOption.id;
            }).length} out of {generatedQuestions.length} questions correctly.
          </p>
        </div>
        
        <div className="space-y-4">
          {generatedQuestions.map((question, index) => {
            const selectedOption = selectedAnswers[question.id];
            const correctOption = question.options.find(option => option.correct);
            const isCorrect = selectedOption === correctOption.id;
            
            return (
              <div key={question.id} className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    {isCorrect ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-sm">Question {index + 1}: {question.question}</div>
                    <div className="mt-1 text-xs text-gray-700">
                      Your answer: {question.options.find(o => o.id === selectedOption)?.text || 'Not answered'}
                    </div>
                    {!isCorrect && (
                      <div className="mt-1 text-xs text-green-700">
                        Correct answer: {correctOption.text}
                      </div>
                    )}
                    <div className="mt-2 text-xs text-gray-600">
                      {question.options.find(o => o.id === selectedOption)?.explanation}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 flex justify-center">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={restartQuiz}
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {!generatedQuestions ? (
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-4">Generate MCQ Test</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Skill to Test</label>
              <select 
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
              >
                {skillOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
              <div className="flex flex-wrap gap-2">
                {levelOptions.map(option => (
                  <label key={option} className="inline-flex items-center">
                    <input 
                      type="radio" 
                      name="difficulty" 
                      value={option}
                      checked={level === option}
                      onChange={() => setLevel(option)}
                      className="form-radio text-blue-500"
                    />
                    <span className="ml-2 text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
              <select 
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              >
                <option value={5}>5 questions</option>
                <option value={10}>10 questions</option>
                <option value={15}>15 questions</option>
                <option value={20}>20 questions</option>
              </select>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium flex items-center justify-center ${isGenerating ? 'opacity-70' : ''}`}
              onClick={generateMCQs}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Generating Questions...
                </>
              ) : (
                'Generate MCQ Test'
              )}
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{skill} {level} MCQ Test</h3>
            <button
              className="text-gray-500 hover:text-gray-700 text-sm"
              onClick={() => setGeneratedQuestions(null)}
            >
              Create New Test
            </button>
          </div>
          
          {showResults ? (
            renderResults()
          ) : (
            <>
              {renderQuizNavigation()}
              {renderQuestion(generatedQuestions[currentQuestionIndex])}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Learning Dashboard Component
const LearningDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillResources, setSkillResources] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedSkill, setDraggedSkill] = useState(null);
  const [roadmapScheduleMode, setRoadmapScheduleMode] = useState(false);
  
  // Example data for today's micro-lesson
  const todaysMicroLesson = {
    id: 'ml-today-1',
    title: 'Modern React State Management',
    category: 'React',
    duration: '15 min',
    description: 'Learn how to efficiently manage state in modern React applications using hooks and context API.',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80'
  };
  
  // Handler for skill click in 3D skill stack
  const handleSkillClick = (skill) => {
    setSelectedSkill(skill);
    // Fetch related resources for the selected skill
    const resources = [
      { 
        type: 'documentation', 
        title: `${skill.name} Documentation`, 
        link: `https://docs.example.com/${skill.name.toLowerCase()}` 
      },
      { 
        type: 'video', 
        title: `Advanced ${skill.name} Tutorial`, 
        link: `https://videos.example.com/${skill.name.toLowerCase()}-advanced` 
      },
      { 
        type: 'exercise', 
        title: `${skill.name} Practice Problems`, 
        link: `https://exercises.example.com/${skill.name.toLowerCase()}` 
      }
    ];
    setSkillResources(resources);
  };
  
  // Handler for hovering over roadmap items
  const handleRoadmapItemHover = (item) => {
    if (roadmapScheduleMode) {
      // Show rescheduling UI options
    }
  };
  
  // Handler for starting skill drag
  const handleSkillDragStart = (skill, event) => {
    setIsDragging(true);
    setDraggedSkill(skill);
  };
  
  // Handler for dropping skill to prioritize
  const handleSkillDrop = (targetArea) => {
    if (draggedSkill) {
      // Update skill priority based on drop target
      setIsDragging(false);
      setDraggedSkill(null);
    }
  };
  
  // Toggle roadmap schedule mode
  const toggleRoadmapScheduleMode = () => {
    setRoadmapScheduleMode(!roadmapScheduleMode);
  };
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F5F5F7]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-2 border-black border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F5F5F7] font-sans">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-20 overflow-hidden flex flex-col">
        {/* Top Navigation */}
        <div className="h-16 bg-white shadow-sm flex items-center justify-between px-6 flex-shrink-0">
          <h1 className="text-xl font-semibold text-gray-800">Learning Dashboard</h1>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white flex items-center"
              onClick={toggleRoadmapScheduleMode}
            >
              {roadmapScheduleMode ? (
                <>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Done Rescheduling
                </>
              ) : (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Reschedule Items
                </>
              )}
            </motion.button>
          </div>
        </div>
        
        {/* Main Dashboard Layout */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Section: 3D Skills + Roadmap + Today's Lesson */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - 3D Skill Stack */}
            <div className="w-1/4 p-4 overflow-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden h-full flex flex-col"
              >
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold flex items-center">
                    <AcademicCapIcon className="h-5 w-5 mr-2 text-blue-500" />
                    3D Skill Stack
                  </h2>
                </div>
                <div className="flex-1 relative">
                  <Canvas camera={{ position: [0, 2, 10], fov: 40 }} shadows>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[5, 10, 5]} intensity={1} castShadow />
                    <directionalLight 
                      position={[-5, 5, 5]} 
                      intensity={0.5} 
                      castShadow 
                      shadow-mapSize-width={1024} 
                      shadow-mapSize-height={1024}
                    />
                    <OrbitControls 
                      enableZoom={true} 
                      enablePan={true} 
                      minPolarAngle={0} 
                      maxPolarAngle={Math.PI / 2} 
                      minDistance={5}
                      maxDistance={15}
                    />
                    <SkillStack onSkillClick={handleSkillClick} />
                  </Canvas>
                  {selectedSkill && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-sm p-4 rounded-t-xl"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-800">{selectedSkill.name}</h3>
                        <button 
                          onClick={() => setSelectedSkill(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-auto">
                        {skillResources.map((resource, idx) => (
                          <a 
                            key={idx}
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center">
                              {resource.type === 'documentation' && <DocumentTextIcon className="h-4 w-4 text-blue-500 mr-2" />}
                              {resource.type === 'video' && <VideoCameraIcon className="h-4 w-4 text-red-500 mr-2" />}
                              {resource.type === 'exercise' && <LightBulbIcon className="h-4 w-4 text-green-500 mr-2" />}
                              <span className="text-sm">{resource.title}</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
            
            {/* Center - Dynamic Roadmap */}
            <div className="w-2/4 p-4 overflow-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-md h-full flex flex-col"
              >
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold flex items-center">
                    <ChartBarIcon className="h-5 w-5 mr-2 text-green-500" />
                    Dynamic Learning Roadmap
                  </h2>
                </div>
                <div className="p-6 flex-1 overflow-auto">
                  <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-yellow-500 to-gray-300 z-0"></div>
                    
                    {/* Roadmap Nodes */}
                    {roadmapNodes.map((node, index) => (
                      <div 
                        key={node.id} 
                        className="flex mb-8 relative z-10"
                        onMouseEnter={() => handleRoadmapItemHover(node)}
                        draggable={roadmapScheduleMode}
                        onDragStart={(e) => handleSkillDragStart(node, e)}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md flex-shrink-0 ${
                          node.status === 'completed' ? 'bg-green-500' : 
                          node.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                        } ${roadmapScheduleMode ? 'cursor-grab' : ''}`}>
                          {node.status === 'completed' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : node.status === 'in-progress' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        
                        <div className="ml-4 flex-grow">
                          <h3 className={`font-medium ${
                            node.status === 'completed' ? 'text-green-600' : 
                            node.status === 'in-progress' ? 'text-yellow-600' : 'text-gray-600'
                          }`}>
                            {node.title}
                          </h3>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {node.skills.map(skill => (
                              <span key={skill} className="px-2 py-0.5 bg-gray-100 rounded-md text-xs text-gray-700">
                                {skill}
                              </span>
                            ))}
                          </div>
                          
                          {node.status === 'in-progress' && (
                            <div className="mt-2">
                              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '65%' }}></div>
                              </div>
                              <div className="mt-1 text-xs text-gray-500">65% completed</div>
                            </div>
                          )}
                          
                          {roadmapScheduleMode && (
                            <div className="mt-2 flex space-x-2">
                              <button className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">
                                Move Up
                              </button>
                              <button className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">
                                Move Down
                              </button>
                              <button className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100">
                                Postpone
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Right Panel - Today's Micro-Lesson & Quick MCQ Test */}
            <div className="w-1/4 p-4 overflow-auto">
              <div className="space-y-4 h-full flex flex-col">
                {/* Today's Micro-Lesson */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold flex items-center">
                      <LightBulbIcon className="h-5 w-5 mr-2 text-yellow-500" />
                      Today's Micro-Lesson
                    </h2>
                  </div>
                  <div className="relative">
                    <img 
                      src={todaysMicroLesson.imageUrl} 
                      alt={todaysMicroLesson.title}
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <span className="text-xs font-medium text-white bg-blue-500 px-2 py-0.5 rounded-full">
                        {todaysMicroLesson.category}
                      </span>
                      <h3 className="text-white font-medium mt-1">{todaysMicroLesson.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {todaysMicroLesson.duration}
                      </span>
                      <span className="text-blue-500 font-medium">Start Now</span>
                    </div>
                    <p className="text-sm text-gray-600">{todaysMicroLesson.description}</p>
                  </div>
                </motion.div>
                
                {/* Quick MCQ Test Button */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold flex items-center">
                      <DocumentTextIcon className="h-5 w-5 mr-2 text-purple-500" />
                      Quick Assessment
                    </h2>
                  </div>
                  <div className="p-4">
                    <div className="mb-4 text-sm text-gray-600">
                      Test your knowledge with a quick MCQ test tailored to your current learning focus.
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium shadow-md"
                    >
                      Start Quick Test
                    </motion.button>
                  </div>
                </motion.div>
                
                {/* Skills to Prioritize Drop Area */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden flex-1"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleSkillDrop('priority')}
                >
                  <div className="p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold flex items-center">
                      <BuildingOfficeIcon className="h-5 w-5 mr-2 text-teal-500" />
                      Skills to Prioritize
                    </h2>
                  </div>
                  <div className="p-4 h-full flex flex-col">
                    {isDragging ? (
                      <div className="flex-1 border-2 border-dashed border-teal-300 rounded-xl flex items-center justify-center bg-teal-50">
                        <p className="text-sm text-teal-600 font-medium">Drop skill here to prioritize</p>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <p className="text-sm text-gray-500">Drag skills here to prioritize them in your learning path</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Bottom Section: Learning History Timeline */}
          <div className="h-72 p-4 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-md h-full"
            >
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2 text-indigo-500" />
                  Learning History Timeline
                </h2>
              </div>
              <div className="h-full overflow-hidden">
                {renderLearningHistoryTimeline()}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningDashboard; 