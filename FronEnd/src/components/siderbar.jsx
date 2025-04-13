import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ChartBarIcon, 
  UsersIcon, 
  CogIcon, 
  BellIcon, 
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  AcademicCapIcon,
  LightBulbIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { LightBulbIcon as LightBulbSolid } from '@heroicons/react/24/solid';

const Sidebar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(() => {
    // Set active item based on current path when component mounts
    const path = location.pathname.split('/')[1];
    return path || 'QuickConnect';
  });

  const menuItems = [
    { title: 'CoachBot', icon: DocumentTextIcon, notification: 0, path: '/dashboard/coachbot' },
    { title: 'PathFinder', icon: ChartBarIcon, notification: 0, path: '/dashboard/pathfinder' },
    { title: 'Learning', icon: BookOpenIcon, notification: 4, path: '/dashboard/learning' },
    { title: 'ResumeCraft', icon: AcademicCapIcon, notification: 2, path: '/dashboard/resumecraft' },
    { title: 'PortfolioCraft', icon: AcademicCapIcon, notification: 2, path: '/dashboard/resumecraft' },
    { title: 'Growth', icon: BellIcon, notification: 5, path: '/dashboard/growth' },
    { title: 'SpeakSmart', icon: LightBulbIcon, notification: 0, path: '/dashboard/speaksmart' },
    { title: 'Skillpuls', icon: UsersIcon, notification: 3, path: '/dashboard/skillpuls' },
    { title: 'QuickConnect', icon: HomeIcon, notification: 0, path: '/dashboard/quickconnect' },
    { title: 'Settings', icon: CogIcon, notification: 0, path: '/dashboard/settings' },
    { title: 'Help', icon: QuestionMarkCircleIcon, notification: 0, path: '/dashboard/help' },
  ];

  return (
    <div className="w-20 h-screen bg-white bg-opacity-90 backdrop-blur-sm fixed top-0 left-0 z-50 shadow-md border-r border-gray-100">
      {/* Sidebar Header with Logo */}
      <div className="flex items-center justify-center p-4 border-b border-gray-100">
        <Link to="/" className="block">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center">
            <LightBulbSolid className="h-6 w-6 text-white" />
          </div>
        </Link>
      </div>

      {/* Profile */}
      <div className="flex flex-col p-3 items-center border-b border-gray-100">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-pink-400 flex items-center justify-center">
            <span className="text-sm font-medium text-white">AJ</span>
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="mt-4 px-2 space-y-1">
        {menuItems.map((item) => (
          <Link 
            key={item.title}
            to={item.path}
            onClick={() => setActiveItem(item.title)}
            className={`flex items-center justify-center py-3 rounded-xl cursor-pointer transition-all duration-200 relative group
              ${activeItem === item.title 
                ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-sm' 
                : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-pink-50 text-gray-600'}`}
          >
            <div className={`flex items-center justify-center ${
              activeItem === item.title 
                ? '' 
                : 'w-9 h-9 rounded-lg border border-gray-200 bg-white'
            }`}>
              <item.icon className={`h-5 w-5 ${
                activeItem === item.title 
                  ? 'text-white' 
                  : 'text-gray-500 group-hover:text-gray-700'
              }`} />
            </div>
            
            {/* Tooltip that appears on hover */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {item.title}
              <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-0 h-0 border-t-4 border-r-4 border-b-4 border-t-transparent border-r-gray-800 border-b-transparent"></div>
            </div>
            
            {item.notification > 0 && (
              <div className="absolute -top-1 -right-1">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-medium">
                  {item.notification}
                </span>
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
        <div className="flex justify-center relative group">
          <Link to="/pricing" className="block">
            <div className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center cursor-pointer hover:bg-gradient-to-r hover:from-teal-500 hover:to-blue-500 hover:border-transparent group-hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </Link>
          
          {/* Tooltip for Pro Access */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            Get Pro Access
            <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-0 h-0 border-t-4 border-r-4 border-b-4 border-t-transparent border-r-gray-800 border-b-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;