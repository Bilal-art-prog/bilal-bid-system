import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UploadTenderPage from './pages/UploadTenderPage';
import TenderAnalysisPage from './pages/TenderAnalysisPage';
import CapabilityMatchingPage from './pages/CapabilityMatchingPage';
import ComplianceMatrixPage from './pages/ComplianceMatrixPage';
import ProposalGeneratorPage from './pages/ProposalGeneratorPage';
import WinProbabilityPage from './pages/WinProbabilityPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/upload" element={<UploadTenderPage />} />
            <Route path="/analysis" element={<TenderAnalysisPage />} />
            <Route path="/capabilities" element={<CapabilityMatchingPage />} />
            <Route path="/compliance" element={<ComplianceMatrixPage />} />
            <Route path="/proposal" element={<ProposalGeneratorPage />} />
            <Route path="/probability" element={<WinProbabilityPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
