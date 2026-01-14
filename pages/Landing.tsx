import React from 'react';
import { ViewState } from '../types';
import { ArrowRight, MessageSquare, Zap, Shield } from 'lucide-react';

interface LandingProps {
  setView: (view: ViewState) => void;
}

export const Landing: React.FC<LandingProps> = ({ setView }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-16 py-16 animate-fade-in relative z-10">
      <div className="text-center max-w-4xl space-y-8 glass-panel p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden backdrop-blur-2xl bg-white/60 dark:bg-[#0A0A0A]/90 border border-white/40 dark:border-white/5 shadow-xl">
        {/* Decorative blur blob behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sakura/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#0F0F0F] border border-[#F472B6]/30 text-[#F472B6] text-sm font-medium mb-6 shadow-lg shadow-[#F472B6]/10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F472B6] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F472B6]"></span>
          </span>
          Live System Active
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground tracking-tight leading-[1.1] animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Resolve Campus Issues <br />
          <span className="italic text-gradient-sakura">
            With Elegance & Speed
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-sans leading-relaxed animate-fade-up" style={{ animationDelay: '0.3s' }}>
          Experience a new standard of campus management. Simply report, track, and resolve maintenance requests on a platform designed for clarity and calm.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-10 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => setView('report')}
            className="group px-8 py-4 bg-gradient-to-br from-sakura-dark to-sakura text-white rounded-full font-semibold shadow-sakura hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
          >
            Report an Issue <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => setView('feed')}
            className="px-8 py-4 bg-white/80 dark:bg-[#0F0F0F] backdrop-blur-md border border-sakura/30 dark:border-[#F472B6]/20 hover:bg-sakura-light dark:hover:bg-[#1A1A1A] text-sakura-dark dark:text-[#F472B6] rounded-full font-semibold transition-all duration-300 hover:scale-105"
          >
            View Live Feed
          </button>
        </div>
      </div>

      {/* Premium Feature Section */}
      <div className="w-full max-w-6xl mt-16 animate-fade-up" style={{ animationDelay: '0.6s' }}>
        <div className="text-center mb-12">
          <span className="text-[#F472B6] font-mono text-sm tracking-widest uppercase">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground dark:text-[#E5E7EB] mt-2">Built for Modern Campuses</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            number="01"
            icon={MessageSquare}
            title="Natural Language"
            desc="Just type 'Leak in the library' — our AI understands context, extracts location, and categorizes instantly."
          />
          <FeatureCard
            number="02"
            icon={Zap}
            title="Instant Routing"
            desc="Smart routing algorithms ensure your request reaches the exact right team in under 2 seconds."
            highlighted
          />
          <FeatureCard
            number="03"
            icon={Shield}
            title="Total Transparency"
            desc="Real-time tracking from submission to resolution. Never wonder 'what's happening' again."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ number, icon: Icon, title, desc, highlighted }: { number: string, icon: any, title: string, desc: string, highlighted?: boolean }) => (
  <div className={`relative group p-8 rounded-2xl transition-all duration-500 overflow-hidden
    ${highlighted
      ? 'bg-gradient-to-br from-[#F472B6]/10 to-[#EC4899]/5 border border-[#F472B6]/30'
      : 'bg-[#0A0A0A] border border-white/5 hover:border-[#F472B6]/20'
    }`}>

    {/* Gradient line accent */}
    <div className={`absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#F472B6]/50 to-transparent
      ${highlighted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-500`}></div>

    {/* Number */}
    <span className="text-[#F472B6]/30 font-mono text-6xl font-bold absolute top-4 right-6 select-none">{number}</span>

    {/* Icon */}
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300
      ${highlighted
        ? 'bg-[#F472B6] shadow-lg shadow-[#F472B6]/25'
        : 'bg-[#1A1A1A] group-hover:bg-[#F472B6]/20'
      }`}>
      <Icon className={`h-6 w-6 ${highlighted ? 'text-white' : 'text-[#F472B6]'}`} />
    </div>

    {/* Content */}
    <h3 className="text-xl font-bold text-[#E5E7EB] mb-3 tracking-tight">{title}</h3>
    <p className="text-[#9CA3AF] leading-relaxed text-sm">{desc}</p>

    {/* Bottom accent for highlighted */}
    {highlighted && (
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F472B6] to-[#EC4899]"></div>
    )}
  </div>
);