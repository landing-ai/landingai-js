import { Annotation, ObjectDetectionPrediction, PredictionsMap } from "../types";
import { palette } from "./colorUtils";

export function predictionsToAnnotations(predictionsMap: PredictionsMap) {
  return Object.entries(predictionsMap).map(([id, prediction]) => ({
    id,
    color: palette[prediction.labelIndex - 1],
    coordinates: (prediction as ObjectDetectionPrediction).coordinates,
    name: prediction.labelName,
  } as Annotation))
}