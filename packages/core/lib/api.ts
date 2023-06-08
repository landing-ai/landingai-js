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

  console.log('apiInfo', apiInfo);
  if (!apiInfo.key) {
    throw new Error('Missing apiInfo.key is required');
  }

  const result = await fetch(
    apiInfo.endpoint,
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