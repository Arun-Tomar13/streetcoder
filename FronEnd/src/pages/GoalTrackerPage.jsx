import React from 'react';
import Sidebar from '../components/siderbar';
import GoalTracker from '../components/GoalTracker';

const GoalTrackerPage = () => {
  return (
    <div className="flex bg-gradient-to-br from-[#C3D9F1] to-[#F5C0CF] min-h-screen font-sans">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-20 p-8 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[28px] font-bold text-[#333333]">Goal Tracker</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search goals" 
                  className="pl-4 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#41A6B2] focus:ring-1 focus:ring-[#41A6B2] w-[220px]"
                />
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-[#41A6B2] to-[#8FD3C9] flex items-center justify-center shadow-md">
                <span className="text-white font-medium">T</span>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="mb-6">
            <GoalTracker />
          </div>
          
          {/* Stats and Progress */}
          <div className="grid grid-cols-12 gap-6">
            {/* Streak Calendar */}
            <div className="col-span-8 bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-[#333333]">Your Streaks</h3>
                <span className="text-xs text-[#41A6B2] cursor-pointer">View Details</span>
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 30 }, (_, i) => {
                  // Random activity level for demonstration
                  const activity = Math.floor(Math.random() * 4);
                  const today = new Date();
                  const date = new Date(today);
                  date.setDate(today.getDate() - 30 + i);
                  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayOfMonth = date.getDate();
                  
                  return (
                    <div 
                      key={i} 
                      className="flex flex-col items-center"
                    >
                      {i < 7 && <div className="text-xs text-gray-500 mb-1">{dayOfWeek}</div>}
                      <div 
                        className={`w-8 h-8 rounded-md flex items-center justify-center text-xs ${
                          activity === 0 ? 'bg-gray-100 text-gray-500' : 
                          activity === 1 ? 'bg-green-100 text-green-600' : 
                          activity === 2 ? 'bg-green-200 text-green-700' : 
                          'bg-green-300 text-green-800'
                        }`}
                        title={`${date.toLocaleDateString()}: ${
                          activity === 0 ? 'No activity' : 
                          activity === 1 ? 'Low activity' : 
                          activity === 2 ? 'Medium activity' : 
                          'High activity'
                        }`}
                      >
                        {dayOfMonth}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-end items-center mt-4 text-xs text-gray-500">
                <span className="flex items-center mr-3">
                  <div className="w-3 h-3 bg-gray-100 rounded-sm mr-1"></div>
                  No activity
                </span>
                <span className="flex items-center mr-3">
                  <div className="w-3 h-3 bg-green-100 rounded-sm mr-1"></div>
                  Low
                </span>
                <span className="flex items-center mr-3">
                  <div className="w-3 h-3 bg-green-200 rounded-sm mr-1"></div>
                  Medium
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-green-300 rounded-sm mr-1"></div>
                  High
                </span>
              </div>
            </div>
            
            {/* Time Management Tools */}
            <div className="col-span-4 bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-[#333333]">Time Management</h3>
                <span className="text-xs text-[#41A6B2] cursor-pointer">View All</span>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Pomodoro Timer</h4>
                  <div className="flex justify-center mb-3">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#41A6B2] to-[#8FD3C9] flex items-center justify-center text-white text-2xl font-bold">
                      25:00
                    </div>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <button className="px-3 py-1.5 bg-[#41A6B2] text-white text-xs rounded-lg hover:bg-opacity-90 transition-colors">
                      Start
                    </button>
                    <button className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition-colors">
                      Reset
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Upcoming Tasks</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center text-sm">
                      <span>Complete project proposal</span>
                      <span className="text-xs text-gray-500">Today</span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                      <span>Client meeting</span>
                      <span className="text-xs text-gray-500">Tomorrow</span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                      <span>Review code changes</span>
                      <span className="text-xs text-gray-500">Wed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalTrackerPage; 