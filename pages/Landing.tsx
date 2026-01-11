import React from 'react';
import { ViewState } from '../types';
import { ArrowRight, MessageSquare, Zap, Shield } from 'lucide-react';

interface LandingProps {
  setView: (view: ViewState) => void;
}

export const Landing: React.FC<LandingProps> = ({ setView }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-16 py-16 animate-fade-in relative z-10">
      <div className="text-center max-w-4xl space-y-8 glass-panel p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden backdrop-blur-2xl bg-white/60 border border-white/40 shadow-xl">
        {/* Decorative blur blob behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sakura/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="inline-flex items-center px-4 py-2 rounded-full bg-sakura-light/50 border border-sakura/20 text-sakura-dark text-sm font-medium mb-6 shadow-sm backdrop-blur-sm animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <span className="flex h-2 w-2 rounded-full bg-sakura mr-2 animate-pulse"></span>
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
            className="px-8 py-4 bg-white/80 backdrop-blur-md border border-sakura/30 hover:bg-sakura-light text-sakura-dark rounded-full font-semibold transition-all duration-300 hover:scale-105"
          >
            View Live Feed
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl mt-8 animate-fade-up" style={{ animationDelay: '0.6s' }}>
        <FeatureCard
          icon={MessageSquare}
          title="Natural Language"
          desc="Ideally simple. Just type 'Leak in the library' and let AI handle the categorization."
        />
        <FeatureCard
          icon={Zap}
          title="Instant Routing"
          desc="Advanced routing ensures your request reaches the right team immediately."
        />
        <FeatureCard
          icon={Shield}
          title="Total Transparency"
          desc="Follow your request from submission to resolution with complete visibility."
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="glass-panel p-8 rounded-[2rem] hover:shadow-sakura transition-all duration-300 group hover:-translate-y-2">
    <div className="w-14 h-14 bg-sakura-light/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      <Icon className="text-sakura-dark h-7 w-7" />
    </div>
    <h3 className="text-xl font-display font-bold text-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{desc}</p>
  </div>
);