// ============================================================
// Quality Gate — Client-side image quality checks
// Pure canvas-based analysis, no model required
// ============================================================

import type { QualityReport } from "../types";

const THRESHOLDS = {
  blur: 15, // Laplacian variance — below = too blurry
  lightingLow: 60, // mean brightness below = too dark
  lightingHigh: 220, // mean brightness above = too bright
  glare: 0.08, // fraction of near-white pixels
  minWidth: 200,
  minHeight: 200,
};

/**
 * Analyze an image element and return a quality report.
 * Runs entirely on-device via canvas pixel access.
 */
export async function analyzeQuality(
  img: HTMLImageElement
): Promise<QualityReport> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // Scale down for fast analysis (max 512px on longest side)
  const scale = Math.min(1, 512 / Math.max(img.naturalWidth, img.naturalHeight));
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  // --- Resolution check ---
  const resolutionPass =
    img.naturalWidth >= THRESHOLDS.minWidth &&
    img.naturalHeight >= THRESHOLDS.minHeight;

  // --- Convert to grayscale for analysis ---
  const gray = new Float32Array(width * height);
  for (let i = 0; i < gray.length; i++) {
    const idx = i * 4;
    gray[i] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
  }

  // --- Blur detection (Laplacian variance) ---
  const blurScore = computeLaplacianVariance(gray, width, height);
  const blurPass = blurScore >= THRESHOLDS.blur;

  // --- Lighting (mean brightness) ---
  let sum = 0;
  for (let i = 0; i < gray.length; i++) sum += gray[i];
  const meanBrightness = sum / gray.length;
  const lightingPass =
    meanBrightness >= THRESHOLDS.lightingLow &&
    meanBrightness <= THRESHOLDS.lightingHigh;

  // --- Glare detection (fraction of very bright pixels) ---
  let brightPixels = 0;
  for (let i = 0; i < gray.length; i++) {
    if (gray[i] > 245) brightPixels++;
  }
  const glareFraction = brightPixels / gray.length;
  const glarePass = glareFraction < THRESHOLDS.glare;

  const allPass = blurPass && lightingPass && glarePass && resolutionPass;

  return {
    pass: allPass,
    blur: {
      score: Math.round(blurScore * 10) / 10,
      pass: blurPass,
      message: blurPass
        ? "Sharpness looks good"
        : "Image is too blurry — try holding your phone steady",
    },
    lighting: {
      score: Math.round(meanBrightness),
      pass: lightingPass,
      message: lightingPass
        ? "Lighting looks good"
        : meanBrightness < THRESHOLDS.lightingLow
          ? "Too dark — move to better lighting"
          : "Too bright — reduce direct light",
    },
    glare: {
      score: Math.round(glareFraction * 1000) / 10, // as percentage
      pass: glarePass,
      message: glarePass
        ? "No significant glare"
        : "Glare detected — tilt to avoid reflections",
    },
    resolution: {
      pass: resolutionPass,
      message: resolutionPass
        ? "Resolution is sufficient"
        : `Image too small (need at least ${THRESHOLDS.minWidth}×${THRESHOLDS.minHeight}px)`,
    },
    overall: allPass
      ? "Image quality is good — ready to continue"
      : "Some issues detected — retaking may give better guidance",
  };
}

/**
 * Laplacian variance — classic blur detection.
 * Higher = sharper. Very low = blurry.
 */
function computeLaplacianVariance(
  gray: Float32Array,
  w: number,
  h: number
): number {
  let sum = 0;
  let sumSq = 0;
  let count = 0;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      // 3×3 Laplacian kernel
      const lap =
        -gray[(y - 1) * w + x] -
        gray[y * w + (x - 1)] +
        4 * gray[y * w + x] -
        gray[y * w + (x + 1)] -
        gray[(y + 1) * w + x];
      sum += lap;
      sumSq += lap * lap;
      count++;
    }
  }

  const mean = sum / count;
  return sumSq / count - mean * mean; // variance
}
