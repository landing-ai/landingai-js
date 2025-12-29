import { Annotation, InferenceResult, ObjectDetectionPrediction, SegmentationPrediction } from '../types';
import { hexToRgb, palette as defaultPalette } from './colorUtils';

/**
 * Convert server format predictions into a list of {@link Annotation} for easy rendering
 * @param inferenceResult - The inference result from the API
 * @param customPalette - Optional custom color palette to use instead of the default
 */
export function predictionsToAnnotations(inferenceResult?: InferenceResult | null, customPalette?: string[]) {
  if (!inferenceResult) {
    return [];
  }
  const palette = customPalette || defaultPalette;
  const { backbonepredictions, predictions } = inferenceResult;
  const predictionsMap = predictions.bitmaps ?? backbonepredictions?.bitmaps ?? backbonepredictions;
  return Object.entries(predictionsMap || []).map(([id, prediction]) => ({
    id,
    color: palette[prediction.labelIndex - 1],
    coordinates: (prediction as ObjectDetectionPrediction).coordinates,
    bitmap: (prediction as SegmentationPrediction).bitmap,
    name: prediction.labelName,
  } as Annotation));
}

const RLE_OPTIONS = { map: { Z: '0', N: '1' } };
const rleDecodeMap: Record<string, string> = RLE_OPTIONS.map;

/**
 * Decode string like 1N2Z1N3Z into 1001000
 */
export const runLengthDecode = (text: string) => {
  if (!text) return text;
  /**
   * Groups all encoded pieces together
   * 1N2Z1N3Z1N5Z1N2Z1N3Z1N3Z1N =>
   * ["12Z", "1N", "3Z", "1N", "5Z", "1N", "2Z", "1N", "3Z", "1N", "3Z", "1N"]
   */
  const matches = text.match(/(\d+)(\w|\s)/g);
  /**
   * Repeat each piece's last char with number
   * 3Z = 000 1N = 1
   */
  return matches!.reduce((acc, str) => {
    const decodedKey = rleDecodeMap[str.slice(-1)];
    const times = Number(str.slice(0, str.length - 1));
    return `${acc}${decodedKey.repeat(times)}`;
  }, '');
};

/**
 * Convert a run-length-encoded string to a blob
 */
export const convertCompressedBitMapToBlob = async (
  compressedBitMap: string,
  color: string,
  width: number,
  height: number,
) => {
  const bitMap = runLengthDecode(compressedBitMap) || '';
  const { r, g, b } = hexToRgb(color);
  const offscreen = new OffscreenCanvas(width, height);
  const context = offscreen.getContext('2d', {
    desynchronized: true,
  });
  const imageData = context?.createImageData(width, height) as ImageData;
  for (let i = 0; i < bitMap.length; i += 1) {
    if (bitMap[i] === '1') {
      imageData.data[4 * i + 0] = r; // R value
      imageData.data[4 * i + 1] = g; // G value
      imageData.data[4 * i + 2] = b; // B value
      imageData.data[4 * i + 3] = 255 * 0.6; // A value
    }
  }
  context?.putImageData(imageData, 0, 0);
  return offscreen.convertToBlob();
};