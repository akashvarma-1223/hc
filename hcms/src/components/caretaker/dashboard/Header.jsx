import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/caretaker/use-Toast';
import { useNavigate } from 'react-router-dom';
const Header = () => {
    const navigate = useNavigate();
  const handleLogout = () => {
    toast.success('Successfully logged out');
    navigate('/');
    // import { useNavigate } from 'react-router-dom';In a real app, this would handle the actual logout functionality
  };

  return (
    <header className="flex justify-between items-center py-6 px-4 bg-white  animate-fade-in rounded-md">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Caretaker Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage hostel operations efficiently</p>
      </div>
      <Button 
        variant="outline"
        size="sm"
        className="flex items-center gap-1 px-3 font-medium"
        onClick={()=>navigate('/')}
      >
        <LogOut size={16} />
        <span>Logout</span>
      </Button>
    </header>
  );
};

export default Header;
