
export interface Artifact {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface AnalysisResult {
  isAI: boolean;
  confidenceScore: number;
  verdict: string;
  artifacts: Artifact[];
  detailedReasoning: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
