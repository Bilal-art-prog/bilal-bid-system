import { motion } from 'framer-motion';
import { Bell, Search, Moon, Sun, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useState } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-4">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-muted-foreground mt-0.5"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div
          className={`relative flex items-center transition-all duration-200 ${
            searchFocused ? 'w-72' : 'w-64'
          }`}
        >
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search tenders, proposals..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>

        <button
          onClick={toggleTheme}
          className="relative w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-muted/50 transition-colors group"
        >
          <motion.div
            initial={false}
            animate={{ rotate: theme === 'dark' ? 0 : 180, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            ) : (
              <Sun className="w-5 h-5 text-warning group-hover:text-warning transition-colors" />
            )}
          </motion.div>
        </button>

        <button className="relative w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-muted/50 transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border/50">
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shadow-glow">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground">Sarah Chen</p>
            <p className="text-xs text-muted-foreground">Bid Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
