import { useRef, useState } from "react";
import styles from "./PhotoCollector.module.css";

export interface PhotoCollectorProps {
  setImage: (image: string) => void;
}

export const PhotoCollector: React.FC<PhotoCollectorProps> = ({
  setImage,
}) => {

  const capture = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files;
    if (files?.length && files[0]) {
      setImage(URL.createObjectURL(files[0]));
    }
  };

  return (
    <>
      <div className={styles.container}>
        <button>Select a photo</button>
        <input onChange={capture} className={styles.fileInput} type="file" accept="image/*" />
      </div>
    </>
  );
};
