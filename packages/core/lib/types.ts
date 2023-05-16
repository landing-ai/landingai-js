export interface ApiInfo {
  key: string;
  secret: string;
  endpointId: string;
  baseUrl: string;
}

export type Coordinates = {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
};

export type Annotation = {
  id: string;
  coordinates: Coordinates;
  color: string;
  name: string;
};

export type Prediction = {
  score: number;
  defect_id: number;
  coordinates: Coordinates;
  labelIndex: number;
  labelName: string;
};

export type PredictionsMap = Record<string, Prediction>;
