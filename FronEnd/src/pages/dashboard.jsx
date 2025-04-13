import React, { useState, useEffect } from 'react';
import Sidebar from '../components/siderbar';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon, 
  CalendarIcon, 
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

// Main Dashboard Component
const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F9F7FE]">
        <div className="w-8 h-8 rounded-full border-2 border-t-[#41A6B2] border-r-[#41A6B2] border-b-transparent border-l-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex bg-gradient-to-br from-[#C3D9F1] to-[#F5C0CF] min-h-screen font-sans">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-20 p-8 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto">
          {/* Header with Welcome and Search */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[28px] font-bold text-[#333333]">Welcome back Ramlal</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="pl-4 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#41A6B2] focus:ring-1 focus:ring-[#41A6B2] w-[220px]"
                />
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-[#41A6B2] to-[#8FD3C9] flex items-center justify-center shadow-md">
                <span className="text-white font-medium">T</span>
              </div>
            </div>
          </div>
          
          {/* Stats Cards Row */}
          <div className="mb-6 flex items-stretch gap-6">
            <div className="bg-white rounded-2xl p-5 shadow-md flex-1 flex items-center justify-between border border-gray-100">
              <div>
                <p className="text-gray-500 text-sm mb-1">your statistics</p>
                <h3 className="font-semibold text-xl text-[#333333]">427</h3>
                <p className="text-gray-500 text-xs">Profile views this week</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#C3D9F1] flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-[#41A6B2]" />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-5 shadow-md flex-1 flex items-center justify-between border border-gray-100">
              <div>
                <p className="text-gray-500 text-sm mb-1">Interview Score</p>
                <h3 className="font-semibold text-xl text-[#333333]">87%</h3>
                <p className="text-gray-500 text-xs">Resume completion</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#8FD3C9] flex items-center justify-center">
                <ClipboardDocumentCheckIcon className="w-6 h-6 text-[#41A6B2]" />
              </div>
            </div>  
            
            <div className="bg-white rounded-2xl p-5 shadow-md flex-1 flex items-center justify-between border border-gray-100">
              <div>
                <p className="text-gray-500 text-sm mb-1">Resume Strength</p>
                <h3 className="font-semibold text-xl text-[#333333]">4</h3>
                <p className="text-gray-500 text-xs">Skills validated</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#F5C0CF] flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-[#41A6B2]" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-[#41A6B2] to-[#8FD3C9] rounded-2xl p-5 shadow-md flex-1 flex items-center border border-gray-100">
              <div className="text-white">
                <p className="text-white text-sm opacity-80 mb-1">Premium</p>
                <h3 className="font-semibold text-lg">Unlock full access</h3>
                <button className="mt-2 bg-white text-[#41A6B2] text-xs font-medium py-1 px-3 rounded-lg shadow-sm">Upgrade</button>
              </div>
            </div>
          </div>
          
          {/* Main Content Sections */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Vertical Bar Chart */}
            <div className="col-span-4 bg-white h-fit rounded-2xl p-5 shadow-md border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-[#333333]">Weekly Progress</h3>
                <div className="text-xs text-gray-500">Last 7 days</div>
              </div>
              
              <div className="flex">
                {/* This is a placeholder for the bar chart */}
                <div className="w-full flex justify-between items-end h-[150px]">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div key={day} className="flex flex-col items-center">
                      <div 
                        className={`w-7 rounded-t-md ${
                          day === 'Wed' ? 'bg-[#41A6B2]' : 'bg-gray-200'
                        }`} 
                        style={{height: `${[45, 80, 120, 60, 90, 40, 75][i]}px`}}
                      ></div>
                      <span className="mt-2 text-xs text-gray-500">{day}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total hours this week</span>
                  <span className="font-medium text-[#333333]">18h 23m</span>
                </div>
              </div>
            </div>
            
            {/* Middle Column - Daily Schedule */}
            <div className="col-span-4 bg-white h-fit rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-4 px-5 bg-gradient-to-r from-[#E3F0F7] to-[#F7E3ED] rounded-t-xl">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-[#333333]">Today's Schedule</div>
                  <div className="text-xs text-[#41A6B2] cursor-pointer">View all</div>
                </div>
              </div>
              
              {/* Schedule Items */}
              <div className="px-5 py-2.5 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#8FD3C9] rounded-full mr-3"></div>
                  <div>
                    <h4 className="text-sm font-medium text-[#333333]">Interview Prep</h4>
                    <p className="text-xs text-gray-500">10:00 - 11:00 AM</p>
                  </div>
                </div>
              </div>
              
              <div className="px-5 py-2.5 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#F5C0CF] rounded-full mr-3"></div>
                  <div>
                    <h4 className="text-sm font-medium text-[#333333]">Resume Review</h4>
                    <p className="text-xs text-gray-500">01:30 - 02:15 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="px-5 py-2.5 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#41A6B2] rounded-full mr-3"></div>
                  <div>
                    <h4 className="text-sm font-medium text-[#333333]">Skill Assessment</h4>
                    <p className="text-xs text-gray-500">03:00 - 04:00 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="px-5 py-2.5 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#C3D9F1] rounded-full mr-3"></div>
                  <div>
                    <h4 className="text-sm font-medium text-[#333333]">Mentorship Call</h4>
                    <p className="text-xs text-gray-500">05:30 - 06:15 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Calendar and Assignments */}
            <div className="col-span-4 flex flex-col gap-6">
              {/* Calendar */}
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex-1">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-[#333333]">Calendar</h3>
                  <CalendarIcon className="w-5 h-5 text-gray-500" />
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                    <div key={day} className="text-xs font-medium text-gray-500">{day}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center">
                  {Array.from({length: 31}, (_, i) => i + 1).map((day) => (
                    <div key={day} className={`text-xs py-1.5 ${
                      day === 15 ? 'bg-[#C3D9F1] rounded-full text-[#41A6B2] font-bold' : 'text-gray-800'
                    }`}>
                      {day}
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          </div>
          
          {/* Additional Section to Fill Bottom Space */}
          <div className="grid grid-cols-12 gap-6 mt-6">
            {/* Course Recommendations */}
            <div className="col-span-8 bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-[#333333]">Course Recommendations</h3>
                <span className="text-xs text-[#41A6B2] cursor-pointer">View all</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-[#8FD3C9] flex items-center justify-center mb-3">
                    <AcademicCapIcon className="w-6 h-6 text-[#41A6B2]" />
                  </div>
                  <h4 className="font-medium text-[#333333] mb-1">Advanced Interview Skills</h4>
                  <p className="text-xs text-gray-500 mb-2">Learn techniques to excel in technical interviews</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-[#41A6B2]">4.8 ★</span>
                    <span className="text-xs text-gray-500">8 hours</span>
                  </div>
                </div>
                
                <div className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-[#C3D9F1] flex items-center justify-center mb-3">
                    <ChartBarIcon className="w-6 h-6 text-[#41A6B2]" />
                  </div>
                  <h4 className="font-medium text-[#333333] mb-1">Data Analysis Fundamentals</h4>
                  <p className="text-xs text-gray-500 mb-2">Build essential data analysis skills for your career</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-[#41A6B2]">4.9 ★</span>
                    <span className="text-xs text-gray-500">12 hours</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Upcoming Events */}
            <div className="col-span-4 bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-[#333333]">Upcoming Events</h3>
                <span className="text-xs text-[#41A6B2] cursor-pointer">View all</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex p-3 rounded-lg bg-gradient-to-r from-[#E3F0F7] to-[#F7E3ED]">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mr-3">
                    <CalendarIcon className="w-6 h-6 text-[#41A6B2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#333333]">Career Fair</h4>
                    <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
                    <div className="flex items-center mt-2">
                      <div className="flex -space-x-1.5">
                        <div className="w-5 h-5 rounded-full bg-[#8FD3C9]"></div>
                        <div className="w-5 h-5 rounded-full bg-[#41A6B2]"></div>
                        <div className="w-5 h-5 rounded-full bg-[#C3D9F1]"></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">+12 attending</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 rounded-lg bg-[#8FD3C9] flex items-center justify-center mr-3">
                    <UserGroupIcon className="w-6 h-6 text-[#41A6B2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#333333]">Resume Workshop</h4>
                    <p className="text-xs text-gray-500">Friday, 02:00 PM</p>
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

export default Dashboard;