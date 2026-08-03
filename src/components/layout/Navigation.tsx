import { useState, useEffect } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import {
  Home,
  User,
  Menu,
  X,
  Search,
  Compass,
  BookOpen,
  Waves,
  Settings
} from 'lucide-react';
import { cn } from '~/lib/utils';
import { useAuth } from '~/hooks/useAuth';
import Logo from './Logo';

const navigationItems = [
  {
    id: 'home',
    label: 'Home',
    href: '/home',
    icon: Home,
    depth: 0
  },
  {
    id: 'explore',
    label: 'Explore',
    href: '/explore',
    icon: Compass,
    depth: 0
  },
  {
    id: 'learn',
    label: 'Learn',
    href: '/learn',
    icon: BookOpen,
    depth: 0
  },
  {
    id: 'search',
    label: 'Search',
    href: '/search',
    icon: Search,
    depth: 0
  },
  {
    id: 'ocean',
    label: 'Ocean 3D',
    href: '/ocean',
    icon: Waves,
    depth: 0
  }
];

function Navigation() {
  const { user, signOut, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  const isActive = (href: string) => {
    return location.pathname.startsWith(href);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        className={cn(
          "hidden lg:flex fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled 
            ? "bg-abyss/95 backdrop-blur-sm border-b border-white/10 shadow-lg"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto w-full px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3"
            >
              <Logo className="w-8 h-8 text-bio-blue" />
              <span className="text-xl font-bold text-white">Marine Institute</span>
            </div>
            
            {/* Main Navigation */}
            <div className="flex items-center space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <div key={item.id} className="relative">
                    <Link
                      to={item.href}
                      className={cn(
                        'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 group relative',
                        active 
                          ? 'bg-bio-blue/20 text-bio-blue'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      )}
                    >
                      <Icon className={cn(
                        'w-5 h-5 transition-all duration-200',
                        active
                      )} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
            
            {/* User Menu */}
            <div 
              className="flex items-center space-x-4"
            >
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300">{user?.email}</span>
                  
                  {/* User Profile & Settings Links */}
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/profile"
                      className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      title="Profile"
                    >
                      <User className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/settings"
                      className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      title="Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </Link>
                  </div>
                  
                  <button
                    onClick={() => signOut.mutate()}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/signup"
                    className="px-3 py-2 text-bio-blue hover:text-bio-cyan transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-bio-blue/20 hover:bg-bio-blue/30 text-bio-blue rounded-lg transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled 
            ? "bg-abyss/95 backdrop-blur-sm border-b border-white/10 shadow-lg"
            : "bg-transparent"
        )}>
          <div className="flex items-center justify-between h-16 px-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Logo className="w-6 h-6 text-bio-blue" glowClassName="w-6 h-6" />
              <span className="text-lg font-bold text-white">Marine Institute</span>
            </div>
            
            {/* Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <div
              className="fixed top-16 left-0 bottom-0 z-50 w-80 bg-abyss/95 backdrop-blur-sm border-r border-white/10"
            >
                <div className="p-6 space-y-6">
                  {/* Main Navigation */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                      Navigation
                    </h3>
                    <div className="space-y-2">
                      {navigationItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        
                        return (
                          <div key={item.id}>
                            <Link
                              to={item.href}
                              className={cn(
                                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                                active 
                                  ? 'bg-bio-blue/20 text-bio-blue'
                                  : 'text-gray-300 hover:text-white hover:bg-white/5'
                              )}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Icon className={cn(
                                'w-5 h-5',
                                active && 'animate-bio-pulse'
                              )} />
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* User Menu */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                      Account
                    </h3>
                    <div className="space-y-2">
                      {isAuthenticated ? (
                        <div className="space-y-2">
                          <div className="px-4 py-3 text-gray-300">
                            {user?.email}
                          </div>
                          
                          {/* Profile & Settings Links */}
                          <Link
                            to="/profile"
                            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <User className="w-5 h-5" />
                            <span className="font-medium">Profile</span>
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Settings className="w-5 h-5" />
                            <span className="font-medium">Settings</span>
                          </Link>
                          
                          <button
                            onClick={() => {
                              signOut.mutate();
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors font-medium"
                          >
                            <User className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Link
                            to="/signup"
                            className="flex items-center space-x-3 px-4 py-3 text-bio-blue hover:text-bio-cyan rounded-lg transition-colors font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <User className="w-5 h-5" />
                            <span className="font-medium">Sign Up</span>
                          </Link>
                          <Link
                            to="/login"
                            className="flex items-center space-x-3 px-4 py-3 bg-bio-blue/20 hover:bg-bio-blue/30 text-bio-blue rounded-lg transition-colors font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <User className="w-5 h-5" />
                            <span className="font-medium">Sign In</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  }

export default Navigation;

