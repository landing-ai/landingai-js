# `@landingai-js/core`

Core functions for getting predictions from Landing AI cloud deployment endpoints and rendering predictions.

```bash
npm install @landingai-js/core
# OR
yarn add @landingai-js/core
```

## Usage

### Getting prediction results

```javascript
// 1. setup endpoint and credentials
const apiInfo = {
  endpoint: "https://predict.app.landing.ai/inference/v1/predict?endpoint_id=<endpoint_id>",
  key: "<api_key>",
  secret: "<api_secret>",
}
// 2. get an image and convert to blob
const blob = await fetch("url-to-image").then((response) => response.blob());
// 3. get predictions from the blob
const { backbonepredictions } = await getInferenceResult(apiInfo, blob);
// 4. convert to annotations for rendering
const annotations = predictionsToAnnotations(backbonepredictions);
// render annotations
```

**References**

* [How to get an endpoint](https://support.landing.ai/docs/cloud-deployment)
* [How to get api key and secret](https://support.landing.ai/docs/api-key-and-api-secret)
