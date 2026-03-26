// ============================================================
// Skin Analysis Pipeline — Real CV-based image analysis
//
// Uses the same algorithms as the Distortion Lab retouch engine:
//   - HSV skin mask detection
//   - Blemish detection (flood-fill clustering)
//   - Bilateral filter variance measurement
//   - Under-eye dark circle detection
//   - Color-space redness analysis on skin-only pixels
//
// This is NOT a trained ML model. It's real computer vision
// running on raw pixel data — real measurements, not guesses.
// ============================================================

import type { SkinMetrics } from "../types";
import {
  buildSkinMask,
  detectBlemishes,
  type BlemishRegion,
} from "@/lib/imaging/retouch";

/**
 * Run real skin analysis on an image.
 * Returns metrics computed from actual pixel data using CV algorithms.
 */
export async function runSkinAnalysis(
  img: HTMLImageElement
): Promise<SkinMetrics> {
  // Draw image to canvas at analysis resolution
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const maxDim = 400; // balance between accuracy and speed
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;
  const totalPixels = width * height;

  // Step 1: Build skin mask using HSV color detection
  const skinMask = buildSkinMask(imageData);
  const skinPixels: number[] = [];
  for (let i = 0; i < totalPixels; i++) {
    if (skinMask[i]) skinPixels.push(i);
  }

  const skinCount = skinPixels.length;

  // If very few skin pixels found, return low-confidence results
  if (skinCount < totalPixels * 0.05) {
    return {
      redness: 0,
      texture: 0,
      spotCount: 0,
      uniformity: 0.5,
      reliability: 0.2,
      skinPixelRatio: skinCount / totalPixels,
      analysisMethod: "cv-pixel",
    };
  }

  // Step 2: Redness analysis on skin-only pixels
  // Measure how red-shifted skin pixels are relative to their green/blue channels
  const redness = computeSkinRedness(data, skinPixels, width, height);

  // Step 3: Blemish detection using flood-fill clustering
  const blemishes = detectBlemishes(imageData, skinMask, 60);
  const spotCount = blemishes.length;

  // Step 4: Texture analysis — skin variance (how uneven is the surface)
  const texture = computeSkinTexture(data, skinMask, width, height);

  // Step 5: Uniformity — how consistent is skin color across the masked region
  const uniformity = computeSkinUniformity(data, skinPixels, width, height);

  // Step 6: Compute reliability based on analysis quality
  const skinRatio = skinCount / totalPixels;
  const reliability = computeReliability(skinRatio, img.width, img.height);

  // Small delay so the analyzing spinner is visible (UX)
  await new Promise((r) => setTimeout(r, 600));

  return {
    redness: clamp01(redness),
    texture: clamp01(texture),
    spotCount: Math.min(spotCount, 50),
    uniformity: clamp01(uniformity),
    reliability: clamp01(reliability),
    skinPixelRatio: skinRatio,
    analysisMethod: "cv-pixel",
  };
}

// ----------------------------------------------------------
// Redness: baseline-relative with noise pre-filtering
//
// Problem solved: normal skin is always R>G, so absolute redness
// counts everything as red. Instead we compute the MEDIAN R and G
// for this person's skin, then find pixels that are redder than
// their own baseline. A 5x5 box pre-filter eliminates texture noise.
// ----------------------------------------------------------
function computeSkinRedness(
  data: Uint8ClampedArray,
  skinPixels: number[],
  width: number,
  height: number,
): number {
  if (skinPixels.length === 0) return 0;

  // Pre-filter: 5x5 box average to smooth out per-pixel noise
  const avgR = new Float32Array(width * height);
  const avgG = new Float32Array(width * height);
  const rad = 2;

  for (const i of skinPixels) {
    const x = i % width, y = Math.floor(i / width);
    let sr = 0, sg = 0, c = 0;
    for (let dy = -rad; dy <= rad; dy++) {
      for (let dx = -rad; dx <= rad; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        const np = (ny * width + nx) * 4;
        sr += data[np];
        sg += data[np + 1];
        c++;
      }
    }
    avgR[i] = sr / c;
    avgG[i] = sg / c;
  }

  // Compute baseline (median) from smoothed values
  const smoothRs = skinPixels.map((i) => avgR[i]).sort((a, b) => a - b);
  const smoothGs = skinPixels.map((i) => avgG[i]).sort((a, b) => a - b);
  const mid = Math.floor(skinPixels.length / 2);
  const medR = smoothRs[mid];
  const medG = smoothGs[mid];

  // Red shift: how much redder + how much less green vs baseline
  let inflamed = 0;
  let totalShift = 0;

  for (const i of skinPixels) {
    const rIncrease = Math.max(0, avgR[i] - medR);
    const gDecrease = Math.max(0, medG - avgG[i]);
    const shift = (rIncrease + gDecrease) / 2;

    if (shift > 6) {
      inflamed++;
      totalShift += shift;
    }
  }

  const inflamedFraction = inflamed / skinPixels.length;
  const avgShift = inflamed > 0 ? totalShift / inflamed : 0;

  // Tiered: blemish halos are small & scattered (<4% of skin)
  // Real redness patches cover larger areas (>10%)
  let score: number;
  if (inflamedFraction > 0.10) {
    score = inflamedFraction * 2.5 + (avgShift / 40) * 0.8;
  } else if (inflamedFraction > 0.04) {
    score = inflamedFraction * 1.8 + (avgShift / 50) * 0.5;
  } else {
    score = inflamedFraction * 0.6;
  }

  return Math.min(1, score);
}

