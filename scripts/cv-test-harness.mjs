#!/usr/bin/env node
// CV Pipeline Test Harness
//
// Generates synthetic skin images with KNOWN ground truth
// (exact blemish count, redness level, texture) and runs the
// analysis algorithms to measure accuracy.
function createImageData(width, height) {
  return { data: new Uint8ClampedArray(width * height * 4), width, height };
}

// --- Generate test image with known properties ---
function generateTestImage(config) {
  const { width, height, baseSkinR, baseSkinG, baseSkinB, blemishes, rednessPatches, textureNoise, underEyeDarkness } = config;
  const img = createImageData(width, height);
  const { data } = img;

  // Fill with base skin color
  for (let i = 0; i < width * height; i++) {
    const p = i * 4;
    data[p] = baseSkinR + (Math.random() - 0.5) * 10;
    data[p + 1] = baseSkinG + (Math.random() - 0.5) * 8;
    data[p + 2] = baseSkinB + (Math.random() - 0.5) * 6;
    data[p + 3] = 255;
  }

  // Add texture noise
  if (textureNoise > 0) {
    for (let i = 0; i < width * height; i++) {
      const p = i * 4;
      const noise = (Math.random() - 0.5) * textureNoise;
      data[p] = clamp(data[p] + noise, 0, 255);
      data[p + 1] = clamp(data[p + 1] + noise, 0, 255);
      data[p + 2] = clamp(data[p + 2] + noise, 0, 255);
    }
  }

  // Add blemishes (dark red spots)
  for (const b of blemishes) {
    for (let dy = -b.radius; dy <= b.radius; dy++) {
      for (let dx = -b.radius; dx <= b.radius; dx++) {
        if (dx * dx + dy * dy > b.radius * b.radius) continue;
        const px = b.x + dx, py = b.y + dy;
        if (px < 0 || px >= width || py < 0 || py >= height) continue;
        const p = (py * width + px) * 4;
        // Blemish: darker, redder
        data[p] = clamp(data[p] * 0.85 + 30, 0, 255);     // more red
        data[p + 1] = clamp(data[p + 1] * 0.65, 0, 255);   // less green
        data[p + 2] = clamp(data[p + 2] * 0.6, 0, 255);    // less blue
      }
    }
    // Redness halo
    for (let dy = -b.radius * 2; dy <= b.radius * 2; dy++) {
      for (let dx = -b.radius * 2; dx <= b.radius * 2; dx++) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < b.radius || dist > b.radius * 2) continue;
        const px = b.x + dx, py = b.y + dy;
        if (px < 0 || px >= width || py < 0 || py >= height) continue;
        const p = (py * width + px) * 4;
        const falloff = 1 - (dist - b.radius) / b.radius;
        data[p] = clamp(data[p] + 15 * falloff, 0, 255);
        data[p + 1] = clamp(data[p + 1] - 8 * falloff, 0, 255);
      }
    }
  }

  // Add redness patches
  for (const r of rednessPatches) {
    for (let dy = -r.ry; dy <= r.ry; dy++) {
      for (let dx = -r.rx; dx <= r.rx; dx++) {
        if ((dx / r.rx) ** 2 + (dy / r.ry) ** 2 > 1) continue;
        const px = r.x + dx, py = r.y + dy;
        if (px < 0 || px >= width || py < 0 || py >= height) continue;
        const p = (py * width + px) * 4;
        data[p] = clamp(data[p] + r.intensity, 0, 255);
        data[p + 1] = clamp(data[p + 1] - r.intensity * 0.3, 0, 255);
      }
    }
  }

  // Under-eye darkening
  if (underEyeDarkness > 0) {
    const eyeY = Math.round(height * 0.35);
    for (const xOff of [Math.round(width * 0.33), Math.round(width * 0.66)]) {
      for (let dy = -8; dy <= 8; dy++) {
        for (let dx = -25; dx <= 25; dx++) {
          if ((dx / 25) ** 2 + (dy / 8) ** 2 > 1) continue;
          const px = xOff + dx, py = eyeY + dy;
          if (px < 0 || px >= width || py < 0 || py >= height) continue;
          const p = (py * width + px) * 4;
          data[p] = clamp(data[p] - underEyeDarkness, 0, 255);
          data[p + 1] = clamp(data[p + 1] - underEyeDarkness, 0, 255);
          data[p + 2] = clamp(data[p + 2] - underEyeDarkness * 0.8, 0, 255);
        }
      }
    }
  }

  return img;
}

// CV ALGORITHMS (inlined from retouch.ts + inference.ts)
// these are ACTUAL algorithms, edit here to iterate and improve!

