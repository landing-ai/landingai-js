# `@landingai-js/react`

React components to fetch and render predictions from an image.

## Usage

```jsx
import React from 'react';
import { useState } from "react";
import { InferenceContext, InferenceResult, PhotoCollector } from "@landingai-js/react";

const apiInfo = {
  endpoint: `https://predict.app.dev.landing.ai/inference/v1/predict?endpoint_id=<endpoint_id>`,
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

## Examples
- [Codesandbox React example](https://codesandbox.io/s/eloquent-tesla-yzsbsk?file=/src/App.js)
