import "./styles.css";

import { InferenceContext, InferenceResult, PhotoCollector } from "@landingai-js/react";
import { useState } from "react";

/** @type import('@landingai-js/core').ApiInfo */
const API_INFO = {
  endpoint: "https://predict.app.dev.landing.ai/inference/v1/predict?endpoint_id=034f820c-1eb2-40b4-9d30-3a78ea1301b1",
  key: "6fi499ym6jblnqxv772q350umrlmlq0",
  secret: "uddg996h9r727apbldj5gz8maym85on1oqjut34q0mns43exln5za50mbtcbbm",
};

export default function App() {
  const [image, setImage] = useState();
  return (
    <InferenceContext.Provider value={API_INFO}>
      <div className="App">
        <PhotoCollector setImage={setImage} />
        <InferenceResult image={image} />
      </div>
    </InferenceContext.Provider>
  );
}