function buildSkinMask(imageData) {
  const { data, width, height } = imageData;
  const mask = new Array(width * height);

  for (let i = 0; i < width * height; i++) {
    const p = i * 4;
    const r = data[p], g = data[p + 1], b = data[p + 2];

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    if (delta > 0) {
      if (max === r) h = 60 * (((g - b) / delta) % 6);
      else if (max === g) h = 60 * ((b - r) / delta + 2);
      else h = 60 * ((r - g) / delta + 4);
    }
    if (h < 0) h += 360;

    const s = max === 0 ? 0 : delta / max;
    const v = max / 255;

    const isSkin =
      (h >= 0 && h <= 50) &&
      (s >= 0.1 && s <= 0.75) &&
      (v >= 0.2 && v <= 0.95) &&
      r > 60 && g > 40 && r > g && (r - g) > 10;

    mask[i] = isSkin;
  }

  return mask;
}

function detectBlemishes(imageData, mask, sensitivity) {
  if (sensitivity <= 0) return [];

  const { data, width, height } = imageData;
  const threshold = 30 - (sensitivity / 100) * 18;
  const neighborRadius = 12;

  const flagged = new Uint8Array(width * height);

  for (let y = neighborRadius; y < height - neighborRadius; y++) {
    for (let x = neighborRadius; x < width - neighborRadius; x++) {
      const idx = y * width + x;
      if (!mask[idx]) continue;

      const p = idx * 4;
      const r = data[p], g = data[p + 1], b = data[p + 2];
      const lum = r * 0.299 + g * 0.587 + b * 0.114;

      let sumLum = 0, count = 0;
      for (let dy = -neighborRadius; dy <= neighborRadius; dy += 3) {
        for (let dx = -neighborRadius; dx <= neighborRadius; dx += 3) {
          const ni = (y + dy) * width + (x + dx);
          if (mask[ni]) {
            const np = ni * 4;
            sumLum += data[np] * 0.299 + data[np + 1] * 0.587 + data[np + 2] * 0.114;
            count++;
          }
        }
      }

      if (count < 4) continue;
      const avgLum = sumLum / count;

      const darkDiff = avgLum - lum;
      const redness = r - (g + b) / 2;
      let sr = 0, c2 = 0;
      for (let dy = -neighborRadius; dy <= neighborRadius; dy += 4) {
        for (let dx = -neighborRadius; dx <= neighborRadius; dx += 4) {
          const ni = (y + dy) * width + (x + dx);
          if (mask[ni]) {
            const np = ni * 4;
            sr += data[np] - (data[np + 1] + data[np + 2]) / 2;
            c2++;
          }
        }
      }
      const localRedness = c2 > 0 ? sr / c2 : 0;

      // Require BOTH darkness AND redness excess (not just one)
      // This prevents redness patches and noise from being flagged
      const isDark = darkDiff > threshold;
      const isRedder = (redness - localRedness) > threshold * 0.5;

      if (isDark && isRedder) {
        flagged[idx] = 1;
      } else if (darkDiff > threshold * 1.8) {
        // Very dark spots still count even if not red (e.g., blackheads)
        flagged[idx] = 1;
      }
    }
  }

  const visited = new Uint8Array(width * height);
  const blemishes = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (!flagged[idx] || visited[idx]) continue;

      const pixels = [];
      const stack = [{ x, y }];
      let sumX = 0, sumY = 0;

      while (stack.length > 0) {
        const pt = stack.pop();
        const pi = pt.y * width + pt.x;
        if (pt.x < 0 || pt.x >= width || pt.y < 0 || pt.y >= height) continue;
        if (visited[pi] || !flagged[pi]) continue;

        visited[pi] = 1;
        pixels.push(pt);
        sumX += pt.x;
        sumY += pt.y;

        stack.push({ x: pt.x + 1, y: pt.y });
        stack.push({ x: pt.x - 1, y: pt.y });
        stack.push({ x: pt.x, y: pt.y + 1 });
        stack.push({ x: pt.x, y: pt.y - 1 });
      }

      if (pixels.length >= 8 && pixels.length <= 120) {
        const cx = Math.round(sumX / pixels.length);
        const cy = Math.round(sumY / pixels.length);
        const radius = Math.ceil(Math.sqrt(pixels.length / Math.PI)) + 1;
        blemishes.push({ cx, cy, radius, pixels });
      }
    }
  }

  return blemishes;
}

