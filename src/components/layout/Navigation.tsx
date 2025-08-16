import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from '@tanstack/react-router';
import { 
  Home, 
  Search, 
  BookOpen, 
  Compass, 
  User, 
  Settings,
  Menu,
  X,
  Waves,
  Zap
} from 'lucide-react';
import { cn } from '~/lib/utils';

const navigationItems = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: Home,
    depth: 0
  },
  {
    id: 'explore',
    label: 'Explore Species',
    href: '/explore',
    icon: Compass,
    depth: 0
  },
  {
    id: 'learn',
    label: 'Learning Modules',
    href: '/learn',
    icon: BookOpen,
    depth: 0
  },
  {
    id: 'ocean',
    label: '3D Ocean',
    href: '/ocean',
    icon: Waves,
    depth: 0
  },
  {
    id: 'search',
    label: 'Search',
    href: '/search',
    icon: Search,
    depth: 0
  }
];

const userItems = [
  {
    id: 'profile',
    label: 'Profile',
    href: '/profile',
    icon: User
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings
  }
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const mobileMenuVariants = {
    hidden: { 
      opacity: 0, 
      x: '-100%',
      transition: { duration: 0.3 }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, staggerChildren: 0.1 }
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav 
        className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-abyss/95 backdrop-blur-sm border-b border-white/10"
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto w-full px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              variants={itemVariants}
            >
              <div className="relative">
                <Zap className="w-8 h-8 text-bio-blue animate-bio-pulse" />
                <div className="absolute inset-0 w-8 h-8 bg-bio-blue/20 rounded-full blur-lg animate-bio-pulse" />
              </div>
              <span className="text-xl font-bold text-white">DeepGlow</span>
            </motion.div>
            
            {/* Main Navigation */}
            <div className="flex items-center space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <motion.div key={item.id} variants={itemVariants}>
                    <Link
                      to={item.href}
                      className={cn(
                        'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 group',
                        active 
                          ? 'bg-bio-blue/20 text-bio-blue'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      )}
                    >
                      <Icon className={cn(
                        'w-5 h-5 transition-all duration-200',
                        active && 'animate-bio-pulse'
                      )} />
                      <span className="font-medium">{item.label}</span>
                      
                      {/* Active indicator */}
                      {active && (
                        <motion.div
                          className="absolute -bottom-1 left-1/2 w-1 h-1 bg-bio-blue rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          layoutId="activeIndicator"
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            
            {/* User Menu */}
            <motion.div 
              className="flex items-center space-x-4"
              variants={itemVariants}
            >
              {userItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      active 
                        ? 'bg-bio-blue/20 text-bio-blue'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </motion.div>
          </div>
        </div>
      </motion.nav>
      
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-abyss/95 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Zap className="w-6 h-6 text-bio-blue animate-bio-pulse" />
                <div className="absolute inset-0 w-6 h-6 bg-bio-blue/20 rounded-full blur-lg animate-bio-pulse" />
              </div>
              <span className="text-lg font-bold text-white">DeepGlow</span>
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
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              <motion.div
                className="fixed top-16 left-0 bottom-0 z-50 w-80 bg-abyss/95 backdrop-blur-sm border-r border-white/10"
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
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
                          <motion.div key={item.id} variants={itemVariants}>
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
                          </motion.div>
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
                      {userItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        
                        return (
                          <motion.div key={item.id} variants={itemVariants}>
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
                              <Icon className="w-5 h-5" />
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default Navigation;
