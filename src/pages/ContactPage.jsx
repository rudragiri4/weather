import React, { useState } from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { Mail, MessageSquare, Send, Check } from 'lucide-react';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <SEOHead
        title="Contact WeatherSphere Team"
        description="Get in touch with the WeatherSphere development & meteorological team for feedback, API inquiries, or press."
        canonicalPath="/contact"
      />

      <div className="max-w-2xl mx-auto space-y-8 py-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-black text-white">Contact WeatherSphere</h1>
          <p className="text-slate-400 text-sm">Have feedback, API questions, or weather station suggestions?</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-xl">Message Sent Successfully!</h3>
              <p className="text-xs text-slate-400">Thank you for reaching out. Our team will review your inquiry shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jane@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Message / Inquiry</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Write your message here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-white shadow-glow-cyan hover:opacity-95 transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