// ----------------------------------------------------------
// Texture: local variance across skin region
// High variance = rough/uneven skin (acne, dryness, scarring)
// Low variance = smooth skin
// ----------------------------------------------------------
function computeSkinTexture(
  data: Uint8ClampedArray,
  mask: boolean[],
  width: number,
  height: number
): number {
  const neighborRadius = 3;
  let varianceSum = 0;
  let sampleCount = 0;

  // Sample every 3rd pixel for speed
  for (let y = neighborRadius; y < height - neighborRadius; y += 3) {
    for (let x = neighborRadius; x < width - neighborRadius; x += 3) {
      const idx = y * width + x;
      if (!mask[idx]) continue;

      const p = idx * 4;
      const centerLum = data[p] * 0.299 + data[p + 1] * 0.587 + data[p + 2] * 0.114;

      // Compute local variance around this pixel
      let sumDiffSq = 0;
      let neighbors = 0;

      for (let dy = -neighborRadius; dy <= neighborRadius; dy += 2) {
        for (let dx = -neighborRadius; dx <= neighborRadius; dx += 2) {
          const ni = (y + dy) * width + (x + dx);
          if (!mask[ni]) continue;
          const np = ni * 4;
          const nLum = data[np] * 0.299 + data[np + 1] * 0.587 + data[np + 2] * 0.114;
          const diff = centerLum - nLum;
          sumDiffSq += diff * diff;
          neighbors++;
        }
      }

      if (neighbors > 2) {
        varianceSum += Math.sqrt(sumDiffSq / neighbors);
        sampleCount++;
      }
    }
  }

  if (sampleCount === 0) return 0;

  // Normalize: typical skin variance is 5-25, map to 0-1
  const avgVariance = varianceSum / sampleCount;
  return Math.min(1, avgVariance / 20);
}

// ----------------------------------------------------------
// Uniformity: how consistent is skin color across the region
// High uniformity = even skin tone
// Low uniformity = blotchy, patchy, uneven
// ----------------------------------------------------------
// ----------------------------------------------------------
// Uniformity: pixel-level + spatial (quadrant) analysis
//
// Red channel weighted 2x since redness/inflammation is the
// primary cause of uneven skin tone. Spatial quadrant comparison
// catches cases where one region is redder than another.
// ----------------------------------------------------------
function computeSkinUniformity(
  data: Uint8ClampedArray,
  skinPixels: number[],
  width: number,
  height: number,
): number {
  if (skinPixels.length < 10) return 0.5;

  // Compute mean color
  let sumR = 0, sumG = 0, sumB = 0;
  for (const i of skinPixels) {
    const p = i * 4;
    sumR += data[p];
    sumG += data[p + 1];
    sumB += data[p + 2];
  }
  const n = skinPixels.length;
  const meanR = sumR / n, meanG = sumG / n, meanB = sumB / n;

  // Weighted deviation: red channel 2x because inflammation = unevenness
  let sumDevSq = 0;
  for (const i of skinPixels) {
    const p = i * 4;
    const dr = data[p] - meanR;
    const dg = data[p + 1] - meanG;
    const db = data[p + 2] - meanB;
    sumDevSq += dr * dr * 2 + dg * dg + db * db;
  }
  const stdDev = Math.sqrt(sumDevSq / (n * 4)); // 4 = 2+1+1 weights

  // Spatial: divide into 4 quadrants, compare mean luminance
  const halfW = Math.floor(width / 2);
  const halfH = Math.floor(height / 2);
  const quadSums: [number, number][] = [[0, 0], [0, 0], [0, 0], [0, 0]];
  for (const i of skinPixels) {
    const x = i % width, y = Math.floor(i / width);
    const p = i * 4;
    const lum = data[p] * 0.299 + data[p + 1] * 0.587 + data[p + 2] * 0.114;
    const qi = (y < halfH ? 0 : 2) + (x < halfW ? 0 : 1);
    quadSums[qi][0] += lum;
    quadSums[qi][1]++;
  }

  const quadMeans = quadSums.map(([s, c]) => c > 0 ? s / c : 0);
  const activeQuads = quadMeans.filter((_, i) => quadSums[i][1] > 10);
  let spatialVar = 0;
  if (activeQuads.length > 1) {
    const gm = activeQuads.reduce((a, b) => a + b, 0) / activeQuads.length;
    for (const qm of activeQuads) spatialVar += (qm - gm) ** 2;
    spatialVar = Math.sqrt(spatialVar / activeQuads.length);
  }

  const pixelScore = Math.max(0, 1 - stdDev / 12);
  const spatialScore = Math.max(0, 1 - spatialVar / 6);

  return Math.max(0, Math.min(1, pixelScore * 0.6 + spatialScore * 0.4));
}

// ----------------------------------------------------------
// Reliability: confidence in the analysis based on image quality
// ----------------------------------------------------------
function computeReliability(
  skinRatio: number,
  originalWidth: number,
  originalHeight: number
): number {
  let score = 0.5; // base

  // More skin pixels = more data = more reliable
  if (skinRatio > 0.3) score += 0.15;
  else if (skinRatio > 0.15) score += 0.08;
  else score -= 0.1;

  // Higher resolution original = better detail
  const megapixels = (originalWidth * originalHeight) / 1_000_000;
  if (megapixels > 2) score += 0.1;
  else if (megapixels > 0.5) score += 0.05;

  // Cap at reasonable range
  return Math.max(0.25, Math.min(0.85, score));
}

function clamp01(v: number): number {
  return Math.round(Math.max(0, Math.min(1, v)) * 100) / 100;
}
