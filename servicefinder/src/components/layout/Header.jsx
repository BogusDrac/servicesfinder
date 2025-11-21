import { useState,useEffect } from "react";
import { Menu, User, LogOut,Bell } from "lucide-react";
import { useAuth } from "../Auth/AuthProvider";
import Logo from "../common/Logo";

const Header = ({ onMenuToggle, onAuthClick }) => {
  const { currentUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const username = currentUser?.email?.split("@")[0];

  // Show notification for 3 seconds when user logs in
  useEffect(() => {
    if (currentUser) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentUser]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Notification Banner - Shows for 3 seconds max */}
      {currentUser && showNotification && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-2.5 text-sm font-medium flex items-center justify-center gap-2 animate-slideDown">
          <Bell className="w-4 h-4 animate-bounce" />
          Welcome back, <span className="capitalize font-bold">{username}</span> 👋
        </div>
      )}

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="lg:hidden hover:bg-gray-100 p-2 rounded-xl transition-all active:scale-95"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

            <Logo />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="relative">
                {/* User Button */}
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                  aria-label="User menu"
                >
                  <User className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 flex items-center justify-center text-white font-semibold text-sm group-hover:scale-110 transition-transform duration-200" />
                  <span className="hidden sm:inline text-sm capitalize">
                    {username}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 border border-gray-100 animate-fadeSlide z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 capitalize">{username}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{currentUser.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 transition-all duration-200 font-medium text-sm group"
                      >
                        <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Animation for dropdown */}
      <style>{`
        .animate-fadeSlide {
          animation: fadeSlide 0.25s ease-out;
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
};

export default Header;
