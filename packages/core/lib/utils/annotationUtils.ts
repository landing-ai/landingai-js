import { Annotation, PredictionsMap } from "../types";
import { palette } from "./colorUtils";

export function predictionsToAnnotations(predictionsMap: PredictionsMap) {
  return Object.entries(predictionsMap).map(([id, prediction]) => ({
    id,
    color: palette[prediction.labelIndex - 1],
    coordinates: prediction.coordinates,
    name: prediction.labelName,
  } as Annotation))
}