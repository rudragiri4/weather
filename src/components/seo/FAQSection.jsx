import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { generateFAQSchema } from '../../utils/seoConfig';

export const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      question: "How does WeatherSphere provide real-time weather data?",
      answer: "WeatherSphere aggregates high-resolution atmospheric data directly from Open-Meteo, ECMWF (European Centre for Medium-Range Weather Forecasts), NOAA GFS, and local Doppler radar networks. We update station readings every 15 minutes."
    },
    {
      question: "What makes the Windy-style interactive radar map unique?",
      answer: "Our weather map combines vector particle wind streamlines with live satellite reflectivity. Users can toggle layers for Wind, Temperature Heatmaps, Precipitation Radar, Cloud Coverage, Sea Pressure, and Air Quality (AQI) simultaneously."
    },
    {
      question: "How accurately can WeatherSphere predict precipitation?",
      answer: "Our 24-hour hourly precipitation probability uses high-frequency radar nowcasting with an accuracy exceeding 92% for immediate 2-hour rain windows."
    },
    {
      question: "Is WeatherSphere free to use?",
      answer: "Yes! WeatherSphere is completely free with no registration or mandatory API keys required. You can search any city, ZIP code, or GPS coordinate globally."
    },
    {
      question: "How do I measure Air Quality Index (AQI) for my location?",
      answer: "Navigate to our Air Quality page or select the AQI tab on the homepage widget. We measure PM2.5, PM10, Nitrogen Dioxide (NO2), and Ozone (O3) against international EPA and European environmental health standards."
    }
  ];

  const faqSchema = generateFAQSchema(faqs);

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
      <div className="flex items-center gap-2.5 text-white font-bold text-lg">
        <HelpCircle className="w-6 h-6 text-cyan-400" />
        <h2>Frequently Asked Weather Questions (FAQ)</h2>
      </div>

      <div className="divide-y divide-slate-800/80">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="py-4">
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base text-slate-100 hover:text-cyan-300 transition"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-cyan-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed pl-1">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
