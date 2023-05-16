/* eslint-disable @next/next/no-img-element */
import { calcAnnotationTextStylesStyles } from "@landingai-js/core/utils/textUtils";
import { isDark } from "@landingai-js/core/utils/colorUtils";
import { Annotation } from "@/types";
import styles from "./InferenceResult.module.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { dataUrlToFile, resetOrientation } from "@landingai-js/core/utils/imageUtils";
import { predictionsToAnnotations } from "@landingai-js/core/utils/annotationUtils";
import { countBy } from "lodash";
import { useInferenceContext } from "../context/InferenceContext";
import { BASE_URL } from "@/configs.mjs";

type AnnotationComponentProps = {
  annotation: Annotation;
  imageWidth: number;
  imageHeight: number;
};

function AnnotationComponent(props: AnnotationComponentProps) {
  const { annotation, imageWidth, imageHeight } = props;

  // TODO: extract to a util function
  const style = useMemo(() => {
    const {
      coordinates: { xmin, xmax, ymin, ymax },
      color,
    } = annotation;
    const width = xmax - xmin;
    const height = ymax - ymin;

    return {
      left: `${(100 * xmin) / imageWidth}%`,
      top: `${(100 * ymin) / imageHeight}%`,
      width: `${(100 * width) / imageWidth}%`,
      height: `${(100 * height) / imageHeight}%`,
      borderColor: color,
    } as React.CSSProperties;
  }, [annotation, imageHeight, imageWidth]);

  const textBoundingRectStyles = useMemo(() => {
    const { coordinates, color, name } = annotation;

    const styles = calcAnnotationTextStylesStyles({
      ...coordinates,
      imageWidth,
      imageHeight,
      scale: 1,
      text: name,
    });
    styles.backgroundColor = color;
    styles.color = isDark(color) ? "white" : "black";
    return styles;
  }, [annotation, imageHeight, imageWidth]);

  return (
    <>
      <div className={styles.annotation} style={style}>
        <div className={styles.text} style={textBoundingRectStyles}>
          {annotation.name}
        </div>
      </div>
    </>
  );
}

export type InferenceResultProps = {
  image: string;
  onGoBack: () => void;
};

export default function InferenceResult(props: InferenceResultProps) {
  const { image, onGoBack } = props;
  const apiInfo = useInferenceContext();

  const imageRef = useRef<HTMLImageElement>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const annotationCounts = useMemo(() => {
    const counts = countBy(annotations, "name");
    return Object.entries(counts).map(([labelName, count]) => ({
      labelName,
      count,
    }));
  }, [annotations]);

  const onPredict = useCallback(
    async () => {
      try {
        setIsLoading(true);
        const dataUrl = await resetOrientation(imageRef.current);
        const imageFile = await dataUrlToFile(
          dataUrl,
          new Date().toISOString() + "_WebcamCaptured",
          "image/png"
        );
        const formData = new FormData();
        formData.append("file", imageFile);
        const result = await fetch(
          `${BASE_URL}/inference/v1/predict?endpoint_id=${apiInfo.endpoint}`,
          {
            headers: {
              Accept: "*/*",
              apikey: apiInfo.key,
              apisecret: apiInfo.secret,
            },
            body: formData,
            referrerPolicy: "strict-origin-when-cross-origin",
            method: "POST",
            credentials: "omit",
            mode: "cors",
          }
        );
        const json = await result.json();
        setAnnotations(predictionsToAnnotations(json.backbonepredictions));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [apiInfo]
  );

  return (
    <>
      <div className={styles.inferenceResult}>
        {!image && (
          <div className={styles.photoPlaceholder}>
            Your image will be displayed here.
          </div>
        )}
        {image && (
          <div className={styles.imageContainer}>
            <img
              className={isLoading ? styles.blur : ""}
              ref={imageRef}
              src={image}
              alt="result"
              width="100%"
              style={{ verticalAlign: "middle" }}
              onLoad={() => {
                onPredict();
              }}
            />
            {imageRef.current &&
              annotations.map((annotation) => (
                <AnnotationComponent
                  key={annotation.id}
                  annotation={annotation}
                  imageWidth={imageRef.current!.naturalWidth}
                  imageHeight={imageRef.current!.naturalHeight}
                />
              ))}
            {isLoading && <div className={styles.ring}></div>}
          </div>
        )}
        <div className={styles.inferenceSummary}>
          <p>Total: {annotations.length} objects detected</p>
          <ul>
            {annotationCounts.map(({ labelName, count }) => (
              <li key={labelName}>
                Number of {labelName}: {count}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button className={styles.backButton} onClick={onGoBack}>
        Set API Configuration
      </button>
    </>
  );
}
