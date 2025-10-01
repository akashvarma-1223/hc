import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex items-center h-16 px-4 border-b md:px-6">
      <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </Link>
    </nav>
  );
};

export default Navbar;
