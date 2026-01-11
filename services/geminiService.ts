import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, IssueCategory, IssuePriority, ReportType } from '../types';

// Initialize Gemini Client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeIssueWithGemini = async (description: string): Promise<AIAnalysisResult> => {
  if (!apiKey) {
    console.warn("No API Key found. Returning mock analysis.");
    return mockAnalysis(description);
  }

  try {
    const prompt = `
      You are an AI managing a university campus facility system. 
      Analyze the following student input which could be a specific problem report OR a general suggestion/idea.
      
      Extract the following structured data:
      1. Type: One of [Problem, Suggestion]. 'Problem' is for broken things, complaints, hazards, or maintenance issues. 'Suggestion' is for improvements, new ideas, or feature requests.
      2. Category: One of [Maintenance, Plumbing, Electrical, IT, Security, Cleanliness, Other].
      3. Priority: One of [Low, Medium, High, Critical]. Suggestions should generally be Low or Medium unless they address a safety hazard. Problems depend on urgency/safety.
      4. Summary: A short 3-5 word title.
      5. Location: The specific location mentioned. If none, say "Unknown Location".
      6. Department: The likely department responsible.
      7. Confidence: A number between 0 and 1 indicating how sure you are.

      Input: "${description}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            category: { type: Type.STRING },
            priority: { type: Type.STRING },
            summary: { type: Type.STRING },
            location: { type: Type.STRING },
            department: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          },
          required: ["type", "category", "priority", "summary", "location", "department", "confidence"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");

    const result = JSON.parse(jsonText);

    // Normalize Enums
    return {
      type: mapType(result.type),
      category: mapCategory(result.category),
      priority: mapPriority(result.priority),
      summary: result.summary,
      location: result.location,
      department: result.department,
      confidence: result.confidence
    };

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return mockAnalysis(description);
  }
};

const mapType = (type: string): ReportType => {
  const normalized = type?.toUpperCase() || '';
  if (normalized === 'SUGGESTION') return ReportType.SUGGESTION;
  return ReportType.PROBLEM;
};

const mapCategory = (cat: string): IssueCategory => {
  const normalized = cat.toUpperCase();
  if (Object.values(IssueCategory).includes(cat as IssueCategory)) return cat as IssueCategory;
  // Fallback mapping
  if (normalized.includes('PLUMB')) return IssueCategory.PLUMBING;
  if (normalized.includes('ELECTR')) return IssueCategory.ELECTRICAL;
  if (normalized.includes('IT') || normalized.includes('NET') || normalized.includes('WIFI')) return IssueCategory.IT;
  if (normalized.includes('SECUR') || normalized.includes('SAFE')) return IssueCategory.SECURITY;
  if (normalized.includes('CLEAN') || normalized.includes('TRASH')) return IssueCategory.CLEANLINESS;
  return IssueCategory.OTHER;
};

const mapPriority = (prio: string): IssuePriority => {
  const normalized = prio.toUpperCase();
  if (Object.values(IssuePriority).includes(prio as IssuePriority)) return prio as IssuePriority;
  if (normalized === 'CRITICAL') return IssuePriority.CRITICAL;
  if (normalized === 'HIGH') return IssuePriority.HIGH;
  if (normalized === 'MEDIUM') return IssuePriority.MEDIUM;
  return IssuePriority.LOW;
};

const mockAnalysis = (text: string): AIAnalysisResult => {
  const lower = text.toLowerCase();

  // Basic mock detection
  let type = ReportType.PROBLEM;
  if (lower.includes('should') || lower.includes('could') || lower.includes('idea') || lower.includes('suggest') || lower.includes('would be nice')) {
    type = ReportType.SUGGESTION;
  }

  let category = IssueCategory.MAINTENANCE;
  if (lower.includes('water') || lower.includes('leak')) category = IssueCategory.PLUMBING;
  else if (lower.includes('light') || lower.includes('power')) category = IssueCategory.ELECTRICAL;
  else if (lower.includes('wifi') || lower.includes('internet')) category = IssueCategory.IT;

  return {
    type,
    category,
    priority: type === ReportType.SUGGESTION ? IssuePriority.LOW : IssuePriority.MEDIUM,
    summary: type === ReportType.SUGGESTION ? "New Suggestion" : "New Issue Report",
    location: "Unspecified Location",
    department: "General Facilities",
    confidence: 0.5
  };
};