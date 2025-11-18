/**
 * Sanitize filename to prevent XSS and path traversal attacks
 */
export function sanitizeFilename(filename: string): string {
  // Remove any path components
  const base = filename.split('/').pop()?.split('\\').pop() || 'video';
  
  // Remove dangerous characters and limit length
  return base
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 255);
}

/**
 * Sanitize text input for display in HTML
 */
export function sanitizeText(text: string): string {
  const element = document.createElement('div');
  element.textContent = text;
  return element.innerHTML;
}

/**
 * Validate video file type
 */
export function isValidVideoFile(file: File): boolean {
  const validTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska'
  ];
  
  return validTypes.includes(file.type) || 
         /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(file.name);
}

/**
 * Validate file size (max 500MB)
 */
export function isValidFileSize(file: File): boolean {
  const maxSize = 500 * 1024 * 1024; // 500MB
  return file.size <= maxSize;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
