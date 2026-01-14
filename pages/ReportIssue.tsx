import React, { useState } from 'react';
import { Mic, Send, Loader2, MapPin, AlertTriangle, CheckCircle, Lightbulb, AlertOctagon } from 'lucide-react';
import { analyzeIssueWithGemini } from '../services/geminiService';
import { AIAnalysisResult, IssueReport, IssueStatus, IssueCategory, IssuePriority, ReportType } from '../types';

interface ReportIssueProps {
  onAddIssue: (issue: IssueReport) => void;
}

export const ReportIssue: React.FC<ReportIssueProps> = ({ onAddIssue }) => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Mock Voice Recognition
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Browser does not support speech recognition. Please type.");
      return;
    }

    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setInput(prev => prev + (prev ? " " : "") + "We should add more benches near the north garden.");
        setIsListening(false);
      }, 2000);
    }
  };

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    const result = await analyzeIssueWithGemini(input);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleSubmit = () => {
    if (!analysis) return;

    const newIssue: IssueReport = {
      id: `iss_${Date.now()}`,
      type: analysis.type,
      title: analysis.summary,
      description: input,
      category: analysis.category,
      priority: analysis.priority,
      location: analysis.location,
      department: analysis.department,
      status: IssueStatus.OPEN,
      createdAt: Date.now(),
      aiConfidence: analysis.confidence
    };

    onAddIssue(newIssue);
    setInput('');
    setAnalysis(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-[#E5E7EB]">Report or Suggest</h2>
        <p className="text-slate-500 dark:text-[#9CA3AF]">Describe a problem to fix, or an idea to improve campus.</p>
      </div>

      <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 transition-colors">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 'Water leak in library' OR 'We need more power outlets in the study hall'"
            className="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F0F0F] focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-[#F472B6]/30 outline-none resize-none text-slate-700 dark:text-[#E5E7EB] text-lg placeholder:text-slate-400 dark:placeholder:text-[#6B7280] transition-colors"
          />
          <button
            onClick={toggleListening}
            className={`absolute bottom-4 right-4 p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-slate-600 hover:text-blue-600'}`}
          >
            <Mic className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !input}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 fill-current" />
                <span>Analyze Input</span>
              </>
            )}
          </button>
        </div>
      </div>

      {analysis && (
        <div className="bg-[#0A0A0A] rounded-2xl shadow-lg border border-white/5 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={`p-4 border-b flex justify-between items-center ${analysis.type === ReportType.SUGGESTION
            ? 'bg-[#F59E0B]/10 border-[#F59E0B]/20'
            : 'bg-[#3B82F6]/10 border-[#3B82F6]/20'
            }`}>
            <h3 className={`font-bold flex items-center ${analysis.type === ReportType.SUGGESTION ? 'text-[#F59E0B]' : 'text-[#3B82F6]'
              }`}>
              {analysis.type === ReportType.SUGGESTION ? (
                <Lightbulb className="h-4 w-4 mr-2" />
              ) : (
                <AlertOctagon className="h-4 w-4 mr-2" />
              )}
              Detected: {analysis.type}
            </h3>
            <span className="text-xs font-medium text-[#9CA3AF] bg-[#0F0F0F] px-3 py-1 rounded-full border border-white/10">
              {(analysis.confidence * 100).toFixed(0)}% Confidence
            </span>
          </div>

          <div className="p-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Summary</label>
              <p className="font-semibold text-[#E5E7EB] text-lg">{analysis.summary}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Location</label>
              <div className="flex items-center text-[#9CA3AF]">
                <MapPin className="h-4 w-4 mr-1 text-[#6B7280]" />
                {analysis.location}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Category</label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-[#F472B6]/15 text-[#F472B6] border border-[#F472B6]/30">
                {analysis.category}
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Priority</label>
              <div className="flex items-center">
                <PriorityBadge priority={analysis.priority} />
              </div>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Routing To</label>
              <div className="p-3 bg-[#0F0F0F] rounded-lg text-[#9CA3AF] font-mono text-sm border border-white/5">
                &rarr; {analysis.department}
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#0F0F0F] border-t border-white/5 flex justify-end space-x-3">
            <button
              onClick={() => setAnalysis(null)}
              className="px-4 py-2 text-[#6B7280] hover:text-[#E5E7EB] font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`px-6 py-2 text-white rounded-lg font-bold shadow-md flex items-center transition-colors ${analysis.type === ReportType.SUGGESTION ? 'bg-[#F59E0B] hover:bg-[#D97706]' : 'bg-[#3B82F6] hover:bg-[#2563EB]'
                }`}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Submit {analysis.type}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
import { Zap } from 'lucide-react';

const PriorityBadge = ({ priority }: { priority: IssuePriority }) => {
  const colors = {
    [IssuePriority.LOW]: 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30',
    [IssuePriority.MEDIUM]: 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30',
    [IssuePriority.HIGH]: 'bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30',
    [IssuePriority.CRITICAL]: 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30',
  };

  return (
    <span className={`px-2 py-1 rounded-md text-sm font-bold flex items-center ${colors[priority]}`}>
      <AlertTriangle className="h-3 w-3 mr-1" />
      {priority}
    </span>
  );
};