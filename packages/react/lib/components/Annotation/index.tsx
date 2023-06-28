import { isDark, Annotation, convertCompressedBitMapToBlob } from 'landingai';
import styles from '../index.module.css';
import React, { CSSProperties, useEffect, useMemo, useState } from 'react';

interface LabelNameProps {
  name: string;
  color: string;
}

export function LabelName(props: LabelNameProps) {
  const { name, color } = props;
  const textColor = isDark(color) ? 'white': 'black';
  return (
    <span style={{ backgroundColor: color, color: textColor, borderColor: textColor }} className={styles.labelName}>
      {name}
    </span>
  );
}

interface AnnotationComponentProps {
  annotation: Annotation;
  imageWidth: number;
  imageHeight: number;
  showLabel?: boolean;
}

export function AnnotationComponent(props: AnnotationComponentProps) {
  const { annotation } = props;
  if (annotation.coordinates) {
    return <BoxAnnotationComponent {...props} />;
  }
  if (annotation.bitmap) {
    return <SegAnnotationComponent {...props} />;
  }
  return <></>;
}

function BoxAnnotationComponent(props: AnnotationComponentProps) {
  const { annotation, imageWidth, imageHeight, showLabel = false } = props;

  const style = useMemo(() => {
    const { coordinates, color } = annotation;
    if (coordinates) {
      const { xmin, xmax, ymin, ymax } = coordinates;
      const width = xmax - xmin;
      const height = ymax - ymin;
      return {
        left: `${(100 * xmin) / imageWidth}%`,
        top: `${(100 * ymin) / imageHeight}%`,
        width: `${(100 * width) / imageWidth}%`,
        height: `${(100 * height) / imageHeight}%`,
        borderColor: color,
      } as React.CSSProperties;
    }
    return {} as React.CSSProperties;
  }, [annotation, imageHeight, imageWidth]);

  const textBoundingRectStyles = useMemo(() => {
    const { color } = annotation;
    return {
      left: 0,
      top: -4,
      backgroundColor: color,
      color: isDark(color) ? 'white' : 'black',
      outlineColor: isDark(color) ? 'white' : 'black',
      transform: 'translateY(-100%)',
    } as CSSProperties;
  }, [annotation, imageHeight, imageWidth]);

  return (
    <div className={styles.boxAnnotation} style={style}>
      {showLabel && (
        <div className={styles.text} style={textBoundingRectStyles}>
          {annotation.name}
        </div>
      )}
    </div>
  );
}

function SegAnnotationComponent(props: AnnotationComponentProps) {
  const { annotation, imageWidth, imageHeight } = props;
  const { bitmap, color } = annotation;
  if (!bitmap) {
    return null;
  }

  const [imgSrc, setImgSrc] = useState<string>();
  useEffect(() => {
    let url: string | undefined = undefined;
    convertCompressedBitMapToBlob(bitmap, color, imageWidth, imageHeight).then(res => {
      url = URL.createObjectURL(res);
      setImgSrc(url);
    });
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  if (!imgSrc) {
    return null;
  }

  return (
    <img className={styles.segAnnotation} src={imgSrc} />
  );
}