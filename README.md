# ProposalAI - AI-Powered Bid & Proposal Response Engine

A production-ready enterprise SaaS frontend for managing bids, tenders, and proposals with AI-powered analysis capabilities.

## Features

- **Dashboard** - KPI cards with Total Bids, Active Bids, Win Rate, and Compliance Rate statistics
- **Upload Tender** - Drag-and-drop PDF/DOCX file upload with progress tracking
- **Tender Analysis** - AI-extracted requirements, evaluation criteria, and Q&A insights
- **Capability Matching** - Match projects, certifications, confidence scores
- **Compliance Matrix** - Track requirement status, evidence, and gaps
- **Proposal Generator** - Editable sections with AI enhancement capabilities
- **Win Probability** - Radial charts, GO/NO-GO recommendations
- **Settings** - Profile, notifications, appearance, security settings

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** with custom design system
- **Framer Motion** for animations
- **Recharts** for data visualization
- **React Router** for navigation
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

## Design System

- **Inter** font family
- Dark/Light mode support
- Glassmorphism UI components
- Responsive layouts (mobile to desktop)
- Smooth animations and transitions

## Project Structure

```
src/
├── components/
│   ├── layout/        # Sidebar, Header, PageLayout
│   └── ui/            # GlassCard, Button, StatusBadge, etc.
├── contexts/          # Theme context
├── data/              # Mock data for demo
├── pages/             # All page components
└── types/             # TypeScript interfaces
```

## Screenshots

The application features a premium dark-mode design with:
- Animated sidebar navigation
- Interactive KPI cards with charts
- Drag-and-drop file uploads
- Data tables with filtering
- Radial progress charts
- Toggle switches and form controls

## License

MIT
