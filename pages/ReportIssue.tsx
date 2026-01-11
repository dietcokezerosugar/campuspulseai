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
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Report or Suggest</h2>
        <p className="text-slate-500 dark:text-slate-400">Describe a problem to fix, or an idea to improve campus.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 'Water leak in library' OR 'We need more power outlets in the study hall'"
            className="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none resize-none text-slate-700 dark:text-slate-200 text-lg placeholder:text-slate-400 transition-colors"
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

      {/* Analysis Result Card */}
      {analysis && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-blue-100 dark:border-slate-600 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={`p-4 border-b flex justify-between items-center ${
            analysis.type === ReportType.SUGGESTION 
              ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30' 
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30'
          }`}>
            <h3 className={`font-bold flex items-center ${
              analysis.type === ReportType.SUGGESTION ? 'text-amber-900 dark:text-amber-400' : 'text-blue-900 dark:text-blue-400'
            }`}>
              {analysis.type === ReportType.SUGGESTION ? (
                <Lightbulb className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
              ) : (
                <AlertOctagon className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              )}
              Detected: {analysis.type}
            </h3>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded-full">
              {(analysis.confidence * 100).toFixed(0)}% Confidence
            </span>
          </div>
          
          <div className="p-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Summary</label>
              <p className="font-semibold text-slate-900 dark:text-white text-lg">{analysis.summary}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</label>
              <div className="flex items-center text-slate-700 dark:text-slate-300">
                <MapPin className="h-4 w-4 mr-1 text-slate-400" />
                {analysis.location}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300">
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
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Routing To</label>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-slate-700 dark:text-slate-300 font-mono text-sm border border-slate-100 dark:border-slate-700">
                &rarr; {analysis.department}
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-3">
            <button 
              onClick={() => setAnalysis(null)}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className={`px-6 py-2 text-white rounded-lg font-bold shadow-md flex items-center ${
                analysis.type === ReportType.SUGGESTION ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
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
    [IssuePriority.LOW]: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    [IssuePriority.MEDIUM]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    [IssuePriority.HIGH]: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    [IssuePriority.CRITICAL]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <span className={`px-2 py-1 rounded-md text-sm font-bold flex items-center ${colors[priority]}`}>
      <AlertTriangle className="h-3 w-3 mr-1" />
      {priority}
    </span>
  );
};