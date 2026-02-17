export function makeMockMask(width: number, height: number) {
    const mask = new Uint8Array(width * height);
  
    // simple ellipse in center
    const cx = width * 0.5;
    const cy = height * 0.5;
    const rx = width * 0.28;
    const ry = height * 0.18;
  
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = (x - cx) / rx;
        const dy = (y - cy) / ry;
        const inside = dx * dx + dy * dy <= 1.0;
        mask[y * width + x] = inside ? 1 : 0;
      }
    }
    return { mask, width, height };
  }
  