import React, { useState } from 'react';
import { 
  HomeIcon, 
  ChartBarIcon, 
  UsersIcon, 
  CogIcon, 
  BellIcon, 
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  AcademicCapIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { LightBulbIcon as LightBulbSolid } from '@heroicons/react/24/solid';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    { title: 'Dashboard', icon: HomeIcon, notification: 0 },
    { title: 'Career Paths', icon: ChartBarIcon, notification: 0 },
    { title: 'Skills', icon: AcademicCapIcon, notification: 2 },
    { title: 'CoachBot', icon: LightBulbIcon, notification: 0 },
    { title: 'QuickConnect', icon: UsersIcon, notification: 3 },
    { title: 'SpeakSmart', icon: DocumentTextIcon, notification: 0 },
    { title: 'Notifications', icon: BellIcon, notification: 5 },
    { title: 'Settings', icon: CogIcon, notification: 0 },
    { title: 'Help', icon: QuestionMarkCircleIcon, notification: 0 },
  ];

  return (
    <div 
      className={`${expanded ? 'w-64' : 'w-20'} h-screen bg-white bg-opacity-90 backdrop-blur-sm transition-all duration-300 ease-in-out fixed top-0 left-0 z-50 shadow-md border-r border-gray-100`}
    >
      {/* Sidebar Header with Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        {expanded ? (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center">
              <LightBulbSolid className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Elevate Os</h1>
          </div>
        ) : (
          <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center">
            <LightBulbSolid className="h-6 w-6 text-white" />
          </div>
        )}
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          {expanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Profile */}
      <div className={`${expanded ? 'flex-row p-4' : 'flex-col p-3'} flex items-center border-b border-gray-100`}>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-pink-400 flex items-center justify-center">
            <span className="text-sm font-medium text-white">AJ</span>
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
        </div>
        {expanded && (
          <div className="ml-3 overflow-hidden">
            <p className="font-medium text-gray-800 truncate">Alex Johnson</p>
            <p className="text-xs text-gray-500 truncate">Software Developer</p>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav className="mt-4 px-2 space-y-1">
        {menuItems.map((item) => (
          <div 
            key={item.title}
            onClick={() => setActiveItem(item.title)}
            className={`flex items-center ${expanded ? 'justify-between px-4' : 'justify-center'} py-3 rounded-xl cursor-pointer transition-all duration-200 group relative
              ${activeItem === item.title 
                ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-sm' 
                : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-pink-50 text-gray-600'}`}
          >
            <div className={`flex items-center ${expanded ? '' : 'justify-center flex-col'}`}>
              <item.icon className={`h-5 w-5 ${activeItem === item.title ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
              {expanded && <span className={`ml-3 font-medium ${activeItem === item.title ? 'text-white' : ''}`}>{item.title}</span>}
              {!expanded && (
                <span className="text-xs mt-1 font-medium text-gray-500">{item.title.split(' ')[0]}</span>
              )}
            </div>
            
            {item.notification > 0 && (
              <div className={`${expanded ? 'relative' : 'absolute -top-1 -right-1'}`}>
                <span className={`flex h-5 w-5 ${expanded ? 'h-5 w-5' : 'h-4 w-4'} items-center justify-center rounded-full ${activeItem === item.title ? 'bg-white text-teal-600' : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'} text-xs font-medium`}>
                  {item.notification}
                </span>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Progress Section */}
      {expanded && (
        <div className="absolute bottom-20 left-0 right-0 px-4">
          <div className="bg-gradient-to-r from-blue-50 to-pink-50 p-4 rounded-xl">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Career Progress</h4>
            <div className="w-full bg-white bg-opacity-60 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full" 
                style={{ width: '68%' }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Level 4</span>
              <span className="text-xs font-medium text-teal-600">68%</span>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Footer */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
        {expanded ? (
          <button className="w-full flex items-center justify-center py-2 px-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity">
            <span className="text-sm font-medium">Get Pro Access</span>
          </button>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;