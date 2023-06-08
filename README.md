<p align="center">
  <img width="100" height="100" src="https://github.com/landing-ai/landingai-python/raw/main/assets/avi-logo.png">
</p>

# LandingLens JS SDK
The LandingLens JS SDK contains the LandingLens development library and examples that show how to integrate your app with LandingLens in a variety of scenarios.

We've provided some examples in Codesandbox to focus on ease of use.

<!-- Generated using https://www.tablesgenerator.com/markdown_tables -->

| Example | Description | Type |
|---|---|---|
| [Poker Card Suit Identification](https://codesandbox.io/s/eloquent-tesla-yzsbsk?file=/src/App.js) | This example shows how to use an object detection model from LandingLens to detect suits on playing cards. | Codesandbox |

## Install the libraries

```bash
npm install landingai landingai-react
# OR
yarn add landingai landingai-react
```

## Quick Start

### Prerequisites

This library needs to communicate with the LandingLens platform to perform certain functions. (For example, the `getInferenceResult` API calls the HTTP endpoint of your deployed model). To enable communication with LandingLens, you will need the following information:

1. The **Endpoint ID** of your deployed model in LandingLens. You can find this on the Deploy page in LandingLens.
2. The **API Key** and **API Secret** for the LandingLens organization that has the model you want to deploy. To learn how to generate these credentials, go [here](https://support.landing.ai/docs/api-key-and-api-secret).

### Collect Photo and Run Inference
Collect photo and run inference using the endpoint you created in LandingLens:

- Install the JS libraries.
- Construct an `apiInfo` object and pass it to `<InferenceContext.Provider>`.
- Render the photo collector to get image blob.
- Render inference result component to visualize predictions.

```jsx
import React from 'react';
import { useState } from "react";
import { InferenceContext, InferenceResult, PhotoCollector } from "landingai-react";

const apiInfo = {
  endpoint: `https://predict.app.landing.ai/inference/v1/predict?endpoint_id=<FILL_YOUR_INFERENCE_ENDPOINT_ID>`,
  key: "<FILL_YOUR_API_KEY>",
  secret: "<FILL_YOUR_API_SECRET>",
};

export default function App() {
  const [image, setImage] = useState();

  return (
    <InferenceContext.Provider value={apiInfo}>
      <PhotoCollector setImage={setImage} />
      <InferenceResult image={image} />
    </InferenceContext.Provider>
  );
}
```

See a **working example** in [here](https://codesandbox.io/s/eloquent-tesla-yzsbsk?file=/src/App.js).

## Documentation

-  [Landing AI JS Library API Reference](https://landing-ai.github.io/landingai-js/)