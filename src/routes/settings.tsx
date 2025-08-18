import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { Settings, User, Bell, Eye, Palette, Globe, Shield, Download, Moon, Sun, Monitor } from 'lucide-react';

export const Route = createFileRoute('/settings')({
  component: SettingsComponent,
});

function SettingsComponent() {
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'notifications' | 'privacy' | 'data'>('general');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('dark');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    achievements: true,
    updates: false
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'data', label: 'Data', icon: Download }
  ];

  const themes = [
    { value: 'light', label: 'Light', icon: Sun, description: 'Bright theme for daytime use' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Dark theme for low-light environments' },
    { value: 'auto', label: 'Auto', icon: Monitor, description: 'Follows system preference' }
  ];

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
              <span className="text-bio-blue animate-bio-glow-subtle">
                Settings
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Customize your Bioluminescence AI experience. Manage preferences, appearance, 
              notifications, and privacy settings.
            </p>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
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
        <div className="max-w-4xl mx-auto px-6">
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Account Settings */}
              <div className="bg-abyss/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-bio-blue" />
                  Account Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Email Address</div>
                      <div className="text-sm text-gray-400">explorer@bioluminescence.ai</div>
                    </div>
                    <button className="px-4 py-2 bg-bio-blue/20 hover:bg-bio-blue/30 text-bio-blue rounded-lg transition-colors">
                      Change
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Password</div>
                      <div className="text-sm text-gray-400">Last changed 3 months ago</div>
                    </div>
                    <button className="px-4 py-2 bg-bio-blue/20 hover:bg-bio-blue/30 text-bio-blue rounded-lg transition-colors">
                      Update
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Account Deletion</div>
                      <div className="text-sm text-gray-400">Permanently delete your account and data</div>
                    </div>
                    <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Language & Region */}
              <div className="bg-abyss/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-bio-green" />
                  Language & Region
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                    <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-bio-blue/50 focus:border-bio-blue/50 transition-all">
                      <option value="en" className="bg-abyss text-white">English</option>
                      <option value="es" className="bg-abyss text-white">Español</option>
                      <option value="fr" className="bg-abyss text-white">Français</option>
                      <option value="de" className="bg-abyss text-white">Deutsch</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Time Zone</label>
                    <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-bio-blue/50 focus:border-bio-blue/50 transition-all">
                      <option value="utc" className="bg-abyss text-white">UTC (Coordinated Universal Time)</option>
                      <option value="est" className="bg-abyss text-white">EST (Eastern Standard Time)</option>
                      <option value="pst" className="bg-abyss text-white">PST (Pacific Standard Time)</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Theme Selection */}
              <div className="bg-abyss/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-bio-purple" />
                  Theme
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {themes.map(themeOption => {
                    const Icon = themeOption.icon;
                    return (
                      <button
                        key={themeOption.value}
                        onClick={() => setTheme(themeOption.value as any)}
                        className={`p-4 rounded-lg border transition-all text-left ${
                          theme === themeOption.value
                            ? 'bg-bio-blue/20 border-bio-blue/30'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className={`w-5 h-5 ${
                            theme === themeOption.value ? 'text-bio-blue' : 'text-gray-400'
                          }`} />
                          <span className={`font-medium ${
                            theme === themeOption.value ? 'text-bio-blue' : 'text-white'
                          }`}>
                            {themeOption.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{themeOption.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Display Options */}
              <div className="bg-abyss/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-bio-cyan" />
                  Display Options
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Reduce Motion</div>
                      <div className="text-sm text-gray-400">Minimize animations for accessibility</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bio-blue"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-medium text-white">High Contrast</div>
                      <div className="text-sm text-gray-400">Increase contrast for better visibility</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bio-blue"></div>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-abyss/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-bio-yellow" />
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <div className="font-medium text-white capitalize">{key}</div>
                        <div className="text-sm text-gray-400">
                          {key === 'email' && 'Receive email notifications'}
                          {key === 'push' && 'Receive push notifications'}
                          {key === 'achievements' && 'Get notified of new achievements'}
                          {key === 'updates' && 'Receive app updates and news'}
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={value}
                          onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bio-blue"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-abyss/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-bio-green" />
                  Privacy & Security
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Data Collection</div>
                      <div className="text-sm text-gray-400">Allow anonymous usage data collection</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bio-blue"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Location Services</div>
                      <div className="text-sm text-gray-400">Use location for regional content</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bio-blue"></div>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'data' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-abyss/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-bio-cyan" />
                  Data Management
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Export Data</div>
                      <div className="text-sm text-gray-400">Download your learning progress and data</div>
                    </div>
                    <button className="px-4 py-2 bg-bio-blue/20 hover:bg-bio-blue/30 text-bio-blue rounded-lg transition-colors">
                      Export
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Clear Cache</div>
                      <div className="text-sm text-gray-400">Free up storage space</div>
                    </div>
                    <button className="px-4 py-2 bg-bio-blue/20 hover:bg-bio-blue/30 text-bio-blue rounded-lg transition-colors">
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}


