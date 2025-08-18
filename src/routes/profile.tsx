import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { User, Award, BookOpen, Star, Edit, Camera, Settings, Trophy, Target } from 'lucide-react';

export const Route = createFileRoute('/profile')({
  component: ProfileComponent,
});

function ProfileComponent() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'progress' | 'settings'>('overview');

  const userProfile = {
    name: 'Marine Explorer',
    email: 'explorer@bioluminescence.ai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    joinDate: '2024-01-15',
    level: 8,
    experience: 1250,
    nextLevel: 1500,
    totalSpecies: 47,
    completedModules: 12,
    totalModules: 20,
    achievements: 8,
    streak: 15
  };

  const achievements = [
    { id: 1, name: 'First Discovery', description: 'Identified your first bioluminescent species', icon: Star, earned: true, date: '2024-01-20' },
    { id: 2, name: 'Deep Diver', description: 'Explored the midnight zone', icon: Award, earned: true, date: '2024-02-15' },
    { id: 3, name: 'Scholar', description: 'Completed 10 learning modules', icon: BookOpen, earned: true, date: '2024-03-01' },
    { id: 4, name: 'Conservationist', description: 'Learned about 50 species', icon: Trophy, earned: false, date: null },
    { id: 5, name: 'Oceanographer', description: 'Spent 100 hours in 3D ocean', icon: Target, earned: false, date: null }
  ];

  const recentActivity = [
    { type: 'module', title: 'Completed Deep Sea Light Shows', time: '2 hours ago', icon: BookOpen },
    { type: 'species', title: 'Discovered Atolla Jellyfish', time: '1 day ago', icon: Star },
    { type: 'exploration', title: 'Explored Twilight Zone', time: '3 days ago', icon: Award },
    { type: 'achievement', title: 'Earned Scholar Badge', time: '1 week ago', icon: Trophy }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'progress', label: 'Progress', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const progressPercentage = (userProfile.completedModules / userProfile.totalModules) * 100;
  const experiencePercentage = (userProfile.experience / userProfile.nextLevel) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-sea via-abyss to-ocean-deep">
      {/* Header */}
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-white mb-4">
              Your{' '}
              <span className="text-bio-blue animate-bio-glow-subtle">
                Profile
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Track your progress, achievements, and learning journey through the fascinating world of bioluminescence.
            </p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-abyss/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8"
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Avatar Section */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-bio-blue/30">
                  <img 
                    src={userProfile.avatar} 
                    alt={userProfile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-bio-blue rounded-full text-white hover:bg-bio-cyan transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                  <h2 className="text-3xl font-bold text-white">{userProfile.name}</h2>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 text-gray-400 hover:text-bio-blue transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-gray-400 mb-4">{userProfile.email}</p>
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-bio-blue">{userProfile.level}</div>
                    <div className="text-sm text-gray-400">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-bio-green">{userProfile.streak}</div>
                    <div className="text-sm text-gray-400">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-bio-pink">{userProfile.achievements}</div>
                    <div className="text-sm text-gray-400">Achievements</div>
                  </div>
                </div>

                {/* Experience Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                    <span>Experience</span>
                    <span>{userProfile.experience} / {userProfile.nextLevel}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-bio-blue to-bio-cyan h-2 rounded-full transition-all duration-500"
                      style={{ width: `${experiencePercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-bio-blue/20 text-bio-blue border border-bio-blue/30'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Progress Overview */}
              <div className="bg-abyss/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Learning Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <span>Modules Completed</span>
                      <span>{userProfile.completedModules} / {userProfile.totalModules}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-bio-green to-bio-blue h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-bio-blue">{userProfile.totalSpecies}</div>
                      <div className="text-sm text-gray-400">Species Discovered</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-bio-green">{userProfile.streak}</div>
                      <div className="text-sm text-gray-400">Day Streak</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-abyss/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <div className="w-10 h-10 bg-bio-blue/20 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-bio-blue" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{activity.title}</div>
                          <div className="text-xs text-gray-400">{activity.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`p-6 rounded-xl border transition-all ${
                      achievement.earned
                        ? 'bg-bio-blue/10 border-bio-blue/30 text-white'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        achievement.earned ? 'bg-bio-blue/20' : 'bg-white/10'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          achievement.earned ? 'text-bio-blue' : 'text-gray-500'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{achievement.name}</h4>
                        <p className="text-sm text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                    {achievement.earned && (
                      <div className="text-xs text-bio-blue">
                        Earned on {achievement.date}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-abyss/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Learning Path</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                    <div className="w-12 h-12 bg-bio-green/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-bio-green" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Introduction to Bioluminescence</h4>
                      <p className="text-sm text-gray-400">Completed • 30 min</p>
                    </div>
                    <div className="text-bio-green">✓</div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                    <div className="w-12 h-12 bg-bio-blue/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-bio-blue" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Deep Sea Light Shows</h4>
                      <p className="text-sm text-gray-400">In Progress • 45 min</p>
                    </div>
                    <div className="text-bio-blue">⟳</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-abyss/30 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Profile Settings</h3>
              <p className="text-gray-400">Profile settings and preferences will be available here.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
