import { ApiInfo, InferenceResult, ServerSegmentationPredictions } from './types';

export class ApiError extends Error {
  body: any;
  status?: number;
  statusText?: string;
  constructor(message: string){
    super(message);
  }
}

/**
 * Call Landing AI inference endpoint to get predictions
 */
export const getInferenceResult = async (apiInfo: ApiInfo, image: Blob): Promise<InferenceResult> => {
  const formData = new FormData();
  formData.append('file', image);

  const result = await fetch(
    apiInfo.endpoint + `&device_type=${process.env.LIB_DEVICE_TYPE ?? 'jslib'}`,
    {
      method: 'POST',
      headers: {
        Accept: '*/*',
        ...(apiInfo.key
          ? {
            apikey: apiInfo.key,
            apisecret: apiInfo.secret,
          }
          : undefined
        )
      },
      body: formData,
    }
  );
  const body: any = await result.text();
  let bodyJson: any;
  try {
    bodyJson = JSON.parse(body);

    // convert segmentation prediction fields to camel case
    const bitmaps = (bodyJson as InferenceResult).predictions?.bitmaps
      ?? ((bodyJson as InferenceResult).backbonepredictions as ServerSegmentationPredictions)?.bitmaps;
    if (bitmaps) {
      for (const key in bitmaps) {
        const {
          score,
          label_name: labelName,
          label_index: labelIndex,
          defect_id: defectId,
          bitmap,
        } = bitmaps[key] as any;

        bitmaps[key] = { score, labelName, labelIndex, defectId, bitmap };
      }
    }

  } catch (e) {
    // ignore error
  }

  if (result.status !== 200) {
    const error = new ApiError(bodyJson?.message ?? body);
    error.status = result.status;
    error.statusText = result.statusText;
    error.body = bodyJson;
    throw error;
  }
  return bodyJson as any;
};