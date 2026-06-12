import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Upload,
  FileSearch,
  Target,
  CheckSquare,
  FileText,
  TrendingUp,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Upload Tender', href: '/upload', icon: Upload },
  { name: 'Tender Analysis', href: '/analysis', icon: FileSearch },
  { name: 'Capability Matching', href: '/capabilities', icon: Target },
  { name: 'Compliance Matrix', href: '/compliance', icon: CheckSquare },
  { name: 'Proposal Generator', href: '/proposal', icon: FileText },
  { name: 'Win Probability', href: '/probability', icon: TrendingUp },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed left-0 top-0 h-screen z-40 glass-sidebar flex flex-col ${
        theme === 'dark' ? '' : ''
      }`}
    >
      <div className="flex items-center h-16 px-4 border-b border-border/30">
        <motion.div
          animate={{ opacity: 1 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <FileText className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <h1 className="text-lg font-bold text-gradient">ProposalAI</h1>
              <p className="text-xs text-muted-foreground">Bid Engine</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-lg gradient-primary/10 border border-primary/20"
                  transition={{ duration: 0.2 }}
                />
              )}
              <item.icon
                className={`w-5 h-5 relative z-10 transition-colors ${
                  isActive ? 'text-primary' : 'group-hover:text-foreground'
                }`}
              />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 font-medium text-sm"
                >
                  {item.name}
                </motion.span>
              )}
              {isActive && !collapsed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border/30">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
        <NavLink
          to="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-error hover:bg-error/10 transition-colors mt-1"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </NavLink>
      </div>
    </motion.aside>
  );
}
