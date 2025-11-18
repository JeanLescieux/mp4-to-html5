export interface VideoFile {
  file: File;
  url: string;
  name: string;
  size: number;
  duration?: number;
}

export interface ConversionOptions {
  format: 'webm' | 'mp4';
  quality: 'high' | 'medium' | 'low';
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
}

export interface ConversionResult {
  blob: Blob;
  url: string;
  size: number;
  format: string;
}

export interface ConversionProgress {
  phase: 'idle' | 'loading' | 'converting' | 'complete' | 'error';
  percentage: number;
  message: string;
}