function computeSkinRedness(data, skinPixels, width, height) {
  if (skinPixels.length === 0) return 0;

  // Step 1: Pre-filter — compute LOCAL averages to eliminate texture noise.
  // Use a 5x5 box average for each skin pixel's R and G channels.
  // This smooths out per-pixel noise while preserving regional redness.
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

  // Step 2: Compute BASELINE from the locally-averaged values
  const smoothRs = [];
  for (const i of skinPixels) smoothRs.push(avgR[i]);
  smoothRs.sort((a, b) => a - b);
  const medR = smoothRs[Math.floor(smoothRs.length / 2)];

  const smoothGs = [];
  for (const i of skinPixels) smoothGs.push(avgG[i]);
  smoothGs.sort((a, b) => a - b);
  const medG = smoothGs[Math.floor(smoothGs.length / 2)];

  // Step 3: Compute red shift from baseline on smoothed values
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

  // Tiered scoring
  let score;
  if (inflamedFraction > 0.10) {
    score = inflamedFraction * 2.5 + (avgShift / 40) * 0.8;
  } else if (inflamedFraction > 0.04) {
    score = inflamedFraction * 1.8 + (avgShift / 50) * 0.5;
  } else {
    score = inflamedFraction * 0.6;
  }

  return Math.min(1, score);
}

