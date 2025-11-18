import { useState } from 'react';
import { VideoUploader } from './components/VideoUploader';
import { VideoPreview } from './components/VideoPreview';
import { ConversionPanel } from './components/ConversionPanel';
import { CodeOutput } from './components/CodeOutput';
import { convertVideo } from './utils/converter';
import { sanitizeFilename } from './utils/sanitize';
import type { VideoFile, ConversionOptions, ConversionResult, ConversionProgress } from './types';
import styles from './App.module.css';

function App() {
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
  const [convertedVideo, setConvertedVideo] = useState<ConversionResult | null>(null);
  const [progress, setProgress] = useState<ConversionProgress>({
    phase: 'idle',
    percentage: 0,
    message: ''
  });

  const handleVideoSelect = (video: VideoFile) => {
    setVideoFile(video);
    setConvertedVideo(null);
    setProgress({ phase: 'idle', percentage: 0, message: '' });
  };

  const handleRemoveVideo = () => {
    if (videoFile) {
      URL.revokeObjectURL(videoFile.url);
    }
    if (convertedVideo) {
      URL.revokeObjectURL(convertedVideo.url);
    }
    setVideoFile(null);
    setConvertedVideo(null);
    setProgress({ phase: 'idle', percentage: 0, message: '' });
  };

  const handleConvert = async (options: ConversionOptions) => {
    if (!videoFile) return;

    setProgress({ phase: 'loading', percentage: 0, message: 'Initialisation...' });
    setConvertedVideo(null);

    try {
      const result = await convertVideo(
        videoFile.file,
        options,
        (percentage, message) => {
          setProgress({ phase: 'converting', percentage, message });
        }
      );

      setConvertedVideo(result);
      setProgress({ phase: 'complete', percentage: 100, message: 'Conversion terminée!' });
    } catch (error) {
      console.error('Conversion error:', error);
      setProgress({
        phase: 'error',
        percentage: 0,
        message: error instanceof Error ? error.message : 'Erreur de conversion'
      });
    }
  };

  const handleDownload = () => {
    if (!convertedVideo) return;

    const link = document.createElement('a');
    link.href = convertedVideo.url;
    const filename = sanitizeFilename(videoFile?.name || 'video');
    const baseName = filename.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}_converted.${convertedVideo.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isConverting = progress.phase === 'loading' || progress.phase === 'converting';

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>🎬 Convertisseur Vidéo MP4 vers HTML5</h1>
        <p className={styles.subtitle}>
          Convertissez vos vidéos pour le web avec HTML5 - 100% gratuit et sécurisé
        </p>
      </header>

      <main className={styles.main}>
        {!videoFile ? (
          <VideoUploader onVideoSelect={handleVideoSelect} />
        ) : (
          <>
            <VideoPreview video={videoFile} onRemove={handleRemoveVideo} />
            
            <div className={styles.divider} />
            
            <ConversionPanel
              onConvert={handleConvert}
              disabled={isConverting}
            />

            {(isConverting || progress.phase === 'complete' || progress.phase === 'error') && (
              <div className={styles.progressSection}>
                {progress.phase === 'error' ? (
                  <div className={styles.error}>
                    ❌ {progress.message}
                  </div>
                ) : (
                  <>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <p className={styles.progressText}>
                      {progress.message} ({progress.percentage}%)
                    </p>
                  </>
                )}
              </div>
            )}

            {convertedVideo && progress.phase === 'complete' && (
              <>
                <div className={styles.downloadSection}>
                  <button onClick={handleDownload} className={styles.downloadButton}>
                    ⬇️ Télécharger la vidéo convertie
                  </button>
                  <p className={styles.downloadInfo}>
                    Taille: {(convertedVideo.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <div className={styles.divider} />

                <CodeOutput
                  videoUrl={convertedVideo.url}
                  filename={`video.${convertedVideo.format}`}
                />
              </>
            )}
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Conversion effectuée localement dans votre navigateur - Aucune donnée n'est envoyée à un serveur</p>
      </footer>
    </div>
  );
}

export default App;
