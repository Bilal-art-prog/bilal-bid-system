import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  HelpCircle,
  ChevronRight,
  Moon,
  Sun,
  Check,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { useTheme } from '../contexts/ThemeContext';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'language', label: 'Language', icon: Globe },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: false,
    mentions: true,
  });
  const { theme, toggleTheme } = useTheme();

  return (
    <PageLayout title="Settings" subtitle="Manage your account preferences">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <GlassCard className="lg:col-span-1" delay={0}>
          <nav className="space-y-1">
            {settingsSections.map((section, index) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  activeSection === section.id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </div>
                {activeSection === section.id && (
                  <motion.div
                    layoutId="activeSettings"
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </GlassCard>

        <GlassCard className="lg:col-span-3" delay={0.1}>
          {activeSection === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-foreground">
                Profile Settings
              </h3>

              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-glow">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <Button variant="secondary" size="sm">
                    Change Avatar
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Sarah"
                    className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Chen"
                    className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="sarah.chen@company.com"
                    className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Role
                  </label>
                  <input
                    type="text"
                    defaultValue="Bid Manager"
                    className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </motion.div>
          )}

          {activeSection === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-foreground">
                Notification Preferences
              </h3>

              <div className="space-y-4">
                {[
                  {
                    key: 'email',
                    title: 'Email Notifications',
                    description: 'Receive notifications via email',
                  },
                  {
                    key: 'push',
                    title: 'Push Notifications',
                    description: 'Browser push notifications',
                  },
                  {
                    key: 'weekly',
                    title: 'Weekly Digest',
                    description: 'Weekly summary of activities',
                  },
                  {
                    key: 'mentions',
                    title: 'Mention Alerts',
                    description: 'Notify when mentioned in comments',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {item.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key as keyof typeof prev],
                        }))
                      }
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        notifications[item.key as keyof typeof notifications]
                          ? 'bg-primary'
                          : 'bg-muted'
                      }`}
                    >
                      <motion.div
                        animate={{
                          x: notifications[item.key as keyof typeof notifications]
                            ? 24
                            : 2,
                        }}
                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                      />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-foreground">
                Appearance Settings
              </h3>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <p className="font-medium text-foreground mb-3">Theme</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => theme === 'light' && toggleTheme()}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        theme === 'dark'
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 hover:border-primary/30'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center">
                        <Moon className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-medium text-foreground">Dark</span>
                      {theme === 'dark' && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </button>

                    <button
                      onClick={() => theme === 'dark' && toggleTheme()}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        theme === 'light'
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 hover:border-primary/30'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center border border-gray-200">
                        <Sun className="w-6 h-6 text-amber-500" />
                      </div>
                      <span className="font-medium text-foreground">Light</span>
                      {theme === 'light' && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-foreground">
                Security Settings
              </h3>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium text-foreground">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security
                      </p>
                    </div>
                    <Button variant="secondary" size="sm">
                      Enable
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <p className="font-medium text-foreground mb-3">
                    Change Password
                  </p>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <Button>Update Password</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'organization' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-foreground">
                Organization Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    defaultValue="TechCorp Industries"
                    className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Industry
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option>Technology</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                    <option>Government</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </motion.div>
          )}

          {!['profile', 'notifications', 'appearance', 'security', 'organization'].includes(activeSection) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                <ChevronRight className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                Section coming soon
              </p>
            </motion.div>
          )}
        </GlassCard>
      </div>
    </PageLayout>
  );
}