function computeSkinTexture(data, mask, width, height) {
  const neighborRadius = 3;
  let varianceSum = 0;
  let sampleCount = 0;

  for (let y = neighborRadius; y < height - neighborRadius; y += 3) {
    for (let x = neighborRadius; x < width - neighborRadius; x += 3) {
      const idx = y * width + x;
      if (!mask[idx]) continue;

      const p = idx * 4;
      const centerLum = data[p] * 0.299 + data[p + 1] * 0.587 + data[p + 2] * 0.114;

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
  const avgVariance = varianceSum / sampleCount;
  return Math.min(1, avgVariance / 20);
}

function computeSkinUniformity(data, skinPixels, width, height) {
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

  // Weighted deviation: red channel weighted 2x because redness/inflammation
  // is the primary source of skin tone unevenness
  let sumDevSq = 0;
  for (const i of skinPixels) {
    const p = i * 4;
    const dr = data[p] - meanR;
    const dg = data[p + 1] - meanG;
    const db = data[p + 2] - meanB;
    sumDevSq += dr * dr * 2 + dg * dg + db * db;
  }

  const stdDev = Math.sqrt(sumDevSq / (n * 4));

  // Spatial uniformity: divide into 4 quadrants based on actual dimensions
  const halfW = Math.floor(width / 2);
  const halfH = Math.floor(height / 2);
  const quadSums = [[0, 0], [0, 0], [0, 0], [0, 0]]; // [sum, count] per quad
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

  // Combine: pixel stdDev maps ~3-14 range to uniformity
  // spatialVar maps ~0-8 range to spatial uniformity
  const pixelScore = Math.max(0, 1 - stdDev / 12);
  const spatialScore = Math.max(0, 1 - spatialVar / 6);

  return Math.max(0, Math.min(1, pixelScore * 0.6 + spatialScore * 0.4));
}

// ============================================================
// TEST RUNNER
// ============================================================

function runAnalysis(imageData) {
  const { data, width, height } = imageData;
  const totalPixels = width * height;

  const skinMask = buildSkinMask(imageData);
  const skinPixels = [];
  for (let i = 0; i < totalPixels; i++) {
    if (skinMask[i]) skinPixels.push(i);
  }

  const skinCount = skinPixels.length;
  const redness = computeSkinRedness(data, skinPixels, width, height);
  const blemishes = detectBlemishes(imageData, skinMask, 60);
  const texture = computeSkinTexture(data, skinMask, width, height);
  const uniformity = computeSkinUniformity(data, skinPixels, width, height);

  return {
    skinRatio: skinCount / totalPixels,
    redness: Math.round(Math.min(1, redness) * 100) / 100,
    spotCount: blemishes.length,
    texture: Math.round(Math.min(1, texture) * 100) / 100,
    uniformity: Math.round(Math.max(0, Math.min(1, uniformity)) * 100) / 100,
  };
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// ============================================================
// TEST CASES — images with known ground truth
// ============================================================

const TEST_CASES = [
  {
    name: "Clean skin — no issues",
    config: {
      width: 300, height: 300,
      baseSkinR: 210, baseSkinG: 170, baseSkinB: 140,
      blemishes: [],
      rednessPatches: [],
      textureNoise: 8,
      underEyeDarkness: 0,
    },
    expected: { redness: 0.1, spotCount: 0, texture: 0.15, uniformity: 0.8 },
    tolerance: { redness: 0.15, spotCount: 2, texture: 0.2, uniformity: 0.25 },
  },
  {
    name: "Mild acne — 5 small blemishes",
    config: {
      width: 300, height: 300,
      baseSkinR: 200, baseSkinG: 160, baseSkinB: 130,
      blemishes: [
        { x: 80, y: 100, radius: 4 },
        { x: 150, y: 120, radius: 3 },
        { x: 200, y: 180, radius: 5 },
        { x: 120, y: 200, radius: 4 },
        { x: 220, y: 140, radius: 3 },
      ],
      rednessPatches: [],
      textureNoise: 12,
      underEyeDarkness: 0,
    },
    expected: { redness: 0.2, spotCount: 5, texture: 0.25, uniformity: 0.65 },
    tolerance: { redness: 0.15, spotCount: 3, texture: 0.2, uniformity: 0.2 },
  },
  {
    name: "Moderate acne — 12 blemishes + redness",
    config: {
      width: 300, height: 300,
      baseSkinR: 200, baseSkinG: 155, baseSkinB: 125,
      blemishes: [
        { x: 60, y: 80, radius: 5 }, { x: 100, y: 90, radius: 4 },
        { x: 140, y: 70, radius: 6 }, { x: 180, y: 100, radius: 4 },
        { x: 220, y: 85, radius: 5 }, { x: 80, y: 150, radius: 3 },
        { x: 130, y: 160, radius: 5 }, { x: 170, y: 170, radius: 4 },
        { x: 210, y: 155, radius: 3 }, { x: 100, y: 220, radius: 6 },
        { x: 160, y: 230, radius: 4 }, { x: 200, y: 210, radius: 5 },
      ],
      rednessPatches: [
        { x: 130, y: 120, rx: 40, ry: 30, intensity: 25 },
        { x: 180, y: 180, rx: 35, ry: 25, intensity: 20 },
      ],
      textureNoise: 18,
      underEyeDarkness: 0,
    },
    expected: { redness: 0.4, spotCount: 12, texture: 0.45, uniformity: 0.45 },
    tolerance: { redness: 0.2, spotCount: 5, texture: 0.25, uniformity: 0.25 },
  },
  {
    name: "High redness — irritation/rosacea-like",
    config: {
      width: 300, height: 300,
      baseSkinR: 210, baseSkinG: 155, baseSkinB: 120,
      blemishes: [
        { x: 150, y: 150, radius: 4 },
        { x: 180, y: 170, radius: 3 },
      ],
      rednessPatches: [
        { x: 120, y: 130, rx: 60, ry: 40, intensity: 40 },
        { x: 190, y: 160, rx: 50, ry: 35, intensity: 35 },
        { x: 150, y: 200, rx: 45, ry: 30, intensity: 30 },
      ],
      textureNoise: 15,
      underEyeDarkness: 0,
    },
    expected: { redness: 0.6, spotCount: 2, texture: 0.3, uniformity: 0.35 },
    tolerance: { redness: 0.2, spotCount: 3, texture: 0.2, uniformity: 0.2 },
  },
  {
    name: "Dry/textured skin — high variance, low redness",
    config: {
      width: 300, height: 300,
      baseSkinR: 195, baseSkinG: 165, baseSkinB: 140,
      blemishes: [],
      rednessPatches: [],
      textureNoise: 35,
      underEyeDarkness: 15,
    },
    expected: { redness: 0.1, spotCount: 0, texture: 0.6, uniformity: 0.4 },
    tolerance: { redness: 0.15, spotCount: 3, texture: 0.25, uniformity: 0.25 },
  },
  {
    name: "Dark skin tone — should still detect skin",
    config: {
      width: 300, height: 300,
      baseSkinR: 140, baseSkinG: 90, baseSkinB: 65,
      blemishes: [
        { x: 100, y: 150, radius: 5 },
        { x: 200, y: 150, radius: 4 },
        { x: 150, y: 200, radius: 6 },
      ],
      rednessPatches: [
        { x: 150, y: 150, rx: 30, ry: 25, intensity: 20 },
      ],
      textureNoise: 14,
      underEyeDarkness: 0,
    },
    expected: { redness: 0.25, spotCount: 3, texture: 0.3, uniformity: 0.6 },
    tolerance: { redness: 0.2, spotCount: 3, texture: 0.25, uniformity: 0.25 },
  },
];

// ============================================================
// SCORING
// ============================================================

function scoreMetric(actual, expected, tolerance) {
  const error = Math.abs(actual - expected);
  if (error <= tolerance * 0.5) return 1.0;   // excellent
  if (error <= tolerance) return 0.7;           // good
  if (error <= tolerance * 1.5) return 0.4;     // fair
  return 0.0;                                    // poor
}

function runTests() {
  console.log("=" .repeat(70));
  console.log("CV PIPELINE TEST HARNESS");
  console.log("=".repeat(70));
  console.log();

  let totalScore = 0;
  let totalMetrics = 0;
  const metricScores = { redness: 0, spotCount: 0, texture: 0, uniformity: 0, skinMask: 0 };
  const metricCounts = { redness: 0, spotCount: 0, texture: 0, uniformity: 0, skinMask: 0 };

  for (const tc of TEST_CASES) {
    console.log(`--- ${tc.name} ---`);
    const img = generateTestImage(tc.config);

    const t0 = performance.now();
    const result = runAnalysis(img);
    const elapsed = (performance.now() - t0).toFixed(1);

    console.log(`  Skin detected: ${(result.skinRatio * 100).toFixed(1)}%`);
    console.log(`  Redness:     ${result.redness.toFixed(2)}  (expected ${tc.expected.redness.toFixed(2)}, tol ±${tc.expected.redness > 0 ? tc.tolerance.redness.toFixed(2) : tc.tolerance.redness.toFixed(2)})`);
    console.log(`  Spots:       ${result.spotCount}  (expected ${tc.expected.spotCount}, tol ±${tc.tolerance.spotCount})`);
    console.log(`  Texture:     ${result.texture.toFixed(2)}  (expected ${tc.expected.texture.toFixed(2)}, tol ±${tc.tolerance.texture.toFixed(2)})`);
    console.log(`  Uniformity:  ${result.uniformity.toFixed(2)}  (expected ${tc.expected.uniformity.toFixed(2)}, tol ±${tc.tolerance.uniformity.toFixed(2)})`);
    console.log(`  Time:        ${elapsed}ms`);

    // Score
    const rScore = scoreMetric(result.redness, tc.expected.redness, tc.tolerance.redness);
    const sScore = scoreMetric(result.spotCount, tc.expected.spotCount, tc.tolerance.spotCount);
    const tScore = scoreMetric(result.texture, tc.expected.texture, tc.tolerance.texture);
    const uScore = scoreMetric(result.uniformity, tc.expected.uniformity, tc.tolerance.uniformity);
    const skinScore = result.skinRatio > 0.3 ? 1.0 : result.skinRatio > 0.1 ? 0.5 : 0.0;

    const caseScore = (rScore + sScore + tScore + uScore + skinScore) / 5;
    console.log(`  Score:       ${(caseScore * 100).toFixed(0)}% (R:${(rScore*100).toFixed(0)} S:${(sScore*100).toFixed(0)} T:${(tScore*100).toFixed(0)} U:${(uScore*100).toFixed(0)} M:${(skinScore*100).toFixed(0)})`);
    console.log();

    metricScores.redness += rScore; metricCounts.redness++;
    metricScores.spotCount += sScore; metricCounts.spotCount++;
    metricScores.texture += tScore; metricCounts.texture++;
    metricScores.uniformity += uScore; metricCounts.uniformity++;
    metricScores.skinMask += skinScore; metricCounts.skinMask++;
    totalScore += caseScore;
    totalMetrics++;
  }

  console.log("=".repeat(70));
  console.log("SUMMARY");
  console.log("=".repeat(70));
  console.log(`Overall accuracy:   ${(totalScore / totalMetrics * 100).toFixed(1)}%`);
  console.log(`  Skin Mask:        ${(metricScores.skinMask / metricCounts.skinMask * 100).toFixed(1)}%`);
  console.log(`  Redness:          ${(metricScores.redness / metricCounts.redness * 100).toFixed(1)}%`);
  console.log(`  Spot Detection:   ${(metricScores.spotCount / metricCounts.spotCount * 100).toFixed(1)}%`);
  console.log(`  Texture:          ${(metricScores.texture / metricCounts.texture * 100).toFixed(1)}%`);
  console.log(`  Uniformity:       ${(metricScores.uniformity / metricCounts.uniformity * 100).toFixed(1)}%`);
  console.log();

  // Identify weakest metric
  const metricNames = ["skinMask", "redness", "spotCount", "texture", "uniformity"];
  let weakest = metricNames[0], weakestScore = Infinity;
  for (const m of metricNames) {
    const s = metricScores[m] / metricCounts[m];
    if (s < weakestScore) { weakestScore = s; weakest = m; }
  }
  console.log(`WEAKEST METRIC: ${weakest} (${(weakestScore * 100).toFixed(1)}%)`);
  console.log(`NEXT: Improve ${weakest} algorithm`);
}

runTests();
