import { Annotation, ObjectDetectionPrediction, PredictionsMap } from '../types';
import { palette } from './colorUtils';

/**
 * Convert server format predictions into a list of {@link Annotation} for easy rendering
 */
export function predictionsToAnnotations(predictionsMap?: PredictionsMap | null) {
  return Object.entries(predictionsMap || []).map(([id, prediction]) => ({
    id,
    color: palette[prediction.labelIndex - 1],
    coordinates: (prediction as ObjectDetectionPrediction).coordinates,
    name: prediction.labelName,
  } as Annotation));
}