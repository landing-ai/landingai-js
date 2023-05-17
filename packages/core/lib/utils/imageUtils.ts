
import EXIF from 'exif-js';

export const dataUrlToBlob = async (dataUrl: string) => {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return blob;
};

export const dataUrlToFile = async (
  dataUrl: string,
  fileName: string,
  mimeType: string
): Promise<File> => {
  const blob = await dataUrlToBlob(dataUrl);
  return new File([blob], fileName, { type: mimeType });
};

export async function getOrientation(image: HTMLImageElement): Promise<number> {
  return new Promise(resolve => {
    // @ts-ignore
    EXIF.getData(image, function () {
      // @ts-ignore
      const orientation = EXIF.getTag(this, "Orientation");
      resolve(orientation);
    })
  });
}

export async function resetOrientation(img?: HTMLImageElement | null): Promise<string> {
  if (!img) {
    return '';
  }
  return new Promise(async resolve => {
    const srcOrientation = await getOrientation(img);
    var width = img.naturalWidth,
      height = img.naturalHeight,
      canvas = document.createElement('canvas'),
      ctx = canvas.getContext("2d")!;

    // set proper canvas dimensions before transform & export
    if (srcOrientation > 4) {
      canvas.width = height;
      canvas.height = width;
    } else {
      canvas.width = width;
      canvas.height = height;
    }

    // draw image
    ctx.drawImage(img, 0, 0);

    // transform context before drawing image
    switch (srcOrientation) {
      case 2:
        // Horizontal flip
        ctx.translate(width, 0)
        ctx.scale(-1, 1)
        break
      case 3:
        // 180° Rotate CCW
        ctx.translate(width, height)
        ctx.rotate(Math.PI)
        break
      case 4:
        // Vertical flip
        ctx.translate(0, height)
        ctx.scale(1, -1)
        break
      case 5:
        // Horizontal flip + 90° Rotate CCW
        ctx.rotate(-0.5 * Math.PI)
        ctx.scale(-1, 1)
        break
      case 6:
        // 90° Rotate CCW
        ctx.rotate(-0.5 * Math.PI)
        ctx.translate(-width, 0)
        break
      case 7:
        // Vertical flip + 90° Rotate CCW
        ctx.rotate(-0.5 * Math.PI)
        ctx.translate(-width, height)
        ctx.scale(1, -1)
        break
      case 8:
        // 90° Rotate CW
        ctx.rotate(0.5 * Math.PI)
        ctx.translate(0, -height)
        break
      default:
        break;
    }

    // export base64
    resolve(canvas.toDataURL());
  });
}