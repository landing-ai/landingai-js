import {
  predictionsToAnnotations,
  getInferenceResult,
  InferenceResult as InferenceResultType,
  ApiError
} from 'landingai';
import styles from './index.module.css';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInferenceContext } from '../context/InferenceContext';
import { AnnotationComponent, LabelName } from './Annotation';

export interface InferenceResultProps {
  image?: Blob;
  /**
   * Show labels for predicted annotations. Default is false.
   */
  showLabels?: boolean;
  /**
   * Custom color palette for annotations. If not provided, uses the default palette.
   * Should be an array of hex color strings (e.g. ['#FF0000', '#00FF00', '#0000FF']).
   */
  customPalette?: string[];
  /**
   * Called when there is predict error.
   */
  onPredictError?: (err: ApiError) => void;
}

/**
 * Inference result component.
 * 
 * Renders the image, calls predict API and renders predictions over the image.
 * 
 * Also provides summaries of the results.
 */
export const InferenceResult: React.FC<InferenceResultProps> = (props) => {
  const { image, showLabels = false, customPalette, onPredictError } = props;
  const apiInfo = useInferenceContext();

  const imageRef = useRef<HTMLImageElement>(null);

  // inference results
  const [inferenceResult, setInferenceResult] = useState<InferenceResultType>();
  const annotations = useMemo(() => {
    return predictionsToAnnotations(inferenceResult, customPalette);
  }, [inferenceResult, customPalette]);
  const className = useMemo(() => {
    return inferenceResult?.predictions?.labelName ?? '';
  }, [inferenceResult]);

  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [preview, setPreview] = useState<string>();

  const annotationCounts = useMemo(() => {
    const labelCountByName = annotations.reduce((acc, ann) => ({
      ...acc,
      [ann.name]: {
        name: ann.name,
        color: ann.color,
        count: ((acc[ann.name] as any)?.count ?? 0) + 1,
      }
    }), {} as Record<string, { name: string, color: string, count: number }>);
    return Object.values(labelCountByName);
  }, [annotations]);

  const onPredict = useCallback(
    async (image: Blob) => {
      try {
        setIsLoading(true);
        const result = await getInferenceResult(apiInfo, image);
        setInferenceResult(result);
      } catch (err) {
        onPredictError?.(err as any);
      } finally {
        setIsLoading(false);
      }
    },
    [apiInfo]
  );

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);

      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);

  useEffect(() => {
    if (image) {
      onPredict(image);
    }
  }, [image, onPredict]);

  return (
    <>
      <div className={styles.inferenceResult} data-testid="inference-result">
        {!preview && (
          <div className={styles.photoPlaceholder}>
            Your image will be displayed here.
          </div>
        )}
        {/* Image and annotations like boxes / segemtation_mask */}
        {preview && (
          <div className={styles.imageContainer}>
            <img
              className={`${styles.preview} ${isLoading ? styles.blur : ''}`}
              ref={imageRef}
              src={preview}
              alt="result"
              width="100%"
              style={{ verticalAlign: 'middle' }}
            />
            {imageRef.current && !isLoading &&
              annotations.map((annotation) => (
                <AnnotationComponent
                  key={annotation.id}
                  annotation={annotation}
                  imageWidth={imageRef.current!.naturalWidth}
                  imageHeight={imageRef.current!.naturalHeight}
                  showLabel={showLabels}
                />
              ))}
            {isLoading && <div className={styles.ring}></div>}
          </div>
        )}
        {/* Summaries of predictions */}
        {preview && !isLoading && !!inferenceResult && <div className={styles.inferenceSummary}>
          {inferenceResult?.type === 'ClassificationPrediction' && !inferenceResult.backbonetype && <div>Class: {className}</div>}
          {inferenceResult.backbonetype === 'ObjectDetectionPrediction' && (
            <>
              <div>Total: {annotations.length} objects detected</div>
              {annotationCounts.map(({ name, count, color }) => (
                <div className={styles.labelNameCount} key={name}>
                  <span>Number of <LabelName name={name} color={color} /></span>
                  <span>{count}</span>
                </div>
              ))}
            </>
          )}
          {(inferenceResult?.type === 'SegmentationPrediction' || inferenceResult.backbonetype === 'SegmentationPrediction') && (
            <>
              <div>Legend</div>
              <div className={styles.legend}>
                {annotationCounts.map(({ name, color }) => (
                  <div className={styles.labelNameCount} key={name}>
                    <span><LabelName name={name} color={color} /></span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>}
      </div>
    </>
  );
};
