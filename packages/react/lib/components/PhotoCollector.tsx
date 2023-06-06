import React from 'react';
import styles from './index.module.css';
import { EImageType, compressAccurately } from 'image-conversion';

export type PhotoCollectorProps = {
  setImage: (image: Blob) => void;
};

/**
 * Photo collector. This component will compress image so that:
 * 1. The image does not go too large
 * 2. EXIF attributes, such as orientations, are removed
 */
export const PhotoCollector: React.FC<PhotoCollectorProps> = (props) => {
  const { setImage } = props;

  const capture = async (e: React.SyntheticEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files;
    if (files?.length && files[0]) {
      // Compress to remove EXIF information like orientation
      const compressed = await compressAccurately(files[0], {
        size: 1000,
        type: EImageType.JPEG,
      });
      setImage(compressed);
    }
  };

  return (
    <div className={styles.photoCollectorContainer} aria-label="Select a photo">
      <button className={styles.photoCollectorButton}>Select a photo</button>
      <input onChange={capture} className={styles.fileInput} type="file" accept="image/*" data-testid="select-photo-input" />
    </div>
  );
};
