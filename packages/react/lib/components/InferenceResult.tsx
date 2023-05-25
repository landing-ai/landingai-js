/* eslint-disable @next/next/no-img-element */
import { isDark, countBy, predictionsToAnnotations, Annotation, getInferenceResult } from "@landingai-js/core";
import styles from "./index.module.css";
import React, { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInferenceContext } from "../context/InferenceContext";

export interface InferenceResultProps {
  image?: Blob;
  onGoBack?: () => void;
};

export const InferenceResult: React.FC<InferenceResultProps> = (props) => {
  const { image, onGoBack } = props;
  const apiInfo = useInferenceContext();

  const imageRef = useRef<HTMLImageElement>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [preview, setPreview] = useState<string>();

  const annotationCounts = useMemo(() => {
    const counts = countBy(annotations, "name");
    return Object.entries(counts).map(([labelName, count]) => ({
      labelName,
      count,
    }));
  }, [annotations]);

  const onPredict = useCallback(
    async (image: Blob) => {
      try {
        setIsLoading(true);
        const result = await getInferenceResult(apiInfo, image);
        setAnnotations(predictionsToAnnotations(result.backbonepredictions));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [apiInfo]
  );

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image)
      setPreview(objectUrl)

      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [image])

  useEffect(() => {
    if (image) {
      onPredict(image);
    }
  }, [image, onPredict]);

  return (
    <>
      <div className={styles.inferenceResult}>
        {!preview && (
          <div className={styles.photoPlaceholder}>
            Your image will be displayed here.
          </div>
        )}
        {preview && (
          <div className={styles.imageContainer}>
            <img
              className={`${styles.preview} ${isLoading ? styles.blur : ""}`}
              ref={imageRef}
              src={preview}
              alt="result"
              width="100%"
              style={{ verticalAlign: "middle" }}
            />
            {imageRef.current && !isLoading &&
              annotations.map((annotation) => (
                <AnnotationComponent
                  key={annotation.id}
                  annotation={annotation}
                  imageWidth={imageRef.current!.naturalWidth}
                  imageHeight={imageRef.current!.naturalHeight}
                />
              ))}
            {isLoading && <div className={styles.ring}></div>}
          </div>
        )}
        {preview && !isLoading && <div className={styles.inferenceSummary}>
          <p>Total: {annotations.length} objects detected</p>
          {annotationCounts.map(({ labelName, count }) => (
            <div className={styles.labelNameCount} key={labelName}>
              <span>Number of {labelName}</span>
              <span>{count}</span>
            </div>
          ))}
        </div>}
      </div>
      {!!onGoBack && (
        <button className={styles.bottomButton} onClick={onGoBack}>
          Set API Configuration
        </button>
      )}
    </>
  );
}

interface AnnotationComponentProps {
  annotation: Annotation;
  imageWidth: number;
  imageHeight: number;
};

function AnnotationComponent(props: AnnotationComponentProps) {
  const { annotation, imageWidth, imageHeight } = props;

  const style = useMemo(() => {
    const { coordinates, color } = annotation;
    // TODO: support segmentation as well
    const { xmin, xmax, ymin, ymax } = coordinates!;
    const width = xmax - xmin;
    const height = ymax - ymin;

    return {
      left: `${(100 * xmin) / imageWidth}%`,
      top: `${(100 * ymin) / imageHeight}%`,
      width: `${(100 * width) / imageWidth}%`,
      height: `${(100 * height) / imageHeight}%`,
      borderColor: color,
    } as React.CSSProperties;
  }, [annotation, imageHeight, imageWidth]);

  const textBoundingRectStyles = useMemo(() => {
    const { color } = annotation;
    return {
      left: 0,
      top: -4,
      backgroundColor: color,
      color: isDark(color) ? "white" : "black",
      outlineColor: isDark(color) ? "white" : "black",
      transform: 'translateY(-100%)',
    } as CSSProperties;
  }, [annotation, imageHeight, imageWidth]);

  return (
    <>
      <div className={styles.annotation} style={style}>
        <div className={styles.text} style={textBoundingRectStyles}>
          {annotation.name}
        </div>
      </div>
    </>
  );
}