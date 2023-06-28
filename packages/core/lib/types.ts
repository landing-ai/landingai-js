/**
 * Information required for calling Landing AI to get predictions.
 */
export interface ApiInfo {
  /**
   * Landing AI API key of a particular LandingLens user. See https://support.landing.ai/docs/api-key-and-api-secret
   */
  key: string;
  /**
   * Landing AI API secret of a particular LandingLens user. See https://support.landing.ai/docs/api-key-and-api-secret
   *
   * If your API key is prefixed with `land_sk_`, the secret is not required
   */
  secret?: string;
  /**
   * The cloud deployment endpoint. See https://support.landing.ai/docs/cloud-deployment
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
 * 
 */
export type SegmentationBitmap = {
  score: number;
  labelName: string;
  labelIndex: number;
  defectId: number;
  bitmap: string;
};

/**
 * The base/parent prediction class that stores the common shared properties of a prediction.
 */
export type BasePrediction = {
  /**
   * The confidence score of this prediction.
   */
  score: number;
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
  bitmap: string;
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
 * A map where keys are uuids of predictions and values are predictions.
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
   * The predicted segmentation mask
   */
  bitmap?: string;
  /**
   * The color of the annotation
   */
  color: string;
  /**
   * Name of the annotation
   */
  name: string;
};

export type ServerSegmentationPredictions = {
  labelIndex: number;
  labelName: string;
  score: number;
  /**
   * Segmentation bitmaps
   */
  bitmaps?: Record<string, SegmentationBitmap> | null,
};

/**
 * Inference API response
 */
export type InferenceResult = {
  /**
   * backbone predictions. e.g. bounding boxes
   */
  backbonepredictions: PredictionsMap | ServerSegmentationPredictions | null;
  /**
   * prediction on the image
   */
  predictions: ServerSegmentationPredictions,
  /**
   * Inference type for the image.
   * 
   * For object detection, segmentation and classification projects, this field will be 'ClassificationPrediction'
   * for the image, stating if the image is OK (no annotations detected) or NG (has annotations detected).
   *
   * In this case, please use backbonetype to differentiate the two types of projects.
   * 
   * For visual prompting projects, this field will be 'SegmentationPrediction'.
   */
  type: 'SegmentationPrediction' | 'ClassificationPrediction';
  /**
   * Prediction type. Only for object detection, segmentation projects.
   */
  backbonetype: 'SegmentationPrediction' | 'ObjectDetectionPrediction';
};