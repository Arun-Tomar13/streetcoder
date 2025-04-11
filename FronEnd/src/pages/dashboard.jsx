import React, { useState } from 'react';
import Sidebar from '../components/siderbar';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  EllipsisHorizontalIcon,
  UserCircleIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ChartBarIcon,
  LightBulbIcon,
  MicrophoneIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  // Career progress stats
  const stats = [
    { title: 'Skills Mastered', value: '24', change: '+3', isPositive: true, icon: AcademicCapIcon },
    { title: 'Interview Score', value: '87%', change: '+12%', isPositive: true, icon: ChatBubbleLeftRightIcon },
    { title: 'Resume Strength', value: '92%', change: '+8%', isPositive: true, icon: DocumentTextIcon },
    { title: 'Career Readiness', value: '78%', change: '+5%', isPositive: true, icon: ChartBarIcon },
  ];

  // Career companion activities
  const recentActivity = [
    { user: 'CoachBot', action: 'Suggested "Leadership Skills" course', time: '2 hours ago', impact: 'High' },
    { user: 'QuickConnect', action: 'Matched with Senior Developer mentor', time: '1 day ago', impact: 'Medium' },
    { user: 'SpeakSmart', action: 'Completed interview practice session', time: '2 days ago', impact: 'High' },
    { user: 'AI Resume Builder', action: 'Updated resume with new skills', time: '3 days ago', impact: 'Medium' },
    { user: 'SparkBoard', action: 'Completed "Technical Writing" skill test', time: '5 days ago', impact: 'Medium' },
  ];

  // Career pathway options
  const careerPaths = [
    { title: 'Software Engineering', progress: 65, skills: 38, estimate: '8 months' },
    { title: 'Product Management', progress: 42, skills: 24, estimate: '11 months' },
    { title: 'Data Science', progress: 28, skills: 19, estimate: '14 months' }
  ];

  // Upcoming events/mentoring sessions
  const upcomingEvents = [
    { title: 'Mock Interview: Frontend Development', time: 'Tomorrow, 3:00 PM', type: 'QuickConnect' },
    { title: 'Group Discussion: Career Transitions', time: 'Friday, 5:30 PM', type: 'Community' },
    { title: 'Resume Review Session', time: 'Next Monday, 2:00 PM', type: 'CoachBot' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100 font-sans">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-20'} overflow-auto`}>
        {/* Top Navigation */}
        <div className="h-16 bg-white bg-opacity-80 backdrop-blur-sm shadow-sm flex items-center justify-between px-6 rounded-b-xl">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">Career Dashboard</h1>
            <span className="ml-2 px-2 py-1 bg-teal-100 text-teal-800 text-xs font-medium rounded">BETA</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask your CoachBot..." 
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-200 w-64 bg-white bg-opacity-90"
              />
              <MicrophoneIcon className="h-5 w-5 text-teal-600 absolute left-3 top-2.5" />
            </div>
            <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center cursor-pointer hover:bg-teal-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, Alex</h2>
            <p className="text-gray-600">Your career growth is on track. Here's what you can focus on today.</p>
          </div>
          
          {/* AI Insight Card */}
          <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl shadow-md p-6 mb-8 text-white">
            <div className="flex items-start">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-4">
                <LightBulbIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">CoachBot's Daily Insight</h3>
                <p className="opacity-90 mb-4">Based on your recent interview practice, focus on improving your technical explanation skills. I've prepared a personalized exercise for you.</p>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-white text-teal-700 rounded-lg font-medium text-sm hover:bg-opacity-90 transition-colors">Start Exercise</button>
                  <button className="px-4 py-2 bg-transparent border border-white text-white rounded-lg font-medium text-sm hover:bg-white hover:bg-opacity-10 transition-colors">View Details</button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-sm p-6 transition-all hover:shadow-md border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                  </div>
                  <div className="p-2 rounded-lg bg-teal-100">
                    <stat.icon className="h-6 w-6 text-teal-700" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium flex items-center ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.isPositive ? (
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">this month</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Main Section with Career Path and SparkBoard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Career Path Progression - Takes 2/3 of the width */}
            <div className="lg:col-span-2 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-800">Your Career Paths</h3>
                <button className="p-2 rounded-lg hover:bg-gray-100 text-teal-600 text-sm font-medium">
                  Explore More Paths
                </button>
              </div>
              
              <div className="space-y-6">
                {careerPaths.map((path, index) => (
                  <div key={index} className="border border-gray-100 rounded-lg p-4 hover:border-teal-200 transition-colors bg-white bg-opacity-70">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-800">{path.title}</h4>
                      <span className="text-sm text-gray-500">Est. {path.estimate} to job-ready</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-blue-500 h-2.5 rounded-full" 
                        style={{ width: `${path.progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-teal-600 font-medium">{path.progress}% complete</span>
                      <span className="text-gray-600">{path.skills} skills identified</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-pink-50 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium text-gray-700">Need guidance on your career direction?</h4>
                    <p className="text-xs text-gray-500 mt-1">Our AI can analyze your strengths and preferences to suggest optimal career paths.</p>
                  </div>
                  <button className="ml-3 px-3 py-1.5 bg-gradient-to-r from-teal-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                    Run Assessment
                  </button>
                </div>
              </div>
            </div>
            
            {/* SparkBoard & Upcoming - Takes 1/3 of the width */}
            <div className="space-y-6">
              {/* SparkBoard Summary */}
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">SparkBoard</h3>
                  <button className="text-teal-600 text-sm hover:text-teal-800">View All</button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Weekly Goal</span>
                    <span className="text-sm font-medium">3 of 5 completed</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div className="mt-5">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Top Skills to Practice</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-teal-500 mr-2"></div>
                      <span className="text-sm text-gray-600">System Design</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm text-gray-600">Problem Solving</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-pink-500 mr-2"></div>
                      <span className="text-sm text-gray-600">Technical Communication</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Upcoming Events */}
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">Upcoming Events</h3>
                  <button className="text-teal-600 text-sm hover:text-teal-800">Schedule More</button>
                </div>
                
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-start">
                      <div className={`p-2 rounded-lg mr-3 ${
                        event.type === 'QuickConnect' ? 'bg-blue-100 text-blue-700' : 
                        event.type === 'Community' ? 'bg-teal-100 text-teal-700' : 
                        'bg-pink-100 text-pink-700'
                      }`}>
                        {event.type === 'QuickConnect' ? (
                          <UserCircleIcon className="h-5 w-5" />
                        ) : event.type === 'Community' ? (
                          <ChatBubbleLeftRightIcon className="h-5 w-5" />
                        ) : (
                          <LightBulbIcon className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">{event.title}</h4>
                        <p className="text-xs text-gray-500">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-gray-800">Your Activity Feed</h3>
              <button className="text-teal-600 text-sm font-medium hover:text-teal-800">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 bg-opacity-60">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                  </tr>
                </thead>
                <tbody className="bg-white bg-opacity-50 divide-y divide-gray-200">
                  {recentActivity.map((activity, index) => (
                    <tr key={index} className="hover:bg-blue-50 hover:bg-opacity-30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-teal-600">{activity.user}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-600">{activity.action}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500 text-sm">{activity.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${activity.impact === 'High' 
                            ? 'bg-teal-100 text-teal-800' 
                            : 'bg-blue-100 text-blue-800'}`}>
                          {activity.impact}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
