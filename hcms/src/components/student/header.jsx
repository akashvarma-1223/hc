
import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import Badge from './Badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';


const Header= ({
  username,
  notificationCount,
  onLogout = () => console.log('Logout clicked'),
}) => {
  const navigate=useNavigate();
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
      <h1 className="text-xl font-bold text-blue-600">NITC HostelConnect</h1>
        <span className="text-gray-500 hidden sm:inline-block">|</span>
        <p className="text-gray-600 hidden sm:inline-block">
          Welcome, {username}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {/* <div className="relative cursor-pointer">
          <Bell size={20} className="text-gray-600 hover:text-nitc-blue transition-colors" />
          <Badge count={notificationCount} className="-top-2 -right-2" />
        </div> */}
        
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-600 hover:text-nitc-blue hover:bg-nitc-light-blue transition-all"
          onClick={onLogout}
        >
          <LogOut size={18} />
          <span className="hidden sm:inline-block" onClick={()=>navigate('/')}>Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
