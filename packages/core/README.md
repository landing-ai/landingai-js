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
  endpoint: "https://predict.app.dev.landing.ai/inference/v1/predict?endpoint_id=034f820c-1eb2-40b4-9d30-3a78ea1301b1",
  key: "6fi499ym6jblnqxv772q350umrlmlq0",
  secret: "uddg996h9r727apbldj5gz8maym85on1oqjut34q0mns43exln5za50mbtcbbm",
}
// 2. get an image and convert to blob
fetch("url-to-image")
  .then((response) => response.blob())
  .then((blob) => {
    // 3. get predictions from the blob
    const { backbonepredictions } = await getInferenceResult(apiInfo, image);
    // 4. convert to annotations for rendering
    const annotations = predictionsToAnnotations(backbonepredictions);
    // render annotations
  });
```

### Color utilities

#### `isDark`

check if a hex color is dark or not.

```javascript
const textColor = isDark('#abc123') ? 'white' : 'black';
```