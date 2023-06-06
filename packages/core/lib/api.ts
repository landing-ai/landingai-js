import { ApiInfo, InferenceResult } from './types';

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
    apiInfo.endpoint,
    {
      method: 'POST',
      headers: {
        Accept: '*/*',
        ...((apiInfo.key && apiInfo.secret)
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

  if (result.status !== 200) {
    let bodyJson: any;
    try {
      bodyJson = JSON.parse(body);
    } catch (e) {
      // ignore error
    }
    const error = new ApiError(bodyJson?.message ?? body);
    error.status = result.status;
    error.statusText = result.statusText;
    error.body = bodyJson;
    throw error;
  }
  return body as any;
};