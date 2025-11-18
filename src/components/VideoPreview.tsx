import React from 'react';
import { formatFileSize } from '../utils/sanitize';
import type { VideoFile } from '../types';
import styles from './VideoPreview.module.css';

interface VideoPreviewProps {
  video: VideoFile;
  onRemove: () => void;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ video, onRemove }) => {
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.preview}>
      <div className={styles.videoContainer}>
        <video
          src={video.url}
          controls
          className={styles.video}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Nom:</span>
          <span className={styles.value}>{video.name}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Taille:</span>
          <span className={styles.value}>{formatFileSize(video.size)}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Durée:</span>
          <span className={styles.value}>{formatDuration(video.duration)}</span>
        </div>
      </div>
      <button onClick={onRemove} className={styles.removeButton}>
        ✕ Supprimer et choisir une autre vidéo
      </button>
    </div>
  );
};
