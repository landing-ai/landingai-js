/**
 * window.OffscreenCanvas
 * https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
 */
if (typeof window !== 'undefined' && !window.OffscreenCanvas) {
  // @ts-ignore
  window.OffscreenCanvas = class OffscreenCanvas {
    canvas: any;
    constructor(width: number, height: number) {
      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;

      this.canvas.convertToBlob = () => {
        return new Promise(resolve => {
          this.canvas.toBlob(resolve);
        });
      };

      return this.canvas;
    }
  };
}

export default {};
