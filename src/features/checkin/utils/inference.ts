// ============================================================
// ONNX Inference Pipeline
// Currently returns mock results; swaps to real model when
// skin_seg.onnx contains actual weights.
// ============================================================

import type { SkinMetrics } from "../types";

// Flag to control mock vs real inference
const USE_MOCK = true; // ← flip to false when you have a real model

/**
 * Run skin analysis on an image.
 * Returns metrics extracted from the image.
 *
 * Currently mock — will use onnxruntime-web when real model is ready.
 */
export async function runSkinAnalysis(
  img: HTMLImageElement
): Promise<SkinMetrics> {
  if (USE_MOCK) {
    return runMockAnalysis(img);
  }
  return runOnnxAnalysis(img);
}

// ----------------------------------------------------------
// Mock analysis — extracts real pixel stats for plausible values
// ----------------------------------------------------------
async function runMockAnalysis(img: HTMLImageElement): Promise<SkinMetrics> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const size = 256;
  canvas.width = size;
  canvas.height = size;
  ctx.drawImage(img, 0, 0, size, size);

  const { data } = ctx.getImageData(0, 0, size, size);
  const pixels = size * size;

  // Compute real color stats for semi-plausible mock metrics
  let rSum = 0, gSum = 0, bSum = 0;
  let redPixels = 0;
  let darkSpots = 0;

  for (let i = 0; i < pixels; i++) {
    const idx = i * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    rSum += r;
    gSum += g;
    bSum += b;

    // Redness heuristic: red channel dominant
    if (r > 140 && r > g * 1.3 && r > b * 1.3) redPixels++;
    // Dark spot heuristic
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum < 80) darkSpots++;
  }

  const rMean = rSum / pixels;
  const gMean = gSum / pixels;
  const bMean = bSum / pixels;

  // Redness as fraction of pixels with red dominance
  const redness = Math.min(1, redPixels / pixels * 5);

  // Texture approximation using color variance
  let varSum = 0;
  for (let i = 0; i < pixels; i++) {
    const idx = i * 4;
    const diff = Math.abs(data[idx] - rMean) +
                 Math.abs(data[idx + 1] - gMean) +
                 Math.abs(data[idx + 2] - bMean);
    varSum += diff;
  }
  const texture = Math.min(1, (varSum / pixels) / 200);

  // Uniformity (inverse of variance, normalized)
  const uniformity = Math.max(0, 1 - texture);

  // Spot count (very rough mock)
  const spotCount = Math.round((darkSpots / pixels) * 50);

  // Reliability is moderate since this is mock
  const reliability = 0.55;

  // Simulate a small delay like real inference would have
  await new Promise((r) => setTimeout(r, 800));

  return {
    redness: Math.round(redness * 100) / 100,
    texture: Math.round(texture * 100) / 100,
    spotCount: Math.min(spotCount, 30),
    uniformity: Math.round(uniformity * 100) / 100,
    reliability,
  };
}

// ----------------------------------------------------------
// Real ONNX analysis — placeholder for when model is ready
// ----------------------------------------------------------
async function runOnnxAnalysis(img: HTMLImageElement): Promise<SkinMetrics> {
  // TODO: Wire up when skin_seg.onnx has real weights
  //
  // Implementation plan:
  // 1. import * as ort from "onnxruntime-web";
  // 2. const session = await ort.InferenceSession.create("/models/skin_seg.onnx");
  // 3. Preprocess img → Float32Array tensor (resize, normalize)
  // 4. const results = await session.run({ input: tensor });
  // 5. Post-process output masks → SkinMetrics
  //
  // For now, fall back to mock:
  console.warn("[Unfilter] Real ONNX model not yet available, using mock");
  return runMockAnalysis(img);
}
