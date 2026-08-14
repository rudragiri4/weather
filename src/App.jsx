import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { LocationProvider } from './context/LocationContext';
import { WeatherProvider } from './context/WeatherContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { CurrentWeatherPage } from './pages/CurrentWeatherPage';
import { HourlyPage } from './pages/HourlyPage';
import { WeeklyPage } from './pages/WeeklyPage';
import { AirQualityPage } from './pages/AirQualityPage';
import { WeatherMapsPage } from './pages/WeatherMapsPage';
import { AlertsPage } from './pages/AlertsPage';
import { ComparePage } from './pages/ComparePage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

// Routes that get the FULLSCREEN map treatment (no header/footer)
const FULLSCREEN_ROUTES = ['/', '/maps'];

function AppLayout() {
  const location = useLocation();
  const isFullscreen = FULLSCREEN_ROUTES.includes(location.pathname);

  if (isFullscreen) {
    return (
      // Fullscreen map mode — no header/footer, full 100vh
      <div className="w-screen h-screen overflow-hidden bg-[#0a0d16]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/maps" element={<WeatherMapsPage />} />
        </Routes>
      </div>
    );
  }

  return (
    // Normal page mode — with sticky header and footer
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/current" element={<CurrentWeatherPage />} />
          <Route path="/hourly" element={<HourlyPage />} />
          <Route path="/weekly" element={<WeeklyPage />} />
          <Route path="/air-quality" element={<AirQualityPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          {/* Fallback to map */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <SettingsProvider>
      <LocationProvider>
        <WeatherProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </WeatherProvider>
      </LocationProvider>
    </SettingsProvider>
  );
}

export default App;
