import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import type { ConversionOptions, ConversionResult } from '../types';

let ffmpegInstance: FFmpeg | null = null;

/**
 * Initialize FFmpeg instance
 */
export async function initFFmpeg(
  onProgress?: (progress: number, message: string) => void
): Promise<FFmpeg> {
  if (ffmpegInstance && ffmpegInstance.loaded) {
    return ffmpegInstance;
  }

  ffmpegInstance = new FFmpeg();

  // Setup progress logging
  ffmpegInstance.on('log', ({ message }) => {
    console.log('FFmpeg:', message);
  });

  // Setup progress reporting
  ffmpegInstance.on('progress', ({ progress, time }) => {
    const percentage = Math.round(progress * 100);
    onProgress?.(percentage, `Conversion en cours: ${percentage}%`);
  });

  // Load FFmpeg
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  
  onProgress?.(10, 'Chargement de FFmpeg...');
  
  await ffmpegInstance.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  onProgress?.(30, 'FFmpeg chargé avec succès');
  
  return ffmpegInstance;
}

/**
 * Convert video to HTML5-compatible format
 */
export async function convertVideo(
  file: File,
  options: ConversionOptions,
  onProgress?: (progress: number, message: string) => void
): Promise<ConversionResult> {
  try {
    onProgress?.(0, 'Initialisation...');
    
    const ffmpeg = await initFFmpeg(onProgress);
    
    onProgress?.(35, 'Lecture du fichier vidéo...');
    
    // Write input file to FFmpeg virtual filesystem
    const inputName = 'input.mp4';
    const outputExt = options.format === 'webm' ? 'webm' : 'mp4';
    const outputName = `output.${outputExt}`;
    
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    
    onProgress?.(40, 'Démarrage de la conversion...');
    
    // Build FFmpeg command based on options
    const args = buildFFmpegArgs(inputName, outputName, options);
    
    // Execute conversion
    await ffmpeg.exec(args);
    
    onProgress?.(95, 'Finalisation...');
    
    // Read output file
    const data = await ffmpeg.readFile(outputName);
    
    // Create blob and URL
    const mimeType = options.format === 'webm' ? 'video/webm' : 'video/mp4';
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    // Cleanup
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);
    
    onProgress?.(100, 'Conversion terminée!');
    
    return {
      blob,
      url,
      size: blob.size,
      format: outputExt
    };
  } catch (error) {
    console.error('Conversion error:', error);
    throw new Error(`Erreur de conversion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

/**
 * Build FFmpeg arguments based on conversion options
 */
function buildFFmpegArgs(
  inputName: string,
  outputName: string,
  options: ConversionOptions
): string[] {
  const args = ['-i', inputName];
  
  // Video codec based on format
  if (options.format === 'webm') {
    args.push('-c:v', 'libvpx-vp9');
    args.push('-c:a', 'libopus');
  } else {
    args.push('-c:v', 'libx264');
    args.push('-c:a', 'aac');
  }
  
  // Quality settings
  const crf = options.quality === 'high' ? '18' : options.quality === 'medium' ? '23' : '28';
  args.push('-crf', crf);
  
  // Resolution
  if (options.width && options.height) {
    if (options.maintainAspectRatio) {
      args.push('-vf', `scale=${options.width}:${options.height}:force_original_aspect_ratio=decrease`);
    } else {
      args.push('-vf', `scale=${options.width}:${options.height}`);
    }
  }
  
  // Optimize for web
  args.push('-movflags', '+faststart');
  
  // Output
  args.push(outputName);
  
  return args;
}

/**
 * Generate HTML5 video embed code
 */
export function generateHTML5Code(
  videoUrl: string,
  filename: string,
  options: {
    autoplay?: boolean;
    loop?: boolean;
    controls?: boolean;
    muted?: boolean;
    width?: string;
    height?: string;
  } = {}
): string {
  const {
    autoplay = false,
    loop = false,
    controls = true,
    muted = false,
    width = '640',
    height = '360'
  } = options;

  const attrs: string[] = [];
  
  if (controls) attrs.push('controls');
  if (autoplay) attrs.push('autoplay');
  if (loop) attrs.push('loop');
  if (muted) attrs.push('muted');
  
  const attrString = attrs.length > 0 ? ' ' + attrs.join(' ') : '';
  
  return `<video width="${width}" height="${height}"${attrString}>
  <source src="${filename}" type="video/${filename.endsWith('.webm') ? 'webm' : 'mp4'}">
  Votre navigateur ne supporte pas la balise vidéo HTML5.
</video>`;
}
