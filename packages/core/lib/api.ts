import { ApiInfo, InferenceResult } from "./types";

/**
 * Call Landing AI inference endpoint to get predictions
 */
export const getInferenceResult = async (apiInfo: ApiInfo, image: Blob): Promise<InferenceResult> => {
  const formData = new FormData();
  formData.append("file", image);

  const result = await fetch(
    apiInfo.endpoint,
    {
      method: "POST",
      headers: {
        Accept: "*/*",
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
  const json = await result.json();
  return json;
}