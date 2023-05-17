/**
 * Information required for calling Landing AI to get predictions.
 */
export interface ApiInfo {
  /**
   * Landing AI API key of a particular LandingLens user. See https://support.landing.ai/docs/api-key-and-api-secret
   *
   * Not required for public endpoints.
   */
  key?: string;
  /**
   * Landing AI API secret of a particular LandingLens user. See https://support.landing.ai/docs/api-key-and-api-secret
   *
   * Not required for public endpoints.
   */
  secret?: string;
  /**
   * The could deployment endpoint. See https://support.landing.ai/docs/cloud-deployment
   */
  endpoint: string;
}

/**
 * The coordinates (xmin, ymin, xmax, ymax) of the predicted bounding box.
 */
export type Coordinates = {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
};

/**
 * The base/parent prediction class that stores the common shared properties of a prediction.
 */
export type BasePrediction = {
  /**
   * The confidence score of this prediction.
   */
  score: number;
  coordinates: Coordinates;
  /**
   * The predicted label name.
   */
  labelName: string;
  /**
   * The predicted label index. A label index is an unique integer identifies a label in your label book.
   * See https://support.landing.ai/docs/manage-label-book for more details.
   */
  labelIndex: number;
};

/**
 * A single bounding box prediction for an image.
 * It includes a predicted bounding box (xmin, ymin, xmax, ymax), confidence score and the predicted label.
 */
export type ObjectDetectionPrediction = BasePrediction & {
  coordinates: Coordinates;
};

/**
 * A single segmentation mask prediction for an image.
 * It includes a predicted segmentation mask, confidence score and the predicted label.
 */
export type SegmentationPrediction = BasePrediction & {
  // TODO: add more attributes here
};

/**
 * A single classification prediction for an image.
 */
export type ClassificationPrediction = BasePrediction & {};

/**
 * Prediction for one of object detection, segmentation, or classification
 */
export type Prediction = ObjectDetectionPrediction | SegmentationPrediction | ClassificationPrediction;

/**
 * A uuid to prediction map
 */
export type PredictionsMap = Record<string, Prediction>;

/**
 * The converted annotation format for rendering.
 * 
 * An annotation is a segmentation mask, a bounding box, or a class.
 */
export type Annotation = {
  /**
   * A uuid string generated from the backend
   */
  id: string;
  /**
   * The predicted coordinates (xmin, ymin, xmax, ymax) of the predicted bounding box
   */
  coordinates?: Coordinates;
  /**
   * The color of the annotation
   */
  color: string;
  /**
   * Name of the annotation
   */
  name: string;
};

// export type InferenceResult = {

// };