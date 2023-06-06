# `@landingai/react`

React components to fetch and render predictions from an image.

## Usage

```jsx
import React from 'react';
import { useState } from "react";
import { InferenceContext, InferenceResult, PhotoCollector } from "@landingai/react";

const apiInfo = {
  endpoint: `https://predict.app.landing.ai/inference/v1/predict?endpoint_id=<endpoint_id>`,
  key: "<api_key>",
  secret: "<api_secret>",
};

export default function App() {
  const [image, setImage] = useState<Blob>();

  return (
    <InferenceContext.Provider value={apiInfo}>
      <PhotoCollector setImage={setImage} />
      <InferenceResult image={image} />
    </InferenceContext.Provider>
  );
}
```

**References**

* [How to get an endpoint](https://support.landing.ai/docs/cloud-deployment)
* [How to get api key and secret](https://support.landing.ai/docs/api-key-and-api-secret)


## Examples
- [Codesandbox React example](https://codesandbox.io/s/eloquent-tesla-yzsbsk?file=/src/App.js)
